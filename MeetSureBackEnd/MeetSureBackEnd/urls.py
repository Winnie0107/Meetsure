from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from myapp.views import user_list, get_meetings, register_user, add_meeting, transcribe_audio, register_company,register_representative,get_companies,get_representatives
from django.conf import settings
from django.conf.urls.static import static
from myapp.views import login_user  
from myapp.gptApiview import chatgpt_response  
from myapp.views_line import LineWebhookView,line_webhook,generate_verification_code,get_ngrok_url,webhook_line 
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


# API 路由
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),  # 指向 React 的 index.html
    path('api/register', register_user, name='register_user'),  # 註冊用戶
    path('api/users/', user_list, name='user_list'),  # 用戶列表
    path('api/meetings/add', add_meeting, name='add_meeting'),  # 新增會議
    path('api/meetings', get_meetings, name='get_meetings'),  # 獲取會議列表
    path('api/transcribe', transcribe_audio, name='transcribe_audio'),  # 音檔轉文字
    path('api/login/', login_user, name='login_user'),  # 新增此行
    path("chatgpt/", chatgpt_response, name="chatgpt_response"), #gpt 
    path('register_company/', register_company, name='register_company'),
    path('register_representative/', register_representative, name='register_representative'),
    path('get_companies/', get_companies, name='get_companies'),
    path('get_representatives/', get_representatives, name='get_representatives'),
    path("webhook/line/", LineWebhookView.as_view(), name="line-webhook"),  
    path("api/generate-verification-code/", generate_verification_code),    
    path("api/line-webhook/", line_webhook, name="line-webhook-alt"),  # 另一個 Webhook 處理
    path("api/get-ngrok-url/", get_ngrok_url, name="get-ngrok-url"),  # ✅ 讓前端取得最新的 ngrok URL
    path("webhook/line/", webhook_line, name="webhook_line"),


]

# 靜態文件設置（開發模式下）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
