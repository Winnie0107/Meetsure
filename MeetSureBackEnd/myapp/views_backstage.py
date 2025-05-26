from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Company,Users, CompanyRepresentative,Project, Friend
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .serializers import UserSerializer,ProjectSerializer
from django.db import transaction



@api_view(['GET'])
@permission_classes([AllowAny])  # 👈 加這行讓此 API 不需認證
def get_companies(request):
    companies = Company.objects.all().values('ID', 'name')
    return Response(list(companies))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_by_company_admin(request):
    try:
        current_user = request.user
        creator = Users.objects.get(auth_user=current_user)

        # 取得該管理員對應的公司代表資訊
        representative = CompanyRepresentative.objects.get(user=creator)
        company_instance = representative.company

        # 從前端取得帳號資料
        data = request.data
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # 資料完整性檢查
        if not all([name, email, password]):
            return Response({"error": "資料不完整"}, status=status.HTTP_400_BAD_REQUEST)

        if Users.objects.filter(email=email).exists():
            return Response({"error": "此 Email 已被使用"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # 建立新使用者
            user = Users.objects.create(
                name=name,
                email=email,
                password=make_password(password),
                acco_level="user",
                company=company_instance,
            )

            # 建立好友關係
            company_users = Users.objects.filter(company=company_instance, acco_level="user").exclude(ID=user.ID)

            # 遍歷同公司的現有用戶，建立好友關係
            for existing_user in company_users:
        # 檢查是否已存在雙向好友關係
                if not Friend.objects.filter(user1=user, user2=existing_user).exists() and \
                    not Friend.objects.filter(user1=existing_user, user2=user).exists():
                    Friend.objects.create(user1=user, user2=existing_user)

        return Response({"message": "使用者建立成功，並建立好友關係", "user_id": user.ID}, status=status.HTTP_201_CREATED)

    except CompanyRepresentative.DoesNotExist:
        return Response({"error": "目前使用者不是公司管理員"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_users(request):
    try:
        # 透過 request.user 取得對應的 Users 實例
        current_user = Users.objects.get(auth_user=request.user)
        company = current_user.company

        # 查詢同公司且 acco_level 為 user 的帳號
        users = Users.objects.filter(company=company, acco_level="user")

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Users.DoesNotExist:
        return Response({"error": "使用者資料不存在"}, status=404)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    try:
        user = Users.objects.get(pk=user_id)
        data = request.data

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)

        if data.get("password"):
            user.password = make_password(data["password"])

        user.save()
        return Response({"message": "使用者已更新成功"}, status=status.HTTP_200_OK)

    except Users.DoesNotExist:
        return Response({"error": "使用者不存在"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = Users.objects.get(ID=user_id)
        user.delete()
        return Response({"message": "使用者已刪除成功"}, status=status.HTTP_204_NO_CONTENT)
    except Users.DoesNotExist:
        return Response({"error": "找不到使用者"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"❌ 刪除錯誤: {str(e)}")  # 🔥 把錯誤印出來方便找問題
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_in_progress_project_count(request):
    try:
        current_user = Users.objects.get(auth_user=request.user)
        company = current_user.company

        # 找出該公司所有用戶
        company_users = Users.objects.filter(company=company)

        in_progress_projects = Project.objects.filter(
            created_by__in=company_users,
        )

        return Response({"count": in_progress_projects.count()}, status=200)

    except Users.DoesNotExist:
        return Response({"error": "使用者資料不存在"}, status=404)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_company_projects(request):
    try:
        current_user = Users.objects.get(auth_user=request.user)
        company_users = Users.objects.filter(company=current_user.company)

        # 找出該公司用戶建立的專案
        company_projects = Project.objects.filter(created_by__in=company_users)

        serializer = ProjectSerializer(company_projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Users.DoesNotExist:
        return Response({"error": "使用者資料不存在"}, status=status.HTTP_404_NOT_FOUND)

