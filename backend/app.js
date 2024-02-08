require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const app = express();
const axios = require("axios");

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// routers
const labRouter = require("./routes/lab");
const userRouter = require("./routes/user");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Lab deployment API</h1>");
});

const getGitHubAccessToken = async (code, client_id, client_secret) => {
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error getting GitHub access token:",
      error.response?.data || error.message
    );
    throw new Error("Unable to obtain GitHub access token");
  }
};

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user", "repo", "workflow"],
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("accessToken:", profile);
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

app.get("/auth/github", passport.authenticate("github"));

app.post("/auth/github/access_token", (req, res) => {
  const { code } = req.body;
  (async () => {
    try {
      const accessToken = await getGitHubAccessToken(
        code,
        process.env.GITHUB_CLIENT_ID,
        process.env.GITHUB_CLIENT_SECRET
      );
      return res.json({ access_token: accessToken });
    } catch (error) {
      console.error("Error:", error.message);
      // console.log(error);
      return res.status(400).json({ error: error.message });
    }
  })();
});

// routes
app.use("/api/lab", labRouter);
app.use("/api/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5005;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
