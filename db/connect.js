const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(
      url
      //   , {
      //   useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
      //   useUnifiedTopology: true,
      // }
    )
    .then(() => console.log("Connected to MongoDB"));
  // .catch((err) => console.log("Error connecting to MongoDB:", err));
};

module.exports = connectDB;
