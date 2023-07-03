import specialtyService from '../services/specialtyService'

let createNewSpecialty = async (req, res)=>{
    try {
        let infor = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server !!!',
        });
    }
}

let getAllSpecialty = async (req, res)=>{
    try {
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server !!!',
        });
    }
}

module.exports ={
    createNewSpecialty,
    getAllSpecialty
}