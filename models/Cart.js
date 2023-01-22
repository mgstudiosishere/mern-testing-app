const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    name: {
      type: String,
      required: true,
    },
    imgCollection: {
      type: Array,
      required: true,
    },
    producttype: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    quantity : {
        type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
