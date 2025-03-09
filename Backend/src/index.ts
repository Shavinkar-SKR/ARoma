const cors = require("cors");
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { MongoClient, ObjectId, ChangeStreamDocument, MongoClientOptions, Db } from "mongodb";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import menuRoutes from "./routes/menuRoutes";
import * as dotenv from "dotenv";
import restaurantMenuRoutes from './routes/restaurantMenuRoutes';
import feedbackRoutes from "./routes/feedbackRoutes";
import { Order } from "./models/orderModel";
//import payment from './routes/paymentRoutes'


dotenv.config();

declare global {
  namespace Express {
    interface Request {
      db?: Db;
    }
  }
}

const MONGODB_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/ARoma?retryWrites=true&w=majority&appName=ARoma&replicaSet=atlas-4uxo98-shard-0&tls=true";

const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

const mongoOptions: MongoClientOptions = {
  maxPoolSize: 50,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
  waitQueueTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  tls: true,
  directConnection: false
};

const mongoClient = new MongoClient(MONGODB_URI, mongoOptions);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);

let dbConnection: Db | null = null;

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbConnection) {
      dbConnection = mongoClient.db("ARoma");
      await dbConnection.admin().ping();
    }
    req.db = dbConnection;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/feedback", feedbackRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use('/api/restaurants', restaurantMenuRoutes);
//app.use('/api/payment', payment);


const activeConnections = new Set();

app.get('/order-events/:orderId', 
  (req: Request<{ orderId: string }>, res: Response) => {
    if (activeConnections.size >= 50) {
      res.status(429).send('Too many connections');
      return;
    }

    const connectionId = Symbol();
    activeConnections.add(connectionId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    (async () => {
      try {
        const db = req.db!;
        const order = await db.collection<Order>('orders').findOne({ 
          _id: new ObjectId(req.params.orderId) 
        });

        if (!order) {
          res.write('event: error\ndata: Order not found\n\n');
          res.end();
          return;
        }

        res.write(`event: initial\ndata: ${JSON.stringify(order)}\n\n`);

        const changeStream = db.collection<Order>('orders').watch(
          [{
            $match: {
              'fullDocument._id': new ObjectId(req.params.orderId),
              operationType: { $in: ['update', 'replace'] }
            }
          }], 
          { fullDocument: 'updateLookup' }
        );

        const onChange = (change: ChangeStreamDocument<Order>) => {
          if (change.operationType === 'update' && change.fullDocument) {
            res.write(`event: update\ndata: ${JSON.stringify(change.fullDocument)}\n\n`);
          }
        };

        const onError = (error: Error) => {
          console.error('Change stream error:', error);
          res.end();
        };

        changeStream.on('change', onChange);
        changeStream.on('error', onError);

        req.on('close', () => {
          activeConnections.delete(connectionId);
          changeStream.off('change', onChange);
          changeStream.off('error', onError);
          changeStream.close();
        });

      } catch (err) {
        console.error('SSE connection error:', err);
        res.write('event: error\ndata: Failed to fetch order\n\n');
        res.end();
      }
    })();
  }
);

const connectWithRetry = async (attempt = 1): Promise<void> => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB Atlas");
    
    await mongoClient.db().admin().ping();
    console.log("Database connection verified");

    setInterval(async () => {
      try {
        await mongoClient.db().command({ ping: 1 });
      } catch (pingError) {
        console.error('Connection heartbeat failed:', pingError);
        await mongoClient.close();
        connectWithRetry();
      }
    }, 15000);

  } catch (error) {
    console.error(`Connection attempt ${attempt} failed:`, error);
    if (attempt < 5) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      return connectWithRetry(attempt + 1);
    }
    console.error("Critical connection failure after 5 attempts");
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
});

const startServer = async () => {
  try {
    await connectWithRetry();
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`SSE endpoint: http://localhost:${PORT}/order-events/:orderId`);
    });

    process.on('SIGINT', async () => {
      await mongoClient.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error("Fatal connection error:", error);
    process.exit(1);
  }
};

startServer();