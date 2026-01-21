import { EMAIL_TEMPLATES } from '../../lib/constants';

export function getPasswordResetHtmlTemplate(
  userName: string,
  resetLink: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${EMAIL_TEMPLATES.RESET_PASSWORD_TITLE}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">📝 ${EMAIL_TEMPLATES.APP_NAME}</div>
              <h1 style="margin: 10px 0 0; font-size: 22px; color: #1f2937;">${EMAIL_TEMPLATES.RESET_PASSWORD_TITLE}</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #374151;">
              <p>${EMAIL_TEMPLATES.RESET_PASSWORD_GREETING} <strong>${userName}</strong>,</p>
              <p>${EMAIL_TEMPLATES.RESET_PASSWORD_INTRO}</p>
              <table align="center" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                <tr>
                  <td bgcolor="#2563eb" style="border-radius: 6px; padding: 14px 32px;">
                    <a href="${resetLink}" style="color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">${EMAIL_TEMPLATES.RESET_PASSWORD_BUTTON}</a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px;">
                <strong>${EMAIL_TEMPLATES.RESET_PASSWORD_WARNING}</strong> ${EMAIL_TEMPLATES.RESET_PASSWORD_EXPIRY} <strong>${EMAIL_TEMPLATES.RESET_PASSWORD_EXPIRY_TIME}</strong>.
              </div>
              <p>${EMAIL_TEMPLATES.RESET_PASSWORD_FALLBACK}</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 14px;">${resetLink}</p>
              <p>${EMAIL_TEMPLATES.RESET_PASSWORD_IGNORE}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">${EMAIL_TEMPLATES.RESET_PASSWORD_CLOSING}<br /><strong>${EMAIL_TEMPLATES.RESET_PASSWORD_TEAM}</strong></p>
              <p style="margin: 8px 0 0;">${EMAIL_TEMPLATES.RESET_PASSWORD_AUTO}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates plain text template for password reset email
 */
export function getPasswordResetTextTemplate(
  userName: string,
  resetLink: string,
): string {
  return `${EMAIL_TEMPLATES.RESET_PASSWORD_GREETING} ${userName},\n\n${EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_INTRO}\n\n${resetLink}\n\n${EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_EXPIRY}\n\n${EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_IGNORE}\n\n${EMAIL_TEMPLATES.RESET_PASSWORD_CLOSING}\n${EMAIL_TEMPLATES.RESET_PASSWORD_TEAM}`;
}
