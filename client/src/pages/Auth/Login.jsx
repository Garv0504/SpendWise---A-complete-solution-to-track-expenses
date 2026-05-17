import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const { updateUser } = useContext(UserContext);

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!validateEmail(email)) {
			setError("Enter a valid email address");
			return;
		}

		if (!password) {
			setError("Please enter your password");
			return;
		}

		setError("");

		try {
			const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
				email,
				password,
			});
			// console.log(response);
			const { token, resUser } = response.data;
			//console.log(response.data)

			if (token) {
				localStorage.setItem("token", token);
				updateUser(resUser);
				navigate("/dashboard");
			}
		} catch (error) {
			if (error.response && error.response.data.message) {
				setError(error.response.data.message);
			} else {
				setError("Something went wrong, try again");
			}
		}
	};

	return (
		<AuthLayout>
			<div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
				<h3 className="text-xl font-semibold text-[#EEEEEE]">Welcome Back</h3>
				<p className="text-xs text-[#00ADB5] mt-[5px] mb-6">
					Please enter your details to log in
				</p>

				<form onSubmit={handleLogin}>
					<Input
						value={email}
						onChange={({ target }) => setEmail(target.value)}
						label="Email Address"
						placeholder="john@example.com"
						type="text"
					/>

					<Input
						value={password}
						onChange={({ target }) => setPassword(target.value)}
						label="Password"
						placeholder="Min. 8 characters"
						type="password"
					/>

					{error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

					<button type="submit" className="btn-primary">
						LOGIN
					</button>

					<p className="text-[13px] text-[#EEEEEE] mt-3">
						Don't have an account?{" "}
						<Link className="font-medium text-primary underline" to="/signup">
							SignUp
						</Link>
					</p>
				</form>
			</div>
		</AuthLayout>
	);
};

export default Login;
