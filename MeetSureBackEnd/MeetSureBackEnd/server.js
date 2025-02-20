const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

// 啟用 CORS
app.use(cors());

// 設定檔案上傳
const upload = multer({ dest: 'uploads/' });

// 接收上傳的音檔
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const audioFile = req.file;

        // 呼叫 Hugging Face API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/openai/whisper-base',
            audioFile,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // 傳回轉錄結果
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('轉錄失敗');
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器已在 http://localhost:${port} 啟動`);
});
