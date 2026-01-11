from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from utils.otp_service import generate_otp, verify_otp
from utils.email_service import send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


class SendOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


@router.post("/send-otp")
def send_otp(data: SendOTPRequest):
    otp = generate_otp(data.email)
    send_otp_email(data.email, otp)
    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
def verify_otp_api(data: VerifyOTPRequest):
    success, message = verify_otp(data.email, data.otp)

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return {
        "message": "Email verified",
        "verified": True
    }
