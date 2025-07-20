import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import offerRoutes from './routes/offerRoutes.js';
import discountRoutes from './routes/discount.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

app.use('/', offerRoutes);
app.use("/", discountRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

