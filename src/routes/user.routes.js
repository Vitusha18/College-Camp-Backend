import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


router.get("/", getAllUsers);
router.get("/", getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;