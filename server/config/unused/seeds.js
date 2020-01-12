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
      'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  }
];

function seedDB() {
  let genericComment = {
    text: 'This place is great, but I wish there was internet',
    author: 'Homer'
  };
  //turn async
  pushComment = async (...args) => {
    camp = args[0];
    commentData = args[1];
    try {
      const tempCampObj = await camp.comments.push(commentData);
      const completedCampObj = await camp.save()
      return completedCampObj
    } catch (e) {
      console.log(e);
      console.error('Error in operation, check your data: ', e.message);
    }
  };
  dbProcess = async () => {
    let writeOperations = [];
    const removeCampground = await Campground.deleteMany({});
    const removeComment = await Comment.deleteMany({});
    for (let seed of data) {
      try {
        const camp = await Campground.create(seed);
        const commentData = await Comment.create(genericComment);
        pushComment(camp, commentData).then(campObj => {
          writeOperations.push(campObj);
        });
      } catch (e) {
        console.log(e);
        console.error('Error in operation, check your data: ', e.message);
      }
    }
    let obj = {
      removeCampground: removeCampground,
      removeComment: removeComment,
      writeOperations: writeOperations
    };
    return obj;
  };

  dbProcess()
    .then(result => {
      console.log(result);
      console.log("Seeding Completed")
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = seedDB;
