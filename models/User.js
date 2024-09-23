require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a valid name."],
    minLength: 3,
    maxLength: 25,
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email."],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email.",
    ],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [
      true,
      "Please provide a valid password between 6 and 25 characters in length.",
    ],
    minLength: 6,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);


// Add team attribute to user registration
//      - "Warning, your team cannot be changed later."
//           if team exists add user to team
//           if team does not exist create new team
//           dialogue box warning "No team by that name found
//               - create a new team?
//               - try another spelling?"