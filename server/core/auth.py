from datetime import datetime, timedelta
from fastapi import Depends
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from crud import user_crud
from models.user import User
from core.error import AuthenticationFailureException

# TODO: Put this in a secrets manager
SECRET_KEY = "20def6918e6ed61b4bf341917a1a0cd84048fa79e7b0b1f57cb4004321ee390f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def login(session: Session, email: str, password: str):
  user = user_crud.get_user_by_email(session, email)
  if not user:
    raise AuthenticationFailureException
  token = authenticate_user(session, email, password)
  return token

def get_password_hash(password: str):
  return password_context.hash(password)

def verify_password(password, hashed_password):
    return password_context.verify(password, hashed_password)

def generate_access_token_for_user(user: User):
  expiration = datetime.utcnow() + timedelta(days=1)
  token_data = { 
    'user_id': user.id,
    'exp': expiration
  }
  encoded_jwt = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt


def authenticate_user(session: Session, email: str, password: str):
  user = user_crud.get_user_by_email(session, email)
  if not user:
    raise AuthenticationFailureException

  valid_password = verify_password(password, user.password)
  if not valid_password:
    raise AuthenticationFailureException
  
  token = generate_access_token_for_user(user)
  return token
