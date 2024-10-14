import React, { forwardRef, useContext } from "react";

import Project from "./Project";
import { AppContext } from "../../../Context/AppContext";
import SearchProject from "./SearchProjects";
import useProjectsDB from "../../../Hooks/useProjectsDB";

const Projects = forwardRef((props, ref) => {
  const { projects, searchedProjects } = useContext(AppContext);

  const viewedProjectsHandler = () =>
    searchedProjects.length ? searchedProjects : projects;

  //get realtime database
  useProjectsDB();

  return (
    <section ref={ref} id="projects">
      <SearchProject />
      <article className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 auto-rows-[400px] xs:auto-rows-[450px] sm:auto-rows-[500px] gap-3 p-2 min-h-[calc(100vh_-_(57px))] ">
        {viewedProjectsHandler().map((project, key) => (
          <Project project={project} key={key} />
        ))}
      </article>
    </section>
  );
});

export default Projects;
