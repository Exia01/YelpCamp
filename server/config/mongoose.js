const mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs"),
  models = path.join(__dirname, "../models");

// fix for updated version
mongoose.set("useFindAndModify", false);

//Connection export
const mongooseConnection = async () => {
  await mongoose.connect(
    `mongodb+srv://admin:WVm6fwYgsLyvOvHl@main-cluster-hpysy.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

//async file importer
fs.readdir(models, (err, files) => {
  if (err) {
    console.log("ERROR!!");
    console.log(err);
  } else {
    files.forEach(function(file) {
      // console.log('From Mongoose.js --> Model Loaded: ' + file)
      //     console.log(files)
      //   console.log(file.indexOf(file));
      //   console.log(file);
      //   console.log(file.length);
      if (file.indexOf(".js") >= 0) {
        require(models + "/" + file);
      }
    });
  }
});

module.exports = {
  mongooseConnection: mongooseConnection
};
