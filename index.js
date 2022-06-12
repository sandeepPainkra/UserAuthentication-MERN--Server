import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// connection to Mongo db
mongoose.connect(
  "mongodb://localhost:27017/myapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (req, res) => console.log("connection successfull")
);

// user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
// creating model for mongodb
const User = new mongoose.model("userData", userSchema);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfully", user: user });
      } else {
        res.send({ message: "Password didn't Match" });
      }
    } else {
      res.send({ message: "User Not Register" });
    }
  });
});
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already exist" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully register !! Please Login Now..." });
        }
      });
    }
  });
});

app.listen(9000, (req, res) => {
  console.log("Server is listening in port no :9000");
});
