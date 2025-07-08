const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null, // 👈 only present for Google users
    unique: true,
    sparse: true, // 👈 allows multiple nulls in unique index
  },
  username: {
    type: String,
    trim: true,
    required: function () {
      return !this.googleId; // 👈 required only if not Google login
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: function () {
      return !this.googleId; // 👈 required only for non-Google users
    },
  },
  phone: {
    type: Number,
    maxLength: 10,
    required: function () {
      return !this.googleId;
    },
  },
  address: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  properties: [],
  bookings: [],
}, {
  timestamps: true,
});

// Hash password before saving (manual signup only)
userSchema.pre("save", async function (next) {
  if (this.isModified("password") ) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate JWT
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  if (!token) throw new Error("error generating token");
  return token;
};

// Authenticate user for email/password login
userSchema.statics.authenticateUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user || !user.password) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");
  return user;
};

module.exports = mongoose.model("User", userSchema);
