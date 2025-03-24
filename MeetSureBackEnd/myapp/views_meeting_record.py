# views.py

from .models import MeetingRecord, Project, Users
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .serializers import MeetingRecordSerializer  # 你要自己建 serializer

@csrf_exempt
def get_meeting_records(request, project_id):
    try:
        meetings = MeetingRecord.objects.filter(project__id=project_id).order_by('-datetime')
        serializer = MeetingRecordSerializer(meetings, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def save_meeting_record(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get("title")
            datetime_str = data.get("datetime")
            transcript = data.get("transcript")
            analysis = data.get("analysis")
            notes = data.get("notes", "")
            project_id = data.get("project_id")
            user_id = data.get("user_id")

            if not all([title, datetime_str, transcript, analysis, project_id, user_id]):
                return JsonResponse({"error": "缺少必要欄位"}, status=400)

            # 查找 project 和 user
            project = Project.objects.get(id=project_id)
            user = Users.objects.get(ID=user_id)
            dt = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M")

            record = MeetingRecord.objects.create(
                title=title,
                datetime=dt,
                transcript=transcript,
                analysis=analysis,
                notes=notes,
                project=project,
                uploaded_by=user  # ✅ 關鍵修正
            )

            return JsonResponse({"message": "會議紀錄儲存成功", "id": record.id}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "無效請求方法"}, status=405)
