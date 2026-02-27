import type { BroadcastTemplate } from "./types.js";

export const productAnnouncementTemplate: BroadcastTemplate = {
  id: "product-announcement",
  subject: "A new feature just dropped",
  previewText: "Personalized updates with one-click access.",
  html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#eef3f9;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef3f9;padding:20px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dbe2ea;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:24px;">
                <img src="https://example.com/banner.png" alt="Announcement banner" width="572" style="display:block;width:100%;height:auto;border:0;border-radius:8px;margin-bottom:20px;" />
                <h2 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0b1220;">Hello {{{FIRST_NAME|there}}},</h2>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#334155;">
                  We launched a new release focused on better reliability, reporting, and team visibility.
                </p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
                  Open your dashboard to see the latest tools and rollout notes.
                </p>
                <a href="https://example.com/releases" style="display:inline-block;padding:12px 16px;background:#0f766e;color:#ffffff;font-weight:700;border-radius:8px;text-decoration:none;">
                  View release notes
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
                  If this email is no longer relevant, you can
                  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#475569;">unsubscribe here</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  text: `Hello {{{FIRST_NAME|there}}},

We launched a new release focused on better reliability, reporting, and team visibility.
Open your dashboard to see the latest tools and rollout notes.

View release notes: https://example.com/releases

Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`,
};

export default productAnnouncementTemplate;

