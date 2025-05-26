import base64

# 將你的 JSON 金鑰檔案路徑放在這裡
json_path = ""

with open(json_path, "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")
    print("✅ 以下是轉換後的 base64 字串，請複製貼進 .env：\n")
    print(encoded)
