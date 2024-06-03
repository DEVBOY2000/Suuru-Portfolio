import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import Loading from "../../Reuseable Components/Loading";
import ActivePreview from "./ActivePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMediaQuery from "../../Hooks/useMediaQuery";
import ImageCard from "../../Reuseable Components/ImageCard";
import { activePreview } from "./../../Utils/constants";

const CurrentView = () => {
  const {
    projects,
    currentView,
    setCurrentView,
    currentProjectItems,
    nextView,
    prevView,
  } = useContext(AppContext);

  const [opacity, setOpacity] = useState(1);

  const { name } = useParams();

  const componentRef = useRef();

  const videoRef = useRef();

  const isMobileView = useMediaQuery("(max-width : 437px)");

  const arrowsStyle = (dir) =>
    `w-[20px] h-[20px] p-[13px] rounded-full absolute top-1/2 ${dir}-5 cursor-pointer z-10 text-white bg-dark-color dark:text-dark-color dark:bg-white`;

  //handling current view
  useEffect(() => {
    !currentView && setCurrentView(currentProjectItems[0]);
  }, [currentProjectItems.length, name]);

  //opacity view in screen that less than desktop
  useEffect(() => {
    function opacityValueHandler() {
      if (isMobileView) {
        const itemsComponent = document
          .getElementById("items")
          .getBoundingClientRect().top;
        const currentViewRef = componentRef.current.clientHeight;
        const value = Math.round((itemsComponent / currentViewRef) * 100) / 100;
        if (value <= 1 && value >= 0) {
          setOpacity(value);
        }
      }
    }

    function videoPlaybackHandler() {
      if (isMobileView) {
        if (currentView && !videoRef.current) return; //must be video tag
        return videoRef.current?.readyState >= 3 && opacity <= 0.6
          ? videoRef.current.pause()
          : videoRef.current.play();
      }
    }

    const onScrollHandler = () => (
      opacityValueHandler(), videoPlaybackHandler()
    );

    window.addEventListener("scroll", onScrollHandler);
    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [opacity, isMobileView]);

  return (
    <article
      className="sticky top-[57px] xs:top-auto z-0 xs:z-auto xs:relative w-full max-w-[600px] min-w-fit sm:min-w-[600px] h-[calc(100dvh_-_57px)] xs:h-[calc(100dvh_-_(3rem_+_57px))] xs:w-[fit-content] mx-auto my-0 xs:my-6 mb-3 rounded-none xs:rounded-lg overflow-hidden"
      ref={componentRef}
      style={{ opacity: isMobileView ? opacity : 1 }}
    >
      {currentView?.includes(activePreview(currentView, projects, name)) ? (
        <FontAwesomeIcon
          icon="fa-solid fa-eye"
          className="absolute top-3 left-5 dark:text-white z-10"
          title="Current Preview"
        />
      ) : (
        <ActivePreview />
      )}
      <FontAwesomeIcon
        className={arrowsStyle("left")}
        icon="fa-solid fa-chevron-left"
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
          ref={videoRef}
        >
          <source type="video/mp4" src={currentView}></source>
        </video>
      ) : (
        <ImageCard src={currentView} />
      )}
      <FontAwesomeIcon
        icon="fa-solid fa-chevron-right"
        className={arrowsStyle("right")}
        onClick={nextView}
        size="1x"
      />
    </article>
  );
};

export default CurrentView;
