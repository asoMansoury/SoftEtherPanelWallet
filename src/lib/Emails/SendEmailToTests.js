import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Set to true for SSL
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_SENDER, // Replace with your Gmail email address
    pass: process.env.EMAIL_SENDER_AUTH// Replace with your Gmail password or an app-specific password
  }
});

export async function SendEmailToTests(to, subject, content, telegram) {
  console.log("Send Email Flag : ",process.env.SEND_EMAIL)
  if(process.env.SEND_EMAIL == 'false' ){
    return;
  }
  try {
    const table = `
        <div>

          ${telegram.hasTelegram == true ? `
                    <div>ّ
                          <a target="_blank" href="${telegram.telegramId}" style="cursor: pointer; font-weight: bold; color: blue; text-decoration: none;">
                          <span style="border-bottom: 1px solid transparent;">برای ارتباط با پشتیبانی اینجا کلیک کنید</span>
                          </a>
                      </div>`: ""}
          <div>${content}</div>
        </div>
        `;
    if (process.env.BY_SENDGRID == true) {
      console.log("sending Email via sendgrid")
      const msg = {
        to: to, // Change to your recipient
        from: process.env.EMAIL_SENDER, // Change to your verified sender
        subject: subject,
        html: table,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.error(`sending email to ${to} email was successful: `)
        })
        .catch((error) => {
          console.error(`sending email to ${to} email was not successful the error is: `, error)
        })
    } else {
      console.log("sending Email via Gmail Service")
      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to, // Replace with the recipient's email address
        subject: subject,
        html: table
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent:', info.response);
      return info.response;
    }



  } catch (err) {
    console.error('Error sending email:', err);
  }
}
