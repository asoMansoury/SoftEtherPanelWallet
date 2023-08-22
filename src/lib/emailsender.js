import nodemailer from 'nodemailer';
import { ConvertToPersianDateTime, SendingEmailService } from './utils';
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

export async function sendEmail(to, users, subject, currentDomain, customer) {
  if(process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development'){
    console.log(process.env.NODE_ENV);
    console.log("hello")
    return;
  } 
  try {

    const tableRows = users.map((user, index) =>
      `
      <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${user.username}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">${user.password}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555; font-weight: bold; color: #5b2121;">${user.expires}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">
          <a href="${user.ovpnurl}">دانلود فایل کانفیگ</a>
        </td>
      </tr>
    `).join('');


    const table = `
      <div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead style="background-color: #f1f1f1;">
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">نام کاربری</th>
              <th style="padding: 10px; border: 1px solid #ddd;">کلمه عبور</th>
              <th style="padding: 10px; border: 1px solid #ddd;">تاریخ انقضا</th>
              <th style="padding: 10px; border: 1px solid #ddd;">دانلود فایل کانفیگ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <p style="margin-bottom: 8px; font-size: 16px;">اطلاعات شما برای ورود به سایت (لطفاً نام کاربری و کلمه عبور خود را به هیچ عنوان به کسی ندهید.)</p>
          <span style="font-size: 14px; color: #007bff;">نام کاربری: ${customer.email}</span><br>
          <span style="font-size: 14px; color: #007bff;">کلمه عبور: ${customer.password}</span>
        </div>
        <div dir="rtl"  style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/OpenVpn/" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای دانلود نرم افزار مربوطه به وی پی ان ایران اینجا کلیک کنید</a>
        </div>
        <div dir="rtl"  style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Learning" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای مشاهده آموزش راه اندازی اینجا کلیک کنید.</a>
        </div>
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


export async function sendEmailTest(to, users, subject) {
  if(process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development'){
    console.log(process.env.NODE_ENV);
    console.log("hello")
    return;
}
  try {

    const tableRows = users.map((user, index) =>
      `
      <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${user.username}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">${user.password}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555; font-weight: bold; color: #5b2121;">${user.expires}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">
          <a href="${user.ovpnurl}">دانلود فایل کانفیگ</a>
        </td>
      </tr>
    `).join('');


    const table = `
      <div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead style="background-color: #f1f1f1;">
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">نام کاربری</th>
              <th style="padding: 10px; border: 1px solid #ddd;">کلمه عبور</th>
              <th style="padding: 10px; border: 1px solid #ddd;">تاریخ انقضا</th>
              <th style="padding: 10px; border: 1px solid #ddd;">دانلود فایل کانفیگ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div dir="rtl"  style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/OpenVpn/" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای دانلود نرم افزار مربوطه به وی پی ان ایران اینجا کلیک کنید</a>
        </div>
        <div dir="rtl"  style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Learning" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای مشاهده آموزش راه اندازی اینجا کلیک کنید.</a>
        </div>
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



export async function sendEmailCiscoClient(to, users, server, subject, currentDomain, customer) {
  if(process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development'){
    console.log(process.env.NODE_ENV);
    console.log("hello")
    return;
}
  try {
    const tableRows = users.map((user, index) =>
      `
      <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${user.username}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">${user.password}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555; font-weight: bold; color: #5b2121;">${user.expires}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">${server.ciscourl + ":" + server.ciscoPort}</td>
      </tr>
    `).join('');

    var domainUrl = currentDomain;
    const table = `
        <div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f1f1f1;">
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd;">نام کاربری</th>
                <th style="padding: 10px; border: 1px solid #ddd;">کلمه عبور</th>
                <th style="padding: 10px; border: 1px solid #ddd;">تاریخ انقضا</th>
                <th style="padding: 10px; border: 1px solid #ddd;">آدرس سرور</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
            <p style="margin-bottom: 8px; font-size: 16px; font-weight: bold; color: red;">زمان وارد کردن آدرس سرور به هیچ عنوان هیچ کلمه اضافی وارد نکنید(دقیقا عین آدرس بدون پیشوند http://) وارد گردد.</p>
            <p style="margin-bottom: 8px; font-size: 16px;">اطلاعات شما برای ورود به سایت (لطفاً نام کاربری و کلمه عبور خود را به هیچ عنوان به کسی ندهید.)</p>
            <span style="font-size: 14px; color: #007bff;">نام کاربری: ${customer.email}</span><br>
            <span style="font-size: 14px; color: #007bff;">کلمه عبور: ${customer.password}</span>
          </div>
            <div dir="rtl" style="margin-top:8px;display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
              <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Cisco/" style="color: #007bff; text-decoration: none; font-weight: bold; cursor:pointer;">برای دانلود نرم افزار مربوطه به سیسکو اینجا کلیک کنید</a>
            </div>
            <div dir="rtl" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
              <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Learning" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای مشاهده آموزش راه اندازی اینجا کلیک کنید.</a>
            </div>
          </div>

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
      }
  } catch (err) {
    console.error('Error sending email:', err);
  }
}



export async function sendEmailCiscoClientTest(to, users, server, subject, currentDomain, customer) {
  if(process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development'){
    console.log(process.env.NODE_ENV);
    console.log("hello")
    return;
  }
  try {
    const tableRows = users.map((user, index) =>
      `
      <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${user.username}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;">${user.password}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555; font-weight: bold; color: #5b2121;">${user.expires}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #555555;"><span>${server.ciscourl + ":" + server.ciscoPort}</span></td>
      </tr>
    `).join('');

    const table = `
        <div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f1f1f1;">
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd;">نام کاربری</th>
                <th style="padding: 10px; border: 1px solid #ddd;">کلمه عبور</th>
                <th style="padding: 10px; border: 1px solid #ddd;">تاریخ انقضا</th>
                <th style="padding: 10px; border: 1px solid #ddd;">آدرس سرور</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
            <p style="margin-bottom: 8px; font-size: 16px; font-weight: bold; color: red;">زمان وارد کردن آدرس سرور به هیچ عنوان هیچ کلمه اضافی وارد نکنید(دقیقا عین آدرس بدون پیشوند http://) وارد گردد.</p>
          </div>
            <div dir="rtl" style="margin-top:8px;display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
              <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Cisco/" style="color: #007bff; text-decoration: none; font-weight: bold; cursor:pointer;">برای دانلود نرم افزار مربوطه به سیسکو اینجا کلیک کنید</a>
            </div>
            <div dir="rtl" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
              <a target="_blank" href="${process.env.NEXTAUTH_URL}/Tutorial/Learning" style="color: #007bff; text-decoration: none; font-weight: bold;cursor:pointer;">برای مشاهده آموزش راه اندازی اینجا کلیک کنید.</a>
            </div>
          </div>

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

