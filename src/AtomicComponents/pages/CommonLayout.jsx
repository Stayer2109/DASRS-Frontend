/** @format */

import { Outlet } from "react-router-dom";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header/Header";
import CircularButton from "../atoms/CircularButton/CircularButton";
import { CancelIcon, LoginIcon } from "@/assets/icon-svg";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../organisms/Modal/Modal";
import Input from "../atoms/Input/Input";
import "./CommonLayout.scss";
import Button from "../atoms/Button/Button";

const CommonLayout = () => {
	const [loginModalShow, setLoginModalShow] = useState(false);

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

	// HANDLE LOGIN FORM SUBMIT
	const handleLoginsSubmit = (e) => {
		e.preventDefault();
		console.log("Login form submitted");
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

				<Modal
					show={loginModalShow}
					size='sm'
					onHide={handleLoginModalHide}
				>
					<ModalHeader
						content={"Login to website"}
						icon={<CancelIcon />}
					/>
					<h1 className='text-h1 text-center italic'>
						Get into the speedy world!
					</h1>
					<ModalBody className='flex items-center justify-center h-full'>
						<form
							className='w-full -translate-y-5'
							onSubmit={handleLoginsSubmit}
						>
							<div className='inf-input-container grid grid-cols-[1fr_3fr] gap-y-5 items-center mb-10'>
								{/* Username */}
								<label htmlFor='username'>Username</label>
								<Input
									type='text'
									placeholder='Username'
								/>

								{/* Password */}
								<label htmlFor='password'>Password</label>
								<Input
									type='password'
									placeholder='Password'
								/>
							</div>

							<div className='flex justify-center'>
								<Button
									content='Login'
									type='submit'
								/>
							</div>
						</form>
					</ModalBody>
				</Modal>
			</div>
			<Footer />
		</>
	);
};

export default CommonLayout;
