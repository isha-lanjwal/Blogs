import mongoose from 'mongoose';

const blogRatingSchema = new mongoose.Schema({
    blog_id: { type: String, required: true, trim: true },
    rating_description: { type: String},
    rating: {type:Number,required : true},
    user_id:{ type: String, required: true, trim: true },
}, { strict: false, timestamps: { createdAt: 'created_at' } });

const BlogRatingModel = mongoose.models.BlogRating || mongoose.model('BlogRating', blogRatingSchema);
export default BlogRatingModel;