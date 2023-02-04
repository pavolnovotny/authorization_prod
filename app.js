require('dotenv').config();
require('express-async-errors')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
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
