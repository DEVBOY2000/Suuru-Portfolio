import { useContext, useRef, useState } from "react";
import UploadItem from "../Components/UploadToProject/UploadItem";
import { AppContext } from "../Context/AppContext";
import { uploadURLHandler } from "../Utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHref, useParams } from "react-router-dom";
import { useEffect } from "react";

const ParentUploadingCom = ({uploadingOpreation}) => {
  const {uploadingState, uploadItems, setUploadItems, setCurrUploadingIndex} = useContext(AppContext);
  const [dragDropState, setDragDropState] = useState(false);
    const dropArea = useRef();

    const pathName = useHref()

  const { name: folderName } = useParams();

    const onDropFile = (e) => {
        e.preventDefault();
        setDragDropState(false);
        setUploadItems((prev) => [...prev, ...e.dataTransfer.files]);
    };


    const optionButtonsStyles = () =>
        `bg-black rounded-md text-white dark:bg-white dark:text-black p-3 capitalize ${
        uploadingState
            ? "cursor-not-allowed opacity-25 pointer-events-auto"
            : "cursor-pointer active:scale-90"
    }`;

    useEffect(() => {
      // don't re-render when uploading
      !uploadingState && setCurrUploadingIndex(uploadItems.length - 1)
    }, [uploadItems.length])


    return  <section
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
          {[...uploadItems].map((item, idx) => (
              <UploadItem
                  index={idx}
                  key={item.name + `10${idx + 1}`}
                  item={item}
                  state={uploadItems}
                  setState={setUploadItems}
                  uploadingState={uploadingState} />
          ))}
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
            onClick={() => uploadURLHandler(uploadItems, setUploadItems)}
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
        {pathName.includes("uploadToProject") && <h1 className="dark:text-white">
            upload to project <span className="!select-all">{`${folderName}`}</span>
          </h1>}
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
  </section>;
}
 
export default ParentUploadingCom;