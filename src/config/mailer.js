const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await resend.emails.send({
            from: 'noreply@resend.dev',
            to,
            subject,
            html,
        });

        console.log("Email sent successfully:", response.id);
    } catch (error) {
        console.error("Email error:", error);
        throw new Error("Email failed");
    }
};