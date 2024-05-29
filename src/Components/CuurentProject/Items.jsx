import React, { useContext, lazy } from "react";
import { AppContext } from "../../Context/AppContext";
import { useScrollToElement } from "../../Hooks/useScrollToElement";
const Item = lazy(() => import("./Item"));
import useProjectStorage from "./../../Hooks/useProjectsStorage";

const Items = () => {
  const { currentProjectItems, deletionState } = useContext(AppContext);

  useScrollToElement("items", deletionState);

  useProjectStorage();
  return (
    <section
      id="items"
      className="min-h-[calc(100vh_-_(57px_+_24px_+_72px))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 auto-rows-[450px] lg:auto-rows-[500px] gap-3 p-3 dark:bg-dark-color bg-white relative z-20"
    >
      {currentProjectItems.map((item, i) => (
        <Item item={item} index={i} key={i} />
      ))}
    </section>
  );
  s;
};

export default Items;
