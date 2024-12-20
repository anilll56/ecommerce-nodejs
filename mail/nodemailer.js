const nodemailer = require("nodemailer");

async function sendEmail(email, message) {
  try {
    // Transporter oluştur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "numansocu5258@gmail.com",
        pass: "fquo oxjm kybl pifw", // Şifrenizi kontrol edin
      },
    });

    // Bağlantıyı test et
    await transporter.verify();
    console.log("SMTP bağlantısı başarılı.");

    // E-posta seçeneklerini tanımla
    const mailOptions = {
      from: "numansocu5258@gmail.com",
      to: email,
      subject: "Nodemailer Test",
      text: message,
      html: "<b>Bu bir test e-postasıdır.</b>",
    };

    // E-postayı gönder
    const info = await transporter.sendMail(mailOptions);
    console.log("E-posta başarıyla gönderildi:", info.response);
  } catch (error) {
    console.error("Hata oluştu:", error.message);
    console.error("Detaylı hata bilgisi:", error);
  }
}

module.exports = sendEmail;
