const multer = require("multer");
const path = require("path");
const Photo = require("./../models/Photo.js");
const mongoose = require("mongoose");
const fs = require('fs');
const request = require('request');
const formidable = require('formidable');

mongoose.connect(
  "mongodb://localhost/fileupload",
  (err, db) => {
    var collection = db.collection("photos");
    collection.find({}).toArray((err, docs) => {
      // console.log(docs);
      // db.dropCollection("photos", (err, result) => {
      //     console.log('Database dropped!');
      //     db.close();
      // });
    });
  }
);

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/upload");
  },
  filename: function(req, file, callback) {
    var filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    callback(null, filename);
  }
});

module.exports.home = function(req, res) {
  Photo.find(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("./../public/views/index.ejs", { photos: data });
    }
  });
};

module.exports.multer = function(req, res) {
  Photo.find(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("./../public/views/multer.ejs", { photos: data });
    }
  });
};

module.exports.dropbox = function(req, res) {
  res.render("./../public/views/dropbox.ejs");
};

// multer upload
module.exports.fileUploadMulter = function(req, res, next) {
  // console.log(req.headers);
  var upload = multer({
    storage: storage
  }).single("file");

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    } else {
      var src = "/upload/" + req.file.filename;
      var data = { caption: req.body.caption, src: src };
      var photo = new Photo(data);

      photo.save(function(err, data) {
        if (err) throw err;
        else {
          res.redirect('/');
        }
        // res.status(200).send(data);
      });
    }
  });
};

module.exports.fileUploadDropbox = function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    if(err) {
      return res.status(400).json({
        error: "Error"
      });
    } else {
      var filename = "file-" + Date.now() + path.extname(file.file.name);
      var content = fs.readFileSync(file.file.path);
     
      options = {
        method: "POST",
              url: 'https://content.dropboxapi.com/2/files/upload',
              headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "Bearer " + fields.token,
                "Dropbox-API-Arg": "{\"path\": \"/dropbox/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
              },
              body:content
      }

      console.log(options);
      request(options, (err, res, body) => {
        console.log(err + "\n" + res + "\n" + body);
      });
    }
  });
};