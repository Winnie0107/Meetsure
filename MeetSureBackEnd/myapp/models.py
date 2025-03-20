from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
import uuid
from django.utils.crypto import get_random_string
from django.conf import settings

# Create your models here.

#用戶列表
class User(models.Model):
    mail = models.CharField(max_length=150)
    password = models.CharField(max_length=128)
    level = models.IntegerField()

    class Meta:
        db_table = 'user'  # 指定數據庫中的表名

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
        user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
        line_user_id = models.CharField(max_length=50)
        line_display_name = models.CharField(max_length=100, blank=True, null=True)
        class Meta:
            db_table = 'lineuser' 

def __str__(self):
        return f"{self.user.username} - {self.line_display_name}"

class LineBinding(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6, unique=True, null=True, default=str(uuid.uuid4())[:6])  # ✅ 預設值
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