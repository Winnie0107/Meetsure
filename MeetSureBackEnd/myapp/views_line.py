import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.conf import settings
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
from myapp.models import LineUser,LineBinding
import uuid
import xml.etree.ElementTree as ET
from django.contrib.auth.decorators import login_required
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from .models import Users
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from django.contrib.auth import get_user_model  # ✅ 確保使用 Django 內建 User
AuthUser = get_user_model()  # ✅ Django 內建 `User`



# 你的 LINE Access Token
LINE_ACCESS_TOKEN = "VPhr1EKyTd1f8NXXJes4r5kdf46r4QKVXCYEUwCzFrhZZXp5RYFfs2bi0jIexQPu1Au5z3ZL+pckzxvGs/R8bXVTeN/C+gmw/JInt7yxK/mO28Gh6QcYI+CXWfkmw/hMO9ZbCuNIVtAHQf71dxcYCAdB04t89/1O/w1cDnyilFU="
LINE_WEBHOOK_URL = "https://api.line.me/v2/bot/channel/webhook"
line_bot_api = LineBotApi(LINE_ACCESS_TOKEN)
handler = WebhookHandler("32fe2becc4bcc841663077569179f48f")

@login_required
def get_line_user_id(request):
    """ 查詢已登入用戶的 LINE 綁定資訊 """
    user = request.user  # 取得當前登入的用戶
    try:
        line_user = LineUser.objects.get(user=user)
        return JsonResponse({"line_user_id": line_user.line_user_id})
    except LineUser.DoesNotExist:
        return JsonResponse({"error": "尚未綁定 LINE"}, status=404)

def fetch_ngrok_url():
    """ 取得目前 ngrok 產生的公開網址，優先請求 JSON，失敗則解析 XML """
    try:
        # 嘗試請求 JSON 格式
        response = requests.get("http://localhost:4040/api/tunnels", headers={"Accept": "application/json"})
        response.raise_for_status()

        try:
            tunnels = response.json().get("tunnels", [])
            for tunnel in tunnels:
                if tunnel.get("proto") == "https":  # 只取 HTTPS 的 ngrok URL
                    return tunnel.get("public_url")
        except requests.exceptions.JSONDecodeError:
            pass  # JSON 解析失敗，改用 XML 解析

        # 如果 JSON 解析失敗，改用 XML 解析
        root = ET.fromstring(response.text)  # 解析 XML
        for tunnel in root.findall("Tunnels"):
            public_url = tunnel.find("PublicURL").text  # 取得 ngrok 公開網址
            if "https://" in public_url:
                return public_url
    except requests.exceptions.RequestException as e:
        print(f"取得 ngrok URL 失敗: {e}")
    return None
def get_ngrok_url(request):
    """ 回傳目前的 ngrok 公開網址，作為 Django API View """
    ngrok_url = fetch_ngrok_url()  # ✅ 呼叫 `fetch_ngrok_url()` 來取得 URL
    if ngrok_url:
        return JsonResponse({"ngrok_url": ngrok_url})
    return JsonResponse({"error": "無法取得 ngrok URL"}, status=500)


def update_line_webhook():
    """ 更新 LINE Webhook 為最新的 ngrok URL """
    ngrok_url = settings.NGROK_URL

    if not ngrok_url:
        try:
            response = requests.get("http://localhost:4040/api/tunnels")
            response.raise_for_status()
            tunnels = response.json().get("tunnels", [])
            for tunnel in tunnels:
                if tunnel.get("proto") == "https":
                    ngrok_url = tunnel.get("public_url")
                    break
        except requests.exceptions.RequestException as e:
            print(f"取得 ngrok URL 失敗: {e}")
            return  # 無法更新 Webhook

    if ngrok_url:
        webhook_url = f"{ngrok_url}/webhook/line/"
        headers = {
            "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        data = {"endpoint": webhook_url}

        response = requests.put("https://api.line.me/v2/bot/channel/webhook", json=data, headers=headers)
        print(f"LINE Webhook 更新結果: {response.status_code}, {response.text}")

# Django 啟動時更新 Webhook
update_line_webhook()

@method_decorator(csrf_exempt, name='dispatch')
class LineWebhookView(View):
    def post(self, request, *args, **kwargs):
        print("🔍 收到 Webhook 請求")
        print("Headers:", request.headers)  # 列出所有請求標頭
        print("Body:", request.body.decode("utf-8"))  # 列出請求內容
        signature = request.headers.get('X-Line-Signature')

        if not signature:
            return JsonResponse({'status': 'failed', 'message': 'Missing signature'}, status=400)

        body = request.body.decode('utf-8')

        try:
            handler.handle(body, signature)
        except InvalidSignatureError:
            return JsonResponse({'status': 'failed', 'message': 'Invalid signature'}, status=400)

        return JsonResponse({'status': 'success'})

    
    
@csrf_exempt
def line_webhook(request):
    if request.method == "POST":
        body = request.body.decode("utf-8")
        try:
            data = json.loads(body)
            print("收到的 LINE Webhook:", json.dumps(data, indent=4))
            return JsonResponse({"status": "success"})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "JSON 解碼失敗"}, status=400)

    # 🔽 當瀏覽器用 GET 訪問時，顯示友善提示
    return JsonResponse({"status": "error", "message": "請使用 POST 發送 Webhook 請求"}, status=405)



