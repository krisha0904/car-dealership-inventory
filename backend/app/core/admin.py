from fastapi import Depends, HTTPException

from app.core.security import get_current_user


def get_current_admin(
    user = Depends(get_current_user)
):

    if not user.is_admin:

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user