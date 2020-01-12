const Campground        = require('../models/CampSchema')
const passport          = require('passport')
const LocalStrategy     = require('passport-local')
const User = require('../models/UserSchema')

// passport setup
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.campground_index = async (req, res) => {
  try {
    let camps;
    camps = await Campground.find({});
    return res.status(200).json(camps);
  } catch (err) {
    return res.status(404).json({
      error: err,
      message: 'Failed to find Campgrounds'
    });
  }
};
exports.campground_create = async (req, res) => {
  // console.log(req.body)
  try {
    let camp = await new Campground(req.body).save();
    res.status(200).json(camp);
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(409).send(new MyError('Duplicate key', [err.message]));
      // console.log(err)
    }
    res.status(403).json({
      error: err,
      message: 'Failed to create campground'
    });
  }
};
exports.campground_show = async (req, res) => {
  try {
    let camp = await Campground.findById(req.params.id);;
    res.status(200).json(camp);
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(409).send(new MyError('Duplicate key', [err.message]));
      // console.log(err)
    }
    res.status(404).json({
      error: err,
      message: 'Failed to find campground'
    });
  }
};


// exports.campground_list = async (req, res) => {
//   try {
//     let camps;
//     camps = await Campground.find({});
//       return res.status(200).json(camps)
//   } catch (err) {
//     return res.status(404).json({
//       error: err,
//       message: 'Failed to find todo Campgrounds'
//     })
//   }
// }

//   try{
//     let campgrounds;
//     campgrounds = await Campground.find({});
//     console.log('from Controller', campgrounds)
//     return res.status(200).json(campgrounds)
//   } catch (err) {
//     return res.status(404).json({
//       error: err,
//       message: 'Failed to find todo items'
//     })
//   };
// };
//   router.post('/campgrounds', (req, res) => {
//     console.log(req.body);
//     let name = req.body.name; // could move to dict directly
//     let image = req.body.image;
//     let tempCampgrounds = {
//       name: name,
//       image: image
//     };
//     campgrounds.push(tempCampgrounds);
//     res.redirect('/campgrounds');
//   });

//   router.get('/campgrounds/new', (req, res) => {
//     //get form data and add to database
//     res.render('camp_new');
//   });

// app.get('/todo', (req, res) => {
//   res.render('todo')
// })

// /* API Semi-restful setup */
// app.get('/api/todos', TodoController.all)
// app.post('/api/todos', TodoController.create)
// app.delete('/api/todos/:id', TodoController.delete)

// /* Catch all */
// app.all('*', (req, res) => {
//   res.sendFile(path.resolve('./client/public/views/page_404.html'))
// })

//implement: https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
//info: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
//separation of controller and service: https://riptutorial.com/node-js/example/32332/model-routes-controllers-services-code-structure
