const { response } = require('express');
const userDetails = require('../models/userSchema');
const bcrypt = require('bcrypt');

class Register {
  signUp = async (req, res) => {
    try {
      const { name, age, gender, email, password } = req.body;
      if (!name) {
        throw {
          message: 'Please enter a name',
        };
      }

      if (!age) {
        throw {
          message: 'Please select age',
        };
      }

      if (!gender) {
        throw {
          message: 'Please select gender',
        };
      }

      if (!email) {
        throw {
          message: 'Please enter a valid email address',
        };
      }

      const findUser = await userDetails.find({ email });

      if (findUser.length > 0) {
        throw { message: 'email is already exist' };
      }

      const passwordHash = bcrypt.hashSync(password, 8);

      const response = await userDetails.create({
        name,
        age,
        gender,
        email,
        password: passwordHash,
      });
      res.send({
        status: true,
        response: {
          name: response.name,
          age: response.age,
          gender: response.gender,
          email: response.email,
          id: response._id,
        },
        message: 'Successfully Register!!',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new Register();
