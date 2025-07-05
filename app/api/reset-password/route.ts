import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create admin client to check user existence
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Check if the user exists
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error checking user existence:', listError)
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again.' },
        { status: 500 }
      )
    }

    // Check if email exists (case insensitive)
    const userExists = userList.users.some((user: any) => 
      user.email?.toLowerCase() === email.toLowerCase()
    )

    if (!userExists) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your email or sign up for a new account.' },
        { status: 404 }
      )
    }

    // If user exists, send password reset email
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
    })

    if (resetError) {
      if (resetError.message.includes('rate limit') || resetError.message.includes('too many')) {
        return NextResponse.json(
          { error: 'Too many password reset requests. Please wait a few minutes before trying again.' },
          { status: 429 }
        )
      }

      console.error('Password reset error:', resetError)
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent successfully'
    })

  } catch (error) {
    console.error('Password reset API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
