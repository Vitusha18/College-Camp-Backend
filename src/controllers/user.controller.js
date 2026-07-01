import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// export const registerUser = async (req, res) => {
//     try {
//         const { name, email, password, phone, profileImage, bio, location } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill all required fields."
//             });
//         }

//         const existingUser = await User.findOne({
//             email: email.toLowerCase()
//         });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists."
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             id: uuidv4(),
//             name,
//             email: email.toLowerCase(),
//             password: hashedPassword,
//             phone,
//             profileImage,
//             bio,
//             location
//         });

//         const safeUser = await User.findOne({ id: user.id }).select("-password");

//         res.status(201).json({
//             success: true,
//             message: "Registration successful.",
//             user: safeUser
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
export const registerUser = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            password,
            role,
            collegeId,
            department,
            year,
            phone,
            profileImage,
            bio,
            location,
            skills,
            interests
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !collegeId
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            id: uuidv4(),
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "student",
            collegeId,
            department,
            year,
            phone,
            profileImage,
            bio,
            location,
            skills,
            interests
        });

        const safeUser = await User.findOne({
            id: user.id
        }).select("-password");

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: safeUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const safeUser = await User.findOne({ id: user.id }).select("-password");

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: safeUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const logoutUser = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logout successful."
    });

};


export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findOne({
            id: req.user.id
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findOne({ id }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const updates = req.body;

        delete updates.password;
        delete updates.email;
        delete updates.id;

        const updatedUser = await User.findOneAndUpdate(
            { id },
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const deletedUser = await User.findOneAndDelete({ id });

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};