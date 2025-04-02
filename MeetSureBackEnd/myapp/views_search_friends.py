from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Users
from .serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search_users(request):
    keyword = request.GET.get('keyword', '')
    exclude_email = request.GET.get('exclude', '')

    if not keyword:
        return Response([])

    results = Users.objects.filter(
        Q(email__icontains=keyword) | Q(name__icontains=keyword)
    ).exclude(email=exclude_email)[:10]

    serializer = UserSerializer(results, many=True)
    return Response(serializer.data)
