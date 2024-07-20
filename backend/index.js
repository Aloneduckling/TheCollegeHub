const express = require("express");
require("dotenv").config();
const logger = require("./logger.util");
const cors = require("cors");
const apiLimiter = require("./middlewares/ratelimit");
//database connections
const db = require("./model/db");
try {
	db.sequelize.sync(/**/ { alter: true });
} catch (e) {
	console.log("DB error: ", e);
}

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const homeRouter = require("./routes/homePageRoutes");
const postRouter = require("./routes/postRouter");
const groupRouter = require("./routes/groupRouter");
const commentRouter = require("./routes/commentRouter");

const app = express();

//middleware calls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use(cors());
//routes

//auth routes
app.use("/api/v1", authRouter);

//profile routes
app.use("/api/v1", profileRouter);

//home page routes
app.use("/api/v1", homeRouter);

//post routes
app.use("/api/v1/post", postRouter);

//group routes
app.use("/api/v1/group", groupRouter);

//comment routes
app.use("/api/v1/comment", commentRouter);

//wildcard to handle route mismatches
app.all("*", (req, res) => {
	return res.status(404).json({ message: "Route Not found!" });
});

app.use((err, req, res, next) => {
	logger(err);
	return res.status(500).json({ message: "Internal server error!" });
});

module.exports = app;
