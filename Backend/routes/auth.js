const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
  // Validating Data
  if (req.body == null) return res.status(400).send("Body Empty");

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(404).send("Email already Exist");

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send({ user: user.id, user: savedUser });
  } catch (err) {
    res.status(404).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // Validating Data
  if (req.body == null) return res.status(400).send("Body Empty");

  //Checking if the user is already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("Email does not Exist");

  //Password is Correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  const TOKEN_SECRET = "sdgvsdv2132hubds23e@4";

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);
  res
    .header("auth-token", token)
    .status(200)
    .send({ token: token, user: user });

  // res.send('Logged In');
});

module.exports = router;
