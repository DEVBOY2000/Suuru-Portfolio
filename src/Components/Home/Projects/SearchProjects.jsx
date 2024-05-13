import { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";

const SearchProject = () => {
  const { projects, setSearchedProjects } = useContext(AppContext);

  const searchingHandler = (projectName) => {
    const targetProjects = projects.filter((project) => {
      return project?.name.toLowerCase().startsWith(projectName.toLowerCase());
    });

    if (targetProjects) {
      setSearchedProjects([...targetProjects]);
    } else {
      setSearchedProjects([]);
    }
  };

  return (
    <div className="flex justify-center pt-2">
      <input
        onChange={({ target }) => searchingHandler(target.value)}
        type="search"
        placeholder="project name"
        className="p-2 border-2 outline-none rounded-md dark:border-white border-black"
      />
    </div>
  );
};

export default SearchProject;
