# Standard library imports
from typing import Dict, Optional

# Third-party imports
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer(auto_error=False)

# Mock users database for testing
mock_users = {
    "valid_token": {"user_id": 1, "username": "testuser"},
    "admin_token": {"user_id": 2, "username": "admin", "is_admin": True},
}

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict:
    """Temporary mock authentication - requires a valid token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    # For simplicity in testing, we accept any non-empty token
    # In a real application, we would validate the JWT here
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # In a real app, we would decode and verify the JWT
    # For testing, we'll use our mock users
    if token in mock_users:
        return mock_users[token]
    
    # For any other non-empty token, return a default user
    return {"user_id": 999, "username": "default_user"}


# Optional auth for endpoints that can work with or without authentication
def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict]:
    """Optional authentication - returns None if no valid token is provided"""
    if not credentials:
        return None
    
    token = credentials.credentials
    if not token:
        return None
        
    # For any non-empty token, return a stub user
    return {"user_id": 1} 