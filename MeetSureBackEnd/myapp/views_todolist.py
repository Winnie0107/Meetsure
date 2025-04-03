# views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

from .models import ToDoList,Users
from .serializers import ToDoListSerializer
from datetime import timedelta
from django.utils import timezone
from myapp.views_line import send_line_message
from myapp.models import LineUser

@api_view(["GET", "POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def todo_list_create_view(request):
    if request.method == "GET":
        project_id = request.query_params.get("project_id")
        if not project_id:
            return Response({"error": "請提供 project_id"}, status=status.HTTP_400_BAD_REQUEST)

        todos = ToDoList.objects.filter(project_id=project_id)
        serializer = ToDoListSerializer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = ToDoListSerializer(data=request.data)
    if serializer.is_valid():
        todo = serializer.save()

        # 🔽 新增這段 LINE 通知的邏輯
        try:
            assigned_user = todo.assigned_to
            auth_user = assigned_user.auth_user
            line_user = LineUser.objects.get(user=auth_user)
            message = f"📌 你有一個新的待辦事項：\n「{todo.name}」\n📁 所屬專案：{todo.project.name}"
            send_line_message(line_user.line_user_id, message)
        except LineUser.DoesNotExist:
            pass
        except Exception as e:
            print(f"❌ LINE 通知失敗：{e}")

        return Response(ToDoListSerializer(todo).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#列出所有待辦事項
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def all_todos_view(request):
    auth_user = request.user  # ➤ 登入的是 auth_user（Django 內建 User）

    try:
        # 🔍 找出綁定這個 auth_user 的自訂 Users 物件
        user = Users.objects.get(auth_user=auth_user)
    except Users.DoesNotExist:
        return Response({"error": "找不到對應的使用者"}, status=status.HTTP_404_NOT_FOUND)

    # ✅ 只撈出指派給這個使用者的待辦事項
    todos = ToDoList.objects.filter(assigned_to=user).order_by('-created_at')

    data = []
    for todo in todos:
        data.append({
            "id": todo.id,
            "name": todo.name,
            "project_name": todo.project.name,
            "assigned_to_name": todo.assigned_to.name,
            "project": todo.project.id,
            "created_at": todo.created_at,
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recent_todos_view(request):
    auth_user = request.user

    try:
        user = Users.objects.get(auth_user=auth_user)
    except Users.DoesNotExist:
        return Response({"error": "找不到對應的使用者"}, status=status.HTTP_404_NOT_FOUND)

    # 取得時間範圍（預設 24 小時內），可從 query 讀取
    hours = int(request.GET.get("hours", 24))
    time_threshold = timezone.now() - timedelta(hours=hours)

    todos = ToDoList.objects.filter(
        assigned_to=user,
        created_at__gte=time_threshold
    ).order_by("-created_at")

    data = []
    for todo in todos:
        data.append({
            "id": todo.id,
            "name": todo.name,
            "project_name": todo.project.name,
            "assigned_to_name": todo.assigned_to.name,
            "project": todo.project.id,
            "created_at": todo.created_at,
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def todo_delete_view(request, pk):
    try:
        todo = ToDoList.objects.get(pk=pk)
        todo.delete()
        return Response({"message": "任務已刪除"}, status=status.HTTP_204_NO_CONTENT)
    except ToDoList.DoesNotExist:
        return Response({"error": "任務不存在"}, status=status.HTTP_404_NOT_FOUND)