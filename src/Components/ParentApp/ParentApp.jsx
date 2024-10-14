import { useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import FlotingEdition from "../FlotingEdition/FlotingEdition";
import Modal from "../../Modal/Modal";
import usePrevState from "../../Hooks/usePrevState";
import { AppContext } from "../../Context/AppContext";
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
    setPrevProjectName,
    prevProjectName,
    setLoadingState,
  } = useContext(AppContext);

  const { pathname } = useLocation();

  const { name } = useParams();

  const prevProject = usePrevState(name);

  useEffect(() => {
    if (!pathname.includes("project")) {
      prevProject && setPrevProjectName(prevProject);
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

    setCurrUploadingIndex(-1);
    setUploadItems([]);
    setSearchedProjects([]);
    setLoadingState(false);
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
