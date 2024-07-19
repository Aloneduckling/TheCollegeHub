const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
	windowMs: 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: "You have exceeded your 5 requests per minute limit.",
	headers: true,
});

module.exports = rateLimitMiddleware;
