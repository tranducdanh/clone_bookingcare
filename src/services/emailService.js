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
        from: '"Đức Danh 👻" <tranducdanhqnm@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
       
        html: `
            <h3>Xin chào${dataSend.patientName}</h3>
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
        `, // html body
      });
}

module.exports ={
    sendSimpleEmail
}