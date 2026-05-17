import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
	useUserAuth();
	const [incomeData, setIncomeData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openDeleteAlert, setOpenDeleteAlert] = useState({
		show: false,
		data: null,
	});

	const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);

	const fetchIncomeDetails = async () => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await axiosInstance.get(
				`${API_PATH.INCOME.GET_ALL_INCOME}`
			);
			if (response.data) {
				setIncomeData(response.data.allIncome);
			}
		} catch (error) {
			console.log("Something went wrong, try again", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddIncome = async (incomeData) => {
		const { source, amount, date, icon } = incomeData;

		if (!source.trim()) {
			toast.error("Please enter a source of income");
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
			await axiosInstance.post(`${API_PATH.INCOME.ADD_INCOME}`, {
				source,
				amount,
				date,
				icon,
			});

			setOpenAddIncomeModal(false);
			toast.success("Income added successfully");
			fetchIncomeDetails();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}
	};

	const handleDownloadIncomeDetails = async () => {
		try {
			const response = await axiosInstance.get(
				`${API_PATH.INCOME.DOWNLOAD_INCOME}`,
				{
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "income.xlsx");
			document.body.appendChild(link);
			link.click();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}	
	}

	const deleteIncome = async (incomeId) => {
		if (!incomeId) return;

		try {
			await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(incomeId));

			toast.success("Income deleted successfully");
			setOpenDeleteAlert({ show: false, data: null });
			fetchIncomeDetails();
		} catch (error) {
			console.log("Something went wrong, try again", error);
		}
	};
	useEffect(() => {
		fetchIncomeDetails();

		return () => {};
	}, []);

	return (
		<DashboardLayout activeMenu="Income">
			<div className="my-5 mx-auto">
				<div className="grid grid-cols-1 gap-6">
					<div>
						<IncomeOverview
							transactions={incomeData}
							onAddIncome={() => setOpenAddIncomeModal(true)}
						/>
					</div>

					<IncomeList
						transactions={incomeData}
						onDelete={(income) => {
							setOpenDeleteAlert({ show: true, data: income });
						}}
						onDownload={handleDownloadIncomeDetails}
					/>
				</div>

				<Modal
					isOpen={OpenAddIncomeModal}
					onClose={() => setOpenAddIncomeModal(false)}
					title="Add Income"
				>
					<AddIncomeForm onAddIncome={handleAddIncome} />
				</Modal>

				<Modal
					isOpen={openDeleteAlert.show}
					onClose={() => setOpenDeleteAlert({ show: false, data: null })}
					title="Delete Income"
				>
					<DeleteAlert
						content="Are you sure you want to delete this income?"
						onDelete={() => {
							deleteIncome(openDeleteAlert.data);
						}}
					/>
				</Modal>
			</div>
		</DashboardLayout>
	);
};

export default Income;
