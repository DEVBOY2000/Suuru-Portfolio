import { useCallback, useContext, useEffect, useState } from "react";
import { storage, database } from "../../Firebase/Firebase";
import { listAll, ref as storageRef, uploadBytes } from "firebase/storage";
import { ref as dbRef, set, push } from "firebase/database";

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
  const [projects, setProjects] = useState([]);

  //get realtime database
  useProjectsDB();

  useNavToLoginCom();

  // ...existing code...
  const uploadingOpreation = useCallback(async () => {
    if (!uploadItems.length) return;
    const projectNamePrompt = window.prompt("type project name");
    if (!projectNamePrompt) return;

    const videosArr = uploadItems.filter((e) => e.type.includes("video"));
    const imagesArr = uploadItems.filter((e) => e.type.includes("image"));

    // تحقق من وجود المشروع مرة واحدة فقط
    const projectContent = (() => {
      const exist = projects.find((project) =>
        project.name.startsWith(projectNamePrompt)
      );
      if (!exist) return undefined;
      const projectRef = storageRef(storage, exist?.fullPath);
      return listAll(projectRef).then(({ items }) => ({
        lastVideosIndex: items.filter((item) => item.name.includes("animation"))
          .length,
        lastImagesIndex: items.filter((item) => item.name.includes("extra"))
          .length,
      }));
    })();

    // تجهيز الملفات
    const fileHandler = (items, startIndex, type, contentType) =>
      items.map((item, i) => {
        const file = new File(
          [item],
          `${type} (${startIndex + i}).${contentType}`,
          { type: contentType === "jpg" ? "image/jpg" : "video/mp4" }
        );
        file.oldName = item.name;
        return file;
      });

    const projectData = projectContent;
    const videos = fileHandler(
      videosArr,
      projectData ? projectData.lastVideosIndex + 1 : 1,
      "animation",
      "mp4"
    );
    const images = fileHandler(
      imagesArr,
      projectData ? projectData.lastImagesIndex + 1 : 1,
      "extra",
      "jpg"
    );
    const result = [...videos, ...images];

    // رفع الملفات
    async function uploading(index) {
      if (index < 0) {
        setLoadingState(false);
        return;
      }
      const file = result[index];
      let fileToUpload = file;
      if (file.type.includes("image")) {
        fileToUpload = await new Promise(
          (resolve) =>
            new Compressor(file, {
              quality: 0.4,
              convertTypes: "image/jpg",
              convertSize: 800000,
              success: (blob) =>
                resolve(new File([blob], file.name, { type: "image/jpg" })),
            })
        );
      }
      const existProject = projects.find((project) =>
        clearString(project.name).startsWith(clearString(projectNamePrompt))
      );
      const projectRef = storageRef(
        storage,
        `Projects/${existProject ? existProject.name : projectNamePrompt}/${
          fileToUpload.name
        }`
      );
      try {
        await uploadBytes(projectRef, fileToUpload);
        // احذف الملف من uploadItems بعد رفعه
        setUploadItems((prev) => prev.filter((_, i) => i !== index));
        setCurrUploadingIndex((prev) => prev - 1);
        uploading(index - 1);
      } catch (error) {
        console.log(error);
        setLoadingState(false);
      }
    }

    // إضافة المشروع للداتابيز إذا مش موجود
    if (!projectData) {
      const url =
        "https://firebasestorage.googleapis.com/v0/b/portofolio-6fbe1.appspot.com/o/";
      await push(dbRef(database), {
        name: projectNamePrompt,
        image: `${url}${encodeURIComponent(
          "Projects/" + projectNamePrompt + "/"
        )}extra%20(1).jpg?alt=media`,
        video: `${url}${encodeURIComponent(
          "Projects/" + projectNamePrompt + "/" + "animation (1).mp4"
        )}?alt=media`,
      }).catch((error) => console.error(error));
    } else {
      alert(
        "This Project Is Exist, But These Items Will Upload To Same Project"
      );
    }
    setLoadingState(true);
    uploading(result.length - 1);
  }, [
    uploadItems,
    projects,
    setUploadItems,
    setLoadingState,
    setCurrUploadingIndex,
    database,
    storage,
  ]);
  // ...existing code...

  useEffect(() => {
    if (!projects.length) {
      const listItemsRef = storageRef(storage, `Projects`);
      listAll(listItemsRef).then(({ prefixes }) => setProjects(prefixes));
    }
  }, [projects.length]);

  return <ParentUploadingCom uploadingOpreation={uploadingOpreation} />;
};

export default UploadProject;
