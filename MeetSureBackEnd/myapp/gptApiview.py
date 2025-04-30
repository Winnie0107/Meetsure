from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import openai


# 創建 OpenAI 客戶端
openai_client = openai.OpenAI(api_key="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")

@csrf_exempt
def chatgpt_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            if not user_message:
                return JsonResponse({"error": "Empty message"}, status=400)

            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}]
            )

            return JsonResponse({"response": response.choices[0].message.content})  # ✅ 確保這行語法正確

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        except openai.OpenAIError as e:  # ✅ 用 `OpenAIError` 來捕捉所有 API 錯誤
            return JsonResponse({"error": str(e)}, status=500)

        except Exception as e:
            return JsonResponse({"error": f"Django API 發生錯誤: {e}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)