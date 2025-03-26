from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.utils import timezone

from myapp.models import MeetingSchedule, Project, Users, LineUser, ProjectMember
from myapp.serializers import MeetingSerializer, MeetingReminderSerializer
from myapp.views_line import send_line_message


# ✅ 共用訊息格式
def format_meeting_message(meeting, action="新增"):
    return (
        f"🔔 會議{action}提醒：\n\n"
        f"📌 會議名稱：{meeting.name}\n"
        f"🕒 時間：{meeting.datetime.strftime('%Y/%m/%d %H:%M')}\n"
        f"📍 地點：{meeting.location or '未填寫'}\n"
        f"📝 補充資訊：{meeting.details or '無'}"
    )


# ✅ 傳送給所有該會議的專案成員
def notify_project_members(meeting, action="新增"):
    members = ProjectMember.objects.filter(project=meeting.project)
    notified = 0
    for member in members:
        auth_user = member.user.auth_user
        if not auth_user:
            continue
        line_user = LineUser.objects.filter(user=auth_user).first()
        if line_user:
            msg = format_meeting_message(meeting, action)
            send_line_message(line_user.line_user_id, msg)
            notified += 1
    print(f"📣 已發送 {action} 通知給 {notified} 位成員")


# ✅ 取得專案的會議列表
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_meetings(request, project_id):
    meetings = MeetingSchedule.objects.filter(project_id=project_id).order_by("datetime")
    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ 新增會議 + 通知
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_meeting(request):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        meeting = serializer.save()
        notify_project_members(meeting, action="新增")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print("❌ 會議驗證失敗:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ 修改會議 + 通知
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_meeting(request, meeting_id):
    try:
        meeting = MeetingSchedule.objects.get(pk=meeting_id)
    except MeetingSchedule.DoesNotExist:
        return Response({"error": "找不到此會議"}, status=404)

    serializer = MeetingSerializer(meeting, data=request.data, partial=True)
    if serializer.is_valid():
        updated_meeting = serializer.save()
        notify_project_members(updated_meeting, action="修改")
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=400)


# ✅ 刪除會議 + 通知
@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_meeting(request, meeting_id):
    try:
        meeting = MeetingSchedule.objects.get(id=meeting_id)
        notify_project_members(meeting, action="刪除")
        meeting.delete()
        return Response({"message": "會議已刪除"}, status=status.HTTP_204_NO_CONTENT)
    except MeetingSchedule.DoesNotExist:
        return Response({"error": "找不到此會議"}, status=status.HTTP_404_NOT_FOUND)


# ✅ 撈取用戶相關會議
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_related_meetings(request):
    user = Users.objects.filter(auth_user=request.user).first()
    if not user:
        return Response({"error": "使用者不存在"}, status=404)

    print(f"🔍 當前登入者：{user.email} / ID={user.ID}")
    user_projects = Project.objects.filter(members__user=user)
    now = timezone.now()
    upcoming_meetings = MeetingSchedule.objects.filter(
        project__in=user_projects,
        datetime__gte=now
    ).order_by("datetime")

    serializer = MeetingReminderSerializer(upcoming_meetings, many=True)
    return Response(serializer.data, status=200)
