import { testEmailConfig } from '@/lib/email';
import { NextResponse } from 'next/server';

// Configure the route for static export
export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = false;

// Note: This route should be disabled or protected in production
export async function GET() {
  try {
    // Check email configuration
    const emailConfigStatus = await testEmailConfig();
    
    if (emailConfigStatus) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email configuration is valid',
          config: {
            user: process.env.EMAIL_USER ? '✓ Set' : '✗ Missing',
            password: process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Missing',
            contactEmail: process.env.CONTACT_EMAIL || 'Using fallback: sunilneupane956@gmail.com',
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email configuration test failed',
          config: {
            user: process.env.EMAIL_USER ? '✓ Set' : '✗ Missing',
            password: process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Missing',
            contactEmail: process.env.CONTACT_EMAIL || 'Using fallback: sunilneupane956@gmail.com',
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email test API error:', error);
    return NextResponse.json(
      { error: 'Server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}
