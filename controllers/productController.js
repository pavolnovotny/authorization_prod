const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')

const createProduct = async (req,res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)

  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req,res) => {
  const products = await Product.find({})

  res.status(StatusCodes.CREATED).json({ products, count: products.length })
}

const getSingleProduct = async (req,res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId }).populate('reviews')

  if (!product) throw new CustomError.NotFoundError('No found prod with id')

  res.status(StatusCodes.CREATED).json({ product })
}

const updateProduct = async (req,res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true
  })

  if (!product) throw new CustomError.NotFoundError('No found prod with id')

  res.status(StatusCodes.CREATED).json({ product })
}

const deleteProduct = async (req,res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })

  if (!product) throw new CustomError.NotFoundError('No found prod with id')

  await product.remove()

  res.status(StatusCodes.OK).json({ product })
}

const uploadImage = async (req,res) => {
  const maxSize = 1024 * 1024
  console.log(req.files)
  if (!req.files) throw new CustomError.BadRequestError('No image')

  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload image')
  }

  if (maxSize < productImage.size) {
    throw new CustomError.BadRequestError('Please upload smaller image')
  }

  const pathImage = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)

  await productImage.mv(pathImage)

  res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`})
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct
}
