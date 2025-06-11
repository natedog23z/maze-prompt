# Standard library imports
from typing import Dict, Optional

# Third-party imports
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

# Mock user database - in a real app, this would be a database
mock_users = {
    "valid_token": {"user_id": "user123", "username": "testuser"}
}


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Mock JWT authentication dependency.
    In a real app, this would validate the JWT token and return the user.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    if token not in mock_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return mock_users[token]


# Optional auth for endpoints that can work with or without authentication
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict]:
    """Optional authentication - returns None if no valid token is provided"""
    if not credentials:
        return None
    
    token = credentials.credentials
    if token not in mock_users:
        return None
        
    return mock_users[token]

def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict]:
    """Temporary mock authentication - accepts any non-empty token."""
    if not credentials:
        return None
    return {"user_id": 1}  # stub user 