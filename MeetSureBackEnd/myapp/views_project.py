from rest_framework.decorators import api_view,permission_classes,authentication_classes, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Users, ProjectMember, ProjectTask,MeetingSchedule,ToDoList
from .serializers import ProjectSerializer,ProjectTaskSerializer,ProjectMemberUserSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication



@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_project_detail(request, id):  # ✅ 確保這裡是 `id`
    try:
        project = Project.objects.get(id=id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=200)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)
    
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_project_tasks(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({"error": "專案不存在"}, status=status.HTTP_404_NOT_FOUND)

    tasks = ProjectTask.objects.filter(project=project).order_by("id")
    serializer = ProjectTaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ✅ 更新任務為已完成
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def complete_task(request, task_id):
    try:
        task = ProjectTask.objects.get(id=task_id)
        task.completed = True
        task.save()
        return Response({"message": f"Task {task.name} marked as completed"}, status=status.HTTP_200_OK)
    except ProjectTask.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_projects(request):
    """ 獲取所有專案的 API，包含成員與任務 """
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_project(request):
    data = request.data
    members_data = data.pop("members", [])
    tasks_data = data.pop("tasks", [])

    custom_user = Users.objects.filter(email=request.user.email).first()
    if not custom_user:
        return Response({"error": "找不到對應的使用者（Users）"}, status=400)

    # ✅ 將 created_by 設定成 custom_user
    project, created = Project.objects.get_or_create(
        name=data["name"],
        defaults={**data, "created_by": custom_user}
    )


    # ✅ **確保不會重複加入 members**
    for user_id in set(members_data):
        user = Users.objects.filter(ID=user_id).first()
        if user:
            ProjectMember.objects.get_or_create(project=project, user=user)

    # ✅ **確保不會重複加入 tasks**
    for task_data in set(tuple(t.items()) for t in tasks_data):
        task_data = dict(task_data)
        ProjectTask.objects.get_or_create(project=project, name=task_data["name"], defaults=task_data)

    return Response({"message": "專案已成功儲存！"}, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)

        # 🔥 刪除相關 ProjectMember、Task、Meeting、Todo（有就刪）
        ProjectTask.objects.filter(project=project).delete()
        ProjectMember.objects.filter(project=project).delete()
        MeetingSchedule.objects.filter(project=project).delete()
        ToDoList.objects.filter(project=project).delete()  # 如果有的話

        # 🔥 最後刪除專案
        project.delete()

        return Response({"message": "Project and related data deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    except Project.DoesNotExist:
        return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_by_email(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "缺少 email 參數"}, status=400)

    user = Users.objects.filter(email=email).first()  # ✅ 只篩選符合 email 的用戶
    if not user:
        return JsonResponse({"error": "用戶不存在"}, status=404)

    return JsonResponse({
        "id": user.ID,   # 確保回傳 `id`
        "name": user.name if user.name else "未命名用戶"
    }, status=200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_project_members(request):
    project_id = request.GET.get('project_id')
    if not project_id:
        return Response({"error": "project_id is required"}, status=400)

    members = ProjectMember.objects.filter(project_id=project_id).select_related('user')
    users = [pm.user for pm in members]
    serializer = ProjectMemberUserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_project_member(request):
    print("📥 POST 請求資料：", request.data)  # 加上這行
    project_id = request.data.get("project_id")
    user_id = request.data.get("user_id")

    if not project_id or not user_id:
        return Response({"error": "缺少 project_id 或 user_id"}, status=400)

    try:
        project = Project.objects.get(id=project_id)
        user = Users.objects.get(ID=user_id)
        ProjectMember.objects.get_or_create(project=project, user=user)
        return Response({"message": "已成功加入專案"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_project_member(request):
    project_id = request.data.get("project_id")
    user_email = request.data.get("user_email")

    if not project_id or not user_email:
        return Response({"error": "缺少 project_id 或 user_email"}, status=400)

    try:
        user = Users.objects.get(email=user_email)
        ProjectMember.objects.filter(project_id=project_id, user=user).delete()
        return Response({"message": "已成功移除成員"}, status=204)
    except Users.DoesNotExist:
        return Response({"error": "找不到使用者"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)