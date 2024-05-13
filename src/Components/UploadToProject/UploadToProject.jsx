import React, { useContext, useEffect, useRef, useState } from "react";
import { storage, database } from "../../Firebase/Firebase";
import {
  ref as stRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, set, get } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "./../../Context/AppContext";
import UploadItem from "./UploadItem";
import Waiting from "../../Utils/Waiting";
import Compressor from "compressorjs";

const UploadToProject = () => {
  const { currentProjectItems, signIn } = useContext(AppContext);

  const [uploadingState, setUploadingState] = useState(false);

  const [uploadItems, setUploadItems] = useState([]);

  const [dragDropState, setDragDropState] = useState(false);

  const { name: folderName } = useParams();

  const dropArea = useRef();

  const navTo = useNavigate();

  const uploadingOpreation = () => {
    if (!uploadItems.length) return;
    //rename files to extra ...
    const result = [...uploadItems].map((item, index) => {
      const file = new File(
        [item],
        item.type.includes("mp4")
          ? `animation (${lastItemIndex().lastVideoIndex + 1 + index}).mp4`
          : `extra (${lastItemIndex().lastImgIndex + 1 + index}).jpg`,
        { type: item.type }
      );
      file.oldName = item.name;
      return file;
    });

    setUploadingState(true);

    Promise.all(
      result.map(async (file) => {
        const uploadingByType = (fileOBJ, type) => {
          const newFile = new File([fileOBJ], fileOBJ.name, { type });
          const projectRef = stRef(
            storage,
            `Projects/${folderName}/${fileOBJ.name}`
          );
          uploadBytes(projectRef, newFile);
        };
        if (file.type.includes("image")) {
          return new Compressor(file, {
            quality: 0.6,
            convertTypes: "image/jpg",
            convertSize: 700000,
            width: 1200,
            height: 1600,
            success(blob) {
              return uploadingByType(blob, "image/jpg");
            },
          });
        } else return uploadingByType(file, "video/mp4");
      })
    )
      .then(() => setUploadItems([]))
      .finally(() => setUploadingState(false));
  };

  function lastItemIndex() {
    function stringHandler(item, itemIndex, itemType, RGEX) {
      const regex = new RegExp(`[${RGEX}.()]`, "gi");
      return +item
        .substring(itemIndex, item.indexOf(itemType))
        .replace("%20", "")
        .replace(regex, "")
        .toLowerCase();
    }

    const lastImgIndex = Math.max(
      ...currentProjectItems.map((item, _, array) => {
        const types = ["jpg", "jpeg"];
        const imgType = types.filter((type) => item.includes(type))[0];
        const imgIndex = item.indexOf("extra");
        return stringHandler(item, imgIndex, imgType, "a-zA-Z");
      })
    );

    const lastVideoIndex = Math.max(
      ...currentProjectItems.map((item) => {
        const videoIndex = item.indexOf("animation");
        if (videoIndex == -1) return 0;
        return stringHandler(item, videoIndex, ".mp4", "a-zA-Z");
      })
    );

    return { lastImgIndex, lastVideoIndex };
  }

  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    if (!signIn?.email) {
      navTo("/Suuru-Portfolio/login");
    }
  }, [signIn]);

  const onDropFile = (e) => {
    e.preventDefault();
    setDragDropState(false);
    setUploadItems((prev) => [...prev, ...e.dataTransfer.files]);
  };

  const uploadURLHandler = async (e) => {
    const prompt = window.prompt("type your link");
    if (prompt) {
      const xhr = new XMLHttpRequest();

      // Use JSFiddle logo as a sample image to avoid complicating
      // this example with cross-domain issues.
      xhr.open("GET", prompt, true);

      // Ask for the result as an ArrayBuffer.
      xhr.responseType = "arraybuffer";

      xhr.onload = function (e) {
        // Obtain a blob: URL for the image data.
        const arrayBufferView = new Uint8Array(this.response);
        const types = ["mp4", "jpg"];
        const getType = types.find((e) => prompt.includes(e));

        const blob = new Blob([arrayBufferView], {
          type: `${getType === "mp4" ? "video/mp4" : "image/jpg"}`,
        });
        // const urlCreator = window.URL || window.webkitURL;
        // const imageUrl = urlCreator.createObjectURL(blob);
        const file = new File([blob], `img (${uploadItems.length})`, {
          type: blob.type,
        });
        setUploadItems((prev) => [...prev, file]);
      };

      xhr.send();
    }
  };

  return (
    <div
      className="bg-gray-200 dark:bg-dark-color"
      ref={dropArea}
      onDragOver={(e) => (
        e.preventDefault(), setDragDropState(true), e.stopPropagation()
      )}
      onDragLeave={(e) => (setDragDropState(false), e.stopPropagation())}
      onDrop={(e) => onDropFile(e)}
    >
      {uploadItems.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 auto-rows-[400px] xs:auto-rows-[450px] gap-3 mx-3">
            {[...uploadItems].map((item) => {
              return (
                <UploadItem
                  key={item.name}
                  item={item}
                  state={uploadItems}
                  setState={setUploadItems}
                  uploadingState={uploadingState}
                />
              );
            })}
          </div>
          <div className="flex gap-3 justify-center sticky bottom-[-40px] sm:bottom-10 translate-y-[-70px] sm:translate-y-[15px] w-full z-40">
            <button
              disabled={uploadingState}
              onClick={uploadingOpreation}
              className={`bg-black text-white dark:bg-white dark:text-black  py-3 px-5 capitalize rounded-md z-40  ${
                uploadingState
                  ? "cursor-not-allowed opacity-25 pointer-events-auto"
                  : "cursor-pointer active:scale-90"
              }`}
            >
              upload files
            </button>
            <button
              disabled={uploadingState}
              onClick={(e) => uploadURLHandler(e)}
              className={`bg-black  dark:bg-white text-white dark:text-black capitalize  rounded-md active:scale-95 py-3 px-5 block ${
                uploadingState
                  ? "cursor-not-allowed opacity-25 pointer-events-auto"
                  : "cursor-pointer active:scale-90"
              }`}
            >
              URL
            </button>
          </div>
        </>
      ) : (
        <div
          className={`w-[calc(100vw_-_5rem)] sm:w-[600px]  h-[calc(500px_-_57px)] max-h-[100%] border-2 ${
            dragDropState
              ? "border-gray-400  dark:border-gray-700"
              : "border-gray-700  dark:border-gray-200"
          } rounded-lg border-dashed flex justify-center items-center gap-6 flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          <h1 className="dark:text-white">
            upload to project {`${folderName}`}
          </h1>
          <FontAwesomeIcon
            icon="fa-solid fa-upload"
            size="5x"
            className="dark:text-white text-black"
          />
          <h1 className="text-black dark:text-white capitalize text-lg">
            darg and drop your files <br />
            <p className="capitalize text-center">or</p>
          </h1>
          <div className="flex gap-3">
            <div className="bg-black  dark:bg-white text-white dark:text-black capitalize  rounded-md active:scale-95">
              <label htmlFor="file" className="py-3 px-5 cursor-pointer block">
                browes files
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                multiple
                onChange={({ target }) => setUploadItems([...target.files])}
              />
            </div>
            <button
              disabled={false}
              onClick={(e) => uploadURLHandler(e)}
              className="bg-black  dark:bg-white text-white dark:text-black capitalize  rounded-md active:scale-95 py-3 px-5 cursor-pointer block"
            >
              URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadToProject;
