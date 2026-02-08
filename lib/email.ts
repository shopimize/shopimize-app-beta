/**
 * Email Service
 * Handles sending transactional emails via SendGrid
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using SendGrid API
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  // Development: Just log to console
  if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
    console.log('📧 Email (DEV MODE):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    console.log('─'.repeat(50));
    return true;
  }

  // Production: Use SendGrid
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          }
        ],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@shopimize.com',
          name: 'Shopimize',
        },
        content: [
          {
            type: 'text/html',
            value: html,
          },
          {
            type: 'text/plain',
            value: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', response.status, error);
      return false;
    }

    console.log('✅ Email sent successfully via SendGrid');
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string | null,
  token: string
): Promise<boolean> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Shopimize</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Verify your email address</h2>
          
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            Thanks for signing up for Shopimize! Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">
              ${verificationUrl}
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't create an account with Shopimize, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email address - Shopimize',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string | null,
  token: string
): Promise<boolean> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Shopimize</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Reset your password</h2>
          
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">
              ${resetUrl}
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your password - Shopimize',
    html,
  });
}

/**
 * Send welcome email (after email verification)
 */
export async function sendWelcomeEmail(
  email: string,
  name: string | null
): Promise<boolean> {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Shopimize!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Shopimize! 🎉</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            Your email has been verified! You're all set to start tracking your e-commerce profits with Shopimize.
          </p>
          
          <h3 style="color: #1f2937; margin-top: 30px;">🚀 Get Started:</h3>
          
          <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
            <li>Connect your Shopify store</li>
            <li>Sync your orders</li>
            <li>Track profit margins in real-time</li>
            <li>Integrate Google Ads (optional)</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Need help? Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/docs" style="color: #667eea;">documentation</a>.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Shopimize! 🎉',
    html,
  });
}


/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string | null,
  token: string
): Promise<boolean> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Shopimize</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Verify your email address</h2>
          
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            Thanks for signing up for Shopimize! Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">
              ${verificationUrl}
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't create an account with Shopimize, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email address - Shopimize',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string | null,
  token: string
): Promise<boolean> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Shopimize</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Reset your password</h2>
          
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">
              ${resetUrl}
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your password - Shopimize',
    html,
  });
}

/**
 * Send welcome email (after email verification)
 */
export async function sendWelcomeEmail(
  email: string,
  name: string | null
): Promise<boolean> {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Shopimize!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Shopimize! 🎉</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="color: #4b5563; font-size: 16px;">
            Hi${name ? ` ${name}` : ''},
          </p>
          
          <p style="color: #4b5563; font-size: 16px;">
            Your email has been verified! You're all set to start tracking your e-commerce profits with Shopimize.
          </p>
          
          <h3 style="color: #1f2937; margin-top: 30px;">🚀 Get Started:</h3>
          
          <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
            <li>Connect your Shopify store</li>
            <li>Sync your orders</li>
            <li>Track profit margins in real-time</li>
            <li>Integrate Google Ads (optional)</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: 600;
                      display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Need help? Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/docs" style="color: #667eea;">documentation</a>.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Shopimize! 🎉',
    html,
  });
}
