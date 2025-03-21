import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CancelIcon,
  EyeCloseIcon,
  EyeOpenIcon,
  LeftArrowIcon,
  LoginIcon,
} from "@/assets/icon-svg";
import { useEffect, useState } from "react";
import { ForgetPasswordValidation, LoginValidation } from "@/utils/Validation";
import { Modal, ModalBody, ModalHeader } from "../organisms/Modal/Modal";
import { jwtDecode } from "jwt-decode";
import Input from "../atoms/Input/Input";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header/Header";
import CircularButton from "../atoms/CircularButton/CircularButton";
import Button from "../atoms/Button/Button";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import { apiAuth } from "@/config/axios/axios";
import { encryptToken } from "@/utils/CryptoUtils";
import Spinner from "../atoms/Spinner/Spinner";
import "./CommonLayout.scss";
import Toast from "../molecules/Toaster/Toaster";

const CommonLayout = () => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [forgetPasswordModalShow, setForgetPasswordModalShow] = useState(false);
  const inputCommonClassname = "w-full mb-1";

  // INPUT ERRORS
  const [loginErrors, setLoginErrors] = useState({});
  const [forgetPasswordErrors, setForgetPasswordErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [emailForForgetPassword, setEmailForForgetPassword] = useState("");

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

  //#region HANDLE FORM VALIDATION
  // HANDLE LOGIN FORM VALIDATION
  const handleLoginValidation = (data) => {
    const errors = LoginValidation(data);
    setLoginErrors(errors);
  };

  // HANDLE FORGET PASSWORD FORM VALIDATION
  const handleForgetPasswordValidation = (data) => {
    const errors = ForgetPasswordValidation(data);
    setForgetPasswordErrors(errors);
    setSuccessMessage("");
  };
  //#endregion

  // SUBMIT LOGIN FORM
  const handleLoginsSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(loginErrors).length > 0) return;

    try {
      setIsLoading(true);
      const response = await apiAuth.post("auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // When login complete get accesstoken and role out
      const refreshToken = response.data.data.refresh_token;
      const accessToken = response.data.data.access_token;

      // Set cookies for refresh token in 7 days
      Cookies.set("refreshToken", encryptToken(refreshToken), {
        expires: 7,
        secure: true,
        sameSite: "Strict", // Prvent CSRF attack
      });
      Cookies.set("accessToken", accessToken);

      // Decode jwt token
      const decodedToken = jwtDecode(accessToken);

      // Get information
      const role = decodedToken.role;

      // Save to auth
      setAuth({
        email: loginData.email,
        password: loginData.password,
        role,
        accessToken,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // SUBMIT FORGET PASSWORD FORM
  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (Object.keys(forgetPasswordErrors).length > 0) return;

    try {
      setIsLoading(true);
      const response = await apiAuth.post(
        `auth/forgot-password?email=${emailForForgetPassword}`
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      setForgetPasswordErrors(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // SHOW SUCCESS MESSAGE
  useEffect(() => {
    const successMessage = sessionStorage.getItem("successMessage");
    if (successMessage) {
      Toast({ message: successMessage, type: "success", title: "Success" });
      sessionStorage.removeItem("successMessage");
    }
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <Header />
      <div className="page-layout-body px-standard-x py-standard-y">
        <Outlet />
        <CircularButton
          content="Login"
          className="fixed bottom-5 right-5"
          onClick={handleLoginModalShow}
          icon={<LoginIcon />}
        />

        {/* LOGIN MODAL */}
        <Modal show={loginModalShow} size="sm" onHide={handleLoginModalHide}>
          <ModalHeader content={"Login to website"} icon={<CancelIcon />} />
          <ModalBody>
            <h1 className="text-h1 text-center italic mb-10">
              Get into the speedy world!
            </h1>
            <div className="flex items-center justify-center h-full">
              <form className="w-full" onSubmit={handleLoginsSubmit}>
                <div
                  className="inf-input-container grid grid-cols-[1fr_3fr] 
							gap-y-5 items-center mb-5">
                  {/* Email */}
                  <label htmlFor="email">Email</label>
                  <div>
                    <Input
                      className={inputCommonClassname}
                      type="email"
                      placeholder="Input your email here ..."
                      autoComplete=""
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        });
                      }}
                    />

                    {loginErrors.email && (
                      <p className="text-red-500 text-xs">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <label htmlFor="password">Password</label>
                  <div className="relative">
                    <Input
                      className={`${inputCommonClassname} pr-15`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Input your password here ..."
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        });
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 -translate-x-2 translate-y-[5px] cursor-pointer active:scale-92 active:translate-y-[6px]"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOpenIcon width={28} />
                      ) : (
                        <EyeCloseIcon width={28} />
                      )}
                    </div>

                    {loginErrors.password && (
                      <p className="text-red-500 text-xs">
                        {loginErrors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="forget-pwd-container">
                  <h3
                    className="text-h5 text-main-blue 
									cursor-pointer hover:text-main-blue-hover inline-block"
                    onClick={() => {
                      handleForgetPasswordModalShow();
                      handleLoginModalHide();
                    }}>
                    Forget password?
                  </h3>
                </div>

                <div className="flex justify-center">
                  <Button
                    content="Login"
                    onClick={() => handleLoginValidation(loginData)}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>

        {/* FORGET PASSWORD MODAL */}
        <Modal
          show={forgetPasswordModalShow}
          size="sm"
          onHide={() => {
            handleForgetPasswordModalHide();
            handleLoginModalShow();
          }}>
          <ModalHeader content={"Forget password"} icon={<CancelIcon />} />
          <ModalBody>
            <div className="modal-desc static">
              <LeftArrowIcon
                className="absolute translate-y-[25%] cursor-pointer"
                onClick={() => {
                  handleForgetPasswordModalHide();
                  handleLoginModalShow();
                }}
              />
              <h1 className="text-h1 text-center mb-10">
                Type your email to get a new password
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <form className="w-full" onSubmit={handleForgetPassword}>
                {
                  // Show success message
                  successMessage && (
                    <h6 className="text-center text-green-500 font-bold mb-3">
                      {successMessage}
                    </h6>
                  )
                }
                <div className="inf-input-container grid grid-cols-[1fr_3fr] gap-y-5 items-center mb-5">
                  {/* Email */}
                  <label htmlFor="email">Email</label>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      className={inputCommonClassname}
                      onChange={(e) =>
                        setEmailForForgetPassword(e.target.value)
                      }
                    />

                    {forgetPasswordErrors && (
                      <p className="text-red-500 text-xs">
                        {forgetPasswordErrors}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    content="Send"
                    type="submit"
                    onClick={() =>
                      handleForgetPasswordValidation(emailForForgetPassword)
                    }
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
