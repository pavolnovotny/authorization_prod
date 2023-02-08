const express = require('express')
const router = express.Router()
const {getAllProducts, getSingleProduct, uploadImage, deleteProduct, createProduct, updateProduct } = require('../controllers/productController')
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')
const { getSingleProductReviews } = require('../controllers/reviewController')

router.route('/')
  .get(getAllProducts)
  .post(authenticateUser,authorizePermissions('admin', 'owner'), createProduct)

router.route('/uploadImage')
  .post(authenticateUser,authorizePermissions('admin', 'owner'), uploadImage)


router.route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser,authorizePermissions('admin', 'owner'), updateProduct)
  .delete(authenticateUser,authorizePermissions('admin', 'owner'), deleteProduct)

router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router
