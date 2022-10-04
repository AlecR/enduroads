from pydantic import BaseModel

from pydantic import BaseModel, EmailStr

class BaseUser(BaseModel):
  email: EmailStr


class UserRegister(BaseModel):
  email: EmailStr
  password: str

class UserLogin(BaseModel):
  email: EmailStr
  password: str