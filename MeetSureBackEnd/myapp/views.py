from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password,check_password
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Users, MeetingSchedule,Company,CompanyRepresentative, Group, GroupMembership, Project,ProjectMember
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
from django.contrib.auth import get_user_model  # ✅ 確保使用 Django 內建 User
User = get_user_model()  # ✅ 正確獲取 User
import traceback  # 🔥 這行讓我們能夠捕捉完整錯誤訊息
import time
import random
from google.api_core.exceptions import GoogleAPICallError
import base64
from django.core.files.base import ContentFile
from PIL import Image
from django.conf import settings
import os
import openai
from MeetSureBackEnd.firebase_config import db, bucket
import uuid
import ffmpeg
import tempfile


from firebase_admin import storage
bucket = storage.bucket()

import uuid 
from django.views.decorators.http import require_GET
import requests

# 用來暫存進度資訊：task_id -> {current: x, total: y}
progress_dict = {}



import firebase_admin
from firebase_admin import firestore
db = firestore.client()  # 不用再 initialize_app
from django.utils.timezone import now
import threading

from google.api_core.exceptions import DeadlineExceeded

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





@csrf_exempt
def add_meeting(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            date = data.get("date")
            time = data.get("time")
            details = data.get("description")
            user_id = data.get("user_id")
            name = data.get("name", "未命名會議")

            if not date or not time or not user_id:
                return JsonResponse({"error": "Missing fields"}, status=400)

            datetime_str = f"{date} {time}"
            local_dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
            local_tz = timezone("Asia/Taipei")
            datetime_obj = local_tz.localize(local_dt).astimezone(timezone("UTC"))

            user = Users.objects.get(ID=user_id)
            default_project = Project.objects.first()

            meeting_data = {
                "name": name,
                "datetime": datetime_obj,
                "location": data.get("location", ""),
                "details": details or "",
                "created_by": user,
                "project": None
            }

            MeetingSchedule.objects.create(**meeting_data)
            return JsonResponse({"message": "Meeting added successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# 返回符合日期的會議
@csrf_exempt
def get_meetings_indi(request):
    try:
        date_str = request.GET.get('date')
        user_id = request.GET.get('user_id')

        if not date_str or not user_id:
            return JsonResponse({"error": "Missing date or user_id"}, status=400)

        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # 取得該 user 物件
        user = Users.objects.get(ID=user_id)

        # 撈出 user 參與的專案們
        user_projects = Project.objects.filter(members__user=user)

        # 撈出該 user 的會議（個人建立的）
        personal_meetings = MeetingSchedule.objects.filter(
            created_by=user,
            datetime__date=date
        )

        # 撈出 user 所屬專案中的所有會議
        project_meetings = MeetingSchedule.objects.filter(
            project__in=user_projects,
            datetime__date=date
        )

        # 合併兩者，避免重複資料（使用 union() 會過濾重複）
        all_meetings = personal_meetings.union(project_meetings).order_by("datetime")

        data = [
            {
                "id": m.id,
                "name": m.name,
                "datetime": m.datetime.isoformat(),
                "date": m.datetime.strftime("%Y-%m-%d"),
                "time": m.datetime.strftime("%H:%M"),
                "description": m.details,
                "location": m.location,
                "project_id": m.project.id if m.project else None
            }
            for m in all_meetings
        ]

        return JsonResponse({"meetings": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def get_all_user_meetings(request):
    """撈出個人 + 所屬專案的所有會議"""
    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "Missing user_id"}, status=400)

    try:
        user = Users.objects.get(ID=user_id)

        # 個人行程
        personal_meetings = MeetingSchedule.objects.filter(created_by=user)

        # 專案行程
        project_ids = ProjectMember.objects.filter(user=user).values_list("project_id", flat=True)
        project_meetings = MeetingSchedule.objects.filter(project_id__in=project_ids)

        # 合併 & 回傳
        combined = personal_meetings.union(project_meetings).order_by("datetime")

        data = [
            {
                "id": m.id,
                "name": m.name,
                "datetime": m.datetime.isoformat(),
                "date": m.datetime.strftime("%Y-%m-%d"),
                "time": m.datetime.strftime("%H:%M"),
                "description": m.details,
                "location": m.location,
                "project_id": m.project.id if m.project else None,
                "project_name": m.project.name if m.project else None,  # ✅ 加上 project name
            }
            for m in combined
        ]

        return JsonResponse({"meetings": data}, status=200)

    except Users.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

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



# 使用 Hugging Face API 而不依賴 TensorFlow/PyTorch
print("🔄 Loading Whisper model...")
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-tiny", device=-1)  # 強制使用 CPU
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

    audio_file = request.FILES['audio']
    audio_bytes = audio_file.read()

    try:
        # Step 1: 儲存原始上傳檔為 .m4a 或其他副檔名（用副檔名可提升 ffmpeg 準確率）
        ext = audio_file.name.split('.')[-1].lower()
        with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as temp_input:
            temp_input.write(audio_bytes)
            temp_input_path = temp_input.name

        # Step 2: 轉檔為 .wav（16kHz / mono）
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_output:
            temp_output_path = temp_output.name

        # 使用 ffmpeg 將音訊轉為 whisper 建議格式
        ffmpeg.input(temp_input_path)\
              .output(temp_output_path, format="wav", ac=1, ar="16000")\
              .overwrite_output()\
              .run(quiet=True)

        # Step 3: 讀 wav 為 numpy array
        samples, samplerate = sf.read(temp_output_path)

        # 清除暫存檔案
        os.remove(temp_input_path)
        os.remove(temp_output_path)

    except Exception as e:
        return JsonResponse({"error": f"Failed to convert audio: {str(e)}"}, status=500)

    try:
        # Step 4: 切段（每段 30 秒）處理
        segments = split_audio(samples, samplerate, segment_length=30)
        task_id = str(uuid.uuid4())[:8]
        progress_dict[task_id] = {"current": 0, "total": len(segments)}

        transcription_result = []
        for i, segment in enumerate(segments):
            transcription = whisper({
                "raw": segment,
                "sampling_rate": samplerate
            })
            transcription_result.append(transcription["text"])
            progress_dict[task_id]["current"] = i + 1

        full_transcription = "\n\n".join(transcription_result)

        return JsonResponse({
            "task_id": task_id,
            "text": full_transcription
        }, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
#進度資訊
@require_GET
def get_progress(request):
    task_id = request.GET.get("task_id")
    if not task_id:
        return JsonResponse({"error": "缺少 task_id"}, status=400)

    progress = progress_dict.get(task_id)
    if not progress:
        return JsonResponse({"error": "找不到此任務"}, status=404)

    return JsonResponse(progress)

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
            password=make_password(password),  # ✅ 這裡加密
            acco_level="adminC",
            company=company,
            name=account_name,  # ✅ 要加這行

            
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


openai_client = openai.OpenAI(api_key="")
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
            character = data.get("character", "a person")
            style = data.get("style", "friendly")

            prompt = (
                f"A 3D cartoon-style {character} portrait , in a {style} style, with a smiling facial expression. "
                "Highly detailed, Pixar and Disney-like rendering, ultra high-resolution, cinematic lighting, "
                "soft pastel colors, symmetrical face, front-facing, upper body only, simple light background"
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
            import traceback
            traceback.print_exc()  # 👈 加這個印出完整錯誤
            return JsonResponse({"error": f"伺服器錯誤: {e}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def update_avatar(request):
    """ 更新用戶頭貼（上傳 Firebase） """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            img_base64 = data.get("img_base64")

            if not user_id or not img_base64:
                return JsonResponse({"error": "Missing data"}, status=400)

            user = Users.objects.get(ID=user_id)

            # 移除 base64 前綴
            if ";base64," in img_base64:
                img_base64 = img_base64.split(";base64,")[1]

            img_data = base64.b64decode(img_base64)

            # 上傳到 Firebase Storage
            filename = f"avatars/avatar_{user_id}_{uuid.uuid4().hex[:8]}.png"
            blob = bucket.blob(filename)
            blob.upload_from_string(img_data, content_type="image/png")
            blob.make_public()
            # 更新資料庫中的 img 欄位為下載 URL
            user.img = blob.public_url
            user.save()

            return JsonResponse({"success": True, "img_url": user.img}, status=200)

        except Users.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            import traceback
            traceback.print_exc()
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



@csrf_exempt
def create_group(request):
    if request.method == "POST":
        data = json.loads(request.body)

        group_name = data.get("group_name")
        owner_email = data.get("owner_email")
        member_emails = data.get("member_emails", [])  # ✅ 取得選擇的好友 Email 列表

        # ✅ 檢查必要參數
        if not group_name or not owner_email:
            return JsonResponse({"error": "缺少必要參數"}, status=400)

        # ✅ 查找擁有者
        owner = Users.objects.filter(email=owner_email).first()
        if not owner:
            return JsonResponse({"error": "用戶不存在"}, status=404)

        # ✅ 創建群組
        group = Group.objects.create(name=group_name, owner=owner)

        # ✅ 讓擁有者成為群組成員
        GroupMembership.objects.create(group=group, user=owner, is_admin=True)

        # ✅ 遍歷選擇的好友，將他們加入群組
        for email in member_emails:
            user = Users.objects.filter(email=email).first()
            if user:
                GroupMembership.objects.create(group=group, user=user, is_admin=False)

        return JsonResponse({"message": "群組建立成功", "group_id": group.id}, status=201)

    return JsonResponse({"error": "請使用 POST 方法"}, status=405)
@csrf_exempt
def send_message(request):
    """處理發送訊息（支援個人與群組）"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            sender = data.get("sender")
            message = data.get("message")
            conversation_type = data.get("conversation_type", "individual")  # 預設為個人
            conversation_id = data.get("conversation_id")  # email 或 group_id

            if not sender or not message or not conversation_id:
                return JsonResponse({"error": "缺少必要字段"}, status=400)

            if conversation_type == "individual":
                receiver = data.get("receiver")
                if not receiver:
                    return JsonResponse({"error": "個人對話需提供 receiver"}, status=400)

                participants = [sender, receiver]
                conversation_id = "_".join(sorted([sender, receiver]))

            elif conversation_type == "group":
                from .models import GroupMembership, Group
                group = Group.objects.filter(name=conversation_id).first()
                if not group:
                    return JsonResponse({"error": "群組不存在"}, status=404)

                members = GroupMembership.objects.filter(group=group).select_related("user")
                participants = [member.user.email for member in members]

            else:
                return JsonResponse({"error": "無效的 conversation_type"}, status=400)

            new_message = {
                "sender": sender,
                "message": message,
                "timestamp": datetime.utcnow(),
                "participants": participants,
                "conversation_id": conversation_id,
                "conversation_type": conversation_type,
            }

            # ✅ 加入 retry with exponential backoff（最多 5 次）
            for attempt in range(5):
                try:
                    db.collection("meetsure").add(new_message)
                    return JsonResponse({"message": "訊息已發送"}, status=201)
                except GoogleAPICallError as e:
                    wait = (2 ** attempt) + random.uniform(0, 1)
                    print(f"❌ 發送失敗，第 {attempt + 1} 次嘗試後等待 {wait:.2f} 秒重試...：{e}")
                    time.sleep(wait)

            # 如果重試失敗，回傳錯誤
            return JsonResponse({"error": "訊息發送失敗，請稍後再試"}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"error": "無效的 JSON 格式"}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({"error": f"伺服器錯誤: {e}"}, status=500)

    return JsonResponse({"error": "請使用 POST 方法"}, status=405)
@csrf_exempt
def get_messages(request):
    """獲取與指定好友的聊天記錄"""
    sender = request.GET.get("sender")
    receiver = request.GET.get("receiver")

    if not sender or not receiver:
        return JsonResponse({"error": "請提供 sender 和 receiver"}, status=400)

    # 從 Firestore 查找該對話的訊息
    messages_ref = (
        db.collection("meetsure")
        .where("participants", "array-contains", sender)  # 確保發送者參與這段對話
        .order_by("timestamp")
    )
    messages = messages_ref.stream()

    chat_history = []
    for msg in messages:
        msg_data = msg.to_dict()
        # 確保訊息是這兩位用戶的
        if receiver in msg_data["participants"]:
            chat_history.append({
                "sender": msg_data["sender"],
                "receiver": msg_data["receiver"],
                "message": msg_data["message"],
                "timestamp": msg_data["timestamp"].isoformat(),
            })

    return JsonResponse({"messages": chat_history}, safe=False)


@csrf_exempt
def login_admin(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        # 🔍 查詢帳號
        user = Users.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "User not found"}, status=401)

        if not check_password(password, user.password):
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        # ✅ 限制角色
        if user.acco_level not in ["adminS", "adminC"]:
            return JsonResponse({"error": "Not allowed to login here"}, status=403)

        # ✅ 建立 auth_user（如無）
        if not user.auth_user:
            username = user.name or email
            auth_user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": username[:150]}
            )
            if created:
                auth_user.set_password(password)
                auth_user.save()
            user.auth_user = auth_user
            user.save()

        # ✅ 建立 token
        token, _ = Token.objects.get_or_create(user=user.auth_user)

        # ✅ 角色 & 導向
        role = "system_admin" if user.acco_level == "adminS" else "company_admin"
        redirect_url = "/#/backstage/admindashboard"

        return JsonResponse({
            "success": True,
            "user_id": user.ID,
            "role": role,
            "email": user.email,
            "token": token.key,
            "redirect_url": redirect_url
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)
    
@csrf_exempt
def llm_proxy(request):
    if request.method == "POST":
        try:
            llm_url = "http://localhost:3001/api/v1/workspace/meetsure/chat"
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer JV1YW65-5ZMMQQZ-PDZT80Z-1ENW7YE"
            }
            response = requests.post(llm_url, headers=headers, data=request.body)
            return JsonResponse(response.json(), status=response.status_code)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)