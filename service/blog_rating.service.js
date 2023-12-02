import { BlogRatingModel, BlogModel } from "../schema/index.js";
class BlogRatingService {
    static addBlogRating(body) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!body || !body.user_id || !body.blog_id || !body.rating) {
                    resolve({
                        message: `Insufficient Parameters`,
                        messageCode: 402,
                        success: false
                    });
                } else {
                    const userBlog = await BlogModel.countDocuments({ user_id: body.user_id, _id: body.blog_id })
                    if (userBlog > 0) {
                        resolve({
                            message: "You are restricted to rate your own blogs",
                            messageCode: 200,
                            success: false
                        })
                    } else {
                        const count = await BlogRatingModel.countDocuments({ user_id: body.user_id, blog_id: body.blog_id })
                        if (count > 0) {
                            resolve({
                                message: "You have already provides ratings for this blog",
                                messageCode: 200,
                                success: false
                            })
                        } else {
                            let rating = new BlogRatingModel(body)
                            await rating.save()
                            resolve({
                                message: "Ratings added successfully",
                                messageCode: 200,
                                success: true
                            })
                        }
                    }

                }
            }
            catch (error) {
                console.log(error)
                reject({
                    messageCode: 500,
                    message: "Server Error.."
                });
            }
        });
    }

    static getAllRatings(body) {
        return new Promise(async (resolve, reject) => {
            const {
                offset,
                limit
            } = body;
            const pageSize = Number(limit) || 10;
            const pageNo = Number(offset) || 1;
            const matchConditions = {
                $and: [
                    body.blog_id ? { blog_id: body.blog_id } : {},
                ]
            };
            const userLookup = { $lookup: { from: "users", localField: 'user_id', foreignField: 'user_id', as: 'user' } }
            let rating = await BlogRatingModel.aggregate([{ $match: matchConditions },userLookup])
                .skip((pageSize * pageNo) - pageSize)
                .limit(pageSize)
                .exec();
            let count = await BlogRatingModel.countDocuments().lean().exec()
            if (rating.length > 0) {
                resolve({ content: rating, messageCode: 200,count:count,message: "OK", sucess: true });
            } else {
                resolve({ message: "Dara not found", messageCode: 200, sucess: false });
            }
        })
    }
}

export default BlogRatingService