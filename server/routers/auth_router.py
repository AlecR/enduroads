from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.auth import login
from core.database import get_db
from core.error import UserAlreadyExistsException, AuthenticationFailureException
from crud.user_crud import create_user
from schemas.user import UserRegister, UserLogin

router = APIRouter(prefix='/auth')


@router.post('/register')
async def regsiter_user(register_user: UserRegister, session: Session = Depends(get_db)):
  try:
    create_user(session, register_user)
  except UserAlreadyExistsException:
    raise HTTPException(status_code=409, detail='Email already exists')
  
  token = login(session, register_user.email, register_user.password)
  return {'token': token}


@router.post('/login')
async def login_user(login_user: UserLogin, session: Session = Depends(get_db)):
  try:
    token = login(session, login_user.email, login_user.password)
    return {'token': token}
  except AuthenticationFailureException:
    raise HTTPException(status_code=401, detail='Invalid username or password')

  
  