"use strict";

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
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
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

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
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
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
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;
exports.emitOrderUpdate = void 0;

var cors = require("cors");

var express = require("express");

var http_1 = require("http");

var socket_io_1 = require("socket.io");

var bodyParser = require("body-parser");

var dbConfig_1 = require("./config/dbConfig");

var cartRoutes_1 = require("./routes/cartRoutes");

var orderRoutes_1 = require("./routes/orderRoutes");

var restaurantRoutes_1 = require("./routes/restaurantRoutes");

var menuRoutes_1 = require("./routes/menuRoutes");

var dotenv = require("dotenv");

var restaurantMenuRoutes_1 = require("./routes/restaurantMenuRoutes"); // import paymentRoutes from "./routes/paymentRoutes";


dotenv.config();
var app = express();
var PORT = process.env.PORT || 5001;
var httpServer = http_1.createServer(app); // Configure CORS for Socket.IO

var io = new socket_io_1.Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
  }
}); // Configure CORS for Express

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"]
})); // Middleware to parse JSON bodies

app.use(express.json()); // Routes

app.use("/api/orders", orderRoutes_1["default"]);
app.use("/api/carts", cartRoutes_1["default"]);
app.use("/api/restaurants", restaurantRoutes_1["default"]);
app.use("/api/menus", menuRoutes_1["default"]); // app.use("/api/payment", paymentRoutes);

app.use('/api/restaurants', restaurantMenuRoutes_1["default"]);
app.use(bodyParser.json()); // WebSocket connection

io.on("connection", function (socket) {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", function () {
    console.log("Client disconnected:", socket.id);
  });
}); // Function to emit order updates via WebSocket

var emitOrderUpdate = function emitOrderUpdate(updatedOrder) {
  io.emit("orderUpdated", updatedOrder);
};

exports.emitOrderUpdate = emitOrderUpdate; // Start the server

var startServer = function startServer() {
  return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 3]);

          return [4
          /*yield*/
          , dbConfig_1.connectDB()];

        case 1:
          _a.sent();

          console.log("Connected to the database");
          httpServer.listen(PORT, function () {
            console.log("Server is running on port " + PORT);
          });
          return [3
          /*break*/
          , 3];

        case 2:
          error_1 = _a.sent();
          console.error("Failed to connect to the database:", error_1);
          process.exit(1);
          return [3
          /*break*/
          , 3];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};

startServer();