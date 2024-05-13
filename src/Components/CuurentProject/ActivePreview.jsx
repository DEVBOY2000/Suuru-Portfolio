import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { ref, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../../Firebase/Firebase";
import Compressor from "compressorjs";
import { unEncodedStr } from "../../Utils/constants";

const ActivePreview = () => {
  const [state, setState] = useState(false);

  const [loadingState, setLoadingState] = useState(false);

  const { name } = useParams();

  const { currentView, projects } = useContext(AppContext);

  const uploadURLToDB = async () => {
    const targetProject = projects.find((project) => project.name === name);
    const projectId = projects.findIndex(
      (project) => project === targetProject
    );
    delete targetProject.playVideoState;
    const projectNameIndex = currentView.search(encodeURIComponent(name));
    const restURL = currentView.slice(
      projectNameIndex + encodeURIComponent(name).length,
      currentView.indexOf("?")
    );

    const targetURL = `${currentView.slice(
      0,
      projectNameIndex
    )}${encodeURIComponent(`${name}/Prviews`)}${restURL}?alt=media`;

    set(ref(database, "/" + projectId), {
      ...targetProject,
      image: targetURL,
    }).finally(() => setLoadingState(false), setState(false));
  };

  const uploadFileToStorage = async () => {
    const fileName = unEncodedStr(
      currentView.slice(
        currentView.search("extra"),
        currentView.indexOf("?") - 4
      )
    );

    const createFile = await (await fetch(currentView)).blob();
    const file = new File([createFile], fileName, {
      type: createFile.type,
    });

    return new Compressor(file, {
      quality: 0.9,
      convertSize: 100000,
      convertTypes: "image/jpg",
      width: 550,
      height: 755,
      success(blob) {
        const result = new File([blob], blob.name, { type: "image/jpg" });
        const projectRef = storageRef(
          storage,
          `Projects/${name}/Prviews/${result.name}.jpg`
        );
        uploadBytes(projectRef, result);
      },
    });
  };

  const activePreview = async function ({ target }) {
    if (target.checked) {
      setLoadingState(true);
      await uploadFileToStorage();
      await uploadURLToDB().then(() => setLoadingState(false), setState(false));
    }
  };

  return (
    <div className="absolute right-5 top-3 z-10">
      <FontAwesomeIcon
        onClick={() => !loadingState && setState(!state)}
        icon={"fa-solid fa-ellipsis"}
        size="xl"
        className="dark:text-white cursor-pointer active:scale-90 active:text-dark-color"
      />
      {state && (
        <div className="absolute p-3 bg-white right-0 text-black rounded-md flex gap-3">
          <label htmlFor="preview" className="whitespace-nowrap text-sm">
            set as project preview
          </label>
          <input
            type="checkbox"
            id="preview"
            onChange={(e) => !loadingState && activePreview(e)}
          />
          {loadingState && (
            <svg
              aria-hidden="true"
              className="w-5 h-5 animate-spin text-gray-200 dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivePreview;
