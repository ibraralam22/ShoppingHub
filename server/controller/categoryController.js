const { response } = require('express');
const categoryDetails = require('../models/categorySchema');
const loggedData = require('../middleware/auth');

class Category {
  createCategory = async (req, res) => {
    try {
      const userId = req.loggedData.id;

      const { category_name } = req.body;

      if (!category_name) {
        throw {
          message: 'Please enter a Category name',
        };
      }

      const response = await categoryDetails.create({
        userId,
        category_name,
      });
      res.send({
        status: true,
        response: response,
        message: 'Successfully Created Category',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  getCategories = async (req, res) => {
    try {
      const response = await categoryDetails
        .find({ isDeleted: false })
        .populate();
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Categories',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  updateCategory = async (req, res) => {
    try {
      const userId = req.loggedData.id;
      const categoryId = req.body.id;
      const category_name = req.body.category_name;

      // Find the task by task ID and user ID
      const categoryToUpdate = await categoryDetails.findOneAndUpdate({
        categoryId: categoryId,
        userId: userId,
      });

      // Update the task details
      categoryToUpdate.category_name = category_name;

      const updatedCategory = await categoryToUpdate.save();
      res.send({
        status: true,
        response: updatedCategory,
        message: 'Successfully Updated the Category',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  softDeleteCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const response = await categoryDetails.updateOne(
        { _id: id },
        { $set: { isDeleted: true } }
      );
      res.send({
        status: true,
        response: response,
        message: 'Successfully Deleted the Category',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new Category();
