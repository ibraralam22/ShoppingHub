const { response } = require('express');
const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const userDetails = require('../models/userSchema');
const bcrypt = require('bcrypt');

class Login {
  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { message: 'username is required' };
      }
      if (!password) {
        throw { message: 'password is required' };
      }

      const findCredentials = await userDetails.find({ email });
      if (findCredentials.length == 0) {
        throw { message: 'signUp is Required' };
      }

      if (bcrypt.compareSync(password, findCredentials[0].password)) {
        const userCookieData = {
          id: findCredentials[0]._id,
          name: findCredentials[0].name,
          age: findCredentials[0].age,
          gender: findCredentials[0].gender,
          email: findCredentials[0].email,
          userRole: findCredentials[0].userRole,
        };

        const access_token = jwt.sign(userCookieData, JWT_AUTH_TOKEN, {
          expiresIn: '1d',
        });
        const login_token = jwt.sign(userCookieData, JWT_REFRESH_TOKEN, {
          expiresIn: '30d',
        });
        return res
          .status(202)
          .header('access_token', access_token)
          .send({
            message: 'LogIn Successfully',
            error: false,
            data: {
              id: findCredentials[0]._id,
              name: findCredentials[0].name,
              age: findCredentials[0].age,
              gender: findCredentials[0].gender,
              email: findCredentials[0].email,
              userRole: findCredentials[0].userRole,
              access_token: access_token,
              login_token: login_token,
            },
          });
      } else {
        throw { message: 'password is wrong!' };
      }
    } catch (error) {
      return res.status(400).send({ message: error.message, error: true });
    }
  };

  getUsers = async (req, res) => {
    try {
      const response = await userDetails.find({});
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Users',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  getUserOrder = async (req, res) => {
    try {
      const userId = req.query.userId;
      const response = await userDetails
        .find({ userId: userId })
        .populate('userId');
      res.send({
        status: true,
        response: response,
        message: 'Successfully get user all Orders',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new Login();
