from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Users, Meeting
from .serializers import UserSerializer
from datetime import datetime
from pytz import timezone
from django.views.decorators.csrf import csrf_exempt
from transformers import pipeline
from django.contrib.auth import authenticate
import soundfile as sf
import io
import numpy as np

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

        # 檢查電子郵件是否已存在
        if Users.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email is already taken"}, status=400)
        
        # 創建新用戶
        user = Users(
            email=email,
            password=make_password(password),  # 密碼進行加密
            acco_level=acco_level,
            company=company,
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

# 返回所有用戶的列表
def user_list(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

# 加載 Whisper 模型
print("Loading Whisper model...")
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base")
print("Model loaded.")

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
            transcription_result.append(f"Segment {i + 1}:\n{transcription['text']}")

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


       # 驗證用戶
       user = Users.objects.filter(email=email).first()
       if user and user.password == password:  # 假設密碼為明文存儲
           # 判斷用戶權限
           if user.acco_level == "adminS":
               role = "system_admin"
           elif user.acco_level == "adminC":
               role = "company_admin"
           else:
               return JsonResponse({"error": "Unauthorized role"}, status=403)


           # 返回成功響應
           return JsonResponse(
               {
                   "message": "Login successful",
                   "user_id": user.ID,  # 確保主鍵名稱正確
                   "role": role,
                   "redirect_url": "/#/backstage/admindashboard",
               },
               status=200,
           )
       else:
           return JsonResponse({"error": "Invalid credentials"}, status=401)


   except json.JSONDecodeError:
       return JsonResponse({"error": "Invalid JSON format"}, status=400)
   except Exception as e:
       return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
