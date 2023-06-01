const User = require('../models/usermodel');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const Destination = require('../models/destinationmodel');

exports.registerUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    destinations: [],
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
};

exports.loginUser = async (req, res) => {
  const user = await User.findOne({ name: req.body.name });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  res.json({ token });
};

exports.getDestinations = async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user.destinations);
};
exports.addDestination = async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) {
    console.log('User not found');
    return res.status(404).json({ message: 'User not found' });
  }

  console.log('User found:', user);

  // create new destination and push its id to user's destinations array
  const newDestination = new Destination(req.body);
  await newDestination.save();

  user.destinations.push(newDestination._id);
  await user.save();

  console.log('User with added destination:', user);

  res.json(user.destinations);
};


exports.updateDestination = async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.destinations.includes(req.params.destinationId)) {
    return res.status(404).json({ message: 'Destination not found in user\'s list' });
  }

  const destination = await Destination.findById(req.params.destinationId);
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  Object.assign(destination, req.body);
  await destination.save();

  res.json(destination);
};

exports.deleteDestination = async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.destinations.pull({ _id: req.params.destinationId });
  await user.save();

  res.json({ message: 'Destination deleted successfully' });
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updatePassword = async (req, res) => {
  const { name } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};