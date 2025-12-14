exports.emailVerificationTemplate = (otp)=>{
    return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Upasthit: Signup Verification OTP</title>
  <!-- Preheader text (hidden) -->
  <style>
    .preheader { display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
    @media screen and (max-width: 600px){
      .container { width:100% !important; }
      .p-24 { padding:20px !important; }
      .otp { font-size:32px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f6f7fb;">
  <div class="preheader">Use this OTP to verify your Upasthit account. It’s valid for 2 minutes.</div>

  <!-- Background wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f6f7fb;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <!-- Main card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
          <tr>
            <td class="p-24" style="padding:28px 32px 12px 32px; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#2b0b3a;">
             
              <!-- Greeting -->
              <p style="margin:28px 0 16px; font-size:18px; line-height:28px; text-align:center; color:#3a0e4f;">
                Dear User,
              </p>

              <!-- Copy -->
              <p style="margin:0 0 8px; font-size:16px; line-height:28px; text-align:center; color:#3a0e4f;">
                Thank you for registering with Upasthit. To complete your registration, please use the
              </p>
              <p style="margin:0 0 18px; font-size:16px; line-height:28px; text-align:center; color:#3a0e4f;">
                following <span style="background:#fde68a; padding:2px 6px; border-radius:4px;">OTP</span>
                (<span style="background:#fde68a; padding:2px 6px; border-radius:4px;">One-Time Password</span>)
                to verify your account:
              </p>

              <!-- OTP code -->
              <div class="otp" style="text-align:center; font-weight:800; font-size:40px; letter-spacing:1px; margin:16px 0 8px; color:#1b0b2b;">
                ${otp}
              </div>

              <!-- Validity -->
              <p style="margin:24px 0 4px; font-size:16px; line-height:28px; text-align:center; color:#3a0e4f;">
                This <span style="background:#fde68a; padding:2px 6px; border-radius:4px;">OTP</span> is valid for 2 minutes.
              </p>
              <p style="margin:0 0 6px; font-size:16px; line-height:28px; text-align:center; color:#3a0e4f;">
                If you did not request this verification, please disregard this email.
              </p>

              <!-- Spacer -->
              <div style="height:8px; line-height:8px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 28px 32px; text-align:center; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
              <hr style="border:none; border-top:1px solid #eee; margin:12px 0 16px;">
              <p style="margin:0; font-size:12px; line-height:20px; color:#7a6b85;">
                &copy; 2025 Upasthit. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        <!-- /Main card -->
      </td>
    </tr>
  </table>
</body>
</html>
`
}