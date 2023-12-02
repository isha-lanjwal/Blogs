import { BlogModel } from "../schema/index.js";
class BlogService {
    static addBlog(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.title || !data.description || !data.content || !data.user_id) {
                    resolve({
                        message: `Insufficient Parameters`,
                        messageCode: 402,
                        success: false
                    });
                }
                let blogData = await BlogModel.findOne({ title: data.title }).exec()
                if (blogData) {
                    resolve({
                        messageCode: 409,
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
            const userLookup = { $lookup: { from: "users", localField: 'user_id', foreignField: 'user_id', as: 'user' } }
            // from: another collection name, localField: field to match from current table, foreignField: field to match from another table
            // whenever we have to to lookup using _id, we have to conver that into string, then only it will match
            // projectToLookupBlogID : project _id as string for lookup with rating table to match blog_id from rating table and _id from blog table
            const projectToLookupBlogID =   {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    title: 1,
                    description: 1,
                    content: 1,
                    user: 1
                }
            }
            let blog = await BlogModel.aggregate([{ $match: matchConditions }, userLookup,projectToLookupBlogID, 
            { $lookup: { from: "blogratings", localField: '_id', foreignField: 'blog_id', as: 'ratings' } }, //lookup blog table with rating table
            {
                $addFields: {
                    averageRating: { $avg: "$ratings.rating" }  // Calculate average rating
                }
            },
            {
                $project: {
                    ratings: 0  // Exclude the blogRatings field from the final output
                }
            }])
                .skip((pageSize * pageNo) - pageSize)
                .limit(pageSize)
                .exec();
            let count = await BlogModel.countDocuments().lean().exec()
            if (blog.length > 0) {
                resolve({ content: blog, messageCode: 200, count: count, message: "OK", sucess: true });
            } else {
                resolve({ message: "Dara not found", messageCode: 200, sucess: false });
            }
        })
    }

    static deleteBlog(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.id) {
                    resolve({
                        message: `Insufficient Parameters`,
                        messageCode: 402,
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
            } catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }

        })
    }

    static editBlog(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data._id) {
                    resolve({
                        message: `Insufficient Parameters`,
                        messageCode: 402,
                        success: false
                    });
                } else {
                    let userBlog = await BlogModel.findOne({
                        _id: data._id, user_id: data.user_id
                    }).exec();
                    if (userBlog) {
                        let blogData = await BlogModel.findOne({ title: data.title }).exec()
                        if (blogData) {
                            resolve({
                                messageCode: 409,
                                message: "Blog with the same title already exist.",
                                success: false
                            })
                        } else {
                            await BlogModel.findOneAndUpdate({
                                _id: data._id, user_id: data.user_id
                            }, { $set: data }).exec();
                            resolve({
                                messageCode: 200,
                                content: 'Blog Updated!!',
                                success: true
                            })
                        }
                    } else {
                        resolve({ success: false, messageCode: 200, message: 'Blog not found or not authorized to delete' })
                    }
                }
            } catch (error) {
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