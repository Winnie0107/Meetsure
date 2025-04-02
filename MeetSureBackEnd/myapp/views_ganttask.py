from rest_framework.decorators import api_view,permission_classes,authentication_classes, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import GanttTask, Project
from .serializers import GanttTaskSerializer
from rest_framework.authentication import TokenAuthentication

# 取得特定專案的所有任務
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_gantt_tasks(request, project_id):
    tasks = GanttTask.objects.filter(project_id=project_id)
    serializer = GanttTaskSerializer(tasks, many=True)
    return Response(serializer.data)

# 建立新的任務
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_gantt_task(request):
    serializer = GanttTaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# 更新任務（用於日期或進度變更）
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_gantt_task(request, task_id):
    try:
        task = GanttTask.objects.get(id=task_id)
    except GanttTask.DoesNotExist:
        return Response({"error": "任務不存在"}, status=status.HTTP_404_NOT_FOUND)

    serializer = GanttTaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 刪除任務
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_gantt_task(request, task_id):
    try:
        task = GanttTask.objects.get(id=task_id)
        task.delete()
        return Response({"message": "任務已刪除"}, status=status.HTTP_204_NO_CONTENT)
    except GanttTask.DoesNotExist:
        return Response({"error": "任務不存在"}, status=status.HTTP_404_NOT_FOUND)
