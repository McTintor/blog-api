const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");

const app = express();


app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});