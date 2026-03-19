// emailService.js
import { Resend } from 'resend';

// Esta API KEY debe estar en las variables de entorno de Render
const resend = new Resend(process.env.RESEND_API_KEY);

// emailService.js

export const sendResetEmail = async (to, token) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: "SismosApp", 
          email: "e.valuacionsismica2002@gmail.com" // Pon el correo con el que te registraste en Brevo
        },
        to: [{ email: to }],
        subject: "Código de Recuperación - SismosApp",
        htmlContent: `
          <div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6200EE;">Recuperar Contraseña</h2>
            <p>Tu código de seguridad para SismosApp es:</p>
            <h1 style="background: #f4f4f4; display: inline-block; padding: 10px 20px; letter-spacing: 5px;">${token}</h1>
            <p>Este código expira en 15 minutos.</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error respuesta Brevo:", data);
      throw new Error("Brevo no pudo procesar el envío.");
    }

    console.log("¡Correo enviado con éxito por Brevo!");
    return { success: true };
  } catch (error) {
    console.error("Error crítico enviando con Brevo:", error.message);
    throw error;
  }
};