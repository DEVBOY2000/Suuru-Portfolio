import { memo } from "react";
import { Link } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImageCard from "../../../Reuseable Components/ImageCard";
import VideoCard from "../../../Reuseable Components/VideoCard";

const Project = ({ project }) => {
  return (
    <Link aria-label={`go to ${project.name}`} to={`project/${project.name}`}>
      <div className="relative group h-full w-full">
        {false ? (
          <VideoCard src={project.video} poster={project.image} />
        ) : (
          <ImageCard src={project.image} />
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
