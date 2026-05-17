import { User } from "../models/user.model.js";
import xlsx from "xlsx";
import { Income } from "../models/income.model.js";

const addIncome = async (req, res) => {
	const userId = req.user.id;

	try {
		const { source, icon, amount, date } = req.body;

		if (!source || !amount) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		const newIncome = new Income({
			userId,
			source,
			icon,
			amount,
			date: new Date(date),
		});

		await newIncome.save();
		res.status(200).json({ newIncome, message: "income addedd successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const getAllIncome = async (req, res) => {
	const userId = req.user.id;

	try {
		const allIncome = await Income.find({ userId }).sort({ date: -1 });

		if (allIncome.length <= 0) {
			return res.status(300).json({ message: "No income found" });
		}

		res.status(200).json({ allIncome, message: "Income fetched successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const deleteIncome = async (req, res) => {
	try {
		await Income.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Income deleted successfully" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const downloadIncomeExcel = async (req, res) => {
	const userId = req.user.id;

	try {
		const income = await Income.find({ userId }).sort({ date: -1 });

		const data = income.map((item) => ({
			Source: item.source,
			Amount: item.amount,
			Date: item.date.toLocaleDateString(),
		}));

		const wb = xlsx.utils.book_new();
		const ws = xlsx.utils.json_to_sheet(data);
		xlsx.utils.book_append_sheet(wb, ws, "Income");
		xlsx.writeFile(wb, "income_details.xlsx");
		res.download("income_details.xlsx");
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };
