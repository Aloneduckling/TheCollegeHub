const express = require("express");
const multer = require("multer");

const postRouter = express.Router();
const upload = multer({ dest: "uploads/" });

const validateAuthToken = require("../middlewares/validateAuthToken");
const {
	fetchPost,
	likePost,
	dislikePost,
	editPost,
	deletePost,
	createPost,
	fetchPostByGroup,
	fetchPostByUser,
} = require("../controllers/postControllers");
const { post } = require("..");

// create
postRouter.post("/new", validateAuthToken, upload.single("image"), createPost);

// fetch
postRouter.get("/:id", validateAuthToken, fetchPost);

//get by group
postRouter.get("/group/:groupName", validateAuthToken, fetchPostByGroup);

//get by user
postRouter.get("/user/:username", validateAuthToken, fetchPostByUser);

// like/dislike
postRouter.post("/:id/like", validateAuthToken, likePost);
postRouter.post("/:id/dislike", validateAuthToken, dislikePost);

// edit
postRouter.get("/:id/edit", validateAuthToken, fetchPost);

postRouter.put("/:id/edit", validateAuthToken, editPost);

// delete
postRouter.delete("/:id", validateAuthToken, deletePost);

module.exports = postRouter;
