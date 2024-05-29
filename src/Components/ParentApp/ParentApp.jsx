import React, { useContext, useEffect } from "react";
import { Outlet, useHref, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import FlotingEdition from "../FlotingEdition/FlotingEdition";
import { AppContext } from "../../Context/AppContext";
import Modal from "../../Modal/Modal";
import { globalIcons } from "../../Utils/GlobalIcons";
import { parentAppComStyle } from "../../Utils/constants";
import usePrevState from "../../Hooks/usePrevState";

const ParentApp = () => {
  const {
    editState,
    setMoreItems,
    setSearchedProjects,
    setCurrentView,
    setCurrentProjectItems,
    setUploadItems,
    setCurrUploadingIndex,
    setPrevProjectName,
    prevProjectName,
  } = useContext(AppContext);

  const pathname = useHref();

  const { name } = useParams();

  const prevProject = usePrevState(name);

  useEffect(() => {
    if (!pathname.includes("project")) {
      setPrevProjectName(prevProject);
    }

    if (
      pathname.includes("uploadToProject") ||
      pathname.includes("uploadProject")
    )
      return;

    if (pathname.includes("project") && name !== prevProjectName) {
      setCurrentProjectItems([]);
      setCurrentView("");
      setMoreItems({ state: false, pageToken: "", noMoreITems: false });
    }

    setCurrUploadingIndex(0);
    setUploadItems([]);
    setSearchedProjects([]);
  }, [pathname, name, prevProjectName]);

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
