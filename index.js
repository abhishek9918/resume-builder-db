require("./src/config/config");
const express = require("express");
const cors = require("cors");
const ResumeRoutes = require("./src/routes/resumeRoutes");

const app = express();

const PORT = process.env.PORT || 3132;
console.log(PORT, "ppp");

app.use(express.json());
app.use(express.json());
app.use(cors());

app.use("/resumes", ResumeRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
