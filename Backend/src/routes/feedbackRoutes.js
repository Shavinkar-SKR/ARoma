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
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController"); // Controller for feedback logic
const router = (0, express_1.Router)();
// Get all feedback
router.get("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield (0, feedbackController_1.getAllFeedback)(req, res);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Error fetching feedback" });
    }
  })
);
// Submit new feedback
router.post("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield (0, feedbackController_1.submitFeedback)(req, res);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Error submitting feedback" });
    }
  })
);
exports.default = router;
