"""
SQLite Storage for SkillSync AI: stores analysis history, metrics, and report records
with privacy-first design (raw files never persisted permanently).
"""
import os
import json
import sqlite3
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "skillsync.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            target_role TEXT NOT NULL,
            experience_level TEXT,
            overall_score REAL NOT NULL,
            score_tier TEXT NOT NULL,
            matched_count INTEGER NOT NULL,
            missing_count INTEGER NOT NULL,
            partial_count INTEGER NOT NULL,
            improvement_priorities TEXT,
            full_data_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_analysis_record(data: Dict[str, Any]) -> str:
    """Saves an analysis record to the local SQLite database."""
    record_id = str(uuid.uuid4())[:8]
    created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    scoring = data.get("scoring", {})
    comparison = data.get("comparison", {})
    
    priorities = scoring.get("improvement_priorities", [])
    priorities_json = json.dumps(priorities)
    
    full_json = json.dumps(data)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO analysis_history 
        (id, created_at, target_role, experience_level, overall_score, score_tier, matched_count, missing_count, partial_count, improvement_priorities, full_data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record_id,
        created_at,
        data.get("target_role", "Target Role"),
        data.get("experience_level", "Mid-Level"),
        float(scoring.get("overall_score", 0.0)),
        scoring.get("score_tier", "Match"),
        int(comparison.get("total_matched_count", 0)),
        int(comparison.get("total_missing_count", 0)),
        int(comparison.get("total_partial_count", 0)),
        priorities_json,
        full_json
    ))
    conn.commit()
    conn.close()
    return record_id

def list_analysis_history() -> List[Dict[str, Any]]:
    """Returns past analysis summaries sorted by creation time descending."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, created_at, target_role, experience_level, overall_score, score_tier, 
               matched_count, missing_count, partial_count, improvement_priorities
        FROM analysis_history 
        ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "target_role": r["target_role"],
            "experience_level": r["experience_level"],
            "overall_score": r["overall_score"],
            "score_tier": r["score_tier"],
            "matched_count": r["matched_count"],
            "missing_count": r["missing_count"],
            "partial_count": r["partial_count"],
            "improvement_priorities": json.loads(r["improvement_priorities"] or "[]")
        })
    return results

def get_analysis_by_id(record_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves full analysis record by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT full_data_json FROM analysis_history WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["full_data_json"])
    return None

def delete_analysis_by_id(record_id: str) -> bool:
    """Deletes single analysis record."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis_history WHERE id = ?", (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history() -> int:
    """Deletes all history records for complete privacy."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis_history")
    count = cursor.rowcount
    conn.commit()
    conn.close()
    return count

# Initialize database on module load
try:
    init_db()
except Exception:
    pass
