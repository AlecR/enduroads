import email
from sqlalchemy.orm import Session

from core import auth
from core.error import UserAlreadyExistsException
from models.user import User
from schemas.user import UserRegister

def create_user(session: Session, user_in: UserRegister):
  user = get_user_by_email(session, user_in.email)
  if user:
    raise UserAlreadyExistsException

  with session.begin():
    hashed_password = auth.get_password_hash(user_in.password)
    db_user = User(email=user_in.email, password=hashed_password)
    session.add(db_user)
    session.commit()
  
  with session.begin():
    session.refresh(db_user)
    
  return db_user

def get_user_by_email(session: Session, email: str):
  with session.begin():
    user = session.query(User).filter_by(email=email).first()
  return user
    