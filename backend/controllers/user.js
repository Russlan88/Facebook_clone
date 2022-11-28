/** @format */
const {
	validateEmail,
	validateLength,
	validateUserName,
} = require('../helpers/validation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/tokens');
const { sendVerificationEmail } = require('../helpers/mailer');

exports.register = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			email,
			password,
			bYear,
			bMonth,
			bDay,
			gender,
		} = req.body;

		if (!validateEmail(email)) {
			return res.status(400).json({
				message: 'Invalid email address',
			});
		}

		const checkEmail = await User.findOne({ email });

		if (checkEmail) {
			return res.status(400).json({
				message:
					'The email address is already exists, please try with another one',
			});
		}

		if (!validateLength(first_name, 3, 30)) {
			return res.status(400).json({
				message: 'First name should be from 3 and 30 characters.',
			});
		}

		if (!validateLength(last_name, 3, 30)) {
			return res.status(400).json({
				message: 'Last name should be from 3 and 30 characters.',
			});
		}

		if (!validateLength(password, 6, 40)) {
			return res.status(400).json({
				message: 'Your password should be at least 6 and 40 characters.',
			});
		}

		const cryptedPassword = await bcrypt.hash(password, 12);

		let tempUserName = first_name + last_name;
		let newUserName = await validateUserName(tempUserName);
		const user = await new User({
			first_name,
			last_name,
			email,
			username: newUserName,
			password: cryptedPassword,
			bYear,
			bMonth,
			bDay,
			gender,
		}).save();
		const emailVerificationToken = generateToken(
			{ id: user._id.toString() },
			'30m'
		);
		const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
		sendVerificationEmail(user.email, user.first_name, url);
		const token = generateToken({ id: user._id.toString() }, '7d');
		res.send({
			id: user._id,
			username: user.username,
			picture: user.picture,
			first_name: user.first_name,
			last_name: user.last_name,
			token: token,
			verified: user.verified,
			message: 'Register Success ! please activate your email to start',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.activateAccount = async (req, res) => {
	try {
		const { token } = req.body;
		const user = jwt.verify(token, process.env.TOKEN_SECRET);
		const check = await User.findById(user.id);
		if (check.verified == true) {
			return res
				.status(400)
				.json({ message: 'This email is already activated' });
		} else {
			await User.findByIdAndUpdate(user.id, { verified: true });
			return res
				.status(200)
				.json({ message: 'Account has been activated successfully' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message:
					'The email address you entered is not connected to any account.',
			});
		}
		const check = await bcrypt.compare(password, user.password);
		if (!check) {
			return res.status(400).json({
				message: 'The password is not correct. Please try one more time',
			});
		}
		const token = generateToken({ id: user._id.toString() }, '7d');
		res.send({
			id: user._id,
			username: user.username,
			picture: user.picture,
			first_name: user.first_name,
			last_name: user.last_name,
			token: token,
			verified: user.verified,
			message: 'Register Success ! please activate your email to start',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// lessons  finished
