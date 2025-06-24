# myapp/serializers.py
from rest_framework import serializers
from .models import Users, Project, ProjectMember, ProjectTask, MeetingSchedule ,ToDoList ,MeetingRecord,Group,GanttTask

class MeetingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRecord
        fields = '__all__'
class ToDoListSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)

    class Meta:
        model = ToDoList
        fields = ['id', 'name', 'assigned_to', 'assigned_to_name', 'project', 'completed', 'created_at']

class ProjectMemberUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['ID', 'name', 'email']  # 你也可以加上其他欄位

class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ["id", "name", "completed"]  # ✅ 加上 "id"


class ProjectMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.ID", read_only=True)
    name = serializers.CharField(source="user.name", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    img = serializers.CharField(source="user.img", allow_null=True, read_only=True)

    class Meta:
        model = ProjectMember
        fields = ["user_id", "name", "email", "img"]


class ProjectSerializer(serializers.ModelSerializer):
    members_name = ProjectMemberSerializer(source="members", many=True, read_only=True)
    members = serializers.ListField(child=serializers.IntegerField(), write_only=True)  # ✅ **寫入時，只接收 ID**
    tasks = ProjectTaskSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_at", "members", "members_name", "tasks"]  # ✅ **確保 members_name 被包含**

    def create(self, validated_data):
        members_data = validated_data.pop("members", [])  # ✅ **正確處理 `members`**
        tasks_data = validated_data.pop("tasks", [])

        project = Project.objects.create(**validated_data)

        # ✅ **存入 ProjectMember**
        for user_id in members_data:
            user = Users.objects.get(ID=user_id)
            ProjectMember.objects.create(project=project, user=user)

        # ✅ **存入 ProjectTask**
        for task_data in tasks_data:
            ProjectTask.objects.create(project=project, **task_data)

        return project
    

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSchedule  
        fields = ["id", "project", "name", "datetime", "location", "details", "created_by"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'ID',         # 自訂主鍵
            'email',
            'acco_level',
            'company',
            'name',
            'img',
            'auth_user',
            'img',
        ]
        read_only_fields = ['ID', 'auth_user']  # 通常不讓使用者手動設這些

class MeetingReminderSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = MeetingSchedule
        fields = [
            "id", "name", "datetime", "project_name", "created_by_name"
        ]

    def get_created_by_name(self, obj):
        return obj.created_by.name if obj.created_by and obj.created_by.name else obj.created_by.email if obj.created_by else "系統"

class GroupSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = "__all__"

    def get_members(self, obj):
        from .models import GroupMembership  # 確保引入
        memberships = GroupMembership.objects.filter(group=obj).select_related("user")
        return UserSerializer([m.user for m in memberships], many=True).data

class GanttTaskSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = GanttTask
        fields = [
            'id',
            'name',
            'start',
            'end',
            'progress',
            'dependencies',
            'project',
            'created_by',
            'created_by_username',
        ]
        read_only_fields = ['created_by_username']  # ✅ 拿掉 'created_by'