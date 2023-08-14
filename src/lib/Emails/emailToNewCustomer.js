import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aso.mansoury@gmail.com', // Replace with your Gmail email address
    pass: 'dfjoqpzndpqtpjis' // Replace with your Gmail password or an app-specific password
  }
});

export async function sendEmailToNewCustomer(to,subject,customer,transferedMoney,agentEmail) {
    try {
      const table = `
      <div>
        <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <p style="margin-bottom: 8px; font-size: 16px;">اطلاعات شما برای ورود به سایت (لطفاً نام کاربری و کلمه عبور خود را به هیچ عنوان با کسی به اشتراک نگذارید.)</p>
          <span style="font-size: 14px; color: #007bff;">نام کاربری: ${customer.email}</span><br>
          <span style="font-size: 14px; color: #007bff;">کلمه عبور: ${customer.password}</span><br>
          <span style="font-size: 14px; color: #007bff;">کیف پول شما به میزان ${transferedMoney} توسط ${agentEmail} شارژ شده است.</span>
        </div>
      </div>
      `;


      const mailOptions = {
        from: `${process.env.EMAIL_SENDER}`,
        to: to, // Replace with the recipient's email address
        subject: subject,
        html: table
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent:', info.response);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }


  export async function sendEmailToInformCustomer(to,subject,transferedMoney,agentEmail) {
    try {
      const table = `
      <div>
        <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <span style="font-size: 14px; color: #007bff;">کیف پول شما به میزان ${transferedMoney} توسط ${agentEmail} شارژ شده است.</span>
        </div>
      </div>
      `;


      const mailOptions = {
        from: `${process.env.EMAIL_SENDER}`,
        to: to, // Replace with the recipient's email address
        subject: subject,
        html: table
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent:', info.response);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
