from django.db import models

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

    class Meta:
        db_table = 'users'  # 確保資料表名稱為 'user'

        
class Meeting(models.Model):
    date = models.DateField()
    time = models.TimeField()
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'meetings'