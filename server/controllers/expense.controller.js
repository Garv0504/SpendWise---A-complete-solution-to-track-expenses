import xlsx from "xlsx";
import { Expense } from "../models/expense.model.js";

const addExpense = async (req, res) => {
	const userId = req.user.id;

	try {
		const { icon, category, amount, date } = req.body;
		if (!category || !amount) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		const newExpense = new Expense({
			userId,
			icon,
			category,
			amount,
			date: new Date(date),
		});

		await newExpense.save();
		res.status(200).json({ message: "Expense added successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
const getAllExpense = async (req, res) => {
	const userId = req.user.id;
	try {
		const allExpense = await Expense.find({ userId }).sort({ date: -1 });
		if (allExpense.length <= 0) {
			return res.status(300).json({ message: "No expense found" });
		}

		res.status(200).json({ allExpense, message: "All expense fetched" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const deleteExpense = async (req, res) => {
	try {
		await Expense.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Expense Deleted Successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const downloadExpenseExcel = async (req, res) => {
	const userId = req.user.id;

	try {
		const expense = await Expense.find({ userId }).sort({ date: -1 });

		const data = expense.map((item) => ({
			Category: item.category,
			Amount: item.amount,
			Date: item.date.toLocaleDateString(),
		}));

		const wb = xlsx.utils.book_new();
		const ws = xlsx.utils.json_to_sheet(data);
		xlsx.utils.book_append_sheet(wb, ws, "Expense");
		xlsx.writeFile(wb, "expense_details.xlsx");
		res.download("expense_details.xlsx");
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export { addExpense, getAllExpense, downloadExpenseExcel, deleteExpense };
