module.exports = function(app) {
  var core = require("./../controllers/core.controller");

  app.route("/").get(core.home);
  app.route("/multer").get(core.multer);
  app.route("/dropbox").get(core.dropbox);

  app.post("/upload", core.fileUploadMulter);
  app.post("/uploaddropbox", core.fileUploadDropbox);
};
