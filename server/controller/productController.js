const { response } = require('express');
const productDetails = require('../models/productSchema');
const CloudinaryService = require('../cloudinary/cloudinary');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const loggedData = require('../middleware/auth');

class Task {
  createProduct = async (req, res) => {
    try {
      const userId = req.loggedData.id;

      const { product_name, product_description, price } = req.body;

      if (!product_name) {
        throw {
          message: 'Please enter a Product name',
        };
      }
      if (!product_description) {
        throw {
          message: 'Please enter a Product Description',
        };
      }
      if (!price) {
        throw {
          message: 'Please enter a Product Price',
        };
      }

      const files = req.files;
      const filePaths = files.map((file) => file.path);

      const cloudFile = await CloudinaryService.uploadImage(files[0]);
      await unlinkFile(files[0].path);
      const response = await productDetails.create({
        userId,
        product_name,
        product_description,
        price,
        imageUrl: cloudFile.secure_url,
        categoryId,
      });
      res.send({
        status: true,
        response: response,
        message: 'Successfully Created Product',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  getTasks = async (req, res) => {
    try {
      const response = await productDetails
        .find({ isDeleted: false })
        .populate('userId');
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Tasks',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  getUserTasks = async (req, res) => {
    try {
      const userId = req.loggedData.id;
      const response = await productDetails
        .find({ userId: userId, isDeleted: false })
        .populate('userId');
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Tasks',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  updateTask = async (req, res) => {
    try {
      const userId = req.loggedData.id;
      const taskId = req.body.id;
      const taskTitle = req.body.taskTitle;
      const taskCategory = req.body.taskCategory;
      const taskDescription = req.body.taskDescription;

      // Find the task by task ID and user ID
      const taskToUpdate = await productDetails.findOneAndUpdate({
        taskId: taskId,
        userId: userId,
      });

      // Update the task details
      taskToUpdate.taskTitle = taskTitle;
      taskToUpdate.taskCategory = taskCategory;
      taskToUpdate.taskDescription = taskDescription;

      const updatedTask = await taskToUpdate.save();
      res.send({
        status: true,
        response: updatedTask,
        message: 'Successfully updated the Task',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  deleteTask = async (req, res) => {
    try {
      const id = req.query.id;
      const response = await productDetails.deleteMany({ _id: id });
      res.send({
        status: true,
        response: response,
        message: 'Successfully deleted the Product',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  softDeleteTask = async (req, res) => {
    try {
      const id = req.query.id;
      const response = await productDetails.updateOne(
        { _id: id },
        { $set: { isDeleted: true } }
      );
      res.send({
        status: true,
        response: response,
        message: 'Successfully soft-deleted the Product',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new Task();
