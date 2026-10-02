const User = require("../models/User");

// Check whether logged-in user is an Admin
const checkAdmin = (req, res) => {
    if (!req.user || req.user.role !== "Admin") {
        res.status(403).json({
            success: false,
            message: "Admin access required"
        });

        return false;
    }

    return true;
};


// Get all users
const getUsers = async (req, res, next) => {
    try {
        if (!checkAdmin(req, res)) return;

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        const formattedUsers = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status || "Active",
            joined: user.createdAt
        }));

        res.status(200).json({
            success: true,
            users: formattedUsers
        });

    } catch (error) {
        next(error);
    }
};


// Change user role
const changeUserRole = async (req, res, next) => {
    try {
        if (!checkAdmin(req, res)) return;

        const { role } = req.body;
        const userId = req.params.id;

        const allowedRoles = [
            "HR Manager",
            "Recruiter",
            "Admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Prevent admin from changing their own role
        if (userId === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || "Active",
                joined: user.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};


// Activate / deactivate user
const changeUserStatus = async (req, res, next) => {
    try {
        if (!checkAdmin(req, res)) return;

        const { status } = req.body;
        const userId = req.params.id;

        if (!["Active", "Inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        // Prevent admin from deactivating themselves
        if (
            userId === req.user.id.toString() &&
            status === "Inactive"
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = status;

        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${status.toLowerCase()} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                joined: user.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        if (!checkAdmin(req, res)) return;

        const userId = req.params.id;

        // Prevent admin from deleting their own account
        if (userId === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    changeUserRole,
    changeUserStatus,
    deleteUser
};