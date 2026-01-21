// | import express

import express from 'express';

// | Import CORS
import cors from 'cors';

// | Import Passport and Session removed

// | Import Router
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import likeRouter from './routes/likeRouter.js';
import ratingRouter from './routes/ratingRouter.js';
import contactRouter from './routes/contactRouter.js';
import whatsappWebhookRouter from './routes/whatsappWebhookRouter.js';

// | Import DB Connect
import dbConnect from './DB/dbConnect.js';
import sequelize from './DB/sequelize.js';

// | Import uploadAuthController
import { uploadAuthController } from './controllers/postControllers.js';

// ` Configure App
const app = express();

// ` CORS Middleware

const allowedOrigins = [
  'http://localhost:5173',
  'https://stacodev.com',
  'http://72.60.200.197',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(o => o.trim())
    : [])
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server, curl, postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ Blocked by CORS:', origin);
    return callback(
      new Error('CORS policy does not allow this origin'),
      false
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
};

app.use(cors(corsOptions));




// @ Port Declare
const port = process.env.PORT || 5000;

// Webhooks removed

// ` Configure Middleware For JSON format
app.use(express.json({ limit: '10mb' }));

// ` Configure Middleware For URL Encoded format

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ` Upload Auth Route (before clerkMiddleware to allow unauthenticated access)
app.get('/posts/upload-auth', uploadAuthController);

// Clerk middleware removed

// ` Configure middleware router
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/likes', likeRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/contact', contactRouter);
app.use('/api/whatsapp', whatsappWebhookRouter);

app.use((error, req, res, next) => {
  if (!res.headersSent) {
    res.status(error.status || 500);

    res.json({
      message: error.message || 'Something went wrong!',
      status: error.status || 500,
      stack: error.stack,
      error: error,
      name: error.name,
    });
  }
});

// ` Configure base route
app.get('/', (req, res) => res.status(200).send('Hello World!'));

// ` Configure app lister with port and DB Configure with app start up
app.listen(port, async () => {
  try {
    console.log(`StacoPost app listening on port ${port}!`);
    await dbConnect();
  } catch (error) {
    console.log(`Error in Blogpost app` + error);
  }
});
