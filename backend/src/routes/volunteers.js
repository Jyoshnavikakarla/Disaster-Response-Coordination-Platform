const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } =require( "express-validator");
const Volunteer =require( "../models/Volunteer.js");

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.post(
  "/",
  auth,
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone").isMobilePhone().withMessage("Valid phone number required"),
    body("resources").isArray({ min: 1 }).withMessage("At least one resource required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    try {
      const { name, email, phone, resources, skills, lat, lng } = req.body;

      const newVolunteer = await Volunteer.create({
        name, email, phone, resources, skills, lat, lng, userId: req.user.id
      });

      res.status(201).json(newVolunteer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports= router;
