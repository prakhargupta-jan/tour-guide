const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.DB.replace("<password>", process.env.DB_PASSWORD))
  .then(() => console.log("DB connected"))
  .catch(function (err) {
    console.log(err);
  });
