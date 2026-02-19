const { Resend } = require('resend');

console.log("RESEND_API_KEY set:", process.env.RESEND_API_KEY ? "✅ YES" : "❌ NO");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await resend.emails.send({
            from: 'noreply@resend.dev',
            to,
            subject,
            html,
        });

        console.log("Email response:", response);
        console.log("Email sent successfully:", response.id);
    } catch (error) {
        console.error("Email send error:", error.message);
        console.error("Full error:", error);
        throw new Error("Email failed");
    }
};