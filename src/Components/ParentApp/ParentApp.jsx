import React, { useContext, useEffect } from "react";
import { Outlet, useHref, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import FlotingEdition from "../FlotingEdition/FlotingEdition";
import { AppContext } from "../../Context/AppContext";
import Modal from "../../Modal/Modal";
import { globalIcons } from "../../Utils/GlobalIcons";
import { parentAppComStyle } from "../../Utils/constants";

const ParentApp = () => {
  const { 
          editState,
          setMoreItems,
          setSearchedProjects,
          setCurrentView,
          setCurrentProjectItems,
          setUploadItems,
          setCurrUploadingIndex,
        } = useContext(AppContext);

  const  pathname  = useHref();

  const {name} = useParams();
  
  useEffect(() => {
    if ((pathname.includes("uploadToProject") || pathname.includes("uploadProject"))) return;
    
    setCurrUploadingIndex(0);
    setUploadItems([])
    setSearchedProjects([]);

    setCurrentProjectItems([]);
    setCurrentView("");
    setMoreItems({state : false, pageToken : "", noMoreITems : false})

  }, [pathname])

  return (
    <main className="dark:bg-dark-color bg-white">
      <Navbar />
      <section className={`relative ${parentAppComStyle(pathname)}`}>
        <Outlet />
      </section>
      {pathname.includes("/Suuru-Portfolio/project/") && <FlotingEdition />}
      <Footer />
      {pathname !== "/Suuru-Portfolio" && editState && <Modal />}
    </main>
  );
};

export default ParentApp;
globalIcons();
