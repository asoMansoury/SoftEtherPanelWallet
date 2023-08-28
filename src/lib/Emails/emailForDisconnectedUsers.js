import nodemailer from 'nodemailer';
import { SendingEmailService } from '../utils';
const sgMail = require('@sendgrid/mail');
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


export async function emailForDisconnectedUsers(to,subject,agentEmail,selectedServer,user) {
//   console.log("Send Email Flag : ",process.env.SEND_EMAIL)
//   if(process.env.SEND_EMAIL == 'false' ){
//     return;
//   }

    try {
      const table = `
      <div>
        <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
          <p style="margin-bottom: 8px; font-size: 16px;">کاربر گرامی اکانت شما توسط نماینده فروش شما قطع شده است، می توانید با نماینده فروش خود دلیل قطع شدن اکانت خود را پیگیری و درخواست اتصال مجدد را داشته باشد.</p>
          <p></p>
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


  export async function emailForReconnectingUsers(to,subject,agentEmail,selectedServer,user) {
    //   console.log("Send Email Flag : ",process.env.SEND_EMAIL)
    //   if(process.env.SEND_EMAIL == 'false' ){
    //     return;
    //   }
    
        try {
          const table = `
          <div>
            <div dir="rtl" style=" margin-top: 8px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background-color: #f5f5f5;">
              <p style="margin-bottom: 8px; font-size: 16px;">کاربر گرامی اکانت شما مجددا توسط نماینده فروش شما متصل گردید می توانید دوباره به اکانت خود متصل شود.</p>
              
              <p></p>
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
