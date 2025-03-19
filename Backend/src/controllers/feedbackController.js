"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFeedback = exports.getAllFeedback = void 0;
const dbConfig_1 = require("../config/dbConfig");
// Fetch all feedback from the database
const getAllFeedback = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const db = yield (0, dbConfig_1.connectDB)();
      const feedbackCollection = db.collection("feedbacks");
      const feedbacks = yield feedbackCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Error fetching feedback" });
    }
  });
exports.getAllFeedback = getAllFeedback;
// Submit new feedback
const submitFeedback = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { comment, rating, username, restaurantName } = req.body;
      if (!comment || !rating || !username || !restaurantName) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const db = yield (0, dbConfig_1.connectDB)();
      const feedbackCollection = db.collection("feedbacks");
      const newFeedback = {
        comment,
        rating,
        username,
        restaurantName,
        createdAt: new Date(),
      };
      yield feedbackCollection.insertOne(newFeedback);
      res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (error) {
      console.error("Error saving feedback:", error);
      res.status(500).json({ message: "Error saving feedback" });
    }
  });
exports.submitFeedback = submitFeedback;
