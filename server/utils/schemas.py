from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class EmailSchema(BaseModel):
    email: EmailStr

class OTPVerifySchema(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    name: Optional[str] = None

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
