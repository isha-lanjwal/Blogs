import { BlogModel } from "../schema/index.js";
class BlogService {
    static addBlog(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.title || !data.description || !data.content || !data.user_id) {
                    reject({
                        message: `Insufficient Parameters`,
                        messageCode: 200,
                        success: false
                    });
                }
                let blogData = await BlogModel.findOne({ title: data.title }).exec()
                if (blogData) {
                    resolve({
                        messageCode: 200,
                        message: "Blog with the same title already exist.",
                        success: false
                    })
                } else {
                    let blog = new BlogModel(data)
                    await blog.save();
                    resolve({
                        messageCode: 200,
                        message: "Blog Added Successfully",
                        success: true
                    })
                }
            } catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }

    static getAllBlogs(body) {
        return new Promise(async (resolve, reject) => {
            const {
                offset,
                limit
            } = body;
            const pageSize = Number(limit) || 10;
            const pageNo = Number(offset) || 1;
            const matchConditions = {
                $and: [
                    body.user_id ? { user_id: body.user_id } : {},
                ]
            };
            let blog = await BlogModel.aggregate([{ $match: matchConditions }, { $lookup: { from: "users", localField: 'user_id', foreignField: 'user_id', as: 'user' } }])
                .skip((pageSize * pageNo) - pageSize)
                .limit(pageSize)
                .exec();
            if (blog.length > 0) {
                resolve({ content: blog, messageCode: 200, message: "OK", sucess: true });
            } else {
                resolve({ message: "Dara not found", messageCode: 200, sucess: false });
            }
        })
    }

    static deleteBlog(data) {
        return new Promise(async (resolve, reject) => {
            try{
                if (!data.id) {
                    reject({
                        message: `Insufficient Parameters`,
                        messageCode: 200,
                        success: false
                    });
                } else {
                    let result = await BlogModel.findOneAndDelete({ _id: data.id, user_id: data.user_id }).lean().exec()
                    if (result) {
                        resolve({ success: true, messageCode: 200, message: 'Blog deleted successfully' })
                    } else {
                        resolve({ success: false, messageCode: 200, message: 'Blog not found or not authorized to delete' })
                    }
                }
            }catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
            
        })
    }
}

export default BlogService