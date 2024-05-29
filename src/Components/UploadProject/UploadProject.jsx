import React, { useCallback, useContext, useEffect, useState } from "react";
import { storage, database } from "../../Firebase/Firebase";
import { listAll, ref as storageRef, uploadBytes } from "firebase/storage";

import { ref as dbRef, set } from "firebase/database";
import { AppContext } from "../../Context/AppContext";
import Compressor from "compressorjs";
import { clearString } from "../../Utils/constants";
import useProjectsDB from "../../Hooks/useProjectsDB";
import ParentUploadingCom from "../../Reuseable Components/ParentUploadingCom";
import useNavToLoginCom from "../../Hooks/useNavToLogin";

const UploadProject = () => {
  const {
    setLoadingState,
    uploadItems,
    setUploadItems,
    setCurrUploadingIndex,
  } = useContext(AppContext);
  let { currUploadingIndex } = useContext(AppContext);
  const [projects, setProjects] = useState([]);

  //get realtime database
  useProjectsDB();

  useNavToLoginCom();

  const uploadingOpreation = useCallback(async () => {
    if (!uploadItems.length) return;
    const projectNamePrompt = window.prompt("type project name");
    if (projectNamePrompt) {
      const videosArr = uploadItems.filter((e) => e.type.includes("video"));
      const imagesArr = uploadItems.filter((e) => e.type.includes("image"));

      //check if project is exist in firebase storage
      const projectExistCheck = async () => {
        const projectExist = projects.find((project) =>
          project.name.startsWith(projectNamePrompt)
        );

        if (projectExist) {
          const projectRef = storageRef(storage, projectExist.fullPath);
          const getProjectFiles = async () => await listAll(projectRef);
          const { items } = await getProjectFiles();
          return {
            lastVideosIndex: items.filter((item) =>
              item.name.includes("animation")
            ).length,
            lastImagesIndex: items.filter((item) => item.name.includes("extra"))
              .length,
          };
        }
        return undefined;
      };

      const projectContent = await projectExistCheck();

      //edit file index & name and type
      const fileHandler = async (items, startIndex, type, contentType) => {
        const result = items.map((item, i) => {
          const file = new File(
            [item],
            `${type} (${startIndex + i}).${contentType}`,
            {
              type: "image/jpg",
            }
          );
          file.oldName = item.name;
          return file;
        });
        return result;
      };

      const videos = await fileHandler(
        videosArr,
        (await projectExistCheck()) ? projectContent?.lastVideosIndex + 1 : 1,
        "animation",
        "mp4"
      );
      const images = await fileHandler(
        imagesArr,
        (await projectExistCheck()) ? projectContent?.lastImagesIndex + 1 : 1,
        "extra",
        "jpg"
      );

      const result = [...videos, ...images];

      const existProject = projects.find((project) =>
        clearString(project.name).startsWith(clearString(projectNamePrompt))
      );

      function uploading() {
        if (currUploadingIndex >= 0) {
          if (result[currUploadingIndex].type.includes("image")) {
            return new Compressor(result[currUploadingIndex], {
              quality: 0.4,
              convertTypes: "image/jpg",
              convertSize: 800000,
              success(blob) {
                return uploadingByType(blob, "image/jpg");
              },
            });
          } else
            return uploadingByType(result[currUploadingIndex], "video/mp4");
        } else {
          setUploadItems([]);
          setLoadingState(false);
        }

        function uploadingByType(fileOBJ, type) {
          let timer;
          const newFile = new File([fileOBJ], fileOBJ.name, { type });
          const projectRef = storageRef(
            storage,
            `Projects/${
              existProject ? existProject?.name : projectNamePrompt
            }/${fileOBJ.name}`
          );
          timer = setTimeout(async () => {
            if (currUploadingIndex >= 0) {
              try {
                await uploadBytes(projectRef, newFile);
                setUploadItems(uploadItems.slice(0, currUploadingIndex));
                setCurrUploadingIndex((currUploadingIndex -= 1));
                currUploadingIndex < 0 && clearTimeout(timer);
                uploading();
              } catch (error) {
                console.log(error);
              }
            }
          }, 300);
        }
      }

      // uploading to database
      if (!(await projectExistCheck())) {
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
      } else {
        alert(
          "This Project Is Exist, But These Items Will Upload To Same Project"
        );
      }
      setLoadingState(true);
      // // uploading to storage
      uploading();
    }
  }, [uploadItems.length]);

  useEffect(() => {
    if (!projects.length) {
      const listItemsRef = storageRef(storage, `Projects`);
      listAll(listItemsRef).then(({ prefixes }) => setProjects(prefixes));
    }
  }, [projects.length]);

  return <ParentUploadingCom uploadingOpreation={uploadingOpreation} />;
};

export default UploadProject;
