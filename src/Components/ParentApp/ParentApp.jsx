import React, { useContext, useEffect } from "react";
import { Outlet, useHref } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import FlotingEdition from "../FlotingEdition/FlotingEdition";
import { AppContext } from "../../Context/AppContext";
import Modal from "../../Modal/Modal";
import { globalIcons } from "../../Utils/GlobalIcons";
import { parentAppComStyle } from "../../Utils/constants";

const ParentApp = () => {
  const { editState, setSearchedProjects,setCurrentView, setCurrentProjectItems } = useContext(AppContext);

  const  pathname  = useHref();

  useEffect(() => {
    setSearchedProjects([])
    setCurrentView("")
    setCurrentProjectItems([])
  }, [pathname])

  return (
    <div className="dark:bg-dark-color bg-white">
      <Navbar />
      <div className={`relative ${parentAppComStyle(pathname)}`}>
        <Outlet />
      </div>
      {pathname.includes("/Suuru-Portfolio/project/") && <FlotingEdition />}
      <Footer />
      {pathname !== "/Suuru-Portfolio" && editState && <Modal />}
    </div>
  );
};

export default ParentApp;
globalIcons();
