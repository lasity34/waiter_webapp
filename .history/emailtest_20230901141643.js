async function sendTestEmail() {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    let mailOptions = {
      from: 'bjornworrall@gmail.com',
      to: 'bjornworrall@gmail.com',
      subject: 'Test',
      text: 'This is a test email',
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.log('An error occurred: ' + error);
    }
  }
  
  sendTestEmail();