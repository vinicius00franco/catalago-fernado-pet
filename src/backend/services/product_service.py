from typing import List, Dict
from backend.models import Product
from backend.repositories.product_repository import ProductRepository, ProductIn

class ProductService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    async def create(self, data: ProductIn) -> Product:
        return await self.repo.create(data)

    async def update(self, product_id: int, data: ProductIn) -> Product | None:
        product = await self.repo.get(product_id)
        if not product:
            return None
        return await self.repo.update(product, data)

    async def list(self, filters: Dict[str, str]) -> List[Product]:
        return await self.repo.list(filters)
