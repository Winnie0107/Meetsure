# Generated by Django 5.1.2 on 2025-03-20 06:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_project_alter_linebinding_verification_code_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectmember',
            name='name',
        ),
        migrations.AddField(
            model_name='projectmember',
            name='user',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='myapp.users'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='linebinding',
            name='verification_code',
            field=models.CharField(default='1b8e7d', max_length=6, unique=True),
        ),
    ]
