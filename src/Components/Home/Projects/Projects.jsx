import React, { useEffect, useContext } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../../Firebase/Firebase";

import Project from "./Project";
import { AppContext } from "../../../Context/AppContext";
import SearchProject from "./SearchProjects";

const Projects = () => {
  const { projects, setProjects, searchedProjects } = useContext(AppContext);

  const viewedProjectsHandler = () =>
    searchedProjects.length ? searchedProjects : projects;

  useEffect(() => {
    const dbRef = ref(database);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const result = snapshot
            .val()
            .map((item) => ({ ...item, playVideoState: false }));
          setProjects(result);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <SearchProject />
      <div
        id="projects"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 auto-rows-[400px] xs:auto-rows-[450px] sm:auto-rows-[500px] gap-3 p-2 min-h-[calc(100vh_-_(57px))] "
        // onMouseUp={console.log("out")}
      >
        {viewedProjectsHandler().map((project, key) => (
          <Project
            //  projectName={project}
            //  details={projects[project]}
            project={project}
            key={key}
          />
        ))}
      </div>
    </>
  );
};

export default Projects;
