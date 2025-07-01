from tortoise import fields
from tortoise.models import Model

class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)

    class Meta:
        table = "categories"
        app = "models"
        default_connection = "models"
