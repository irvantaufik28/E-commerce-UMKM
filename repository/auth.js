const { User } = require("../models");

class AuthRepository {
  constructor() {
    this.UserModel = User;
  }

  async registerUser(userData) {
    return await this.UserModel.create(userData);
  }

  async loginUser(username) {
    return await this.UserModel.findOne({
      where: { username },
      
    });
  }
  async loginWithGoogle(email) {
    return await this.UserModel.findOne({
      where: { email },
      
    });
  }
  

}

module.exports = AuthRepository;
