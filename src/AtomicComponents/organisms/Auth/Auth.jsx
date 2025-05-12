import {
  CancelIcon,
  EyeCloseIcon,
  EyeOpenIcon,
  LoginIcon,
} from "@/assets/icon-svg";
import CircularButton from "@/AtomicComponents/atoms/CircularButton/CircularButton";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import apiClient, { apiAuth } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { encryptToken } from "@/utils/CryptoUtils";
import { ForgetPasswordValidation, LoginValidation } from "@/utils/Validation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Modal from "../Modal/Modal";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { Button } from "@/AtomicComponents/atoms/Button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/molecules/Table/Table";
import { Tooltip } from "react-tooltip";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";

// KEY MAPPING FOR SORT
const sortKeyMap = {
  last_name: "SORT_BY_LASTNAME",
  first_name: "SORT_BY_FIRSTNAME",
  email: "SORT_BY_EMAIL",
};

const Auth = () => {
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [forgetPasswordModalShow, setForgetPasswordModalShow] = useState(false);
  const [organizerListModalShow, setOrganizerListModalShow] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showPassword, setShowPassword] = useState(false);
  const [organizerList, setOrganizerList] = useState([]);
  const [sortByKey, setSortByKey] = useState("tournament_id");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // INPUT ERRORS
  const [loginErrors, setLoginErrors] = useState({});
  const [forgetPasswordErrors, setForgetPasswordErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [emailForForgetPassword, setEmailForForgetPassword] = useState("");
  const inputCommonClassname = "w-full mb-1";

  // TABLE COLUMNS
  const columns = [
    { key: "first_name", label: "First Name", sortable: true },
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
  ];

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  // HANDLE SORT
  const handleSort = (columnKey) => {
    const isSameColumn = sortByKey === columnKey;
    let newDirection = "ASC";

    // Check if the same column is clicked and change sort direction
    if (isSameColumn && sortDirection === "ASC") {
      newDirection = "DESC";
    }

    setSortByKey(columnKey);
    setSortDirection(newDirection);
    setPageIndex(1);
  };

  // GET SORT PARAMS
  const getSortByParam = () => {
    if (!sortByKey || !sortDirection) return null;
    const baseKey = sortKeyMap[sortByKey];
    return baseKey ? `${baseKey}_${sortDirection}` : null;
  };

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
      const id = decodedToken.id;
      const isLeader = decodedToken.isLeader;
      const teamId = decodedToken.teamId;

      // Save to auth
      setAuth({
        email: loginData.email,
        password: loginData.password,
        role,
        accessToken,
        id,
        isLeader,
        teamId,
      });

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "ORGANIZER":
          navigate("/organizer");
          break;
        case "PLAYER":
          navigate("/player");
          break;
        default:
          navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
      Toast({
        message: error.response.data.message,
        type: "error",
        title: "Error",
      });
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
    } catch (error) {
      console.log(error);
      setForgetPasswordErrors(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLE SIGNUP TEMPLATE DOWNLOAD
  const handleSingupTemplateDownload = async () => {
    try {
      const response = await apiAuth.get("accounts/landing/player-template");

      const sampleData = response.data.data;

      // Convert object to array of one row
      const worksheetData = [sampleData];

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      // Create workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Create binary Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "signup_template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Toast({
        message: "Failed to download Excel file",
        type: "error",
        title: "Error",
      });
    }
  };

  // GET ORGANIZER LIST
  const haneldeFetchOrganizerList = async () => {
    const sortByParam = getSortByParam();

    try {
      setIsLoading(true);
      const response = await apiClient.get(
        "accounts/landing/organizer-contacts",
        {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByParam,
            keyword: debouncedSearchTerm,
          },
        }
      );

      if (response.data.http_status === 200) {
        const data = response.data.data.content;
        setOrganizerList(data);
        setTotalPages(data.total_pages || 1);
      }
    } catch (error) {
      Toast({
        message: error.response.data.message,
        type: "error",
        title: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //#region LOGIN MODAL CONTROL
  // HANDLE SHOW LOGIN MODAL
  const handleLoginModalShow = () => {
    setLoginModalShow(true);
    setLoginData({ email: "", password: "" });
    setLoginErrors({});
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

  //#region ORGANIZER LIST MODAL CONTROL
  // HANDLE SHOW ORGANIZER LIST MODAL
  const handleOrganizerListModalShow = () => {
    setOrganizerListModalShow(true);
  };

  // HANDLE HIDE ORGANIZER LIST MODAL
  const handleOrganizerListModalHide = () => {
    setOrganizerListModalShow(false);
    setSearchTerm("");
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

  // GET ORGANIZER LIST ON MOUNT
  useEffect(() => {
    haneldeFetchOrganizerList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, sortByKey, sortDirection, debouncedSearchTerm]);

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

      <div className="px-standard-x py-standard-y page-layout-body">
        <CircularButton
          content="Login"
          className="right-5 bottom-5 z-20 fixed"
          onClick={handleLoginModalShow}
          icon={<LoginIcon height={"30px"} />}
        />
      </div>

      {/* LOGIN MODAL */}
      <Modal show={loginModalShow} size="md" onHide={handleLoginModalHide}>
        <Modal.Header content={"Login to website"} icon={<CancelIcon />} />
        <Modal.Body>
          <h1 className="mb-10 text-mobile-h6 sm:text-h1 text-center italic">
            Get into the <strong>speedy world!</strong>
          </h1>
          <div className="flex justify-center items-center h-full">
            <form className="w-full" onSubmit={handleLoginsSubmit}>
              <div className="items-center gap-y-5 sm:grid grid-cols-[1fr_3fr] mb-3 sm:mb-5 inf-input-container">
                {/* Email */}
                <label htmlFor="email">Email</label>
                <div className="mb-3 sm:mb-0">
                  <Input
                    className={inputCommonClassname}
                    type="email"
                    value={loginData.email || ""}
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
                    <p className="text-red-500 text-xs">{loginErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <Input
                    className={`${inputCommonClassname} pr-15`}
                    type={showPassword ? "text" : "password"}
                    value={loginData.password || ""}
                    placeholder="Input your password here ..."
                    onChange={(e) => {
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      });
                    }}
                  />
                  <div
                    className="top-0 right-0 absolute active:scale-92 -translate-x-2 translate-y-[5px] active:translate-y-[6px] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
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
                  className="inline-block mb-3 sm:mb-0 text-h5 text-main-blue hover:text-main-blue-hover cursor-pointer"
                  onClick={() => {
                    handleForgetPasswordModalShow();
                    handleLoginModalHide();
                  }}
                >
                  Forget password?
                </h3>
              </div>

              <div className="flex flex-col justify-center items-center gap-5">
                <div>
                  <Button
                    content="Login"
                    onClick={() => handleLoginValidation(loginData)}
                    type="submit"
                  />
                </div>

                <span
                  className="text-black hover:text-blue-600 italic cursor-pointer tsext-h5"
                  onClick={handleSingupTemplateDownload}
                >
                  → Want to sign up? Click here to download sign up template ←{" "}
                </span>

                <div className="flex flex-col items-center gap-2 bg-gray-100 shadow p-2 px-6 rounded-md italic">
                  <span className="font-semibold text-muted-foreground">
                    In order to sign up, you must download the template and
                    contact organizers via email and send them the template
                  </span>
                  <span
                    className="font-semibold text-h5 text-yellow-600 hover:underline animate-pump cursor-pointer"
                    onClick={() => {
                      handleOrganizerListModalShow();
                      handleLoginModalHide();
                    }}
                  >
                    Organizers to contact{" "}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* FORGET PASSWORD MODAL */}
      <Modal
        show={forgetPasswordModalShow}
        size="md"
        onHide={() => {
          handleForgetPasswordModalHide();
          handleLoginModalShow();
        }}
      >
        <Modal.Header content={"Forget password"} icon={<CancelIcon />} />
        <Modal.Body>
          <div className="static modal-desc">
            <h1 className="mb-10 text-mobile-h6 sm:text-h1 text-center">
              Type your email to get a new password
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center h-full">
            <form className="w-full" onSubmit={handleForgetPassword}>
              {
                // Show success message
                successMessage && (
                  <h6 className="mb-3 font-bold text-green-600 text-h6 sm:text-h5 text-center">
                    {successMessage}
                  </h6>
                )
              }
              <div className="items-center gap-y-5 grid grid-cols-[1fr_3fr] mb-5 inf-input-container">
                {/* Email */}
                <label htmlFor="email">Email</label>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={inputCommonClassname}
                    value={emailForForgetPassword || ""}
                    onChange={(e) => setEmailForForgetPassword(e.target.value)}
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
        </Modal.Body>
      </Modal>

      {/* ORGANIZER LIST MODAL */}
      <Modal
        show={organizerListModalShow}
        size="2xl"
        onHide={() => {
          handleOrganizerListModalHide();
          handleLoginModalShow();
        }}
      >
        <Modal.Header content={"Organizer list"} icon={<CancelIcon />} />
        <Modal.Body>
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search players by last name or team name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(1); // Reset to page 1 on search
              }}
              className="px-4 py-2 border border-gray-300 rounded w-full sm:max-w-xl"
            />
          </div>

          <div className="flex flex-col justify-center items-center h-full">
            <Table title="List of organizers">
              <TableHeader
                columns={columns}
                sortBy={sortByKey}
                sortDirection={sortDirection?.toLowerCase()}
                onSort={handleSort}
              />
              <TableBody>
                {organizerList.map((row, idx) => (
                  <TableRow
                    key={idx}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    index={idx}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.key === "email" ? (
                          <a
                            href={`mailto:${row[col.key]}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={`Send email to ${
                              row[col.key]
                            }`}
                            data-tooltip-place="top"
                          >
                            {row[col.key]}
                            <Tooltip
                              id="my-tooltip"
                              style={{ borderRadius: "12px" }}
                            />
                          </a>
                        ) : (
                          row[col.key]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
            <DasrsPagination
              pageSize={pageSize}
              pageIndex={pageIndex}
              page={pageIndex}
              count={totalPages}
              handlePagination={handlePagination}
              handleChangePageSize={handleChangePageSize}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Auth;
