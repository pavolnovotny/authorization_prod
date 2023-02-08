const express = require('express')
const router = express.Router()
const {getAllOrders, getSingleOrder, updateOrder, deleteOrder, createOrder, getCurrentUserOrders } = require('../controllers/orderController')
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')
const { getSingleProductReviews } = require('../controllers/reviewController')
const {uploadImage} = require("../controllers/productController");

router.route('/')
  .get(authenticateUser,authorizePermissions('admin', 'owner'), getAllOrders)
  .post(authenticateUser, createOrder)

router.route('/showAllMyOrders')
  .post(authenticateUser, getCurrentUserOrders)

router.route('/:id')
  .get(getSingleOrder)
  .patch(authenticateUser, updateOrder)
  .delete(authenticateUser, deleteOrder)

module.exports = router
