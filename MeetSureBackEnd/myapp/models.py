from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
import uuid
from django.utils.crypto import get_random_string
from django.conf import settings

# Create your models here.

#註冊表
class Users(models.Model):
    ID = models.AutoField(primary_key=True)  # 手動指定主鍵名稱為 ID
    email = models.CharField(max_length=255, unique=True)  # 使用 CharField，並設為唯一
    password = models.CharField(max_length=128)
    acco_level = models.CharField(max_length=100)
    company = models.CharField(max_length=255, null=True, blank=True) 
    name = models.CharField(max_length=100)
    img = models.CharField(max_length=255)
    auth_user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        db_table = 'users'  # 確保資料表名稱為 'user'

        
class Meeting(models.Model):
    date = models.DateField()
    time = models.TimeField()
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'meetings'


class Company(models.Model):
    ID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    owner = models.CharField(max_length=255)
    description = models.TextField()
    plan = models.CharField(max_length=50)
    approval_status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies'

# 公司代表模型
class CompanyRepresentative(models.Model):
    ID = models.AutoField(primary_key=True)
    user = models.OneToOneField('Users', on_delete=models.CASCADE, unique=True)  # 維持與 Users 的關聯
    company = models.ForeignKey('Company', on_delete=models.CASCADE, db_column='company')
    approval_status = models.CharField(max_length=20, default='pending')  # 批准狀態

    class Meta:
        db_table = 'company_representatives'  # 確保資料表名稱正確


    def save(self, *args, **kwargs):
        if not self.user.password.startswith('pbkdf2_sha256$'):
            self.user.password = make_password(self.user.password)
        super().save(*args, **kwargs)
        
class LineUser(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        line_user_id = models.CharField(max_length=50, unique=True)
        line_display_name = models.CharField(max_length=100, blank=True, null=True)
        class Meta:
            db_table = 'lineuser' 

def __str__(self):
        return f"{self.user.username} - {self.line_display_name}"

class LineBinding(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6, unique=True, default=str(uuid.uuid4())[:6])
    class Meta:
        db_table = 'linebinding' 
class UserToken(models.Model):
        user = models.OneToOneField("Users", on_delete=models.CASCADE)  # ✅ 讓 Token 直接綁定 `Users`
        key = models.CharField(max_length=40, unique=True)
class Meta:
        db_table = 'usertoken' 
@staticmethod
def generate_token():
    return get_random_string(40)

# 📌 好友邀請表 (管理好友邀請)
class FriendRequest(models.Model):
    sender = models.ForeignKey("Users", on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey("Users", on_delete=models.CASCADE, related_name="received_requests")
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ 自動填充時間

    def __str__(self):
        return f"{self.sender.email} -> {self.receiver.email} ({self.status})"
# 📌 好友表 (管理真正的好友關係)
class Friend(models.Model):
    user1 = models.ForeignKey(Users, related_name="friends_1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(Users, related_name="friends_2", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")  # 避免重複的好友關係

    def __str__(self):
        return f"{self.user1} <-> {self.user2}"
    
# 📌 專案管理基本資訊
class Project(models.Model):
    name = models.CharField(max_length=255, unique=True)  # 專案名稱
    description = models.TextField(blank=True, null=True)  # 專案描述
    created_at = models.DateTimeField(auto_now_add=True)  # 建立時間

    def __str__(self):
        return self.name

class ProjectMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # ✅ 參考 Users 表的 ID

    def __str__(self):
        return f"{self.user.email} - {self.project.name}"  # ✅ 使用 user.mail 來顯示正確的用戶資訊


class ProjectTask(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=255)  # 任務名稱
    completed = models.BooleanField(default=False)  # 是否已完成

    def __str__(self):
        return f"{self.name} - {self.project.name}"

# 會議列表
class MeetingSchedule(models.Model):  # ✅ 修改這行
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="meetings")  # 會議所屬專案
    name = models.CharField(max_length=255)  # 會議名稱
    datetime = models.DateTimeField()  # 會議時間
    location = models.CharField(max_length=255, blank=True, null=True)  # 會議地點
    details = models.TextField(blank=True, null=True)  # 其他資訊
    created_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)  # 會議創建者
    updated_at = models.DateTimeField(auto_now=True)      # 每次儲存時自動更新

    def __str__(self):
        return f"{self.name} ({self.datetime})"

# 待辦事項
class ToDoList(models.Model):
    name = models.CharField(max_length=255)
    assigned_to = models.ForeignKey(Users, on_delete=models.CASCADE)  # 假設用戶模型是預設的 User
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)