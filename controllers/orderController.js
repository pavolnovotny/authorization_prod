const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const fakeStripAPI = async (amount, currency) => {
  const client_secret = 'randomValue'
  return { client_secret }
}

const createOrder = async (req,res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) throw new CustomError.BadRequestError('No cart items')

  if (!tax || !shippingFee) throw new CustomError.BadRequestError('No tax or shipping fee')

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) throw new CustomError.NotFoundError('Not found Product')

    const {name, price, image, _id} = dbProduct
    console.log(name, price, image, _id)

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id
    }
    orderItems = [...orderItems, singleOrderItem]

    subtotal += item.amount * price
  }
  const total = tax + shippingFee + subtotal
  const paymentIntent = await fakeStripAPI({
    amount: total, currency: 'usd'
  })

  const order = await Order.create({
    orderItems, total, subtotal, tax, shippingFee, clientSecret: paymentIntent.client_secret, user:req.user.userId
  })

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req,res) => {
  const orders = await Order.find({})

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getSingleOrder = async (req,res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })

  if (!order) throw new CustomError.NotFoundError('No found order with id')

  checkPermissions(req.user, order.user)

  res.status(StatusCodes.OK).json({ order })
}

const updateOrder = async (req,res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })

  if (!order) throw new CustomError.NotFoundError('No found order with id')

  checkPermissions(req.user, order.user)

  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.CREATED).json({ order })
}

const deleteOrder = async (req,res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })

  if (!order) throw new CustomError.NotFoundError('No found order with id')

  await order.remove()

  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req,res) => {
  const order = await Order.findOne({ user: req.user.userId })

  if (!order) throw new CustomError.NotFoundError('No found prod with id')

  res.status(StatusCodes.OK).json({ order })
}



module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getCurrentUserOrders
}
