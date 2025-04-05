# views_group.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from .models import Group, GroupMembership, Users,LineUser
from .serializers import GroupSerializer  # 稍後我們會定義這個 serializer
from myapp.views_line import send_line_message


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_groups(request):
    user = request.user
    custom_user = Users.objects.get(email=user.email)

    memberships = GroupMembership.objects.filter(user=custom_user).select_related("group")
    group_ids = memberships.values_list("group_id", flat=True)

    groups = Group.objects.filter(id__in=group_ids).prefetch_related("groupmembership_set__user")
    result = []

    for group in groups:
        members = group.groupmembership_set.all().select_related("user")
        result.append({
            "id": group.id,
            "name": group.name,
            "type": group.type,
            "owner": {
                "name": group.owner.name,
                "email": group.owner.email
            },
            "members": [
                {"name": m.user.name, "email": m.user.email} for m in members
            ]
        })

    return Response(result)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_custom_group(request):
    name = request.data.get("name")
    members_email = request.data.get("members", [])

    if not name or not members_email:
        return Response({"error": "群組名稱與成員為必填"}, status=400)

    user = Users.objects.filter(email=request.user.email).first()
    if not user:
        return Response({"error": "使用者不存在"}, status=400)

    group = Group.objects.create(name=name, owner=user, type="custom")
    GroupMembership.objects.create(group=group, user=user)  # 自己加入群組

    for email in members_email:
        u = Users.objects.filter(email=email).first()
        if u and u != user:
            GroupMembership.objects.get_or_create(group=group, user=u)

            # ✅ 發送 LINE 通知
            try:
                line_user = LineUser.objects.get(user=u.auth_user)
                msg = f"{user.name} 將你加入自創群組「{group.name}」"
                send_line_message(line_user.line_user_id, msg)
            except LineUser.DoesNotExist:
                print(f"❌ {u.email} 尚未綁定 LINE，跳過通知")

    return Response({"message": "群組建立成功"}, status=201)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_group_join_notifications(request):
    user_email = request.query_params.get("user_email")
    user = Users.objects.filter(email=user_email).first()

    if not user:
        return Response({"error": "用戶不存在"}, status=400)

    memberships = GroupMembership.objects.filter(user=user).select_related("group").order_by("-created_at")
    notifications = []

    for m in memberships:
        group = m.group
        if group.owner != user:  # 不顯示自己創的群組
            label = "自創群組" if group.type == "custom" else "專案小組"
            notifications.append({
                "id": m.id,
                "group_name": group.name,
                "group_type": label,
                "owner_name": group.owner.name,
                "owner_email": group.owner.email,
                "created_at": m.created_at,
                "type": "group"
            })

    return Response(notifications)

