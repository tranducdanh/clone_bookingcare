import db from '../models/index';

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

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctors: getAllDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
};
