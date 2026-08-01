import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.database import get_db
from app.models.monetization import AffiliateLink

router = APIRouter(prefix="/affiliates", tags=["affiliates"])
logger = logging.getLogger("gotot.affiliates")


@router.get("/links")
async def get_affiliate_links(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await db.execute(
            select(AffiliateLink).where(AffiliateLink.is_active.is_(True))
        )
        links = result.scalars().all()
    except Exception as exc:
        logger.error("affiliate_links_load_failed", extra={"error": str(exc)}, exc_info=True)
        raise HTTPException(status_code=503, detail="Affiliate links are temporarily unavailable.") from exc

    return [
        {
            "id": str(l.id),
            "platform": l.platform,
            "name": l.name,
            "url": l.url,
            "description": l.description,
            "commission_rate": l.commission_rate,
        }
        for l in links
    ]


@router.post("/{link_id}/click")
async def record_affiliate_click(
    link_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AffiliateLink).where(AffiliateLink.id == link_id))
    link = result.scalar_one_or_none()
    if link:
        link.clicks += 1
        await db.commit()
    return {"status": "recorded"}
