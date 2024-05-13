import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState, memo } from "react";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Reuseable Components/Loading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";

const Item = ({ item }) => {
  const {
    projects,
    editingOpration,
    currentView,
    setCurrentView,
    selectedItemsHandler,
  } = useContext(AppContext);

  const [checked, setCheckedState] = useState(false);

  const { name } = useParams();

  const contnetType = (text) => {
    return (
      <div
        className={`absolute top-[10px] right-[10px] z-10 bg-black/60 px-2 uppercase text-sm text-white`}
      >
        {text}
      </div>
    );
  };

  const onClickEventHandler = () => {
    if (
      editingOpration.state &&
      (editingOpration.type.includes("Download") ||
        editingOpration.type.includes("Delete"))
    ) {
      setCheckedState(!checked);
      selectedItemsHandler(item);
    } else {
      setCurrentView(item);
    }
  };

  const activePreview = () => {
    return item.includes("mp4")
      ? projects.find((project) => project.name === name).video
      : projects.find((project) => project.name === name).image;
  };

  useEffect(() => {
    if (checked && !editingOpration.state) {
      setCheckedState(false);
    }
  }, [editingOpration]);

  return (
    <div
      className={`relative h-full cursor-pointer rounded-lg overflow-hidden  ${
        currentView === item
          ? "border-4 border-black dark:border-white"
          : "hover:border-black dark:hover:border-white hover:border-4"
      }`}
      onClick={onClickEventHandler}
      title={item}
    >
      {item.includes(activePreview()) && (
        <FontAwesomeIcon
          icon="fa-solid fa-eye"
          className="absolute top-3 left-5 dark:text-white z-10"
          title="Current Preview"
        />
      )}
      {editingOpration.state && checked && (
        <div className="w-full h-full z-10 absolute backdrop-blur-[1.5px] bg-black/60 flex justify-center items-center">
          <FontAwesomeIcon icon="fa-solid fa-check" color="white" size="4x" />
        </div>
      )}
      {item ? (
        item?.includes("mp4") ? (
          <>
            {contnetType("mp4")}

            <video
              playsInline
              loading="lazy"
              className="h-full object-cover w-full object-top"
              src={item}
            >
              <source type="video/mp4" src={item}></source>
            </video>
          </>
        ) : (
          <>
            {contnetType("img")}
            <LazyLoadImage
              effect="blur"
              alt="img"
              src={item}
              className="h-full object-cover w-full object-top"
              height="100%"
              width="100%"
            />
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default memo(Item);
