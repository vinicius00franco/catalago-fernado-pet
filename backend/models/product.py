from tortoise import fields
from tortoise.models import Model
from .category import Category
from .brand import Brand

class Product(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=200)
    description = fields.TextField(null=True)
    category: fields.ForeignKeyRelation["Category"] = fields.ForeignKeyField(
        "models.Category", related_name="products", on_delete=fields.CASCADE
    )
    brand: fields.ForeignKeyRelation["Brand"] = fields.ForeignKeyField(
        "models.Brand", related_name="products", on_delete=fields.CASCADE
    )
    price = fields.FloatField()
    stock = fields.IntField(default=0)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "products"
        app = "models"
        default_connection = "models"
