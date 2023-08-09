const { response } = require('express');
const cartItemDetails = require('../models/cartSchema');
const productDetails = require('../models/productSchema');
const cartDetails = require('../models/cartSchema');
const loggedData = require('../middleware/auth');

class OrderItem {
  createOrderItem = async (req, res) => {
    try {
      const userId = req.loggedData.id;

      const { productId, quantity, unit_price } = req.body;

      if (!productId) {
        throw {
          message: 'Please enter a Product ID',
        };
      }
      if (!quantity) {
        throw {
          message: 'Please enter OrderItem quantity',
        };
      }
      if (!unit_price) {
        throw {
          message: 'Please enter a Unit price',
        };
      }

      const product = await productDetails.findById(productId);

      if (!product) {
        throw {
          message: 'Not found Product ID',
        };
      }

      const response = await cartDetails.create({
        userId,
        productId: product._id,
        quantity,
        unit_price,
      });
      res.send({
        status: true,
        response: response,
        message: 'Successfully Created OrderItem',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  getCartItems = async (req, res) => {
    try {
      const response = await cartDetails
        .find({ isDeleted: false })
        .populate('userId')
        .populate('productId');
      res.send({
        status: true,
        response: response,
        message: 'Successfully get all Cart Items',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  updateCartItem = async (req, res) => {
    try {
      const userId = req.loggedData.id;
      const productId = req.body.id;
      const quantity = req.body.quantity;
      const unit_price = req.body.unit_price;

      // Find the Cart by product ID and user ID
      const cartToUpdate = await cartItemDetails.findOneAndUpdate({
        productId: productId,
        userId: userId,
      });

      // Update the Cart Item details
      cartToUpdate.quantity = quantity;
      cartToUpdate.unit_price = unit_price;

      const updatedCartItems = await cartToUpdate.save();
      res.send({
        status: true,
        response: updatedCartItems,
        message: 'Successfully Updated the Cart Items',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };

  softDeleteCartItem = async (req, res) => {
    try {
      const id = req.query.id;
      const response = await cartItemDetails.updateOne(
        { _id: id },
        { $set: { isDeleted: true } }
      );
      res.send({
        status: true,
        response: response,
        message: 'Successfully Deleted the Cart Item',
      });
    } catch (error) {
      res.send({
        status: false,
        response: error.message,
      });
    }
  };
}

module.exports = new OrderItem();
