import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { useUserAuth } from "../../hooks/useUserAuth";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import toast from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";


const Expense = () => {
	useUserAuth();
	const [expenseData, setExpenseData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openDeleteAlert, setOpenDeleteAlert] = useState({
		show: false,
		data: null,
	});

	const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false);

	const fetchExpenseDetails = async () => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await axiosInstance.get(
				`${API_PATH.EXPENSE.GET_ALL_EXPENSE}`
			);
			if (response.data) {
				setExpenseData(response.data.allExpense);
				console.log(expenseData);
			}
		} catch (error) {
			console.log("Something went wrong, try again", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddExpense = async (data) => {
		const { category, amount, date, icon } = data;

		if (!category.trim()) {
			toast.error("Please enter a category of Expense");
			return;
		}

		if (!amount || isNaN(amount) || Number(amount) <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		if (!date) {
			toast.error("Please enter a date");
			return;
		}

		try {
			await axiosInstance.post(`${API_PATH.EXPENSE.ADD_EXPENSE}`, {
				category,
				amount,
				date,
				icon,
			});

			setOpenAddExpenseModal(false);
			toast.success("Expense added successfully");
			fetchExpenseDetails();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}
	};

	const handleDownloadExpenseDetails = async () => {
		try {
			const response = await axiosInstance.get(
				`${API_PATH.EXPENSE.DOWNLOAD_EXPENSE}`,
				{
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "expense.xlsx");
			document.body.appendChild(link);
			link.click();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}
	};

	const deleteExpense = async (incomeId) => {
		if (!incomeId) return;

		try {
			await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(incomeId));

			toast.success("Expense deleted successfully");
			setOpenDeleteAlert({ show: false, data: null });
			fetchExpenseDetails();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}
	};

	useEffect(() => {
		fetchExpenseDetails();

		return () => {};
	}, []);

	return (
		<DashboardLayout activeMenu="Expense">
			<div className="my-5 mx-auto">
				<div className="grid grid-cols-1 gap-6">
					<div className="">
						<ExpenseOverview
							transaction={expenseData}
							onExpenseIncome={() => setOpenAddExpenseModal(true)}
						/>
					</div>

					<ExpenseList
						transactions={expenseData}
						onDelete={(income) => {
							setOpenDeleteAlert({ show: true, data: income });
						}}
						onDownload={handleDownloadExpenseDetails}
					/>
				</div>

				<Modal
					isOpen={OpenAddExpenseModal}
					onClose={() => setOpenAddExpenseModal(false)}
					title="Add Expense"
				>
					<AddExpenseForm onAddExpense={handleAddExpense} />
				</Modal>

				<Modal
					isOpen={openDeleteAlert.show}
					onClose={() => setOpenDeleteAlert({ show: false, data: null })}
					title="Delete Expense"
				>
					<DeleteAlert
						content="Are you sure you want to delete this expense?"
						onDelete={() => {
							deleteExpense(openDeleteAlert.data);
						}}
					/>
				</Modal>
			</div>
		</DashboardLayout>
	);
};

export default Expense;
