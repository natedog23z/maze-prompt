from typing import Annotated

from fastapi import Depends, HTTPException
from supabase import acreate_client, Client
from supabase.lib.client_options import ClientOptions

from src.config import settings


async def get_db() -> Client:
    client: Client | None = None
    try:
        client = await acreate_client(
            settings.DB_URL,
            settings.DB_API_KEY,
            options=ClientOptions(
                postgrest_client_timeout=10, storage_client_timeout=10
            ),
        )
        # client = await client.auth.sign_in_with_password(
        #     {"email": settings.DB_EMAIL, "password": settings.DB_PASSWORD}
        # )
        yield client

    except Exception as e:
        print(e)
        raise


SessionDep = Annotated[Client, Depends(get_db)]
