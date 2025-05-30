from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
import uuid
from django.utils.crypto import get_random_string
from django.conf import settings
import uuid


#註冊表
class Users(models.Model):
    ID = models.AutoField(primary_key=True)  # 手動指定主鍵名稱為 ID
    email = models.CharField(max_length=255, unique=True)  # 使用 CharField，並設為唯一
    password = models.CharField(max_length=128)
    acco_level = models.CharField(max_length=100)
    company = models.CharField(max_length=255, null=True, blank=True) 
    name = models.CharField(max_length=100, null=True, blank=True, default="")
    img = models.CharField(max_length=255, null=True, blank=True, default="")
    auth_user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        db_table = 'users'  # 確保資料表名稱為 'user'


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
        user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
        line_user_id = models.CharField(max_length=50)
        line_display_name = models.CharField(max_length=100, blank=True, null=True)
        class Meta:
            db_table = 'lineuser' 

def __str__(self):
        return f"{self.user.username} - {self.line_display_name}"
def generate_code():
    from myapp.models import LineBinding  # ✅ 避免 import 循環
    while True:
        code = str(uuid.uuid4())[:6]
        if not LineBinding.objects.filter(verification_code=code).exists():
            return code
class LineBinding(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6,unique=True,null=True,blank=True,default=generate_code  )
    is_linked = models.BooleanField(default=False)  # ✅ 新增標記

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
    
    class Meta:
        db_table = "friendrequest" 

# 📌 好友表 (管理真正的好友關係)
class Friend(models.Model):
    user1 = models.ForeignKey(Users, related_name="friends_1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(Users, related_name="friends_2", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")  # 避免重複的好友關係

    def __str__(self):
        return f"{self.user1} <-> {self.user2}"
    
    class Meta:
        unique_together = ("user1", "user2")
        db_table = "friend"

#團隊
class Group(models.Model):
    GROUP_TYPE_CHOICES = (
        ('project', '專案群組'),
        ('custom', '自創群組'),
    )

    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=GROUP_TYPE_CHOICES, default='custom')  # ✅ 新增群組類型欄位
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'groups'


class GroupMembership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        db_table = 'group_memberships'


# 📌 專案管理基本資訊
class Project(models.Model):
    name = models.CharField(max_length=255, unique=True)  # 專案名稱
    description = models.TextField(blank=True, null=True)  # 專案描述
    created_at = models.DateTimeField(auto_now_add=True)  # 建立時間

    created_by = models.ForeignKey(
    "Users",
    on_delete=models.PROTECT,
    related_name="created_projects",
    null=True,
)

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
class MeetingSchedule(models.Model):
    project = models.ForeignKey(
        Project, 
        on_delete=models.SET_NULL,  # 當專案被刪除時，設置為 NULL
        related_name="meetings", 
        null=True,  # 允許為 NULL
        blank=True  # 表單中允許為空
    )
    name = models.CharField(max_length=255)  # 會議名稱
    datetime = models.DateTimeField()  # 會議時間
    location = models.CharField(max_length=255, blank=True, null=True)  # 會議地點
    details = models.TextField(blank=True, null=True)  # 其他資訊
    created_by = models.ForeignKey(
        Users, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name="meetings"  # 添加反向關聯名稱
    )
    updated_at = models.DateTimeField(auto_now=True)  # 每次儲存時自動更新

    def __str__(self):
        return f"{self.name} ({self.datetime})"
    
    class Meta:
        db_table = 'meetingschedule'
    
    
#會議通知
class MeetingNotification(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    meeting_name = models.CharField(max_length=255)
    meeting_datetime = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name or self.user.email} - {self.meeting_name}"

    
    
from django.db import models

# 會議影音紀錄
class MeetingRecord(models.Model):
    title = models.CharField(max_length=255)             # 會議名稱
    datetime = models.DateTimeField()                    # 會議時間
    transcript = models.TextField()                      # 逐字稿
    analysis = models.TextField()                        # AI 分析內容
    notes = models.TextField(blank=True)                 # 補充說明（選填）
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='meeting_records')  # 所屬專案
    uploaded_by = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='uploaded_meetings')  # 上傳者
    created_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間

    def __str__(self):
        return f"{self.title} ({self.datetime.strftime('%Y-%m-%d %H:%M')})"



# 待辦事項
class ToDoList(models.Model):
    name = models.CharField(max_length=255)
    assigned_to = models.ForeignKey(Users, on_delete=models.CASCADE)  # 假設用戶模型是預設的 User
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

#甘特圖
class GanttTask(models.Model):
    name = models.CharField(max_length=200)
    start = models.DateField()
    end = models.DateField()
    progress = models.IntegerField(default=0)
    dependencies = models.CharField(max_length=500, blank=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='gantt_tasks')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')

    def __str__(self):
        return self.name