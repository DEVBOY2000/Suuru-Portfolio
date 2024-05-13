import React, { useContext, useEffect, useRef, useState } from "react";
import { storage, database } from "../../Firebase/Firebase";
import {
  getDownloadURL,
  listAll,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { ref as dbRef, set, get } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadItem from "../UploadToProject/UploadItem";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import { clearString } from "../../Utils/constants";

const UploadProject = () => {
  const { signIn } = useContext(AppContext);

  const [projectsDB, setProjectsDB] = useState([]);

  const [projectsStorage, setProjectsStorage] = useState({});

  const [uploadingState, setUploadingState] = useState(false);

  const [uploadItems, setUploadItems] = useState([]);

  const [dragDropState, setDragDropState] = useState(false);

  const dropArea = useRef();

  const navTo = useNavigate();

  //get realtime database
  useEffect(() => {
    if (!projectsDB.length) {
      const db = dbRef(database);
      get(db)
        .then((snapshot) =>
          snapshot.exists()
            ? setProjectsDB(snapshot.val())
            : console.error("No data available")
        )
        .catch((error) => console.error(error));
    }
  }, [projectsDB.length]);

  // get storage database
  useEffect(() => {
    if (!projectsStorage.length) {
      const listItemsRef = storageRef(storage, "Projects");
      listAll(listItemsRef).then(({ prefixes }) => {
        const object = {};
        prefixes.map((item) => {
          object[item.name] = [];
          const itemRef = storageRef(storage, `Projects/${item.name}`);
          listAll(itemRef).then(({ items }) =>
            items.forEach((e) =>
              getDownloadURL(e).then((res) => object[item.name].push(res))
            )
          );
        });
        setProjectsStorage(object);
      });
    }
  }, [projectsStorage.length]);

  const uploadingOpreation = () => {
    if (!uploadItems.length) return;
    const projectNamePrompt = window.prompt("type project name");
    if (projectNamePrompt) {
      const videosArr = uploadItems.filter((e) => e.type.includes("video"));
      const imagesArr = uploadItems.filter((e) => e.type.includes("image"));

      //check if project is exist in firebase storage
      const projectExistCheck = () => {
        const projectExist = Object.keys(projectsStorage).find((project) =>
          project.startsWith(projectNamePrompt)
        );

        if (projectExist) {
          function filterItems(type) {
            return projectsStorage[projectExist].filter((item) =>
              item.includes(type)
            );
          }
          return {
            videos: [...filterItems("mp4")].length + 1,
            images: [...filterItems("jpg")].length + 1,
          };
        }
        return undefined;
      };

      //edit file index & name and type
      const fileHandler = (items, startIndex, type, contentType) => {
        const result = items.map((item, i) => {
          const file = new File(
            [item],
            `${type} (${startIndex + i}).${contentType}`,
            {
              type: item.type,
            }
          );
          file.oldName = item.name;
          return file;
        });
        return result;
      };

      const videos = fileHandler(
        videosArr,
        projectExistCheck() ? projectExistCheck().videos : 1,
        "animation",
        "mp4"
      );
      const images = fileHandler(
        imagesArr,
        projectExistCheck() ? projectExistCheck().images : 1,
        "extra",
        "jpg"
      );

      const projectNameExist = () => {
        return !projectsDB.find(
          (project) =>
            clearString(project.name) === clearString(projectNamePrompt)
        );
      };

      // uploading to storage
      const result = [...videos, ...images];
      const existProject = Object.keys(projectsStorage).find(
        (project) => clearString(project) === clearString(projectNamePrompt)
      );
      setUploadingState(true);
      Promise.all(
        result.map((file) => {
          const uploadingByType = (fileOBJ, type) => {
            const newFile = new File([fileOBJ], fileOBJ.name, { type });
            const projectRef = storageRef(
              storage,
              `Projects/${existProject ? existProject : projectNamePrompt}/${
                fileOBJ.name
              }`
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
        .finally(
          () => setUploadingState(false),
          setProjectsDB([]),
          setProjectsStorage({})
        );

      //uploading to database
      if (projectNameExist()) {
        const url =
          "https://firebasestorage.googleapis.com/v0/b/portofolio-6fbe1.appspot.com/o/";
        set(dbRef(database, "/" + projectsDB.length), {
          name: projectNamePrompt,
          image: `${url}${encodeURIComponent(
            "Projects/" + projectNamePrompt + "/"
          )}extra%20(1).jpg?alt=media`,
          video:
            `${url}${encodeURIComponent(
              "Projects/" + projectNamePrompt + "/" + "animation (1).mp4"
            )}?alt=media` || "",
        }).catch((error) => console.error(error));
      } else
        alert(
          "This Project Is Exist, But These Items Will Upload To Same Project"
        );
    }
  };

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

  useEffect(() => {
    if (!signIn?.email) {
      navTo("/Suuru-Portfolio/login");
    }
  }, [signIn]);

  const optionButtonsStyles = () =>
    `bg-black rounded-md text-white dark:bg-white dark:text-black p-3 capitalize ${
      uploadingState
        ? "cursor-not-allowed opacity-25 pointer-events-auto"
        : "cursor-pointer active:scale-90"
    }`;

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 auto-rows-[400px] xs:auto-rows-[450px] gap-3 mx-3">
            {[...uploadItems].map((item, idx) => {
              return (
                <UploadItem
                  key={item.name + `10${idx + 1}`}
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
              className={`${optionButtonsStyles()}`}
            >
              upload files
            </button>
            <div className={`${optionButtonsStyles()}`}>
              <label htmlFor="file" disabled={uploadingState}>
                browes files
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                multiple
                onChange={({ target }) =>
                  setUploadItems([...uploadItems, ...target.files])
                }
              />
            </div>
            <button
              disabled={uploadingState}
              onClick={(e) => uploadURLHandler(e)}
              className={`${optionButtonsStyles()}`}
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

export default UploadProject;
