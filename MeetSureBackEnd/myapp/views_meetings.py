from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from myapp.models import MeetingSchedule , Project
from myapp.serializers import MeetingSerializer

# ✅ 取得專案的會議列表
@api_view(["GET"])
def get_meetings(request, project_id):
    meetings = MeetingSchedule.objects.filter(project_id=project_id).order_by("datetime")
    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ 創建新會議
@api_view(["POST"])
def create_meeting(request):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # 🔥 加上錯誤輸出來幫你 debug
    print("❌ 會議驗證失敗:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

