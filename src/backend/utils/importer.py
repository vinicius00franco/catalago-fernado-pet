import pandas as pd
from backend.services.product_service import ProductService
from backend.repositories.product_repository import ProductIn

async def import_excel(path: str, service: ProductService) -> None:
    df = pd.read_excel(path)
    for _, row in df.iterrows():
        product = ProductIn(
            name=row.get('name'),
            description=row.get('description'),
            category=row.get('category'),
            brand=row.get('brand'),
            price=float(row.get('price', 0)),
            stock=int(row.get('stock', 0)),
        )
        await service.create(product)
