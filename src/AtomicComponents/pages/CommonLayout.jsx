/** @format */

import { Outlet } from "react-router-dom";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header/Header";
import CircularButton from "../atoms/CircularButton/CircularButton";
import { CancelIcon, LoginIcon } from "@/assets/icon-svg";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../organisms/Modal/Modal";
import Input from "../atoms/Input/Input";

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

  return (
    <>
      <Header />
      <div className="page-layout-body px-standard-x py-standard-y">
        <Outlet />
        <CircularButton
          content="Login"
          className="fixed bottom-5 right-5"
          onClick={handleLoginModalShow}
          icon={<LoginIcon />}
        />

        <Modal show={loginModalShow} size="md" onHide={handleLoginModalHide}>
          <ModalHeader content={"Login to website"} icon={<CancelIcon />} />
          <ModalBody>
            <form>
              <Input type="text" placeholder="Username" />
              <Input type="password" placeholder="Password" />
            </form>
          </ModalBody>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default CommonLayout;
