const mongoose = require('mongoose');


// User Schema
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'please enter your name'],
      min:3,
      max: 20,
      unique: true
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        min:6,
    },
    isAvaterImageSet: {
        type: Boolean,
        default: false 
    },
    avaterImage: {
        type: String,
        default: ""
    },
  },{
      timestamps: true
  });


  module.exports =  mongoose.model('USER', UserSchema);