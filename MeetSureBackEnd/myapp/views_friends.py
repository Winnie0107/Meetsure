from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

from myapp.models import FriendRequest,Users,Friend,LineUser
from myapp.views_line import send_line_message

# 允許 POST 請求時忽略 CSRF (如果使用 Django Rest Framework 可以用 APIView)
@csrf_exempt
def send_friend_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            sender_email = data.get("sender_email")
            receiver_email = data.get("receiver_email")

            if not sender_email or not receiver_email:
                return JsonResponse({"error": "缺少必要的參數"}, status=400)

            sender = get_object_or_404(Users, email=sender_email)
            receiver = get_object_or_404(Users, email=receiver_email)

            if sender == receiver:
                return JsonResponse({"error": "不能自己加自己為好友"}, status=400)

            # 檢查是否已經有相同的好友請求
            existing_request = FriendRequest.objects.filter(sender=sender, receiver=receiver, status="pending").exists()
            if existing_request:
                return JsonResponse({"error": "已經發送過好友邀請"}, status=400)

            # 創建好友請求
            friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver, status="pending")
            # ✅ 發送 LINE 訊息給被邀請者
            try:
                line_user = LineUser.objects.get(user=receiver.auth_user)  # 這裡是 auth_user
                message = f"你收到來自 {sender.name} 的好友邀請，快去看看吧！"
                send_line_message(line_user.line_user_id, message)
            except LineUser.DoesNotExist:
                print("🔕 該用戶尚未綁定 LINE，不發送通知")

            return JsonResponse({"message": "好友邀請已發送", "request_id": friend_request.id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "無效的 JSON 數據"}, status=400)

    return JsonResponse({"error": "請使用 POST 方法發送好友邀請"}, status=405)  # ❌ GET 會回傳這個


@csrf_exempt
def get_friend_requests(request):
    user_email = request.GET.get("user_email")

    if not user_email:
        return JsonResponse({"error": "缺少 user_email 參數"}, status=400)

    user = Users.objects.filter(email=user_email).first()
    if not user:
        return JsonResponse({"error": "用戶不存在"}, status=404)

    sent_requests = FriendRequest.objects.filter(sender__email=user_email).values(
        "id", 
        "receiver__email", 
        "receiver__name",  # 確保回傳名稱
        "status"
    )
    received_requests = FriendRequest.objects.filter(receiver__email=user_email).values(
        "id", 
        "sender__email", 
        "sender__name",  # 確保回傳名稱
        "sender__img",   # ✅ 加上這個
        "status"
    )
    return JsonResponse({
        "sent_requests": list(sent_requests),
        "received_requests": list(received_requests)
    })


@csrf_exempt
def respond_to_friend_request(request, request_id):
    if request.method == "PATCH":
        data = json.loads(request.body)
        status = data.get("status")

        if status not in ["accepted", "rejected"]:
            return JsonResponse({"error": "無效的請求狀態"}, status=400)

        friend_request = get_object_or_404(FriendRequest, id=request_id)
        friend_request.status = status
        friend_request.save()

        # ✅ 當請求被接受時，新增到 myapp_friend 表
        if status == "accepted":
            Friend.objects.create(user1=friend_request.sender, user2=friend_request.receiver)

        return JsonResponse({"message": f"好友邀請已{status}"}, status=200)



@csrf_exempt
def get_friends_list(request):
    user_email = request.GET.get("user_email")
    if not user_email:
        return JsonResponse({"error": "缺少 user_email 參數"}, status=400)

    user = Users.objects.filter(email=user_email).first()
    if not user:
        return JsonResponse({"error": "用戶不存在"}, status=404)

    # 找到 user 的朋友
    friends = Users.objects.filter(
        Q(ID__in=FriendRequest.objects.filter(receiver=user, status="accepted").values_list("sender", flat=True)) |
        Q(ID__in=FriendRequest.objects.filter(sender=user, status="accepted").values_list("receiver", flat=True))
    )

    friends_data = [
        {
            "email": friend.email,
            "name": friend.name,
            "img": f"media/{friend.img.replace('\\', '/')}" if friend.img else None
        }
        for friend in friends
    ]

    return JsonResponse({"friends": friends_data}, status=200)