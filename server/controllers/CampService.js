// let CR = require('../controllers/CampController')
const Campground = require('../models/CampSchema');
const Comment = require('../models/CommentSchema');
/* 
======================
Implement promise all or multiple error handling
https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await
====================== 
*/
class CampService {
  //index
  async camp_index() {
    const data = await Campground.find({});
    return data;
  }

  //new
  async camp_new(req, res, next) {
    let author = {
      id: req.user._id,
      username: req.user.username
    };
    let data = req.body;
    data.author = author;
    let camp = await new Campground(req.body).save();
    return camp;
  }

  //show
  async camp_show(req) {
    let camp;
    camp = await Campground.findById(req.params._id)
      .populate('comments')
      .exec();
    // console.log(camp)
    return camp;
  }

  //update
  async camp_update(req) {
    const data = req.body.campground;
    const camp = await Campground.findByIdAndUpdate(req.params._id, data);
    let savedCamp = await camp.save();
    return savedCamp;
  }

  //Delete
  async camp_delete(req) {
    const camp = await Campground.findOneAndRemove(req.params._id);
    return camp;
  }

  //Comments
  async comment_new(req) {
    let newComment = await Comment.create(req.body.comment);
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;
    const comment = await newComment.save();
    const camp = await Campground.findById(req.params._id);
    let savingOp = await camp.comments.push(comment); // returns length of array
    // console.log(savingOp)
    return await camp.save();
  }

  async comment_show(req) {
    // console.log(req.params)
    const [camp, comment] = await Promise.all([
      Campground.findById(req.params._id),
      Comment.findById(req.params.comment_id)
    ]);
    return [camp, comment];
  }

  async comment_update(req) {
    const data = req.body.comment;
    const camp = await Comment.findByIdAndUpdate(req.params.comment_id, data);
    let savedComment = await camp.save();
    return savedComment;
  }

  async comment_delete(req) {
    const camp = await Comment.findByIdAndRemove(req.params.comment_id);

    return camp;
  }
}

module.exports = new CampService();
