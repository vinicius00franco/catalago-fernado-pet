from dataclasses import dataclass
from typing import List, Optional, Dict
from backend.models import Product

@dataclass
class ProductIn:
    name: str
    description: str | None = None
    category_id: int | None = None
    brand_id: int | None = None
    price: float = 0.0
    stock: int = 0

class ProductRepository:
    async def create(self, data: ProductIn) -> Product:
        fields_data = {k: v for k, v in data.__dict__.items() if v is not None}
        return await Product.create(**fields_data)

    async def get(self, product_id: int) -> Optional[Product]:
        return await Product.get_or_none(id=product_id)

    async def update(self, product: Product, data: ProductIn) -> Product:
        for field, value in data.__dict__.items():
            if value is not None:
                setattr(product, field, value)
        await product.save()
        return product

    async def list(self, filters: Dict[str, str]) -> List[Product]:
        qs = Product.all()
        if 'name' in filters:
            qs = qs.filter(name__icontains=filters['name'])
        if 'category_id' in filters:
            qs = qs.filter(category_id=filters['category_id'])
        if 'brand_id' in filters:
            qs = qs.filter(brand_id=filters['brand_id'])
        return await qs
