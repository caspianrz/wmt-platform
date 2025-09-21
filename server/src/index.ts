import express, { Application } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config();

import API from '@routes/api';

const app: Application = express();

// Register middle-wares.
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', API);

const port = process.env.PORT || 9990;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
