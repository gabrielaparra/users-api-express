const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myCamelSchema = new Schema(
  {
    name: {
      type: String, required: true
    },
    color: {
      type: String, required: true
    },
    humps: {
      type: Number,
      required: true,
      default: 2,
      min: 1,
      max: 3
    }
  },
  {
    timestamps: true
  }
);

const CamelModel = mongoose.model('Camel', myCamelSchema);

module.exports = CamelModel;
