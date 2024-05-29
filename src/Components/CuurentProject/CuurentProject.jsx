import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { useScrollToTop } from "../../Hooks/useScrollToTop";
import CurrentView from "./CurrentView";
import Items from "./Items";
import RestItems from "./RestItems";
import useProjectsDB from "../../Hooks/useProjectsDB";

const CuurentProject = () => {
  const { currentView, MoreItems } = useContext(AppContext);

  useScrollToTop(currentView);

  useProjectsDB();

  return (
    <section className="flex flex-col">
      <CurrentView />
      <Items />
      {!MoreItems.noMoreITems && <RestItems />}
    </section>
  );
};

export default CuurentProject;
