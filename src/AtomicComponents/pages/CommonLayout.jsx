/** @format */

import { Outlet } from "react-router-dom";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header/Header";
import CircularButton from "../atoms/CircularButton/CircularButton";
import { CancelIcon, LeftArrowIcon, LoginIcon } from "@/assets/icon-svg";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../organisms/Modal/Modal";
import Input from "../atoms/Input/Input";
import "./CommonLayout.scss";
import Button from "../atoms/Button/Button";
import { LoginValidation } from "@/utils/Validation";

const CommonLayout = () => {
	const [loginModalShow, setLoginModalShow] = useState(false);
	const [forgetPasswordModalShow, setForgetPasswordModalShow] = useState(false);
	const inputCommonClassname = "w-full mb-1";

	// INPUT ERRORS
	const [errors, setErrors] = useState({});
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	//#region LOGIN MODAL CONTROL
	// HANDLE SHOW LOGIN MODAL
	const handleLoginModalShow = () => {
		setLoginModalShow(true);
	};

	// HANDLE HIDE LOGIN MODAL
	const handleLoginModalHide = () => {
		setLoginModalShow(false);
	};
	//#endregion

	//#region FORGET PASSWORD MODAL CONTROL
	// HANDLE SHOW FORGET PASSWORD MODAL
	const handleForgetPasswordModalShow = () => {
		setForgetPasswordModalShow(true);
	};

	// HANDLE HIDE FORGET PASSWORD MODAL
	const handleForgetPasswordModalHide = () => {
		setForgetPasswordModalShow(false);
	};
	//#endregion

	// HANDLE LOGIN FORM SUBMIT
	const handleLoginValidation = (data) => {
		const errors = LoginValidation(data);
		setErrors(errors);
	};

	// SUBMIT LOGIN FORM
	const handleLoginsSubmit = (e) => {
		e.preventDefault();

		if (Object.keys(errors).length > 0) return;

		try {
			
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Header />
			<div className='page-layout-body px-standard-x py-standard-y'>
				<Outlet />
				<CircularButton
					content='Login'
					className='fixed bottom-5 right-5'
					onClick={handleLoginModalShow}
					icon={<LoginIcon />}
				/>

				{/* LOGIN MODAL */}
				<Modal
					show={loginModalShow}
					size='sm'
					onHide={handleLoginModalHide}
				>
					<ModalHeader
						content={"Login to website"}
						icon={<CancelIcon />}
					/>
					<ModalBody>
						<h1 className='text-h1 text-center italic mb-10'>
							Get into the speedy world!
						</h1>
						<div className='flex items-center justify-center h-full'>
							<form
								className='w-full'
								onSubmit={handleLoginsSubmit}
							>
								<div
									className='inf-input-container grid grid-cols-[1fr_3fr] 
							gap-y-5 items-center mb-5'
								>
									{/* Email */}
									<label htmlFor='email'>Email</label>
									<div>
										<Input
											className={inputCommonClassname}
											type='text'
											placeholder='Input your email here ...'
											autoComplete=''
											onChange={(e) => {
												setLoginData({
													...loginData,
													email: e.target.value,
												});
											}}
										/>

										{errors.email && loginData.email == "" && (
											<p className='text-red-500 text-xs'>{errors.email}</p>
										)}
									</div>

									{/* Password */}
									<label htmlFor='password'>Password</label>
									<div className=''>
										<Input
											className={inputCommonClassname}
											type='password'
											placeholder='Input your password here ...'
											onChange={(e) => {
												setLoginData({
													...loginData,
													password: e.target.value,
												});
											}}
										/>

										{errors.password && loginData.password == "" && (
											<p className='text-red-500 text-xs'>{errors.password}</p>
										)}
									</div>
								</div>

								<div className='forget-pwd-container'>
									<h3
										className='text-h5 text-main-blue 
									cursor-pointer hover:text-main-blue-hover inline-block'
										onClick={() => {
											handleForgetPasswordModalShow();
											handleLoginModalHide();
										}}
									>
										Forget password?
									</h3>
								</div>

								<div className='flex justify-center'>
									<Button
										content='Login'
										onClick={() => handleLoginValidation(loginData)}
										type='submit'
									/>
								</div>
							</form>
						</div>
					</ModalBody>
				</Modal>

				{/* FORGET PASSWORD MODAL */}
				<Modal
					show={forgetPasswordModalShow}
					size='sm'
					onHide={() => {
						handleForgetPasswordModalHide();
						handleLoginModalShow();
					}}
				>
					<ModalHeader
						content={"Forget password"}
						icon={<CancelIcon />}
					/>
					<ModalBody>
						<div className='modal-desc static'>
							<LeftArrowIcon
								className='absolute translate-y-[25%] cursor-pointer'
								onClick={() => {
									handleForgetPasswordModalHide();
									handleLoginModalShow();
								}}
							/>
							<h1 className='text-h1 text-center mb-10'>
								Type your email to get a new password
							</h1>
						</div>
						<div className='flex flex-col items-center justify-center h-full'>
							<form className='w-full'>
								<div className='inf-input-container grid grid-cols-[1fr_3fr] gap-y-5 items-center mb-5'>
									{/* Email */}
									<label htmlFor='email'>Email</label>
									<Input
										type='email'
										placeholder='Email'
										autoComplete='email'
									/>
								</div>

								<div className='flex justify-center'>
									<Button
										content='Send'
										type='submit'
									/>
								</div>
							</form>
						</div>
					</ModalBody>
				</Modal>
			</div>
			<Footer />
		</>
	);
};

export default CommonLayout;
