import CommonResponse from "../utils/response.util";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

class AuthService extends CommonResponse {
  //authentication
  async auth(requestObject: any) {
    try {
      let authentication = jwt.sign(requestObject, process.env.SECRET_KEY);
      if (authentication != null) {
        return this.RESPONSE(
          200,
          { accesstoken: authentication },
          0,
          "Success!"
        );
      } else {
        return this.RESPONSE(400, {}, 0, "Bad request.");
      }
    } catch (err) {
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }

  //verification
  async verify(token: any) {
    try {
      if (token != null || token != undefined) {
        var getToken = token.split(" ")[1];

        if (getToken != null || getToken != undefined) {
          let verification = await jwt.verify(getToken, process.env.SECRET_KEY);
          if (verification != null) {
            return this.RESPONSE(
              200,
              verification,
              0,
              "Successfully verified token."
            );
          } else {
            return this.RESPONSE(400, {}, 0, "Bad Request.");
          }
        } else {
          return this.RESPONSE(404, {}, 0, "Token not found.");
        }
      } else {
        return this.RESPONSE(400, {}, 0, "Token is not valid.");
      }
    } catch (err) {
      console.log(err);
      return this.RESPONSE(500, err, 0, "Internal Server Error.");
    }
  }
}

export default new AuthService();
