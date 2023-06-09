import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exists
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true,
                });
                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage =
                            'Wrong password. Please try again !!!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found !!!`;
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = `Your email does not exist in the system. Please try again !!!`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message:
                        'Your email is already in use. Please try again !!!',
                });
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            });
            resolve({
                errCode: 0,
                message: 'OK',
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter',
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update user successfully',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'The user not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false,
        });
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'User not found !!!',
            });
        }
        await user.destroy();
        // await db.User.destroy({
        //     where: { id: userId },
        // });
        resolve({
            errCode: 0,
            message: 'The user is deleted !!!',
        });
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
};
