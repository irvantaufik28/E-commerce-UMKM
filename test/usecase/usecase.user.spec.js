const UserUseCase = require('../../usecase/user');
const mockUserRepo = require('../mock/repository.user.mock')
const mockOtpRepo = require('../mock/repository.otp.mock')

let userValues, otpValues = {}
let userUC = null

const bcrypt = {
    hashSync: jest.fn().mockReturnValue('sdjsdkjnfjfw&*23672(%^SHGHGSjhsjkh87623')
}

const cloudinary = {
    uploadCloudinaryAvatar: jest.fn().mockReturnValue('https://cloudinary.com/avatars/image.jpg')
}

describe('users', () => {
    beforeEach(() => {
        userValues = {
            returnGetUserExist: true,
            returnGetUserByID: true,
            returnUpdatePassword: true,
            returnUpdateUser: true,
            returnGetUserByEmail: true,
            returnGetUserByUsername: true,
        }

        otpValues = {
            returnGetOTP: true,
            returnDeleteAllOtp: true,
        }



        userUC = new UserUseCase(mockUserRepo(userValues), mockOtpRepo(otpValues), bcrypt, cloudinary);
  })
  
  describe('getUserExist test', () => { 

    test('should return true', async () => {
        let res = await userUC.getUserExist('user1','user@example.com');

        expect(typeof res === 'object').toBeTruthy();
        expect(res).toHaveProperty('name');
        expect(res).toHaveProperty('username');
        expect(res).toHaveProperty('image');
        expect(res).toHaveProperty('telp');
        expect(res).toHaveProperty('email');
    });

    test('should return null', async () => {
        userValues.returnGetUserExist = null
        userUC = new UserUseCase(mockUserRepo(userValues));
        let res = await userUC.getUserExist('user1','user@example.com');

        expect(res).toBeNull();
    });

   })

  describe('getUserByID test', () => { 

    test('should isSuccess is true and statusCode 200', async () => {
        let res = await userUC.getUserByID(1);

        expect(res.isSuccess).toBeTruthy();
        expect(res.statusCode).toEqual(200);        
    });

    test('should isSuccess is false and reason is "user not found"', async () => {
        userValues.returnGetUserByID = null
        userUC = new UserUseCase(mockUserRepo(userValues));
        let res = await userUC.getUserByID(1);

        expect(res.isSuccess).toBeFalsy();
        expect(res.reason).toEqual('user not found');
        expect(res.statusCode).toEqual(404);
    });

   })

  describe('updateUserProfile test', () => { 

    test('should isSuccess is false and reason is "user not found"', async () => {
        userValues.returnGetUserByID = null
        userUC = new UserUseCase(mockUserRepo(userValues));
        let res = await userUC.updateUserProfile({
                name: 'user',
                username: 'user2',
                image: 'http://localhost:8080/images/user1.jpg',
                telp: '0847383672',
                email: 'user@example.com'
            },2);

        expect(res.isSuccess).toBeFalsy();
        expect(res.reason).toEqual('user not found');
        expect(res.data).toBeNull();
    });

   })

   describe('updatePassword test', () => { 

    test('should isSuccess is true', async () => {
        let res = await userUC.updatePassword({
                newPassword : '12345678',
                confirmNewPassword: '12345678'
            },2);

        expect(res.isSuccess).toBeTruthy();
        expect(res.statusCode).toEqual(200)
    });

    test('should isSuccess is false and reason is "user not found"', async () => {
        userValues.returnGetUserByID = null
        userUC = new UserUseCase(mockUserRepo(userValues));
        let res = await userUC.updatePassword(
            {
                newPassword : '12345678',
                confirmNewPassword: '12345678'
            },2);

        expect(res.isSuccess).toBeFalsy();
        expect(res.reason).toEqual('user not found');
        expect(res.data).toBeNull();
        expect(res.statusCode).toEqual(404);
    });

    test('should isSuccess is false and reason is "password not match"', async () => {
        let res = await userUC.updatePassword(
            {
                newPassword : '12345678',
                confirmNewPassword: '123456789'
            },2);

        expect(res.isSuccess).toBeFalsy();
        expect(res.reason).toEqual('password not match');
        expect(res.data).toBeNull();
        expect(res.statusCode).toEqual(400)
    });

   })

    describe('updateUserImage test', () => { 

    test('should isSuccess is true', async () => {
        let res = await userUC.updateUserImage({image: './image.jpg'}, 1);

        expect(res.isSuccess).toBeTruthy();
        expect(res.statusCode).toEqual(200)
    });

    test('should isSuccess is false and reason is "user not found"', async () => {
        userValues.returnGetUserByID = null
        userUC = new UserUseCase(mockUserRepo(userValues));
        let res = await userUC.updateUserImage({image: './image.jpg'}, 1);

        expect(res.isSuccess).toBeFalsy();
        expect(res.reason).toEqual('user not found');
        expect(res.data).toBeNull();
        expect(res.statusCode).toEqual(404);
    });

   })

    describe('updateEmail test', () => { 

        test('should isSuccess is true', async () => {
            let res = await userUC.updateEmail({
                    email: 'user@gmail.com',
                    otp_code: 467365,
                },1);

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200)
        });

        test('should isSuccess is false and reason is "user not found"', async () => {
            userValues.returnGetUserByID = null
            userUC = new UserUseCase(mockUserRepo(userValues), mockOtpRepo(otpValues), bcrypt, cloudinary);
            
            let res = await userUC.updateEmail({
                email: 'user@gmail.com',
                otp_code: 467365,
            },1);

            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual('user not found');
            expect(res.status).toEqual(404);
        });

   })

   describe('resetPassword test', () => { 

        test('should isSuccess is true', async () => {
            let res = await userUC.resetPassword({
                    newPassword: '12345678',
                    confirmNewPassword: '12345678',
                    otp_code : 467365,
                },1);

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200)
        });

        test('should isSuccess is false and reason is "confrim new password not match"', async () => {
            userUC = new UserUseCase(mockUserRepo(userValues), mockOtpRepo(otpValues), bcrypt, cloudinary);
            
            let res = await userUC.resetPassword({
                newPassword: '12345678',
                confirmNewPassword: '123456789',
                otp_code : 467365,
            },1);

            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual('confrim new password not match');
            expect(res.statusCode).toEqual(400);
        });

        test('should isSuccess is false and reason is "user not found"', async () => {
           userValues.returnGetUserByEmail = null
           userUC = new UserUseCase(mockUserRepo(userValues), mockOtpRepo(otpValues), bcrypt, cloudinary);
           
             let res = await userUC.resetPassword({
                newPassword: '12345678',
                confirmNewPassword: '12345678',
                otp_code : 467365,
            },1);


            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual('user not found');
            expect(res.statusCode).toEqual(400)
        });

   })


});