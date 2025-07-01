import asyncio
from backend.db import init_db, close_db
from backend.models import Product, Category, Brand

async def migrate() -> None:
    await init_db()
    async for prod in Product.all():
        cat, _ = await Category.get_or_create(name=getattr(prod, "category", ""))
        brand, _ = await Brand.get_or_create(name=getattr(prod, "brand", ""))
        prod.category = cat
        prod.brand = brand
        await prod.save()
    await close_db()

if __name__ == "__main__":
    asyncio.run(migrate())
