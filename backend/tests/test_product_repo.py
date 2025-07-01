import os
import pytest
import asyncio
from backend.repositories.product_repository import ProductRepository, ProductIn
from backend.models import Category, Brand
from backend.db import init_db, close_db

@pytest.fixture(scope='module', autouse=True)
def prepare_db():
    os.environ['DATABASE_URL'] = 'sqlite://:memory:'
    asyncio.run(init_db())
    yield
    asyncio.run(close_db())

@pytest.mark.asyncio
async def test_create_and_list():
    repo = ProductRepository()
    category = await Category.create(name='Cat')
    brand = await Brand.create(name='Brand')
    product = await repo.create(ProductIn(name='Teste', price=5.0,
                                          category_id=category.id,
                                          brand_id=brand.id))
    assert product.id is not None
    items = await repo.list({})
    assert len(items) == 1
