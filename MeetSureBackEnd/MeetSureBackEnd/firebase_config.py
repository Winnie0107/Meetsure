import os
import base64
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
from dotenv import load_dotenv
import logging

# ✅ 先載入 .env
load_dotenv()

logger = logging.getLogger(__name__)

firebase_key_b64 = os.getenv('FIREBASE_KEY_B64')

db = None
bucket = None

if not firebase_key_b64:
    logger.error("❌ FIREBASE_KEY_B64 environment variable not found")
    logger.warning("⚠️ Using mock Firebase objects for development")

else:
    try:
        firebase_json = json.loads(base64.b64decode(firebase_key_b64))
        cred = credentials.Certificate(firebase_json)

        if not firebase_admin._apps:
            firebase_app = firebase_admin.initialize_app(cred, {
                "storageBucket": "meetsure-new.appspot.com"  # ✅ 修正 domain
            })

        db = firestore.client()
        bucket = storage.bucket()
        logger.info("✅ Firebase initialized successfully")

    except Exception as e:
        logger.error(f"❌ Firebase initialization error: {e}")
        logger.warning("⚠️ Using mock Firebase objects for development")
