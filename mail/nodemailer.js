const nodemailer = require('nodemailer');

async function sendEmail(user, message, product) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'numansocu5258@gmail.com',
        pass: 'fquo oxjm kybl pifw',
      },
    });

    await transporter.verify();
    console.log('SMTP bağlantısı başarılı.');

    const mailOptions = {
      from: 'numansocu5258@gmail.com',
      to: user.email,
      subject: 'Siparişiniz Alındı!',
      text: 'Sipariş detaylarınızı görmek için HTML destekli bir e-posta istemcisi kullanın.',
      html: emailTemplate(user, message, product),
    };

    // E-postayı gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta başarıyla gönderildi:', info.response);
  } catch (error) {
    console.error('Hata oluştu:', error.message);
    console.error('Detaylı hata bilgisi:', error);
  }
}

module.exports = sendEmail;

const emailTemplate = (user, message, product) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .body {
      padding: 20px;
      color: #333333;
    }
    .body h2 {
      color: #4CAF50;
      margin-bottom: 20px;
    }
    .body p {
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .order-details {
      margin-top: 20px;
      border-collapse: collapse;
      width: 100%;
    }
    .order-details th, .order-details td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    .order-details th {
      background-color: #f2f2f2;
    }
    .product-image {
      text-align: center;
      margin: 20px 0;
    }
    .product-image img {
      max-width: 100%;
      height: auto;
      border-radius: 5px;
    }
    .footer {
      background-color: #f9f9f9;
      color: #888888;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #dddddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      Siparişiniz Alındı!
    </div>
    <div class="body">
      <h2>Merhaba ${user.name} </h2>
      <p>${message}</p>

      <div class="product-image">
        <img src="${product.productImage}" alt="${product.name}" />
      </div>
      
      <table class="order-details">
        <tr>
          <th>Ürün</th>
          <th>Açıklama</th>
          <th>Fiyat</th>
        </tr>
        <tr>
          <td>${product.name}</td>
          <td>${product.productDescription}</td>
          <td>${product.price} ₺</td>
        </tr>
      </table>

      <p>Eğer herhangi bir sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.</p>
    </div>
    <div class="footer">
      <p>Bu e-posta otomatik olarak gönderilmiştir, lütfen cevaplamayın.</p>
      <p>© ${new Date().getFullYear()} Numan Söcü. Tüm Hakları Saklıdır.</p>
    </div>
  </div>
</body>
</html>
`;
