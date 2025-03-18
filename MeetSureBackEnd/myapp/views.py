from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password,check_password
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Users, Meeting, Company,CompanyRepresentative
from .serializers import UserSerializer
from datetime import datetime
from pytz import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import soundfile as sf
import io
import numpy as np
from transformers import pipeline
import openai
import base64
from django.core.files.base import ContentFile
from PIL import Image
from django.conf import settings
import os


print("🔄 Loading Whisper model...")
whisper = pipeline(
    "automatic-speech-recognition", 
    model="openai/whisper-base",
    framework="pt",  # 這裡指定 PyTorch (即使沒有安裝)
    device=-1
)
print("✅ Whisper model loaded successfully!")

#顯示用戶列表
def user_list(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

@csrf_exempt
#個人帳號註冊
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        acco_level = data.get("acco_level")
        company = data.get("company")
        name = data.get("name")  
        img = data.get("img")

        if not email or not password or not name:
            return JsonResponse({"error": "缺少必要欄位"}, status=400)
        
        # 檢查電子郵件是否已存在
        if Users.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email is already taken"}, status=400)
        
        # 創建新用戶
        user = Users(
            email=email,
            password=make_password(password),  # 密碼進行加密
            acco_level=acco_level,
            company=company,
            name=name,            
            img=img,
        )
        user.save()

        return JsonResponse({"message": "User registered successfully"}, status=201)
    else:
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



# 使用 `try-except` 確保不強制要求 TensorFlow 或 PyTorch
try:
    import torch
except ImportError:
    torch = None



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
        # 獲取請求數據
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        # 查詢使用者
        user = Users.objects.filter(email=email).first()

        # 確保用戶存在並且密碼匹配
        if user and check_password(password, user.password):  # ✅ 使用 check_password 解密比較
            if user.acco_level == "adminS":
                role = "system_admin"
                redirect_url = "/#/backstage/admindashboard"
            elif user.acco_level == "adminC":
                role = "company_admin"
                redirect_url = "/#/backstage/admindashboard"
            elif user.acco_level == "user":
                role = "user"
                redirect_url = "/#/admin/dashboard"
            else:
                return JsonResponse({"error": "Unauthorized role"}, status=403)

            return JsonResponse(
                {
                    "success": True,
                    "message": "Login successful",
                    "user_id": user.ID,  # 確保主鍵名稱正確
                    "email": user.email,
                    "role": role,
                    "redirect_url": redirect_url,
                },
                status=200,
            )
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
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

@csrf_exempt
def get_profile(request):
    if request.method == "GET":
        user_id = request.GET.get("user_id")
        if not user_id:
            return JsonResponse({"error": "Missing user_id"}, status=400)

        try:
            user = Users.objects.get(ID=user_id)
        except Users.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        return JsonResponse({
            "email": user.email,
            "password": user.password,  # 哈希值
            "name": user.name,
            "acco_level": user.acco_level,  # 回傳等級
            "img": user.img,

        }, status=200)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def update_profile(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    user_id = data.get("user_id")
    if not user_id:
        return JsonResponse({"error": "Missing user_id"}, status=400)

    try:
        user = Users.objects.get(ID=user_id)
    except Users.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # 更新 name
    if "name" in data:
        user.name = data["name"]

    # 更新 email
    if "email" in data:
        user.email = data["email"]

    # 更新 password (記得加密)
    if "password" in data:
        new_password = data["password"]
        if new_password.strip():
            user.password = make_password(new_password)
        else:
            return JsonResponse({"error": "Password cannot be empty"}, status=400)

    user.save()
    return JsonResponse({"message": "Profile updated successfully"}, status=200)


openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

@csrf_exempt
def generate_avatar(request):
    """ 生成 AI 頭貼 (Base64 回傳，不存檔) """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")

            if not user_id:
                return JsonResponse({"error": "Missing user_id"}, status=400)

            # ✅ **Anime 風格 prompt**
            prompt = (
                "Create a Disney-style avatar featuring only one person, facing forward in a close-up headshot. The focus should be on the upper body with a clean background. Use vibrant colors, smooth shading, and detailed facial features. Avoid multiple people and full-body shots." 
            )



            # ✅ **請求 OpenAI API 生成圖片**
            response = openai_client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json",
            )

            if not response.data:
                return JsonResponse({"error": "Failed to generate image"}, status=500)

            # ✅ **解析 Base64**
            image_data = response.data[0].b64_json  # 直接回傳 Base64，前端不存檔

            return JsonResponse({"base64_img": image_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"伺服器錯誤: {e}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def update_avatar(request):
    """ 更新用戶頭貼 """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            img_base64 = data.get("img_base64")

            if not user_id or not img_base64:
                return JsonResponse({"error": "Missing data"}, status=400)

            try:
                user = Users.objects.get(ID=user_id)
            except Users.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            # ✅ **將 Base64 轉換為圖片**
            format, img_str = img_base64.split(';base64,')  # 分割 Base64 前綴
            ext = format.split('/')[-1]  # 取得副檔名 (如 png)
            
            img_data = base64.b64decode(img_str)  # 解碼 Base64
            img_filename = f"avatar_{user_id}.png"  # 統一用 PNG 儲存
            img_path = os.path.join("avatars", img_filename)  # 儲存到 avatars 資料夾

            # ✅ **儲存圖片到 media/avatars**
            full_path = os.path.join(settings.MEDIA_ROOT, img_path)
            with open(full_path, "wb") as f:
                f.write(img_data)

            # ✅ **更新資料庫**
            user.img = img_path  # 儲存相對路徑
            user.save()

            return JsonResponse({"success": True, "img_url": f"/media/{img_path}"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"伺服器錯誤: {e}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def update_name(request):
    """ 更新使用者名稱 """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            new_name = data.get("new_name")

            if not user_id or not new_name:
                return JsonResponse({"success": False, "error": "缺少必要參數"}, status=400)

            user = Users.objects.get(ID=user_id)
            user.name = new_name  # 更新名稱
            user.save()

            return JsonResponse({"success": True, "message": "名稱更新成功"})
        except Users.DoesNotExist:
            return JsonResponse({"success": False, "error": "找不到使用者"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

@csrf_exempt
def update_password(request):
    """ 用戶更新密碼 (加密存入) """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            new_password = data.get("new_password")

            if not user_id or not new_password:
                return JsonResponse({"error": "缺少必要欄位"}, status=400)

            try:
                user = Users.objects.get(ID=user_id)
            except Users.DoesNotExist:
                return JsonResponse({"error": "用戶不存在"}, status=404)

            # **加密密碼後存入**
            user.password = make_password(new_password)
            user.save()

            return JsonResponse({"message": "密碼更新成功"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "無效的 JSON 格式"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"伺服器錯誤: {e}"}, status=500)

    return JsonResponse({"error": "請求方法錯誤"}, status=405)