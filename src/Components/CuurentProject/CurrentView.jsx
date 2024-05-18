import React, { useContext, useEffect, useRef, useState } from "react";
import left_arrow from "../../SVG/left_arrow.svg";
import right_arrow from "../../SVG/right_arrow.svg";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import Loading from "../../Reuseable Components/Loading";
import ActivePreview from "./ActivePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CurrentView = () => {
  const {
    projects,
    currentView,
    setCurrentView,
    currentProjectItems,
    currentRestItems,
    nextView,
    prevView,
  } = useContext(AppContext);

  const [opacity, setOpacity] = useState(1);

  const { name } = useParams();

  const ref = useRef()

  //handling current content
  useEffect(() => {
    setCurrentView(currentRestItems[0]);
  }, [currentProjectItems.length, name]);

  useEffect(() => {

    function scrollHandler() {
      const itemsComponent = document.getElementById("items").getBoundingClientRect().top;
      const currentViewRef = ref.current.clientHeight
      const value = Math.round(itemsComponent / currentViewRef * 100) / 100
      if (value <= 1 && value >= 0) {
        setOpacity(value)
      }
    }

    window.addEventListener("scroll", scrollHandler)
    return () => window.removeEventListener("scroll", scrollHandler)
  })
  
  const activePreview = () => {
    return currentView.includes("mp4")
      ? projects.find((project) => project.name === name)?.video
      : projects.find((project) => project.name === name)?.image;
  };

  return (
    <div className="sticky top-0 z-0 sm:z-auto sm:relative w-full max-w-[600px] min-w-fit sm:min-w-[600px] h-[calc(100dvh_-_57px)] xs:h-[calc(100dvh_-_(3rem_+_57px))] xs:w-[fit-content] mx-auto my-0 xs:my-6 mb-3 rounded-none xs:rounded-lg overflow-hidden"
         ref={ref}
         style={{opacity}}
    >
      {currentView.includes(activePreview()) ? (
        <FontAwesomeIcon
          icon="fa-solid fa-eye"
          className="absolute top-3 left-5 dark:text-white z-10"
          title="Current Preview"
        />
      ) : (
        <ActivePreview />
      )}

      <img
        src={left_arrow}
        alt="left_arrow"
        className="w-[40px] h-[40px] p-[13px] rounded-full absolute top-1/2 left-5 cursor-pointer z-10 text-white bg-white "
        onClick={prevView}
      />
      {!currentView ? (
        <Loading />
      ) : currentView?.includes("mp4") ? (
        <video
          loading="lazy"
          className="object-cover w-full h-full"
          loop
          muted
          autoPlay
          playsInline
          preload="auto"
          src={currentView}
        >
          <source type="video/mp4" src={currentView}></source>
        </video>
      ) : (
        <img
          loading="lazy"
          className="object-cover w-full h-full object-top"
          src={currentView}
        />
      )}
      <img
        src={right_arrow}
        alt="right_arrow"
        className="w-[40px] h-[40px] p-[13px] rounded-full absolute top-1/2 right-5 cursor-pointer z-10 text-white bg-white "
        onClick={nextView}
      />
    </div>
  );
};

export default CurrentView;
