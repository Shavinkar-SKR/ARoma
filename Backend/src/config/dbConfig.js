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
exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const MONGODB_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/";
const DB_NAME = "ARoma";
const connectDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(MONGODB_URI);
    yield client.connect();
    const db = client.db(DB_NAME);
    return db;
  });
exports.connectDB = connectDB;
