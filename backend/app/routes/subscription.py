"""Subscription API Routes for email newsletter."""
import logging
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, field_validator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.database import get_db
from app.models.user import User
from app.config import get_settings
from slowapi.util import get_remote_address
from app.middleware.rate_limit import limiter

router = APIRouter(prefix="/subscribe", tags=["subscription"])


class SubscribeRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email address")
        return v.lower().strip()


class UnsubscribeRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email address")
        return v.lower().strip()


@router.post("/")
@limiter.limit("3/minute")
async def subscribe(data: SubscribeRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Subscribe to the newsletter."""
    settings = get_settings()

    # Check if already subscribed
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        return {"status": "success", "message": "Already subscribed."}

    # Create subscriber record
    from app.models.database import async_session
    from datetime import datetime, timezone

    subscriber = User(
        email=data.email,
        username=f"subscriber_{int(time.time())}",
        role="subscriber",
        is_active=True,
        email_preferences={"newsletter": True},
    )
    db.add(subscriber)
    await db.commit()

    logging.getLogger("gotot.subscription").info(
        f"New subscription: {data.email}"
    )

    return {
        "status": "success",
        "message": "Subscribed successfully! Check your inbox for confirmation.",
    }


@router.delete("/")
@limiter.limit("3/minute")
async def unsubscribe(data: UnsubscribeRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Unsubscribe from the newsletter."""
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    subscriber = result.scalar_one_or_none()

    if subscriber:
        await db.delete(subscriber)
        await db.commit()

    return {
        "status": "success",
        "message": "Unsubscribed successfully.",
    }


@router.get("/")
async def list_subscribers(request: Request, db: AsyncSession = Depends(get_db)):
    """List all subscribers (admin endpoint)."""
    # Rate limit by IP for admin access
    remote_addr = get_remote_address(request)

    result = await db.execute(
        select(User.email, User.created_at).where(User.role == "subscriber").order_by(User.created_at.desc())
    )
    subscribers = [{"email": email, "created_at": str(created_at)} for email, created_at in result.all()]

    return {
        "status": "success",
        "total": len(subscribers),
        "subscribers": subscribers,
    }


@router.get("/stats")
async def subscription_stats(db: AsyncSession = Depends(get_db)):
    """Get subscription statistics."""
    result = await db.execute(
        select(func.count(User.id)).where(User.role == "subscriber")
    )
    total = result.scalar() or 0

    return {
        "status": "success",
        "total_subscribers": total,
    }