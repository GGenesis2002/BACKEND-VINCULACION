import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Usar el shortcut de gmail es más fiable en Render
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // --- ESTA ES LA CORRECCIÓN CLAVE ---
  family: 4, // Fuerza el uso de IPv4 para evitar el error ENETUNREACH
  // ----------------------------------
  tls: {
    rejectUnauthorized: false 
  }
});

export const sendResetEmail = async (to, token) => {
  try {
    const info = await transporter.sendMail({
      from: `"SismosApp" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #333;">Recuperar contraseña</h2>
          <p>Tu código de recuperación es:</p>
          <h1 style="color: #6200EE; letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${token}</h1>
          <p>Este código expira en 15 minutos.</p>
        </div>
      `,
    });
    console.log("Email enviado con éxito:", info.messageId);
    return { success: true };
  } catch (error) {
    // Logueamos el error completo para debuggear si vuelve a fallar
    console.error("Detalle del error al enviar email:", error);
    throw new Error(`Error de conexión al enviar correo: ${error.code || error.message}`);
  }
};