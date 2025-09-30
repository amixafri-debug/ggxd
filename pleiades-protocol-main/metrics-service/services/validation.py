from fastapi import Header, HTTPException, status
import os

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = "X-API-KEY"
DEV_API_KEY = "DEV"

def get_api_key(x_api_key: str = Header(...)):
    if API_KEY is None:
        if x_api_key != DEV_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="API Key not configured on server"
            )
    elif x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
    return x_api_key