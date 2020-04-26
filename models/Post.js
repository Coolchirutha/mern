const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//  Creating the Schema
const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		},
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			test: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
            },
            date: {
                type: Date,
                default: Date.now,
            }
		},
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Post = mongoose.model('post', PostSchema);
