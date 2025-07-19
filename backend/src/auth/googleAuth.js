const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/user.model"); // ✅ Make sure this path is correct

const router = express.Router();

// ✅ Google OAuth Strategy Setup
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(new Error("No email found in Google profile"), null);
      }

      // ✅ Try finding existing user by googleId or email
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

      // ✅ If not found, create new user
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email,
          password: profile.id, // ⚠️ Dummy password — you should consider replacing this securely or use a special auth flow
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ✅ Session Serialization (optional if you're not using sessions)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ✅ Start OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    try {
      const user = req.user;

      // ✅ Sign JWT with user._id (from MongoDB)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // ✅ Send cookie (secure in production)
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // ✅ Set true in production with HTTPS
        sameSite: "Lax",
        maxAge: 3600000,
      });

      // ✅ Redirect to frontend without exposing token in URL
      res.redirect("https://airbnb-three-indol.vercel.app/");
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
