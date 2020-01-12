const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Comment       = require("./CommentSchema")

/* Define Model (Blueprint) same as mongoose.schema*/
const CampgroundSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Campground must be at least two characters'],
      minlength: [2, 'Campground must be at least two characters'],
      maxlength: [64, 'Please keep Campground item under 64 characters.']
    },
    price: {
      type: String,
      default: '125',
    },
    description: {
      type: String,
      required: [true, 'description must be at least two characters'],
      minlength: [2, 'description must be at least two characters']
      // maxlength: [400, 'Please keep the description item under 400 characters.']
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId, //storing user ID
        ref: 'User' //what we're using to refer
      },
      username: String
    },
    image: {
      type: String
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
);

CampgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});


/* Export MODEL -> collection name with schema*/
module.exports = mongoose.model('Campground', CampgroundSchema);
