"""
Pulls field notes from the Express API and computes a couple of
lightweight stats: total words written and the longest streak of
consecutive days with a note. Small, honest use of Python for actual
data work rather than a stack line-item.
"""
from collections import Counter
from datetime import datetime, timedelta

import httpx


async def get_writing_stats(api_url: str) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.get(f"{api_url}/api/notes")
        resp.raise_for_status()
        notes = resp.json()

    total_words = sum(len(n["body"].split()) for n in notes)
    total_notes = len(notes)

    days = set()
    for n in notes:
        created = datetime.fromisoformat(n["createdAt"].replace("Z", "+00:00"))
        days.add(created.date())

    longest_streak = _longest_streak(days)

    return {
        "totalNotes": total_notes,
        "totalWords": total_words,
        "averageWordsPerNote": round(total_words / total_notes, 1) if total_notes else 0,
        "longestStreakDays": longest_streak,
    }


def _longest_streak(days: set) -> int:
    if not days:
        return 0
    ordered = sorted(days)
    longest = current = 1
    for prev, nxt in zip(ordered, ordered[1:]):
        if nxt - prev == timedelta(days=1):
            current += 1
            longest = max(longest, current)
        else:
            current = 1
    return longest
