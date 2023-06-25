import db from '../models/index';
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: { roleId: 'R2' },
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                },
            });
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.action
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter !!!',
                });
            } else {
                if(inputData.action ==='CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                }else if(inputData.action === 'EDIT'){
                    let doctor = await db.Markdown.findOne({
                        where:{doctorId: inputData.doctorId},  
                        raw: false              
                    })
                    if(doctor){
                        doctor.contentHTML= inputData.contentHTML
                        doctor.contentMarkdown= inputData.contentMarkdown
                        doctor.description= inputData.description
                        

                        await doctor.save()
                    }
                }
                
                resolve({
                    errCode: 0,
                    message: 'Save info doctor succeed !!!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !!!',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'description',
                                'contentHTML',
                                'contentMarkdown',
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if(data&&data.image){
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if(!data){
                    data ={}
                }

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let bulkCreateSchedule = (data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !!!'
                })
            }else{
                let schedule = data.arrSchedule
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // console.log('check data send: ',schedule);

                //get all existing data
                let existing = await db.Schedule.findAll({
                    where:{
                        doctorId: data.doctorId,
                        date: data.date,
                    },
                    attributes:['date','timeType','doctorId','maxNumber'],
                    raw: true
                })
                //convert date
                if(existing && existing.length > 0) {
                    existing = existing.map(item =>{
                        item.date = new Date(item.date).getTime()
                        return item
                    })
                }
                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a,b)=>{
                    return a.timeType === b.timeType && a.date === b.date
                })
                // console.log(toCreate);

                //create data
                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate) 

                }
                resolve({
                    errCode: 0,
                    message:'Succeed !!!'
                })
            }            
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date)=>{
    return new Promise( async(resolve, reject) =>{
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage:' Missing required parameters !!!'
                })
            }else{
                let data = await db.Schedule.findAll({
                    where:{
                        doctorId:doctorId,
                        date:date
                    }                    
                })

                if(!data){
                    data =[]
                }
                resolve({
                    errCode: 0,
                    data: data,
                    message:'Succeed !!!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate
};
