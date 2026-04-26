"""
MongoDB connection layer for the AI Design Generator.

Provides a singleton MongoClient and helper functions for
the 'designs' and 'users' collections.
"""

import logging
from datetime import datetime, timezone
from urllib.parse import quote_plus

from bson import ObjectId
from django.conf import settings
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

logger = logging.getLogger(__name__)

# ─── Singleton client ────────────────────────────────────────────
_client = None
_db = None


def get_db():
    """Return the MongoDB database instance (lazy singleton)."""
    global _client, _db

    if _db is not None:
        return _db

    username = settings.MONGODB_USERNAME
    password = settings.MONGODB_PASSWORD
    host = settings.MONGODB_HOST
    db_name = settings.MONGODB_DB_NAME

    if not username or not host:
        raise ValueError(
            "MongoDB credentials are not configured. "
            "Please set MONGODB_USERNAME, MONGODB_PASSWORD, and "
            "MONGODB_HOST in your backend/.env file."
        )

    # Build URI with properly escaped credentials
    uri = (
        f"mongodb+srv://{quote_plus(username)}:{quote_plus(password)}"
        f"@{host}/?appName=Cluster0"
    )

    try:
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Force a connection check
        _client.admin.command('ping')
        logger.info("✅ Connected to MongoDB Atlas successfully!")
    except ConnectionFailure as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise ValueError(f"Could not connect to MongoDB: {e}")

    _db = _client[db_name]

    # Ensure indexes
    _db.designs.create_index('created_at')
    _db.users.create_index('email', unique=True, sparse=True)

    return _db


# ─── Design helpers ──────────────────────────────────────────────

def save_design(prompt, style, html_code, css_code, full_html, model_used=None):
    """
    Save a generated design to MongoDB.

    Returns the inserted document's ID as a string.
    """
    db = get_db()

    doc = {
        'prompt': prompt,
        'style': style,
        'htmlCode': html_code,
        'cssCode': css_code,
        'fullHtml': full_html,
        'model': model_used or 'unknown',
        'created_at': datetime.now(timezone.utc),
    }

    result = db.designs.insert_one(doc)
    design_id = str(result.inserted_id)
    logger.info(f"Saved design {design_id} to MongoDB")
    return design_id


def get_designs(page=1, per_page=20):
    """
    Retrieve designs sorted by newest first, with pagination.

    Returns (list_of_designs, total_count).
    """
    db = get_db()
    collection = db.designs

    total = collection.count_documents({})
    skip = (page - 1) * per_page

    cursor = (
        collection.find()
        .sort('created_at', -1)
        .skip(skip)
        .limit(per_page)
    )

    designs = []
    for doc in cursor:
        designs.append(_serialize_design(doc))

    return designs, total


def get_design_by_id(design_id):
    """Retrieve a single design by its ObjectId string."""
    db = get_db()

    try:
        oid = ObjectId(design_id)
    except Exception:
        return None

    doc = db.designs.find_one({'_id': oid})
    if doc:
        return _serialize_design(doc)
    return None


def delete_design(design_id):
    """Delete a design by its ObjectId string. Returns True if deleted."""
    db = get_db()

    try:
        oid = ObjectId(design_id)
    except Exception:
        return False

    result = db.designs.delete_one({'_id': oid})
    return result.deleted_count > 0


def _serialize_design(doc):
    """Convert a MongoDB document to a JSON-serializable dict."""
    return {
        'id': str(doc['_id']),
        'prompt': doc.get('prompt', ''),
        'style': doc.get('style', 'modern'),
        'htmlCode': doc.get('htmlCode', ''),
        'cssCode': doc.get('cssCode', ''),
        'fullHtml': doc.get('fullHtml', ''),
        'model': doc.get('model', ''),
        'created_at': doc.get('created_at', '').isoformat()
            if doc.get('created_at') else '',
    }
