import React from "react";
import Banner from "./Banner.jpg";
import useHeaderVideo from "../../../Hooks/useHeaderVideo";

const Header = () => {
  const scrollToProjects = () => {
    const projectComponent = document.querySelector("#projects").offsetTop;
    window.scroll({ top: projectComponent - 57, left: 0, behavior: "smooth" });
  };

  const URL = useHeaderVideo("bannar (1).mp4");

  return (
    <header className="h-[100dvh] relative">
      <video
        loop
        muted
        autoPlay
        preload="auto"
        className="w-full h-full object-cover"
        poster={Banner}
        type="video/mp4"
        src={URL}
        style={{ objectPosition: "90%" }}
        alt="header"
      />
      <div className="w-full h-full absolute top-0 left-0 bg-black opacity-80"></div>
      <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center gap-3 z-0">
        <h1 className="text-center text-[5.5vw] lg:text-[60px] uppercase tracking-wide">
          suuru portfolio
        </h1>
        <button
          className="bg-white p-2 lg:p-3 text-black leading-[1] rounded hover:bg-black hover:text-white capitalize text-[14px] transition-colors"
          onClick={scrollToProjects}
        >
          scroll to projects
        </button>
      </section>
    </header>
  );
};

export default Header;
