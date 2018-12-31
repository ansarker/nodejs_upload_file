var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    caption: {
        type: String,
        default: 'Photo'
    },
    
    src: {
        type: String,
        required: 'You must select an image'
    }
});

var Photo = mongoose.model('Photo', PhotoSchema, 'photos');
module.exports = Photo;