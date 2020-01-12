const mongoose = require('mongoose'),
  path = require('path'),
  fs = require('fs'),
  models = path.join(__dirname, '../models');

mongoose.set('useFindAndModify', false);
// const mongooseConnection = async () => {
//   await mongoose.connect(`mongodb://admin:WVm6fwYgsLyvOvHl@main-cluster-shard-00-00-hpysy.mongodb.net:27017,main-cluster-shard-00-01-hpysy.mongodb.net:27017,main-cluster-shard-00-02-hpysy.mongodb.net:27017/test?ssl=true&replicaSet=main-cluster-shard-0&authSource=admin&retryWrites=true&w=majority`, {
//       useNewUrlParser: true,
//       autoReconnect: true,
//       reconnectTries: 2,
//       reconnectInterval: 3000
//     },
//   );
// };
const mongooseConnection = async () => {
  await mongoose.connect(`mongodb+srv://admin:WVm6fwYgsLyvOvHl@main-cluster-hpysy.mongodb.net/test?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: 2,
      reconnectInterval: 3000
    },
  );
};

//async file importer
fs.readdir(models, (err, files) => {
  if (err) {
    console.log('ERROR!!');
    console.log(err);
  } else {
    files.forEach(function(file) {
      // console.log('From Mongoose.js --> Model Loaded: ' + file)
    //     console.log(files)
    //   console.log(file.indexOf(file));
    //   console.log(file);
    //   console.log(file.length);
      if (file.indexOf('.js') >= 0) {
        require(models + '/' + file);
      }
    });
  }
});
module.exports = {
  mongooseConnection: mongooseConnection
};
