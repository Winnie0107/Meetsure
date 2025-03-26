# views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

from .models import ToDoList
from .serializers import ToDoListSerializer

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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
