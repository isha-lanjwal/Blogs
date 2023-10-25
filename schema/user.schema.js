import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import serverConfig  from "../constants/serverConfig.js";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    password: { type: String, required: true},
    contact_number: {
        type: Number, unique: true
    },
    
}, { strict: false, timestamps: { createdAt: 'created_at' } });
userSchema.methods.generateUserId = function () {
    return new Promise(async (resolve, reject) => {
        this.user_id = new Date().getTime() + Math.floor(100000 + Math.random() * 900000);
        return resolve(true);
    })
};

userSchema.methods.setPassword = function () {
    return new Promise(async (resolve, reject) => {
        const salt = await bcrypt.genSalt(serverConfig.saltRounds);
        // Bcrypt is a valuable tool to use to hash and store passwords. 
        this.password = await bcrypt.hash(this.password, salt);
        return resolve(true);
    })
};

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;