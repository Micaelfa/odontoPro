import nodemailer from "nodemailer"

interface SendPasswordResetEmailProps {
    to: string
    resetLink: string
}

export async function sendPasswordResetEmail({
    to,
    resetLink,
}: SendPasswordResetEmailProps) {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom = process.env.SMTP_FROM

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
        return {
            error: "Serviço de e-mail não configurado.",
            data: null,
        }
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    })

    await transporter.sendMail({
        from: smtpFrom,
        to,
        subject: "Recuperação de senha - OdontoPro",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Recuperação de senha</h2>

                <p>Recebemos uma solicitação para redefinir sua senha de acesso ao sistema.</p>

                <p>Para criar uma nova senha, clique no botão abaixo:</p>

                <p>
                    <a 
                        href="${resetLink}" 
                        style="display:inline-block;background:#10b981;color:#ffffff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:bold;"
                    >
                        Redefinir senha
                    </a>
                </p>

                <p>Este link é válido por 1 hora.</p>

                <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
            </div>
        `,
    })

    return {
        error: null,
        data: "E-mail de recuperação enviado com sucesso.",
    }
}