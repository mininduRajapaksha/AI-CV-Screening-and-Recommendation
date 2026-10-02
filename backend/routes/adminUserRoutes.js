const express = require("express");

const {
    getUsers,
    changeUserRole,
    changeUserStatus,
    deleteUser
} = require("../controllers/adminUserController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, getUsers);

router.patch(
    "/users/:id/role",
    protect,
    changeUserRole
);

router.patch(
    "/users/:id/status",
    protect,
    changeUserStatus
);

router.delete(
    "/users/:id",
    protect,
    deleteUser
);

module.exports = router;