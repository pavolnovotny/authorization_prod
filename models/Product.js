const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxLength: [100, 'Name can not be longer than 100 characters']
  },
  price: {
    type: Number,
    default: 0,
    required: [true, 'Please provide price of product'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please provide desc of product'],
    maxLength: [1000, 'Description can not be longer than 1000 characters']
  },
  image: {
    type: String,
    default: '/uploads/example.jpeg'
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['office', 'kitchen', 'bedroom']
  },
  company: {
    type: String,
    required: [true, 'Please provide company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported'
    }
  },
  colors: {
    type: [String],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  freeShopping: {
    type: Boolean,
    default: false
  },
  inventory: {
    type: Number,
    default: 15,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
})

ProductSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', ProductSchema)
