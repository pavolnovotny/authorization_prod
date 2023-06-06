require('dotenv').config();
require('express-async-errors')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
//fdfdfdfsdfs
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
app.set('trust proxy', 1)
const rateLimiter = require('express-rate-limit')
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


app.get('/', (req,res) => {
  console.log(req.cookies)
  res.send('Api')
})

const connectDB = require('./db/connect')

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('DB is connected')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start()
