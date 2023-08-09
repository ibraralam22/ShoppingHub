const { response } = require('express');
const productDetails = require('../models/productSchema');
const categoryDetails = require('../models/categorySchema');
const CloudinaryService = require('../cloudinary/cloudinary');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const loggedData = require('../middleware/auth');

class Product {
  createProduct = async (req, res) => {
    try {
      const userId = req.loggedData.id;

      const { product_name, product_description, price, categoryId } = req.body;

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
      if (!categoryId) {
        throw {
          message: 'Please enter a valid Category ID',
        };
      }

      const category = await categoryDetails.findById(categoryId); 
      
      if (!category) {
        throw {
          message: 'Not found Category ID',
        };
      }

      const files = req.files;
      if (!files || files.length === 0) {
        throw new Error('Please upload a Image');
      }

      const cloudFile = await CloudinaryService.uploadImage(files[0]);
      await unlinkFile(files[0].path);

      const response = await productDetails.create({
        userId,
        product_name,
        product_description,
        price,
        imageUrl: cloudFile.secure_url,
        categoryId: category._id,
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

  getProducts = async (req, res) => {
    try {
      const response = await productDetails
        .find({ isDeleted: false })
        .populate('categoryId');
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Products',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  // getUserProducts = async (req, res) => {
  //   try {
  //     const userId = req.loggedData.id;
  //     const response = await productDetails
  //       .find({ userId: userId, isDeleted: false })
  //       .populate('userId');
  //     res.send({
  //       status: true,
  //       response: response,
  //       message: 'Successfully get all Products',
  //     });
  //   } catch (error) {
  //     res.send({
  //       status: false,
  //       response: error.message,
  //     });
  //   }
  // };

  updateProduct = async (req, res) => {
    try {
      const userId = req.loggedData.id;
      const productId = req.body.id;
      const product_name = req.body.product_name;
      const product_description = req.body.product_description;
      const price = req.body.price;

      // Find the task by task ID and user ID
      const productToUpdate = await productDetails.findOneAndUpdate({
        productId: productId,
        userId: userId,
      });

      // Update the task details
      productToUpdate.product_name = product_name;
      productToUpdate.product_description = product_description;
      productToUpdate.price = price;

      const updatedProduct = await productToUpdate.save();
      res.send({
        status: true,
        response: updatedProduct,
        message: 'Successfully Updated the Product',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  softDeleteProduct = async (req, res) => {
    try {
      const id = req.query.id;
      const response = await productDetails.updateOne(
        { _id: id },
        { $set: { isDeleted: true } }
      );
      res.send({
        status: true,
        response: response,
        message: 'Successfully Deleted the Product',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new Product();
