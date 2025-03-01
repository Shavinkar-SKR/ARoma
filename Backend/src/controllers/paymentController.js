"use strict";
/*
import { Request, Response } from "express";
import { stripe, processStripePayment } from "../services/paymentService";

const dotenv = require("dotenv");

dotenv.config();

export const handleStripePayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const result = await processStripePayment(
      amount,
      currency,
      paymentMethodId
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Payment failed" });
  }
};

export const createPaymentIntent = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { amount } = req.body; // Amount should be in cents (e.g., $50.00 -> 5000)

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      
      automatic_payment_methods: {
        enabled: true, // Automatically select payment methods available for the user
        allow_redirects: "never", // Prevent redirections
      },
      //return_url: "http://localhost:3000/checkout-complete",
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
*/
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
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var paymentService_1 = require("../services/paymentService");
require("dotenv").config();
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var PaymentService = require("../services/paymentService");
//const Payment = require("../models/paymentModel");
exports.processStripePayment = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, currency, userId, paymentIntent, payment, error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          (_a = req.body),
            (amount = _a.amount),
            (currency = _a.currency),
            (userId = _a.userId);
          return [
            4 /*yield*/,
            paymentService_1.stripe.paymentIntents.create({
              amount: amount,
              currency: currency,
              payment_method_types: ["card"],
            }),
          ];
        case 1:
          paymentIntent = _b.sent();
          payment = new paymentService_1.Payment({
            userId: userId,
            amount: amount,
            currency: currency,
            status: "Pending",
            method: "Stripe",
            transactionId: paymentIntent.id,
          });
          return [4 /*yield*/, payment.save()];
        case 2:
          _b.sent();
          res.status(200).json({ clientSecret: paymentIntent.client_secret });
          return [3 /*break*/, 4];
        case 3:
          error_1 = _b.sent();
          res.status(500).json({ error: error_1.message });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
exports.stripeWebhook = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var sig, event, paymentIntent;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          sig = req.headers["stripe-signature"];
          try {
            event = paymentService_1.stripe.webhooks.constructEvent(
              req.body,
              sig,
              process.env.STRIPE_WEBHOOK_SECRET
            );
          } catch (err) {
            return [
              2 /*return*/,
              res.status(400).send("Webhook Error: ".concat(err.message)),
            ];
          }
          if (!(event.type === "payment_intent.succeeded"))
            return [3 /*break*/, 2];
          paymentIntent = event.data.object;
          return [
            4 /*yield*/,
            paymentService_1.Payment.findOneAndUpdate(
              { transactionId: paymentIntent.id },
              { status: "Completed" }
            ),
          ];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          res.json({ received: true });
          return [2 /*return*/];
      }
    });
  });
};
