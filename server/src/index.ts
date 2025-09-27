import express, { Application } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config();

import API from '@routes/api';

const app: Application = express();
const corsOptions = {
	origin: 'http://localhost:5173', // Replace with your client's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
	allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
	credentials: true // Allow sending cookies/authorization headers
};


// Register middle-wares.
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', API);

const port = process.env.PORT || 9990;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
