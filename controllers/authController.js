import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

dotenv.config({ path: '.env' });

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(422).json({ message: 'An account with this email already exists.' });
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
    const token = signToken(user);
    return res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
