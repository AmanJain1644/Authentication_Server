import nodemailer from "nodemailer";
// create transport
const sendVerificationEmail = async(email,token)=>{
try {
    //transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS,
        },
      });
      //verification url
      const verificationUrl = `${process.env.base_url}/api/v1/user/verify/${token}`;
      //email content
      const mailOptions = {
        from: `"Aman ka Authentication App" <${process.env.email_id}>`, // Who is sending the email
        to: email,                      // Who should receive the email
        subject: 'please verify your email address',                         // The subject line
        text: `Thank You for resgistering! Please verify your email address to complete your resgistration.
            ${verificationUrl}
            the verification link will expire in 10 mins.
            If you did not create an account please ignore this email
        `,        // (Optional) Plain text version
        //html: '<h1>AJ huh!!</h1>',                    // (Optional) HTML version (fancy version)
      };
      //send email
      const info = await transporter.sendMail(mailOptions);
      console.log('verification email sent:%s',info.messageId);
      return true;

    } catch (error) {
        console.error("Error in sending the verification email:",error);
        return false;    
    }
};

export default sendVerificationEmail;