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
      min: 0,
      max: 3
    },
    owner: {
      type: Schema.Types.ObjectId,
      //to save the id of the user who creates the camel
      required: true,
      ref: 'User'
      //ref is the string of a model that the ID refers to
      //ref is needed to use 'populate()'
    }
  },
  {
    timestamps: true
  }
);

const CamelModel = mongoose.model('Camel', myCamelSchema);

module.exports = CamelModel;
