import User from "../Model/User";
import Notification from "../Model/Notifications";
import { emailVerificationMessage, forgotPasswordMail, sendMail } from "../Utils/mail";
import Response from "../Utils/response";
import { generateVerificationToken, verifyToken } from "../Utils/token";
import Token from "../Model/Token";

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = await req.body;
        const findEmail = await User.findOne({ email });
        const fidUsername = await User.findOne({ username });

        if (findEmail)
            return res.status(201).send({ status: "failed", message: "email taken" });

        if (fidUsername)
            return res.status(201).send({ status: "failed", message: "username taken" });

        const user = await User.create({ username, email, password });
        const token = await generateVerificationToken(email);
        const link = `http://localhost:3000/auth/verify/${token}`;

        if (user) {
            await Token.updateMany({ key: token }, { isUsed: true })
            await Token.create({ key: token });
            await sendMail(await emailVerificationMessage({ username, link, email }));
            return res.status(201)
                .send({ status: "success", message: "Account created" });
        }

    } catch (err) {
        console.log(err.message);
        return res
            .status(424)
            .send({ status: "failed", message: "Could not account user" });
    }
};

export const verify = async (req, res, next) => {
    try {
        const { token } = await req.body;
        if (!token) return res.status(200).send({ status: "failed", message: "no token" });

        const verifiedToken = await Token.findOne({ key: token, isUsed: false });
        if (!verifiedToken) return res.status(200).send({ status: "failed", message: "invalid token" });

        const email = await verifyToken(verifiedToken.key);
        const user = await User.findOne({ email, isUsed: false })

        if (user.verified) return res.status(200).send({ status: "failed", message: "already verified" });
        if (verifiedToken.isUsed) return res.status(200).send({ status: "failed", message: "token expired" });

        await user.update({ verified: true });
        await verifiedToken.update({ isUsed: true });

        return res.status(200).send({ status: "success", message: "verified" });

    } catch (err) {
        console.log(err)
        return res.status(200).send({ status: "failed", message: "verification failed" });
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = await req.body;
        const user = await User.findOne({ username }).select("+password");
        const isMatchPassword = await user.isMatchPassword(password);
        const isVerified = await user.verified;

        if (!isVerified) return res.status(200).send({ status: "failed", message: "user not verified" });

        if (!isMatchPassword) return res.status(200).send({ status: "failed", message: "password do not match" });

        const userId = user._id;
        const accessToken = await user.createJwtSignToken();
        const info = await User.findById(userId).select("-password");

        const options = {
            expires: new Date(
                Date.now() + 300 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
            SameSite: "Strict"
        };

        return res.status(200)
            .cookie('QaZtW', accessToken, options)
            .send({ status: "success", accessToken, message: "user authenticated" });
    } catch (err) {

        console.log(err.message);
        return res.status(200)
            .send({ status: "failed", message: "user not found" });
    }
};

export const info = async (req, res, next) => {
    try {
        const user = req.user;
        const userDetails = await User.findById({ _id: user })

        const data = {
            username: userDetails.username,
            email: userDetails.email
        }

        return res.status(200).send({ status: "success", data })
    } catch (err) {
        return res.status(200).send({ status: "failed", message: err.message })
    }
}

export const generateForgotPasswordLink = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) return res.status(404).send({ status: "failed", message: "email is required" })
        const isVerified = await User.findOne({ email })
        if (!isVerified) return res.status(404).send({ status: "failed", message: "email not available" })
        const generateToken = await generateVerificationToken(email)
        const link = `localhost:8080/auth/reset-password/${generateToken}`
        sendMail(forgotPasswordMail({ link, email }))
            .then(msg => {
                return res.status(200).send({ status: "success", message: "link sent" })
            }).catch(err => {
                console.log(err)
                return res.status(200).send({ status: "failed", message: err.message })
            })

    } catch (err) {
        return res.status(500).send({ status: "failed", message: err.message })
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { token, oldPassword, newPassword } = req.body

        if (!token) return res.status(406).send({ status: "failed", message: "token is required" })
        if (!oldPassword) return res.status(406).send({ status: "failed", message: "old password is required" })
        if (!newPassword) return res.status(406).send({ status: "failed", message: "new password is required" })

        const verifiedToken = await verifyToken(token)
        if (!verifiedToken) return res.status(200).send({ status: "failed", message: "invalid token" })
        const user = await User.findOne({ email: verifiedToken }).select("+password")
        const verifiedPassword = await user.isMatchPassword(oldPassword)
        if (!verifiedPassword) return res.status(200).send({ status: "failed", message: "invalid credentials" })

        user.password = newPassword;
        console.log("new password =>" + user.password)
        const saved = await user.save()
        if (!saved) return res.status(200).send({ status: "failed", message: "password not changed" })
        return res.status(200).send({ status: "success", message: "password changed" })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: "failed", message: "an error occurred" })
    }
}

export const updateInfo = async (req, res, next) => {
    try {
        const _id = req.user
        const { firstname, lastname, phonenumber } = req.body
        const user = await User.findById(_id)
        user.firstname = firstname;
        user.lastname = lastname;
        user.phonenumber = phonenumber;

        const updated = await user.save();
        if (!updated) return res.status(200).send({ status: "failed", message: "update terminated" })
        return res.status(200).send({ status: "success", message: "update successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: "failed", message: err.message })
    }

}




export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (users) {
            return res.status(200).send({
                status: "success",
                count: (await users).length,
                data: await users,
            });
        }
    } catch (err) {
        return res.status(200).send({ status: "failed", message: "could not get users" });
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            return res.status(200).send({ status: "success", data: user });
        }
        return res
            .status(200).send({ status: "failed", message: "user not found" });
    } catch (err) {
        return res.status(200).send({ status: "failed", message: "user not found" });
    }
};


export const getNotifications = async (req, res, next) => {
    try {
        const user = req.user;
        const data = await Notification.find(user);
        return res.status(200).send({ status: "success", data });
    } catch (err) {
        return res
            .status(400)
            .send({ status: "failed", message: "cannot get user notifications" });
    }
};

export const generate = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(200).send({ status: "failed", message: "can not generate token" });
        const token = await generateVerificationToken(email);
        const link = `http://localhost:3000/auth/verify/${token}`;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).send({ status: "failed", message: "email does not exist" });
        if (user.verified) return res.status(200).send({ status: "failed", message: "email already verified" });
        if (!user.verified) {
            await Token.updateMany({ key: token }, { isUsed: true })
            await Token.create({ key: token });
            await sendMail(await emailVerificationMessage({ username: user.username, link, email }));
            return res.status(200).send({ status: "success", message: "token generated" });
        }
    } catch (err) {
        console.log(err)
        return res.status(200).send({ status: "failed", message: "can not generate token" });
    }
};


