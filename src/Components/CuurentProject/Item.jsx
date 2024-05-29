import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState, memo } from "react";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Reuseable Components/Loading";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import ImageCard from "../../Reuseable Components/ImageCard";
import VideoCard from "../../Reuseable Components/VideoCard";
import CardType from "../../Reuseable Components/CardType";
import { activePreview } from "../../Utils/constants";

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

  useEffect(() => {
    if (checked && !editingOpration.state) {
      setCheckedState(false);
    }
  }, [editingOpration.state, checked]);

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
      {item.includes(activePreview(item, projects, name)) && (
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
      {<CardType text={item.includes("mp4") ? "mp4" : "img"} />}
      {item ? (
        item?.includes("mp4") ? (
          <VideoCard src={item} />
        ) : (
          <ImageCard src={item} />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default memo(Item);
