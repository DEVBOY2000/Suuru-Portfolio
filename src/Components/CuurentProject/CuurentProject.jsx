import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { useScrollToTop } from "../../Hooks/useScrollToTop";
import CurrentView from "./CurrentView";
import Items from "./Items";
import RestItems from "./RestItems";

const CuurentProject = () => {
  const { currentView } = useContext(AppContext);

  useScrollToTop(currentView);

  return (
    <div className="flex flex-col">
      <CurrentView />
      <Items />
      {/* <RestItems /> */}
    </div>
  );
};

export default CuurentProject;
