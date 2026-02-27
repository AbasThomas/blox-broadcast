import type { BroadcastTemplate } from "./types.js";

// Cloudinary CDN — using w_600/w_192 transforms so email clients receive
// correctly-sized images without downloading the full originals.
const bannerSrc =
  process.env.BANNER_URL ??
  "https://res.cloudinary.com/dwnxxkjwg/image/upload/w_540,q_auto,f_png/v1772207176/banner_wwikkg.png";

const logoSrc =
  process.env.LOGO_URL ??
  "https://res.cloudinary.com/dwnxxkjwg/image/upload/w_192,q_auto,f_png/v1772207176/logo_hgm43f.png";

export const waitlistUpdateTemplate: BroadcastTemplate = {
  id: "waitlist-update",
  subject: "You're on the Blox founding waitlist — here's what's yours",
  previewText:
    "Your exclusive founding member perks are locked in. Here's everything reserved for you.",
  html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e2e8f0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #cbd5e1;">

            <!-- Logo Header — dark bg matches the logo asset -->
            <tr>
              <td align="center" style="padding:28px 32px;background:#0d1117;">
                <img src="${logoSrc}" alt="Blox" width="96" style="display:block;height:auto;border:0;" />
              </td>
            </tr>

            <!-- Hero Banner — inset with dark bg matching the header -->
            
            <!-- Intro -->
            <tr>
              <td style="padding:36px 36px 0;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0ea5e9;">Founding Member</p>
                <h1 style="margin:0 0 20px;font-size:27px;font-weight:700;line-height:1.3;color:#0f172a;">
                  Hi {{{FIRST_NAME|there}}}, your perks are locked in.
                </h1>
                <p style="margin:0 0 18px;font-size:13px;line-height:1.7;color:#94a3b8;border-left:3px solid #e2e8f0;padding-left:12px;">
                  Quick note: If you got a mistaken or duplicate email from us recently, please ignore it — sorry about that mix-up!
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#475569;">
                  Thank you for joining the Blox waitlist. You signed up before most people even knew we existed — and that means something to us.
                </p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#475569;">
                  As a founding member, you've unlocked a set of exclusive perks that won't be available once we open to the public:
                </p>
              </td>
            </tr>

            <!-- Perks Card -->
            <tr>
              <td style="padding:0 36px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:14px;">
                  <tr>
                    <td style="padding:22px 24px;">

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="26" valign="top" style="padding-top:1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:20px;height:20px;background:#0ea5e9;border-radius:50%;text-align:center;font-size:11px;font-weight:700;color:#ffffff;line-height:20px;">&#10003;</td></tr></table>
                          </td>
                          <td style="padding-left:12px;font-size:15px;color:#0f172a;line-height:1.6;">
                            <strong>1 Month Free</strong> <span style="color:#64748b;">— starting the day we launch</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="26" valign="top" style="padding-top:1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:20px;height:20px;background:#0ea5e9;border-radius:50%;text-align:center;font-size:11px;font-weight:700;color:#ffffff;line-height:20px;">&#10003;</td></tr></table>
                          </td>
                          <td style="padding-left:12px;font-size:15px;color:#0f172a;line-height:1.6;">
                            <strong>40% Off Your Second Month</strong> <span style="color:#64748b;">— founder pricing, never available publicly</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="26" valign="top" style="padding-top:1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:20px;height:20px;background:#0ea5e9;border-radius:50%;text-align:center;font-size:11px;font-weight:700;color:#ffffff;line-height:20px;">&#10003;</td></tr></table>
                          </td>
                          <td style="padding-left:12px;font-size:15px;color:#0f172a;line-height:1.6;">
                            <strong>Priority Early Access</strong> <span style="color:#64748b;">— get in before anyone else</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="26" valign="top" style="padding-top:1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:20px;height:20px;background:#0ea5e9;border-radius:50%;text-align:center;font-size:11px;font-weight:700;color:#ffffff;line-height:20px;">&#10003;</td></tr></table>
                          </td>
                          <td style="padding-left:12px;font-size:15px;color:#0f172a;line-height:1.6;">
                            <strong>Exclusive Premium Templates</strong> <span style="color:#64748b;">— portfolios, resumes &amp; branding kits</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="26" valign="top" style="padding-top:1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="width:20px;height:20px;background:#0ea5e9;border-radius:50%;text-align:center;font-size:11px;font-weight:700;color:#ffffff;line-height:20px;">&#10003;</td></tr></table>
                          </td>
                          <td style="padding-left:12px;font-size:15px;color:#0f172a;line-height:1.6;">
                            <strong>Personal Subscription Coupon</strong> <span style="color:#64748b;">— a member-only discount code sent to you at launch</span>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body Copy + CTA -->
            <tr>
              <td style="padding:0 36px 36px;">
                <p style="margin:0 0 16px;font-size:17px;font-weight:700;color:#0f172a;">
                  Launch is very, very close.
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#475569;">
                  Blox is an AI-powered platform built to make professional branding fast, accessible, and effortless — portfolios, resumes, and branding kits, all in one place.
                </p>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:#475569;">
                  Know someone who's been putting off building their online presence? Send them to Blox before we launch. They'll get in early too.
                </p>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:32px;">
                  <tr>
                    <td style="border-radius:10px;background:#0284c7;">
                      <a href="https://bloxplatform.org" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                        Share bloxplatform.org &#8594;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 4px;font-size:15px;line-height:1.75;color:#64748b;">More soon.</p>
                <p style="margin:0;font-size:15px;line-height:1.75;color:#64748b;">&#8212; Thomas, Blox</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 36px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                <p style="margin:0;font-size:12px;line-height:1.7;color:#94a3b8;text-align:center;">
                  You're receiving this because you joined the Blox waitlist at
                  <a href="https://bloxplatform.org" style="color:#64748b;text-decoration:none;">bloxplatform.org</a>.<br />
                  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  text: `Hi {{{FIRST_NAME|there}}},

Quick note: If you got a mistaken or duplicate email from us recently, please ignore it — sorry about that mix-up!

Thank you for joining the Blox waitlist. You signed up before most people even knew we existed — and that means something to us.

As a founding member, you've unlocked exclusive perks that won't be available once we open to the public:

  ✓ 1 Month Free — starting the day we launch
  ✓ 40% Off Your Second Month — founder pricing, never available publicly
  ✓ Priority Early Access — get in before anyone else
  ✓ Exclusive Premium Templates — portfolios, resumes & branding kits
  ✓ Personal Subscription Coupon — a member-only discount code sent to you at launch

**Launch is very, very close.**

Blox is an AI-powered platform built to make professional branding fast, accessible, and effortless — portfolios, resumes, and branding kits, all in one place.

Know someone who's been putting off building their online presence? Send them to Blox before we launch. They'll get in early too.

→ bloxplatform.org

More soon.

— Thomas, Blox

---
You're receiving this because you joined the Blox waitlist at bloxplatform.org.
Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`,
};

export default waitlistUpdateTemplate;

