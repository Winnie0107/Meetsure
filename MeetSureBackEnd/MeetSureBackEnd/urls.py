from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from myapp.views import user_list, get_meetings, register_user, add_meeting, transcribe_audio, register_company,register_representative,get_companies,get_representatives,get_profile, update_profile, generate_avatar, update_name, update_password,update_avatar,send_message, get_messages
from django.conf import settings
from django.conf.urls.static import static
from myapp.views import login_user  
from myapp.gptApiview import chatgpt_response  
from myapp.views_line import LineWebhookView,line_webhook,generate_verification_code,get_ngrok_url,webhook_line,check_line_binding 
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from myapp.views_friends import send_friend_request, get_friend_requests, respond_to_friend_request, get_friends_list
from myapp.views_project import create_project,get_user_by_email,get_projects,get_project_detail,get_project_tasks,complete_task,get_project_members
from myapp.views_meetings import get_meetings, create_meeting,update_meeting,delete_meeting,get_user_related_meetings
from myapp.views_todolist import todo_list_create_view

# API 路由
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),  # 指向 React 的 index.html
    path('api/register', register_user, name='register_user'),  # 註冊用戶
    path('api/users/', user_list, name='user_list'),  # 用戶列表
    path('api/meetings/add/', add_meeting, name='add_meeting'),  # 新增會議
    path('api/meetings/', get_meetings, name='get_meetings'),  # 獲取會議列表
    path('api/transcribe/', transcribe_audio, name='transcribe_audio'),  # 音檔轉文字
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
    path("api/check-line-binding/", check_line_binding,name="check_line_binding"),

    #friends
    path("api/friend_requests/", send_friend_request, name="send_friend_request"),
    path("api/friend_requests/<int:request_id>/", respond_to_friend_request, name="respond_to_friend_request"),
    path("api/friend_requests/list/", get_friend_requests, name="get_friend_requests"),  # ✅ 確保這個路徑正確
    path("api/friends/", get_friends_list, name="get_friends_list"),
    path('api/profile', get_profile, name='get_profile'),
    path('api/profile/update', update_profile, name='update_profile'),

    #user profile
    path('api/generate_avatar/', generate_avatar, name='generate_avatar'),  # ✅ 註冊 AI 生成頭貼 API
    path('api/update_avatar/', update_avatar, name='update_avatar'),
    path("api/update_name/", update_name, name="update_name"),
    path("api/update_password/", update_password, name="update_password"),
    path("send_message/", send_message, name="send_message"),
    path("get_messages/", get_messages, name="get_messages"),

    #project
    path("api/projects/", create_project, name="create_project"),
    path("api/user/", get_user_by_email, name="get_user_by_email"),  
    path("api/projects/get/", get_projects, name="get_projects"),
    path("api/projects/<int:id>/", get_project_detail, name="get_project_detail"),
    path("api/projects/<int:project_id>/tasks/", get_project_tasks, name="get_project_tasks"),
    path("api/tasks/<int:task_id>/complete/", complete_task, name="complete_task"),
    path('api/project-members/', get_project_members, name='project-members'),
    #

    #meetings
    path("api/meetings/<int:project_id>/", get_meetings, name="get_meetings"),
    path("api/meetings/create/", create_meeting, name="create_meeting"),  
    path("api/meetings/<int:meeting_id>/update/", update_meeting, name="update_meeting"),
    path("api/meetings/<int:meeting_id>/delete/", delete_meeting, name="delete_meeting"),
    path("api/meetings/get_user_related_meetings/", get_user_related_meetings,name="get_user_related_meetings"),

    #

    #todolist
    path("api/todos/", todo_list_create_view, name="todo-list-create"),
    #
]

# 靜態文件設置（開發模式下）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)