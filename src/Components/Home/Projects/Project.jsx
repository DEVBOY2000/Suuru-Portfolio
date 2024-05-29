import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useState, memo, useContext } from "react";
import { AppContext } from "../../../Context/AppContext";

const Project = ({ project }) => {
  const { setProjects, setProjectName } = useContext(AppContext);

  // const mouseEnterHandler = () => {
  //   const result = projects.map((item) => {
  //     if (item.name === project.name) {
  //       return { ...item, playVideoState: true };
  //     } else {
  //       return { ...item, playVideoState: false };
  //     }
  //   });

  //   let timimg = setTimeout(() => setProjects(result), 100);
  //   return () => clearTimeout(timimg);
  // };

  // const mouseLeaveHandler = () => {
  //   const result = projects.map((item) => ({ ...item, playVideoState: false }));
  //   setProjects(result);
  // };

  return (
    <Link
    aria-label={`go to ${project.name}`}
      to={`project/${project.name}`}
      // onClick={() => setProjectName((prev) => ({prev : prev.prev, current : project.name}))}
      // onMouseEnter={mouseEnterHandler}
      // onMouseOut={mouseLeaveHandler}
      // onMouseLeave={mouseLeaveHandler}
    >
      {/*project.playVideoState && project.video */}
      <div className="relative group h-full w-full">
        {false ? (
          <video
            loop
            muted
            autoPlay
            playsInline
            autobuffer="true"
            preload="auto"
            className="object-cover h-full"
            src={project.video}
            type="video/mp4"
            poster={project.image}
          />
        ) : (
          <LazyLoadImage
            effect="blur"
            alt="img"
            src={project.image}
            className="h-full w-full object-cover"
            height="100%"
            width="100%"
          />
        )}
        <div
          className="absolute w-full h-full transition-[visibility, opacity] duration-500 bg-black/40 invisible opacity-0 top-0 left-0 text-white flex justify-center items-center group-hover:visible group-hover:opacity-100"
          onMouseOut={(e) => e.stopPropagation()}
        >
          <h6 className="text-center text-sm xs:text-base">{project.name}</h6>
        </div>
      </div>
    </Link>
  );
};

export default memo(Project);
