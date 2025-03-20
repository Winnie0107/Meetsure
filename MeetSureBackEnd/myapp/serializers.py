# myapp/serializers.py
from rest_framework import serializers
from .models import Users
from .models import Project, ProjectMember, ProjectTask

class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ["name", "completed"]

class ProjectMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), source='users')

    class Meta:
        model = ProjectMember
        fields = ["user_id"]  # ✅ 改成存 `user_id`


from rest_framework import serializers
from .models import Users, Project, ProjectMember, ProjectTask

class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ["name", "completed"]

class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.ListField(child=serializers.IntegerField(), write_only=True)  # ✅ 只接受 ID 陣列
    tasks = ProjectTaskSerializer(many=True, required=False)  # ✅ 確保 `tasks` 可以為空

    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_at", "members", "tasks"]

    def create(self, validated_data):
        members_data = validated_data.pop("members", [])  # ✅ 避免 `KeyError`
        tasks_data = validated_data.pop("tasks", [])

        project = Project.objects.create(**validated_data)

        # ✅ **存入 ProjectMember**
        for user_id in members_data:
            user = Users.objects.get(ID=user_id)  # **確保該用戶存在**
            ProjectMember.objects.create(project=project, user=user)

        # ✅ **存入 ProjectTask**
        for task_data in tasks_data:
            ProjectTask.objects.create(project=project, **task_data)

        return project


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'mail', 'level']  # 定義要返回的欄位
