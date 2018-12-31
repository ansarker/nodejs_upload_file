// image preview
function previewPhoto() {
  var photo = $("#photo")[0];
  var file = $("#file")[0].files[0];

  var reader = new FileReader();

  reader.onloadend = function() {
    photo.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    photo.src = "";
  }
}

previewPhoto();

// multer upload
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

// dropbox upload
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
      alert('File uploaded to dropbox');
    }
  });
  return false;
});