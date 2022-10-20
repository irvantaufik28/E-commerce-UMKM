class UserUC {
  constructor(UserRepository, OtpRepository, bcrypt, cloudinary) {
    this.UserRepository = UserRepository;
    this.OtpRepository = OtpRepository;
    this.bcrypt = bcrypt;
    this.cloudinary = cloudinary;
  }

  async getUserExist(username, email) {
    return await this.UserRepository.getUserExist(username, email);
  }

  async getUserByID(id) {
    let result = {
      isSuccess: false,
      reason: null,
      statusCode: 404,
      data: null,
    };

    const user = await this.UserRepository.getUserByID(id);

    if (user === null) {
      result.reason = "user not found";
      return result;
    }

    result.isSuccess = true;
    result.data = user;
    result.statusCode = 200;

    return result;
  }

  async updateUserProfile(userData, id) {
    let result = {
      isSuccess: false,
      reason: "success",
      statusCode: 404,
      data: null,
    };
    let user = await this.UserRepository.getUserByID(id);
    if (user == null) {
      result.reason = "user not found";
      return result;
    }
    user = await this.UserRepository.updateUser(userData, id);
    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async updatePassword(user, id) {
    let result = {
      isSuccess: false,
      reason: "success",
      statusCode: 404,
      data: null,
    };

    if (user.newPassword !== user.confirmNewPassword) {
      result.reason = "password not match";
      result.statusCode = 400;
      return result;
    }

    let userById = await this.UserRepository.getUserByID(id);

    if (userById === null) {
      result.reason = "user not found";
      return result;
    }
    if (this.bcrypt.compareSync(user.newPassword, userById.password) == true) {
      result.reason = "old password and new password can't be the same";
      return result;
    }
    if (!this.bcrypt.compareSync(user.oldPassword, userById.password)) {
      result.reason = "old password not match";
      return result;
    }
    user.password = user.newPassword;
    user.password = this.bcrypt.hashSync(user.password, 10);

    await this.UserRepository.updateUser(user, id);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async resetPassword(userData, email) {
    let result = {
      isSuccess: false,
      reason: null,
      statusCode: 400,
      data: null,
    };
    if (userData.newPassword !== userData.confirmNewPassword) {
      result.reason = "password not match";
      return result;
    }
    let user = await this.UserRepository.getUserByEmail(email);
    if (user === null) {
      result.reason = "user not found";
      return result;
    }
    let otp = await this.OtpRepository.getOTP(
      email,
      userData.Otp_code,
      "RESETPASSWORD"
    );
    if (otp === null) {
      result.reason = "invalid otp code";
      return result;
    }
    userData.password = userData.newPassword;
    userData.password = this.bcrypt.hashSync(userData.password, 10);
    await this.UserRepository.updateUser(userData, user.id);
    await this.OtpRepository.deleteAllOtp(email);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async updateUserImage(userData, id) {
    let result = {
      isSuccess: false,
      reason: null,
      statusCode: 404,
      data: null,
    };

    let userBody = userData;

    let user = await this.UserRepository.getUserByID(id);

    if (user === null) {
      result.reason = "user not found";
      return result;
    }

    userBody.image = await this.cloudinary.uploadCloudinaryAvatar(
      userBody.image
    );

    await this.UserRepository.updateUser(userBody, id);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }
}

module.exports = UserUC;
