const SEND_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - ChatHub</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px;">
    <tr>
      <td style="padding: 30px; text-align: center; background: #4f46e5; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">ChatHub</h1>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin: 0 0 15px 0; font-size: 22px;">Hi {userFullName},</h2>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333;">
          Please verify your email address to start using ChatHub.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{token}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 10px 25px; border-radius: 5px; font-size: 14px;">
            Verify Email Address
          </a>
        </div>
        
        <p style="margin: 0 0 30px 0; font-size: 13px; color: #666; text-align: center;">
This link will expire in 5 minutes
        </p>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            If the button doesn't work, copy and paste this link:
          </p>
          <p style="margin: 0; font-size: 12px; color: #4f46e5; word-break: break-all;">
            {token}
          </p>
        </div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 20px; text-align: center; background: #f8f8f8; border-top: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          © 2026 ChatHub. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

module.exports = SEND_EMAIL_TEMPLATE;
