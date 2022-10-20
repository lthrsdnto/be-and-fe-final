import User from "../models/tables/User";
import CommonResponse from "../utils/response.util";
import dotenv, { DotenvConfigOutput } from "dotenv";
import AuthService from "./auth.service";
import { AddUserDTO } from "../models/dto/UserDTO";
const env_config: DotenvConfigOutput = dotenv.config();
const bcrypt = require("bcrypt");

class UserService extends CommonResponse {
  //get all users
  async users() {
    try {
      let exist = await User.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await User.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Users found.");
      } else {
        return this.RESPONSE(404, [], 0, "No user found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //login
  async login(dto: AddUserDTO["requestObject"]) {
    try {
      let exist = await User.findOne({
        where: { username: dto.username },
      });

      if (exist != null) {
        let passwordConfirm = await bcrypt.compare(
          dto.password,
          exist.password
        );
        if (passwordConfirm == true) {
          console.log(exist.password);
          let token = await AuthService.auth(exist.password);
          return this.RESPONSE(
            200,
            token.response,
            0,
            "Signed in successfully."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Incorrect username or password.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "User not found.");
      }
    } catch (err) {
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }

  //signup
  async signup(dto: AddUserDTO["requestObject"]) {
    try {
      if (dto != null) {
        let exist = await User.findOne({
          where: { username: dto.username },
        });

        if (exist != null) {
          return this.RESPONSE(400, {}, 0, "User already exists.");
        }
        if (dto.password == dto.confirmPassword) {
          let hashPassword = await bcrypt.hash(dto.password, 10);

          let response = await User.create({
            ...dto,
            username: dto.username,
            password: hashPassword,
          });

          if (response != null) {
            return this.RESPONSE(200, response, 0, "Signed up successfully.");
          } else {
            return this.RESPONSE(400, {}, 0, "You have to input something.");
          }
        } else {
          return this.RESPONSE(400, {}, 0, "Confirm password is incorrect.");
        }
      } else {
        return this.RESPONSE(400, {}, 0, "Bad request.");
      }
    } catch (err) {
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }

  //update
  async update(dto: AddUserDTO["requestObject"]) {
    try {
      if (dto != null) {
        let exist = await User.findOne({ where: { id: dto.id } });
        if (exist != null) {
          let hashPassword = await bcrypt.hash(dto.password, 10);

          let updateData = await User.update(
            { id: dto.id, username: dto.username, password: hashPassword },
            {
              where: {
                id: dto.id,
              },
            }
          );

          if (updateData != null) {
            return this.RESPONSE(
              202,
              updateData,
              0,
              "User successfully updated."
            );
          } else {
            return this.RESPONSE(400, {}, 0, "Failed to update user.");
          }
        } else {
          return this.RESPONSE(404, {}, 0, "Record not found.");
        }
      } else {
        return this.RESPONSE(400, {}, 0, "Bad request.");
      }
    } catch (err: any) {
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }

  //delete
  async delete(dto: AddUserDTO["requestObject"]) {
    try {
      let exist = await User.findOne({ where: { id: dto } });
      if (exist != null) {
        let removeData = await User.destroy({ where: { id: dto } });
        if (removeData != null) {
          return this.RESPONSE(200, {}, 0, "User successfully deleted.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete user.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Record not found.");
      }
    } catch (err: any) {
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }
}

export default new UserService();
