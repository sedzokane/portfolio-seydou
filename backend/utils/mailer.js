export const sendContactNotification = async (msg) => {
  if (!process.env.BREVO_API_KEY) {
    console.log("Brevo non configuré — notification non envoyée.");
    return;
  }

  const escapeHtml = (str = "") =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nouveau message</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#13131B;border-radius:12px;overflow:hidden;border:1px solid #272733;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#34D399,#059669);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:rgba(255,255,255,0.75);letter-spacing:3px;text-transform:uppercase;">Portfolio</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">
                Nouveau message
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">
                Reçu le ${new Date().toLocaleDateString("fr-FR", { weekday:"long", year:"numeric", month:"long", day:"numeric" })} à ${new Date().toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Infos contact -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#34D399;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Expéditeur</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1C1C28;border-radius:8px;border:1px solid #272733;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%" style="padding-bottom:12px;">
                                <p style="margin:0 0 3px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Nom complet</p>
                                <p style="margin:0;font-size:15px;font-weight:600;color:#F2F2F5;">${escapeHtml(msg.fullName)}</p>
                              </td>
                              <td width="50%" style="padding-bottom:12px;">
                                <p style="margin:0 0 3px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Email</p>
                                <p style="margin:0;font-size:15px;color:#34D399;">
                                  <a href="mailto:${escapeHtml(msg.email)}" style="color:#34D399;text-decoration:none;">${escapeHtml(msg.email)}</a>
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td width="50%">
                                <p style="margin:0 0 3px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Téléphone / WhatsApp</p>
                                <p style="margin:0;font-size:15px;color:#F2F2F5;">
                                  ${msg.phone
                                    ? `<a href="https://wa.me/${msg.phone.replace(/\s+/g,"").replace("+","")}" style="color:#25D366;text-decoration:none;">${escapeHtml(msg.phone)}</a>`
                                    : '<span style="color:#6B7280;font-style:italic;">Non renseigné</span>'
                                  }
                                </p>
                              </td>
                              <td width="50%">
                                <p style="margin:0 0 3px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Service souhaité</p>
                                <p style="margin:0;">
                                  ${msg.service
                                    ? `<span style="display:inline-block;background-color:#FBBF24;color:#0A0A0F;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">${escapeHtml(msg.service)}</span>`
                                    : '<span style="color:#6B7280;font-style:italic;font-size:13px;">Non précisé</span>'
                                  }
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;font-size:11px;color:#34D399;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Message</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1C1C28;border-radius:8px;border:1px solid #272733;border-left:3px solid #34D399;padding:20px 24px;">
                    <p style="margin:0;font-size:14px;color:#D1D5DB;line-height:1.7;white-space:pre-wrap;">${escapeHtml(msg.message)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA répondre -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(msg.email)}?subject=Re: Votre message sur mon portfolio"
                       style="display:inline-block;background:linear-gradient(135deg,#34D399,#059669);color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
                      Répondre à ${escapeHtml(msg.fullName.split(" ")[0])}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0D0D18;border-top:1px solid #272733;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4B5563;">
                Ce message a été envoyé depuis le formulaire de contact de
                <span style="color:#34D399;font-weight:600;">portfolio-seydou.vercel.app</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Portfolio Seydou KANE",
          email: process.env.BREVO_FROM_EMAIL,
        },
        to: [{ email: process.env.NOTIFY_EMAIL }],
        replyTo: { email: msg.email, name: msg.fullName },
        subject: `📩 Nouveau contact — ${msg.fullName}${msg.service ? ` · ${msg.service}` : ""}`,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur Brevo :", error.message);
    } else {
      console.log("Email envoyé via Brevo");
    }
  } catch (err) {
    console.error("Erreur Brevo :", err.message);
  }
};