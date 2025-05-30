from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from myapp.views import user_list, get_meetings_indi, get_all_user_meetings, register_user, add_meeting, transcribe_audio, register_company,register_representative,get_companies,get_representatives,get_profile, update_profile, generate_avatar, update_name, update_password,update_avatar,send_message, get_messages,login_admin
from django.conf import settings
from django.conf.urls.static import static
from myapp.views import login_user  
from myapp.gptApiview import chatgpt_response  
from myapp.views_line import LineWebhookView,line_webhook,generate_verification_code,get_ngrok_url,webhook_line,check_line_binding 
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from myapp.views_friends import send_friend_request, get_friend_requests, respond_to_friend_request, get_friends_list
from myapp.views_project import create_project,get_user_by_email,get_projects,get_project_detail,get_project_tasks,complete_task,get_project_members,delete_project,add_project_member, remove_project_member
from myapp.views_meetings import get_meetings, create_meeting,update_meeting,delete_meeting,get_user_related_meetings,get_user_related_meetings
from myapp.views_todolist import todo_list_create_view,todo_delete_view,all_todos_view,recent_todos_view
from myapp.views_meeting_record import save_meeting_record,get_meeting_records,delete_meeting_record,update_meeting_record
from myapp.views_search_friends import search_users
from myapp.views_group import get_user_groups,create_custom_group,get_group_join_notifications
from myapp.views_ganttask import get_gantt_tasks,create_gantt_task,update_gantt_task,delete_gantt_task

# API 路由
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),  # 指向 React 的 index.html
    path('api/register', register_user, name='register_user'),  # 註冊用戶
    path('api/users/', user_list, name='user_list'),  # 用戶列表
    path('api/meetings/add/', add_meeting, name='add_meeting'),  # 新增會議
    path("api/meetings/", get_meetings_indi, name="get_meetings_indi"),
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
    path('api/login/admin/', login_admin, name='login_admin'),  # 新增此行

    #friends
    path("api/friend_requests/", send_friend_request, name="send_friend_request"),
    path("api/friend_requests/<int:request_id>/", respond_to_friend_request, name="respond_to_friend_request"),
    path("api/friend_requests/list/", get_friend_requests, name="get_friend_requests"),  # ✅ 確保這個路徑正確
    path("api/friends/", get_friends_list, name="get_friends_list"),
    path('api/profile', get_profile, name='get_profile'),
    path('api/profile/update', update_profile, name='update_profile'),
    path('api/search_users/', search_users, name='search_users'),

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
    path('api/projects/<int:project_id>/delete/', delete_project, name='delete_project-members'),
    path('api/project-members/add/', add_project_member, name='add_project_member'),
    path('api/project-members/remove/', remove_project_member, name='remove_project_member'),  # DELETE 移除
    #

    #project meetings
    path("api/meetings/<int:project_id>/", get_meetings, name="get_meetings"),
    path("api/meetings/create/", create_meeting, name="create_meeting"),  
    path("api/meetings/<int:meeting_id>/update/", update_meeting, name="update_meeting"),
    path("api/meetings/<int:meeting_id>/delete/", delete_meeting, name="delete_meeting"),
    path("api/save-meeting-record/", save_meeting_record, name="save_meeting_record"),
    path("api/meeting-records/<int:project_id>/",get_meeting_records, name="get_meeting_records"),
    path('api/meeting-records/delete/<int:record_id>/', delete_meeting_record, name='delete_meeting_record'),
    path('api/meeting-records/update/<int:record_id>/', update_meeting_record, name='update_meeting_record'),
    path("api/meetings/get_user_related_meetings/", get_user_related_meetings,name="get_user_related_meetings"),
    path("api/meetings/all_user_meetings/", get_all_user_meetings, name="get_all_user_meetings"),
    #

    #todolist
    path("api/todos/", todo_list_create_view, name="todo-list-create"),
    path("api/todos/<int:pk>/", todo_delete_view, name="todo_delete_view"), 
    path("api/todos/recent/",recent_todos_view,name="recent_todos_view"),
    path("api/todos/all/",all_todos_view,name="all_todos_view"),
    #

    #轉檔進度
    
    #

    #group
    path("api/groups/", get_user_groups, name="get_user_groups"),
    path("api/groups/create/", create_custom_group, name="create_group"),
    path('api/group_join_notifications/', get_group_join_notifications, name='group-join-notifications'),

    #

    #gantt
    path('api/projects/<int:project_id>/gantt-tasks/', get_gantt_tasks, name='get_gantt_tasks'),
    path('api/gantt-tasks/create/', create_gantt_task, name='create_gantt_task'),
    path('api/gantt-tasks/<int:task_id>/update/', update_gantt_task, name='update_gantt_task'),
    path('api/gantt-tasks/<int:task_id>/delete/', delete_gantt_task, name='delete_gantt_task'),
    #
]

# 靜態文件設置（開發模式下）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)