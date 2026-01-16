# 會議Meetsure

> MeetSure是一個旨在解決會議人工紀錄的繁瑣程序及會議排程的系統。系統主要以會議影音檔案轉錄成逐字稿及摘要，並根據使用者會議需求進行即時通知推播，及提供一般文書處理等輔助AI功能。
目標在於協助使用者得以有效紀錄、整理與回顧會議內容，並整合前端互動介面與後端服務，模擬實際會議流程，並支援語音資料作為後續分析與應用的基礎，提升會議資訊的可讀性與可追溯性。
---

## 核心功能 Core Features

會議資訊建立與管理 (Meeting Management)
提供使用者建立與管理會議的功能，包含基本會議資訊與資料流程整合，使每一場會議能被系統化保存與回顧。

前後端分離架構 (Front-End / Back-End Separation)
採用前後端分離設計，前端負責使用者操作與視覺呈現，後端負責資料處理與 API 服務，提升系統的可維護性與擴充彈性。

語音轉文字整合 (Speech-to-Text Integration)
系統整合 **Speech-to-Text API**，可將使用者上傳的會議語音檔轉換為逐字稿，作為後續會議記錄、內容搜尋、摘要生成與 AI 分析應用的基礎資料。  
後端由 Django 接收語音檔後呼叫語音辨識服務，將轉換後的文字內容結構化儲存並回傳前端顯示，有效降低人工整理會議紀錄的時間成本。

即時訊息推播 (Real-time Notification via LINE Messaging API)
系統整合 **LINE Messaging API**，於會議狀態更新或重要事件發生時，即時推播通知給使用者，確保使用者不錯過關鍵會議資訊。  
後端透過 Django 觸發事件並呼叫 LINE API，將會議提醒、處理完成通知或系統訊息即時傳送至使用者的 LINE 帳號，提升系統即時性與使用體驗。


---

## 系統運作流程 System Workflow

```text
1.使用者透過 React 前端介面進行會議相關操作
2.前端以 HTTP Request 呼叫 Django REST API
3.Django 後端接收請求並進行資料處理與商業邏輯運算
4.處理結果以 JSON 格式回傳前端
5.前端即時更新畫面並呈現結果
6.語音檔案可作為後端分析與處理的輸入資料來源
```
## 系統架構 System Architecture
```text
**前端 (Front-End)**：React / JavaScript / HTML / CSS
**後端 (Back-End)**：Django（REST API）
**資料傳遞**：RESTful API / JSON
**語音處理**：Speech-to-Text API  
**即時通訊**：LINE Messaging API 
**Ai輔助功能**:OpenAi Api
**版本控制**：Git / GitHub
```
---

## 如何執行（本地開發）

**Clone 專案**

```bash
git clone https://github.com/Winnie0107/Meetsure.git
cd Meetsure
```

**前端啟動**
```bash
cd MeetSureFrontEnd
npm install
npm start
```

**後端啟動**
```bash
cd MeetSureFrontEnd
npx react-scripts build
cd MeetSureBackEnd
pip install -r requirements.txt
python manage.py runserver
```

## 檔案結構 Project Structure

```text
/
├── MeetSureFrontEnd      # 前端程式碼
├── MeetSureBackEnd       # 後端 API
├── sample1.wav           # 測試語音檔
├── README.md             # 專案說明
└── package.json          # 前端套件設定
```



