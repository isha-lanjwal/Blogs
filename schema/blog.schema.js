import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true},    
    user_id: { type: String,required: true }
}, { strict: false, timestamps: { createdAt: 'created_at' } });

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default BlogModel;