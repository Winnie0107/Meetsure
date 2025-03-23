from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Users, ProjectMember, ProjectTask
from .serializers import ProjectSerializer
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

    # ✅ **確保不會創建重複的專案**
    project, created = Project.objects.get_or_create(name=data["name"], defaults=data)

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


@csrf_exempt
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
