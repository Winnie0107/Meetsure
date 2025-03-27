from .models import MeetingRecord, Project, Users
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .serializers import MeetingRecordSerializer
from rest_framework.response import Response
from rest_framework import status
from dateutil.parser import parse as parse_datetime, ParserError
from django.utils.timezone import make_aware, is_naive
import pytz
from datetime import timezone  # ✅ 正確的 UTC 來源


tz = pytz.timezone("Asia/Taipei")

@csrf_exempt
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_meeting_records(request, project_id):
    try:
        meetings = MeetingRecord.objects.filter(project__id=project_id).order_by('-datetime')
        serializer = MeetingRecordSerializer(meetings, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
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

            project = Project.objects.get(id=project_id)
            user = Users.objects.get(ID=user_id)

            try:
                # 前端傳進來的是本地時間（Asia/Taipei）格式的 ISO
                naive_local = parse_datetime(datetime_str)
                if not is_naive(naive_local):
                    naive_local = naive_local.replace(tzinfo=None)
                local_aware = tz.localize(naive_local)
                utc_dt = local_aware.astimezone(pytz.UTC)
            except ParserError:
                return JsonResponse({"error": "無效的時間格式"}, status=400)

            record = MeetingRecord.objects.create(
                title=title,
                datetime=utc_dt,
                transcript=transcript,
                analysis=analysis,
                notes=notes,
                project=project,
                uploaded_by=user
            )

            return JsonResponse({"message": "會議紀錄儲存成功", "id": record.id}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "無效請求方法"}, status=405)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_meeting_record(request, record_id):
    try:
        record = MeetingRecord.objects.get(id=record_id)
        record.delete()
        return Response({"message": "刪除成功"}, status=status.HTTP_204_NO_CONTENT)
    except MeetingRecord.DoesNotExist:
        return Response({"error": "會議紀錄不存在"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_meeting_record(request, record_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            record = MeetingRecord.objects.get(id=record_id)

            record.title = data.get("title", record.title)

            datetime_str = data.get("datetime")
            if datetime_str:
                try:
                    local_dt = parse_datetime(datetime_str)
                    if is_naive(local_dt):
                        dt = make_aware(local_dt, timezone=timezone.utc)
                    else:
                        dt = local_dt.astimezone(timezone.utc)
                    record.datetime = dt
                except ParserError:
                    return JsonResponse({"error": "無效的時間格式"}, status=400)

            record.transcript = data.get("transcript", record.transcript)
            record.analysis = data.get("analysis", record.analysis)
            record.save()

            return JsonResponse({"message": "更新成功"}, status=200)

        except MeetingRecord.DoesNotExist:
            return JsonResponse({"error": "找不到會議記錄"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "不支援的請求方法"}, status=405)
