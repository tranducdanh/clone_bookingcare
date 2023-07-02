require('dotenv').config()
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });
    const info = await transporter.sendMail({
        from: '"BookingCare" <tranducdanhqnm@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
       
        html: getBodyHTMLEmail(dataSend),
      });
}

let getBodyHTMLEmail =(dataSend)=>{
    let result =''
    if(dataSend.language === 'vi'){
        result =  `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>
            <b>Thời gian: ${dataSend.time}</b>                
        </div>
        <div>
            <b>Bác sĩ: ${dataSend.doctorName}</b> 
        </div>
        <p>Nếu các thông tin trên là chính xác, vui lòng bấm vào liên kết bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
        </div>
        <div>Xin cảm ơn !!!</div>
    `
    }
    if(dataSend.language === 'en'){
        result =  `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare</p>
        <p>Information to book a medical appointment:</p>
        <div>
            <b>Time: ${dataSend.time}</b>                
        </div>
        <div>
            <b>Doctor: ${dataSend.doctorName}</b> 
        </div>
        <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
        </div>
        <div>Thank you !!!</div>
    `
    }
    return result
}

module.exports ={
    sendSimpleEmail,
    getBodyHTMLEmail
}