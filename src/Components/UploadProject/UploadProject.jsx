import React, { useContext, useState } from "react";
import { storage, database } from "../../Firebase/Firebase";
import {
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { ref as dbRef, set } from "firebase/database";
import { AppContext } from "../../Context/AppContext";
import Compressor from "compressorjs";
import { clearString } from "../../Utils/constants";
import useProjectsDB from "../../Hooks/useProjectsDB";
import useProjectsStorage from "../../Hooks/useProjectsStorage";
import ParentUploadingCom from "../../Reuseable Components/ParentUploadingCom";
import useNavToLoginCom from "../../Hooks/useNavToLogin";

const UploadProject = () => {
  const {projects, setProjects, setUploadingState } = useContext(AppContext);

  const [uploadItems, setUploadItems] = useState([]);

  //get realtime database
  useProjectsDB()

  // get storage database
  const projectsStorage = useProjectsStorage();

  useNavToLoginCom()

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
        return !projects.find(
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
          setProjects([]),
        );

      //uploading to database
      if (projectNameExist()) {
        const url =
          "https://firebasestorage.googleapis.com/v0/b/portofolio-6fbe1.appspot.com/o/";
        set(dbRef(database, "/" + projects.length), {
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

  return <ParentUploadingCom uploadingOpreation={uploadingOpreation}/>;
};

export default UploadProject;
