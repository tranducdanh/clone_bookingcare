import db from '../models/index';
import emailService from './emailService'

let postBookAppointment = (data)=>{
    return new Promise( async (resolve,reject)=> {
        try {
            if(!data.email || !data.doctorId || !data.date || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameters !!!'
                })
            }else{
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName:'Duc Danh',
                    time:'08:00 - 09:00 - thứ ba - 01/01/2023',
                    doctorName:'Thanh Ha',
                    redirectLink:'https://www.facebook.com/tranducdanhh',
                })
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                      email: data.email,
                      roleId: 'R3'
                    }
                  });

                // create a booking   
                // if(user && user[0]){
                //     await db.Booking.findOrCreate({
                //         where:{
                //             patientId: user[0].id,
                //         },
                //         defaults: {
                //             statusId:'S1',
                //             doctorId: data.doctorId,
                //             patientId: user[0].id,
                //             date: data.date,
                //             timeType: data.timeType
                //         }
                //     })
                // }

                if(user && user[0]){
                    await db.Booking.create({
                        statusId:'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType
                    })
                }

                resolve({                    
                    errCode: 0,
                    errMessage: 'Succeed !!!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports ={
    postBookAppointment
}