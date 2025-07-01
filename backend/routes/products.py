import asyncio
from flask import Blueprint, request, jsonify
from backend.repositories.product_repository import ProductRepository, ProductIn
from backend.services.product_service import ProductService

bp = Blueprint('products', __name__, url_prefix='/api/products')
repo = ProductRepository()
service = ProductService(repo)

def to_dict(p):
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "category": p.category,
        "brand": p.brand,
        "price": p.price,
        "stock": p.stock,
    }

@bp.post('/')
def create_product():
    data = request.get_json() or {}
    product_in = ProductIn(**data)
    product = asyncio.run(service.create(product_in))
    return jsonify(to_dict(product)), 201

@bp.put('/<int:pid>')
def update_product(pid: int):
    data = request.get_json() or {}
    product_in = ProductIn(**data)
    product = asyncio.run(service.update(pid, product_in))
    if not product:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(to_dict(product))

@bp.get('/')
def list_products():
    products = asyncio.run(service.list(request.args.to_dict()))
    return jsonify([to_dict(p) for p in products])
