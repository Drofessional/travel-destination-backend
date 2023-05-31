const User = require('../models/usermodel');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.registerUser = async (req, res) => {
  // hash the password before saving it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,  // Changed name to username
    email: req.body.email,
    password: hashedPassword,
    destinations: [],
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  // find the user by username
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json({ message: 'User not found' });

  // check if the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  // generate a jwt token
  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  res.json({ token });
};

exports.getDestinations = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user.destinations);
};

exports.addDestination = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.destinations.push(req.body);
  await user.save();

  res.json(user.destinations);
};

exports.updateDestination = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const destination = user.destinations.id(req.params.destinationId);
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  Object.assign(destination, req.body);
  await user.save();

  res.json(destination);
};

exports.deleteDestination = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
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


