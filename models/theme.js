var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThemeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
       type: Number,
       default: 0,
       required: true
    },
    author_name: {
        type: String,
        required: true
    },
    author_link: {
        type: String,
        required: false
    },
    created_on: {
        type: Date,
        required: true
    },
    tags: []
});


module.exports = mongoose.model('Theme', ThemeSchema);