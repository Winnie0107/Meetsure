from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt
import json
import openai
from serpapi import GoogleSearch


# 創建 OpenAI 客戶端
openai_client = openai.OpenAI(api_key="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")

# SERP 金鑰
SERP_API_KEY = "6564ca2c86a33a1052d8e8619d12e99ecd481affef00fecd90d6e06bad3300e7"

# ✅ SerpAPI 搜尋函式（回傳前 3 筆）
def search_google(query):
    params = {
        "engine": "google",
        "q": query,
        "api_key": SERP_API_KEY,
        "hl": "zh-tw"
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        organic_results = results.get("organic_results", [])
        if not organic_results:
            return "找不到相關搜尋結果。"

        # 第一筆用來產生回應摘要
        summary_title = organic_results[0].get("title", "（無標題）")
        summary_snippet = organic_results[0].get("snippet", "")
        summary = f"根據搜尋結果，{summary_snippet}（{summary_title}）"

        # 然後附上最多三筆連結
        top_results = organic_results[:3]
        links = []
        for idx, result in enumerate(top_results, 1):
            title = result.get("title", "（無標題）")
            link = result.get("link", "#")
            links.append(f"{idx}. {title}\n{link}")

        return f"{summary}\n\n🔗 延伸閱讀：\n" + "\n\n".join(links)

    except Exception as e:
        return f"搜尋失敗：{e}"



@csrf_exempt
def chatgpt_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "").strip()

            if not user_message:
                return JsonResponse({"error": "Empty message"}, status=400)

            # ✅ 如果訊息中包含搜尋關鍵字，就觸發 SerpAPI
            keywords = ["搜尋", "google",  "找", "新聞", "天氣", "今天","現在"]
            if any(kw in user_message.lower() for kw in keywords):
                print("🔍 觸發 SerpAPI 查詢：", user_message)
                search_result = search_google(user_message)
                return JsonResponse({"response": search_result})

            # ✅ 否則回 GPT-4o
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": user_message}]
            )

            return JsonResponse({"response": response.choices[0].message.content})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        except openai.OpenAIError as e:
            return JsonResponse({"error": str(e)}, status=500)

        except Exception as e:
            return JsonResponse({"error": f"Django API 發生錯誤: {e}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)