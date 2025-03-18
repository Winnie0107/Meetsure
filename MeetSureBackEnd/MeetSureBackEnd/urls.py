from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from myapp.views import user_list, get_meetings, register_user, add_meeting, transcribe_audio, register_company,register_representative,get_companies,get_representatives,get_profile, update_profile, generate_avatar, update_name, update_password,update_avatar
from django.conf import settings
from django.conf.urls.static import static
from myapp.views import login_user  
from myapp.gptApiview import chatgpt_response  
from myapp.views_line import LineWebhookView,line_webhook,generate_verification_code,get_ngrok_url,webhook_line 
from myapp.views_friends import send_friend_request, get_friend_requests, respond_to_friend_request, get_friends_list


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
    path("api/generate-verification-code/", generate_verification_code, name="generate-verification-code"),
    path("api/line-webhook/", line_webhook, name="line-webhook-alt"),  # 另一個 Webhook 處理
    path("api/get-ngrok-url/", get_ngrok_url, name="get-ngrok-url"),  # ✅ 讓前端取得最新的 ngrok URL
    path("webhook/line/", webhook_line, name="webhook_line"),
    #friends
    # 送出好友邀請 (POST)
    path("api/friend_requests/", send_friend_request, name="send_friend_request"),
    path("api/friend_requests/<int:request_id>/", respond_to_friend_request, name="respond_to_friend_request"),
    path("api/friend_requests/list/", get_friend_requests, name="get_friend_requests"),  # ✅ 確保這個路徑正確
    path("api/friends/", get_friends_list, name="get_friends_list"),
    path('api/profile', get_profile, name='get_profile'),
    path('api/profile/update', update_profile, name='update_profile'),
    path('api/generate_avatar/', generate_avatar, name='generate_avatar'),  # ✅ 註冊 AI 生成頭貼 API
    path('api/update_avatar/', update_avatar, name='update_avatar'),
    path("api/update_name/", update_name, name="update_name"),
    path("api/update_password/", update_password, name="update_password"),
    #
]

# 靜態文件設置（開發模式下）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)