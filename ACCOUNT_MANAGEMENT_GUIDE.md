# 📧 Account Management Implementation Guide

## ✅ What's Been Built (Backend Complete!)

### 1. **Email Service** (`lib/email.ts`)
- Send verification emails
- Send password reset emails
- Send welcome emails
- Beautiful HTML email templates
- Resend API integration (free tier: 3k emails/month)
- Fallback to console.log in development

### 2. **Database Schema Updated**
```prisma
model User {
  emailVerified Boolean @default(false)
  verificationToken String? @unique
  verificationTokenExpiry DateTime?
  resetToken String? @unique
  resetTokenExpiry DateTime?
}
```

### 3. **API Endpoints Created**

#### `/api/auth/register` ✅
- Creates user with verification token
- Sends verification email automatically
- Returns success message

####`/api/auth/verify-email` ✅
- Verifies email with token
- Marks account as verified
- Sends welcome email

#### `/api/auth/forgot-password` ✅
- Generates reset token
- Sends reset email
- Prevents email enumeration (always returns success)

#### `/api/auth/reset-password` ✅
- Validates reset token
- Updates password
- Clears reset token

---

## 🚀 Deployment Steps

### Step 1: Add Environment Variables

```bash
# SendGrid API Key
SENDGRID_API_KEY=SG.your_api_key_here

# Email from address (must be verified in SendGrid)
EMAIL_FROM=noreply@shopimize.com
```

**Using Your Existing SendGrid Account:**
1. Go to SendGrid dashboard → Settings → API Keys
2. Copy your existing API key (or create a new one)
3. Add to Vercel environment variables:
   ```bash
   vercel env add SENDGRID_API_KEY production
   vercel env add EMAIL_FROM production
   ```

**Verify Your Sender Email:**
- In SendGrid → Settings → Sender Authentication
- Verify your "from" email address or domain
- Update `EMAIL_FROM` to match verified email

### Step 2: Run Database Migration

```bash
# Generate migration
npx prisma migrate dev --name add_email_verification

# Or push schema directly
npx prisma db push
```

### Step 3: Deploy

```bash
git add .
git commit -m "Add email verification and password reset"
git push
```

---

## 📱 Frontend Pages (TODO - Need to Create)

### 1. Email Verification Page (`app/verify-email/page.tsx`)
**URL:** `/verify-email?token=xxx`

**Features:**
- Reads token from URL
- Calls `/api/auth/verify-email`
- Shows success/error message
- Redirects to login on success

### 2. Forgot Password Page (`app/forgot-password/page.tsx`)
**URL:** `/forgot-password`

**Features:**
- Email input form
- Calls `/api/auth/forgot-password`
- Shows "check your email" message

### 3. Reset Password Page (`app/reset-password/page.tsx`)
**URL:** `/reset-password?token=xxx`

**Features:**
- New password input
- Confirm password input
- Calls `/api/auth/reset-password`
- Redirects to login on success

### 4. Profile Settings Page (`app/settings/page.tsx`)
**URL:** `/settings`

**Features:**
- Update name, email
- Change password
- Email preferences
- Delete account

### 5. Update Registration Page
Add message after registration:
```
"Account created! Please check your email to verify your account."
```

---

## 🧪 Testing Flow

### Email Verification:
1. Register new account
2. Check console (dev) or email (production)
3. Click verification link
4. See "Email verified!" message
5. Receive welcome email
6. Log in successfully

### Password Reset:
1. Go to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Click link → goes to `/reset-password?token=xxx`
5. Enter new password
6. Submit
7. Log in with new password

---

## 📧 Email Templates

All emails include:
- Beautiful Shopimize branding
- Responsive design
- Clear call-to-action buttons
- Fallback text links
- Expiration notices
- Security disclaimers

### Verification Email:
- Subject: "Verify your email address - Shopimize"
- Button: "Verify Email Address"
- Expires in 24 hours

### Password Reset Email:
- Subject: "Reset your password - Shopimize"
- Button: "Reset Password"
- Expires in 1 hour

### Welcome Email:
- Subject: "Welcome to Shopimize! 🎉"
- Button: "Go to Dashboard"
- Getting started checklist

---

## 🔒 Security Features

### Email Enumeration Prevention:
- Forgot password always returns success
- Doesn't reveal if email exists

### Token Expiry:
- Verification tokens: 24 hours
- Reset tokens: 1 hour
- Automatically cleared after use

### Password Requirements:
- Minimum 8 characters
- Hashed with bcrypt (strength 10)
- Never stored in plain text

### Rate Limiting (Recommended - TODO):
```typescript
// Add to forgot-password route
if (tooManyRequests) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429 }
  );
}
```

---

## 🎨 Frontend Component Examples

### Verification Success:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">✓ Email Verified!</h1>
          <p>Redirecting to login...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">✗ Verification Failed</h1>
          <p>Invalid or expired token.</p>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Monitoring

### Metrics to Track:
- Email delivery rate
- Verification completion rate
- Password reset requests
- Failed verification attempts

### SendGrid Dashboard:
- View sent emails
- Track opens/clicks  
- Monitor bounces
- Check delivery status
- Email analytics

---

## 🐛 Troubleshooting

### Emails Not Sending:
1. Check `SENDGRID_API_KEY` is set correctly
2. Verify sender email in SendGrid dashboard
3. Check SendGrid activity feed for errors
4. Look at Vercel function logs
5. Ensure API key has "Mail Send" permissions

### Token Expired:
1. User waited too long
2. Resend verification email
3. Consider extending expiry time

### Development Testing:
- Emails log to console (no real sends)
- Copy verification URL from console
- Test in browser manually

---

## 🎯 Next Steps

1. **Create frontend pages** (verify-email, forgot-password, reset-password, settings)
2. **Add rate limiting** to prevent abuse
3. **Email preferences** (marketing emails, notifications)
4. **Resend verification email** endpoint
5. **Session management** (logout all devices)
6. **2FA** (optional, later)

---

## 📚 Resources

- **SendGrid Docs:** https://docs.sendgrid.com/api-reference/mail-send/mail-send
- **Email Best Practices:** https://sendgrid.com/blog/email-best-practices/
- **Prisma Schema:** https://www.prisma.io/docs/concepts/components/prisma-schema

---

Would you like me to create the frontend pages next? Or shall we move on to another feature (like Stripe billing)?
