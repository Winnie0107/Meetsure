from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password,check_password
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Users, Meeting,UserToken,Company,CompanyRepresentative
from .serializers import UserSerializer
from datetime import datetime
from pytz import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import soundfile as sf
import io
import numpy as np
from transformers import pipeline
from rest_framework.authtoken.models import Token


#顯示用戶列表
def user_list(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            acco_level = data.get("acco_level")
            company = data.get("company", None)
            name = data.get("name")
            img = data.get("img", None)

            if not email or not password or not name:
                return JsonResponse({"error": "缺少必要欄位"}, status=400)

            existing_user = Users.objects.filter(email=email).first()
            if existing_user:
                if existing_user.auth_user:
                    return JsonResponse({"error": "Email is already taken"}, status=400)
                else:
                    print(f"⚠️ 用戶 {email} 已存在，但 `auth_user` 為 None，修正中...")

            base_username = name if name else email.split("@")[0]
            username = base_username
            count = 1

            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{count}"
                count += 1

            print(f"🔍 嘗試建立 `auth_user`：username={username}, email={email}")
            auth_user = User.objects.create_user(username=username, email=email, password=password)

            # ✅ **確保 `auth_user` 來自資料庫**
            auth_user = User.objects.get(pk=auth_user.pk)  
            print(f"✅ `auth_user` 建立成功！ID={auth_user.id}")

            if existing_user:
                existing_user.auth_user = auth_user
                existing_user.save()
                print(f"✅ 已補齊 `Users.auth_user_id`，ID={existing_user.ID}")
                return JsonResponse({"message": "User linked successfully"}, status=200)

            print(f"🔍 嘗試建立 `Users`")
            user = Users(
                email=email,
                password=make_password(password),
                acco_level=acco_level,
                company=company,
                name=name,
                img=img
            )

            user.auth_user = auth_user  # ✅ **確保 `auth_user` 是正確的 `User`**
            user.save()

            print(f"✅ `Users` 建立成功！ID={user.ID}")
            print(f"🔍 `auth_user` 類型: {type(auth_user)}")
            print(f"🔍 `auth_user` 來自 {auth_user.__class__.__module__}.{auth_user.__class__.__name__}")
            print(f"🔍 `Users.auth_user` 預期的類型: {Users._meta.get_field('auth_user').related_model}")


            return JsonResponse({"message": "User registered successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        except Exception as e:
            print(f"❌ 發生錯誤: {str(e)}")
            traceback.print_exc()
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)




#新增行事曆
@csrf_exempt
def add_meeting(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # 解析前端傳來的 JSON
            datetime_str = data.get("datetime")  # 從前端接收 datetime 字串
            description = data.get("description")

            if not datetime_str or not description:
                return JsonResponse({"error": "Missing fields in request"}, status=400)

            # 將 datetime 字串解析成日期與時間
            datetime_obj = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
            date = datetime_obj.date()
            time = datetime_obj.time()

            # 創建新會議
            meeting = Meeting(date=date, time=time, description=description)
            meeting.save()

            return JsonResponse({"message": "Meeting added successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


    
# 返回符合日期的會議
def get_meetings(request):
    # 從前端解析日期參數，格式: yyyy-MM-dd
    date_str = request.GET.get('date')  # 例: "2024-12-03"
    if not date_str:
        return JsonResponse({"error": "Date parameter is required"}, status=400)

    try:
        # 將字串轉為日期物件
        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # 查詢符合日期的會議
        meetings = Meeting.objects.filter(date=date)

        # 構建返回資料，將時間轉為當地時區
        data = [
            {
                "datetime": datetime.combine(meeting.date, meeting.time)
                .astimezone(LOCAL_TIMEZONE)
                .isoformat(),  # 返回 ISO 格式的時間戳
                "description": meeting.description,
            }
            for meeting in meetings
        ]

        return JsonResponse({"meetings": data}, safe=False)

    except ValueError:
        # 當日期格式不正確時，返回錯誤信息
        return JsonResponse({"error": "Invalid date format. Use yyyy-MM-dd"}, status=400)

    # 時區設置
LOCAL_TIMEZONE = timezone("Asia/Taipei")  # 設定你想要的當地時區

# 返回所有用戶的列表
def user_list(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)


# 使用 `try-except` 確保不強制要求 TensorFlow 或 PyTorch
try:
    import torch
except ImportError:
    torch = None

try:
    import tensorflow as tf
except ImportError:
    tf = None

# 使用 Hugging Face API 而不依賴 TensorFlow/PyTorch
print("🔄 Loading Whisper model...")
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=-1)  # 強制使用 CPU
print("✅ Whisper model loaded successfully!")

def split_audio(audio_data, samplerate, segment_length=30):
    """
    將音檔分成多個片段，每段長度為 segment_length 秒
    """
    samples_per_segment = int(segment_length * samplerate)
    num_segments = int(np.ceil(len(audio_data) / samples_per_segment))
    segments = [audio_data[i * samples_per_segment:(i + 1) * samples_per_segment] for i in range(num_segments)]
    return segments

@csrf_exempt
def transcribe_audio(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    if 'audio' not in request.FILES:
        return JsonResponse({"error": "No audio file uploaded"}, status=400)

    # 處理音檔上傳
    audio_file = request.FILES['audio']
    try:
        # 讀取音檔為 numpy.ndarray 格式
        audio_data, samplerate = sf.read(io.BytesIO(audio_file.read()))
    except Exception as e:
        return JsonResponse({"error": f"Failed to read audio file: {str(e)}"}, status=500)

    try:
        # 分段處理音檔
        segments = split_audio(audio_data, samplerate, segment_length=30)
        transcription_result = []

        for i, segment in enumerate(segments):
            # 對每個片段使用 Whisper 模型進行轉錄
            transcription = whisper(segment)
            transcription_result.append(transcription["text"])  # ✅ 只加入內容，沒有 "Segment X"

        # 合併所有片段的結果，並以換行符分隔每個段落
        full_transcription = "\n\n".join(transcription_result)

        return JsonResponse({"text": full_transcription}, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        print(f"🔍 收到登入請求：email={email}, password={'*' * len(password)}")

        # 🔎 查詢 `Users` 表
        user = Users.objects.filter(email=email).first()
        if not user:
            print("❌ 使用者不存在")
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        # 🔐 檢查密碼
        if not check_password(password, user.password):
            print("❌ 密碼錯誤")
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        # ✅ **確認 `auth_user` 是否存在，沒有則創建**
        if user.auth_user is None:
            username = user.name if user.name else email  # 🔥 `Users.name` -> `auth_user.username`
            print(f"⚠️ `auth_user` 不存在，創建帳號：username={username}, email={email}")

            # ✅ **確保 `username` 唯一**
            auth_user, created = User.objects.get_or_create(
            email=email, 
            defaults={"username": username[:150]}
)


            # ✅ **如果新建帳號，設定密碼**
            if created:
                auth_user.set_password(password)  
                auth_user.save()

            # ✅ **將 `auth_user` 綁定到 `Users`**
            user.auth_user = auth_user
            user.save()

        print(f"✅ `auth_user` 確認成功：{user.auth_user}")

        # ✅ **確認 Token 是否已經存在，沒有的話就創建**
        token, _ = Token.objects.get_or_create(user=user.auth_user)

        # ✅ **設置用戶角色 & 跳轉 URL**
        role_map = {
            "adminS": ("system_admin", "/#/backstage/admindashboard"),
            "adminC": ("company_admin", "/#/backstage/admindashboard"),
            "user": ("user", "/#/admin/dashboard")
        }
        role, redirect_url = role_map.get(user.acco_level, ("unknown", "/#/admin/dashboard"))

        print(f"✅ 登入成功：user_id={user.ID}, username={user.auth_user.username}, role={role}")

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "user_id": user.ID,
            "email": user.email,
            "username": user.auth_user.username,  # ✅ 回傳 `auth_user.username`
            "role": role,
            "redirect_url": redirect_url,
            "token": token.key,  # ✅ 回傳 Token
        }, status=200)

    except json.JSONDecodeError:
        print("❌ JSON 格式錯誤")
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        print(f"❌ 發生未預期的錯誤: {str(e)}")
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

@csrf_exempt
def register_company(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        owner = data.get("owner")
        description = data.get("description")
        plan = data.get("plan")

        if not name or not owner or not plan:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        company = Company(name=name, owner=owner, description=description, plan=plan)
        company.save()

        return JsonResponse({"message": "Company registered successfully", "company_id": company.ID}, status=201)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)




@csrf_exempt
def register_representative(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        account_name = data.get("account_name")  
        company_id = data.get("company_id")

        if not email or not password or not account_name or not company_id:
            return JsonResponse({"error": "請完整填寫所有欄位"}, status=400)

        try:
            company = Company.objects.get(ID=company_id)
        except Company.DoesNotExist:
            return JsonResponse({"error": "找不到對應的公司"}, status=404)

        if Users.objects.filter(email=email).exists():
            return JsonResponse({"error": "此 Email 已被使用"}, status=400)

        user = Users.objects.create(
            email=email,
            password=password,  
            acco_level="representative",
            company=company
        )

        representative = CompanyRepresentative.objects.create(
            user=user,
            company=company
        )

        return JsonResponse({"message": "公司代表帳號註冊成功", "user_id": user.ID}, status=201)

    return JsonResponse({"error": "無效的請求方式"}, status=400)

   
@csrf_exempt
def get_companies(request):
    companies = list(Company.objects.values())
    return JsonResponse({"companies": companies}, safe=False)

@csrf_exempt
def get_representatives(request):
    representatives = list(CompanyRepresentative.objects.values())
    return JsonResponse({"representatives": representatives}, safe=False)