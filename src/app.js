const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user_routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ success: true, message: "BloomBack API running" }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/community", require("./modules/community/community.routes"));
app.use("/checkin", require("./modules/checkin/checkin.routes"));
app.use("/insights", require("./modules/insights/insights.routes"));
app.use("/resources", require("./modules/resources/resources.routes"));
app.use("/goals", require("./modules/goals/goals.routes"));
app.use("/calendar", require("./modules/calendar/calendar.routes"));
app.use("/stories", require("./modules/stories/stories.routes"));
app.use("/home", require("./modules/home/home.routes"));

app.use(errorHandler);

module.exports = app;
