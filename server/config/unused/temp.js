//Seeds file to clean the DB and seed the database
const mongoose = require('mongoose');
const Campground = require('../../models/CampSchema');
const Comment = require('../../models/CommentSchema');

let data = [
  {
    name: "Cloud's Rest",
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Canyon Floor',
    image:
      'https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  }
];

function seedDB() {
  let resultObj = [];
  let genericComment = {
    text: 'This place is great, but I wish there was internet',
    author: 'Homer'
  };
  helperPush = (resultObj = resultObj, arg) => {
    console.log(arg);
    resultObj.push(arg);
  };
  pushComment = async (...args) => {
    camp = args[0];
    commentData = args[1];
    try {
      const tempCampObj = await camp.comments.push(commentData);
      const completedCampObj = await camp.save();
      return completedCampObj;
    } catch (e) {
      console.log(e);
      console.error('Error in operation, check your data: ', e.message);
    }
  };
  wipeDB = async () => {
    try {
      const removeCampground = await Campground.deleteMany({});
      const removeComment = await Comment.deleteMany({});
      return [removeCampground, removeComment];
    } catch (e) {
      console.log(e);
      console.error('Error in operation, check your data: ', e.message);
    }
  };

  reSeedOperation = async () => {
    let writeOperations = [];
    for (let seed of data) {
      try {
        const camp = await Campground.create(seed);
        const commentData = await Comment.create(genericComment);
        pushComment(camp, commentData).then(campObj => {
          writeOperations.push(campObj);
          console.log('working...');
        });
      } catch (e) {
        console.log(e);
        console.error('Error in operation, check your data: ', e.message);
      }
    }
    return writeOperations;
  };

  wipeDB()
    .then(tempArr => {
      resultObj.push(tempArr)
    })
    .catch(err => {
      console.error(err);
    });
  reSeedOperation()
    .then(arg => {
      resultObj.push(arg)
      console.log(resultObj);
      console.log('Reseeding completed');
    })
    .catch(err => {
      console.error(err);
    });

  //   dbProcess()
  //     .then(result => {
  //       console.log(result);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
}

module.exports = seedDB;
