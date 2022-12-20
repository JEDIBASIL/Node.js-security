import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "add a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "add an email address"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },

    firstname: {
        type: String,
    },

    lastname: {
        type: String,
    },

    phonenumber: {
        type: String,
    },

    password: {
        type: String,
        select: false,
        required: [true, 'Please add a password'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: false,
        select: false,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



userSchema.methods.isMatchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createJwtSignToken = async function () {
    return jwt.sign(this.email, process.env.ACCESS_TOKEN_SECRET)
}

const User = mongoose.model("user", userSchema)

export default User