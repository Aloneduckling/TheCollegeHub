const jwt = require("jsonwebtoken");
const db = require('../model/db');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
	const { email, password, displayName, about } = req.body;

	try {
		//validate the username
		//validate the email usage
		//save the user to the db
		//return a token

		const user = await db.query("SELECT * FROM accounts WHERE email = $1", [email]);
		
		if (user.rows.length > 0) {
			return res.status(409).json({
				message: "This email is already linked to a different account",
			});
		}

		//save user to db code
		//encrypt the password
		//store the username
		//store the email

		//generate a hash for the password using bcrypt
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//save the user to the db
		let result = await db.query(
			"INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING *",
			[ email, hashedPassword ]
		);

		const accountId = result.rows[0].account_id;
		
		await db.query("INSERT INTO users (account_id, display_name, about) VALUES ($1,$2, $3)", [accountId, displayName, about]);
		
		const token = jwt.sign({ displayName, email }, SECRET, { expiresIn: "1d" });

		const data = { displayName, email };
		return res
			.status(201)
			.json({ messaage: "Account successfully created", data, token });

	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "something went wrong", error });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		
		//fetch the user by email
		let result = await db.query('SELECT account_id, email, password FROM accounts WHERE email = $1', [email]);
		
		if(result.rows.length === 0){
			return res.status(401).json({message: "Invalid email"});
		}

		//check if the password is correct or not
		const hashedPassword = result.rows[0].password;
		const validPassword = await bcrypt.compare(password, hashedPassword);
		
		if(!validPassword){
			return res.status(401).json({message: "Invalid password"});
		}

		const accountId = result.rows[0].account_id;
		
		//fetch the displayName to generate for jwt generation
		result = await db.query('SELECT display_name FROM users WHERE account_id = $1', [accountId]);
		displayName = result.rows[0].display_name;

		//generate token
		const token = jwt.sign({ email, displayName }, SECRET, { expiresIn: "1d" });

		return res.status(200).json({
			message: "signin successful",
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "someting went wrong" });
	}
};

module.exports = {
	signup,
	signin,
};
