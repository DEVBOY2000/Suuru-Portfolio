import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { useScrollToTop } from "../../Hooks/useScrollToTop";
import CurrentView from "./CurrentView";
import Items from "./Items";
import RestItems from "./RestItems";
import useProjectsDB from "../../Hooks/useProjectsDB";
import { useParams } from "react-router-dom";
import usePrevState from "../../Hooks/usePrevState";

const CuurentProject = () => {
  const { currentView,
          MoreItems,
        } = useContext(AppContext);

  useScrollToTop(currentView);

  useProjectsDB();

  return (
    <section className="flex flex-col">
      <CurrentView />
      <Items />
      {!MoreItems.noMoreITems && <RestItems/>}
    </section>
  );
};

export default CuurentProject;
