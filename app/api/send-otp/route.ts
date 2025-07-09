import { NextRequest, NextResponse } from 'next/server'
import { sendClearDataOtpEmail, sendDeleteAccountOtpEmail } from '@/utils/sendOTP'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    // Determine the type of email to send based on the request
    const isClearDataRequest = request.headers.get('X-Request-Type') === 'clear-data'
    const isDeleteAccountRequest = request.headers.get('X-Request-Type') === 'delete-account'
    if (isClearDataRequest) {
      await sendClearDataOtpEmail({ to: email, otp }) 
    } else if (isDeleteAccountRequest) {
      await sendDeleteAccountOtpEmail({ to: email, otp })
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send failed:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
