const User = require("../models/User");
const bcrypt = require("bcryptjs");


// get current user profile

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || "Active",
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};


// update current user profile

const updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.name = name.trim();

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || "Active",
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};


// update current user password

const updatePassword = async (req, res, next) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required"
            });
        }


        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Your new password must have at least 6 characters"
            });
        }


        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Check current password

        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatches) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect"
            });
        }


        // Prevent using the same password

        const samePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );


        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from your current password"
            });
        }


        // Hash new password

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        user.password =
            hashedPassword;

        await user.save();


        res.status(200).json({
            success: true,
            message:
                "Password updated successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getProfile,
    updateProfile,
    updatePassword
};