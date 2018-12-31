# Upload File to Dropbox and Server

## Description:

### This program will show you how to upload file into local storage and dropbox using nodejs and jquery.

**Running the application**

To run this application you must install nodejs and mongodb in your computer.

**MongoDB running**

```
sudo service mongod start
```

**Server running**

```
npm i -g nodemon
nodemon app.js
```

Installing nodemon may need superuser permission, so add `sudo`.

After starting **mongodb** and running the **server** open your browser and goto http://localhost.com:3000 or http://127.0.0.1:3000. Then you will see this page as home page.

![Home Page](https://dl.dropbox.com/s/bc2xczgskh69ui6/index.png?dl=0)

## **Multer File Uploading:**

Insert a **caption** and select any **file (_here photo to show image thumbnails_)**, then click on the **Upload** button.

![Multer upload demo](https://dl.dropbox.com/s/e770sdfyijp6lbg/multer.jpg?dl=0)

## Codes

Here is the demonstration of uploading file using Nodejs, Multer, JQuery.

**HTML**

In `multer.ejs`

```html
<form class="form-control" enctype="multipart/form-data">
    <input type="text" class="input-form" name="caption" id="caption" placeholder="Photo caption" />
    <input type="file" class="input-form" name="file" onchange="previewPhoto()" id="file" />
    <button type="submit" class="upload-btn" id="upload-btn">Upload</button>
</form>
```

**Route**

In `core.routes.js`

```javascript
app.post("/upload", core.fileUploadMulter);
```

**Jquery**

In `script.js`

```javascript
$("#upload-btn").click(function() {
    var inputFile = $("#file")[0].files[0];
    var formData = new FormData();
    formData.append("file", inputFile, inputFile.name);
    formData.append("caption", $("#caption").val());
    
    $.ajax({
        type: "POST",
        url: "/upload",
        data: formData,
        processData: false,
        contentType: false,
        success: function() {
            alert("File uploaded!");
            location.reload();
        }
    });
    return false;
});
```

**Nodejs**

In `core.controller.js`

```javascript
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

module.exports.fileUploadMulter = function(req, res, next) {
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
                res.json(data);
            });
        }
    });
};
```

These lines of code below are storing the form input into `mongodb`

```javascript
var src = "/upload/" + req.file.filename;
var data = { caption: req.body.caption, src: src };
var photo = new Photo(data);
photo.save(function(err, data) {
    if (err) throw err;
    res.json(data);
});
```

**MongoDB Schema**

In models folder `Photo.js`
```javascript
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
```

## **Dropbox File Uploading:**

To upload file in dropbox, first you need to create an app console in Dropbox. Go to the link below and create a console app.

Link: https://www.dropbox.com/developers/apps

Generate the access token. After generating the **Access Token** copy it and paste it into **Access Token** then Select a **file** and click on the **Dropbox Upload** button. Then you will see a success message and check dropbox app folder. The file will be uploaded.

![Dropbox upload](https://dl.dropbox.com/s/7iamoixwkany7sn/drobox.png?dl=0)

**Check it in your dropbox folder**

## Code:

**Html**

In `dropbox.ejs`

```html
<form class="form-control" enctype="multipart/form-data">
    <input type="text" class="input-form" name="accesstoken" id="token" placeholder="Access Token" />
    <input type="file" class="input-form" name="file" onchange="previewPhoto()" id="file" />
    <button type="submit" class="upload-btn" id="dropbox-btn">Dropbox Upload</button>
</form>
```

**Route**

In `core.routes.js`

```javascript
app.post("/uploaddropbox", core.fileUploadDropbox);
```

**Jquery**

In `script.js`

```javascript
$("#dropbox-btn").click(function() {
    var ACCESS_TOKEN = $("#token").val();
    var inputFile = $("#file")[0].files[0];
    var formData = new FormData();
    formData.append("file", inputFile, inputFile.name);
    formData.append("token", ACCESS_TOKEN);
    
    $.ajax({
        method: "POST",
        url: "/uploaddropbox",
        data: formData,
        processData: false,
        contentType: false,
        success: function() {
            location.reload();
        }
    });
    return false;
});
```

**Nodejs**

In `core.controller.js`

```javascript

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
```