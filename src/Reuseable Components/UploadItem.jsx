import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import CircleLoading from "./CircleLoading";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import CardType from "./CardType";

const UploadItem = ({ item, setState, state, loadingState, index }) => {
  const { currUploadingIndex } = useContext(AppContext);
  let { uploadingProgress, setUploadingProgress } = useContext(AppContext);
  const [videoState, setVideoState] = useState(false);

  const deleteIcon = () => (
    <div className="absolute z-10 w-full h-full bg-black/50 flex justify-center items-center text-white scale-0 group-hover/img:scale-100 transition-transform duration-300 cursor-pointer">
      <FontAwesomeIcon icon="fa-solid fa-xmark" size="5x" />
    </div>
  );

  const deleteItemOperation = (item) => {
    const result = state.filter((ele) => ele?.name !== item.name);
    setState(result);
  };

  return (
    <div
      onClick={() => !loadingState && deleteItemOperation(item)}
      className={`relative group/img`}
      key={item.name}
      onMouseEnter={({ target }) =>
        !loadingState && target.localName === "video" && setVideoState(true)
      }
      onMouseLeave={() => !loadingState && setVideoState(false)}
    >
      <CardType text={item.type.includes("image") ? "img" : "mp4"} />
      {!loadingState && deleteIcon()}
      {loadingState && index === currUploadingIndex && (
        <div
          className={`loading absolute w-full h-full bg-black/30 backdrop-blur-sm bottom-0 z-10`}
        >
          <div
            role="status"
            className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
          >
            <CircleLoading />
            {/* <span className="text-white text-xl">
              {uploadingProgress + "%"}
            </span> */}
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {item.type.includes("image") ? (
        <ImageCard src={URL.createObjectURL(item)} />
      ) : (
        <VideoCard
          src={URL.createObjectURL(item)}
          autoPlay={!loadingState && videoState}
        />
      )}
    </div>
  );
};

export default UploadItem;
