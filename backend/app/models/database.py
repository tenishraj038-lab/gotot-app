from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger("gotot.db")

_is_sqlite = settings.database_url.startswith("sqlite")

_engine = None
async_session = None

def _try_create_engine():
    global _engine, async_session
    try:
        if _is_sqlite:
            _engine = create_async_engine(
                settings.database_url,
                echo=settings.environment == "development",
            )
        else:
            _engine = create_async_engine(
                settings.database_url,
                pool_size=20,
                max_overflow=10,
                pool_pre_ping=True,
                echo=settings.environment == "development",
            )
        async_session = async_sessionmaker(_engine, class_=AsyncSession, expire_on_commit=False)
        return True
    except Exception as e:
        logger.warning(f"Database engine creation failed (non-fatal): {e}")
        return False

_try_create_engine()

class Base(DeclarativeBase):
    pass

async def get_db():
    if async_session is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Database unavailable")
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    if _engine is None:
        logger.warning("No database engine, skipping init")
        return
    try:
        async with _engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        logger.warning(f"Database init failed (will retry on demand): {e}")