def reply_message(user_id, text):
    """ 透過 LINE Messaging API 回覆用戶訊息 """
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "to": user_id,
        "messages": [{"type": "text", "text": text}]
    }
    response = requests.post(url, json=data, headers=headers)
    print(f"回覆訊息結果: {response.status_code}, {response.text}")
    
    
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generate_verification_code(request):
    """ 產生 LINE 綁定驗證碼 """
    print(f"🔍 `request.user`: {request.user}")  
    print(f"🔍 `request.auth`: {request.auth}")  
    print(f"🔍 `request.META.get('HTTP_AUTHORIZATION')`: {request.META.get('HTTP_AUTHORIZATION')}")


    # **Step 1: 確保獲取的是 Django 內建 `auth.User`**
    try:
        token = Token.objects.get(key=request.auth)  # `request.auth` 應該是 Token 字串
        auth_user = token.user  # ✅ `auth_user` = Django 內建 `User`
        print(f"✅ 解析出的 AuthUser: {auth_user} (ID={auth_user.id})")
    except Token.DoesNotExist:
        return JsonResponse({"error": "無效的 Token"}, status=401)

    # **Step 2: 找到對應的 `Users` instance**
    try:
        user = Users.objects.get(auth_user=auth_user)  # ✅ 透過 `auth_user` 找 `Users`
        print(f"✅ 找到對應的 Users instance: {user} (ID={user.ID})")
    except Users.DoesNotExist:
        return JsonResponse({"error": "找不到對應的 Users 資料"}, status=400)

    # **Step 3: 產生驗證碼並綁定 `auth_user`**
    verification_code = str(uuid.uuid4())[:6]  # 產生 6 碼驗證碼
    line_binding, created = LineBinding.objects.update_or_create(
        user=auth_user,  # ✅ 存 `auth.User` 而不是 `Users`
        defaults={"verification_code": verification_code}
    )
    print(f"🔍 LineBinding 更新結果: created={created}, verification_code={line_binding.verification_code}")

    return JsonResponse({"verification_code": verification_code})


    
    
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    user_id = event.source.user_id  # 取得 LINE 用戶 ID
    text = event.message.text.strip()  # 取得使用者輸入的驗證碼

    if not user_id:
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text="發生錯誤，請稍後再試！"))
        return

    try:
        line_binding = LineBinding.objects.filter(verification_code=text).first()

        if not line_binding:
            raise LineBinding.DoesNotExist  # 讓 except 處理錯誤訊息

        # 綁定 LINE 帳號
        line_user, created = LineUser.objects.update_or_create(
            user=line_binding.user, defaults={"line_user_id": user_id}
        )

        line_binding.is_linked = True  # 記錄此用戶已綁定
        line_binding.verification_code = None  # ✅ 設為空字串，避免 unique=True 問題
        line_binding.save(update_fields=["verification_code", "is_linked"])  # 只更新這兩個欄位


        reply_text = "綁定成功！"
    except LineBinding.DoesNotExist:
        reply_text = "驗證碼錯誤，請確認後再輸入。"
    except Exception as e:
        print(f"❌ 發生錯誤: {e}")  # ✅ Debug 用
        reply_text = "發生錯誤，請稍後再試。"

    line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_text))
    



def send_line_message(user_id, message):
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "to": user_id,
        "messages": [{"type": "text", "text": message}]
    }
    response = requests.post(url, json=data, headers=headers)
    print(f"回應狀態碼: {response.status_code}, 回應內容: {response.text}")
    
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_line_binding(request):
    auth_user = request.user
    is_linked = LineBinding.objects.filter(user=auth_user, is_linked=True).exists()
    return JsonResponse({"is_linked": is_linked})

@csrf_exempt  # 忽略 CSRF 保護，讓 LINE Webhook 可以存取
def webhook_line(request):
    if request.method == "POST":
        return JsonResponse({"message": "Webhook received"}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)
# send_line_message("你的line用戶ID", "Hello from Django!")
print(fetch_ngrok_url())  # ✅ 這樣只獲取 ngrok URL，不會報錯