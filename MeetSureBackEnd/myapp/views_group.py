# views_group.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from .models import Group, GroupMembership, Users
from .serializers import GroupSerializer  # 稍後我們會定義這個 serializer


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

    return Response({"message": "群組建立成功"}, status=201)
