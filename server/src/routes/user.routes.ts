import { Router } from "express";
import { loginUser, registerUser, searchUserByEmail, fuzzySearchUserByEmail, getUserPublicKey } from "../controllers/user.controller";
import { verifyJWT } from "../middleware/auth.middlerware";
import { upload } from "../middleware/multer.middleware";

const router  = Router();

router.route("/register").post(
    upload.single("avatar")
    ,registerUser);
router.route("/login").post(loginUser);
router.route("/search").get(verifyJWT, searchUserByEmail);
router.route("/fuzzy-search").get(verifyJWT, fuzzySearchUserByEmail);
router.route("/public-key/:userId").get(verifyJWT, getUserPublicKey);

export default router;