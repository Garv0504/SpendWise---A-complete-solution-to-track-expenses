import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import morgan from "morgan";
import helmet from "helmet";


const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL || "*",
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Content-type", "Authorization"],
	})
);

app.use(express.json());
app.use(helmet())
app.use(morgan("dev"));


connectDb();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
