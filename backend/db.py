import os
from tortoise import Tortoise

async def init_db() -> None:
    TORTOISE_ORM = {
        "connections": {"models": os.getenv("DATABASE_URL", "postgres://postgres:postgres@db:5432/catalogo")},
        "apps": {
            "models": {
                "models": ["backend.models"],
                "default_connection": "models",
            }
        },
    }
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()

async def close_db() -> None:
    await Tortoise.close_connections()
