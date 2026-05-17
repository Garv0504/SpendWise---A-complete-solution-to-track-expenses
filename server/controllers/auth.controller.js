import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async (req, res) => {
	const { fullName, email, password, profileImageUrl } = req.body;

	if (!email || !fullName || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use" });
		}

		const user = await User.create({
			fullName,
			email,
			password,
			profileImageUrl,
		});

		const resUser = await User.findById(user._id).select("-password -_id");

		res.status(200).json({
			id: user._id,
			resUser,
			token: generateToken(user._id),
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error registering user ", error: err.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const resUser = await User.findById(user._id).select("-password -_id");

		res.status(200).json({
			id: user._id,
			resUser,
			token: generateToken(user._id),
			message: "User login successfully!",
		});
	} catch (err) {
		res.status(500).json({ message: "Error in logging", error: err.message });
	}
};

const getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error getting user info", err: err.message });
	}
};

export { registerUser, loginUser, getUserInfo };
