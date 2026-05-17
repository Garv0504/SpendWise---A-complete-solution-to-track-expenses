import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import { Toaster } from "react-hot-toast";
import RecentTransaction from "./components/RecentTransaction/RecentTransaction";

const Root = () => {
	const isAuthenticated = !!localStorage.getItem("token");

	return isAuthenticated ? (
		<Navigate to="/dashboard" />
	) : (
		<Navigate to="/login" />
	);
};

const App = () => {
	return (
		<>
			<div>
				<Routes>
					<Route path="/" element={<Root />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/dashboard" element={<Home />} />
					<Route path="/income" element={<Income />} />
					<Route path="/expense" element={<Expense />} />
					<Route path="/recent" element={<RecentTransaction />} />
				</Routes>
			</div>

			<Toaster
				toastoptions={{
					className: "",
					style: {
						fontSize: "13px",
					},
				}}
			/>
		</>
	);
};

export default App;
