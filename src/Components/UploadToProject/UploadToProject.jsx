import { useCallback, useContext, useEffect, useState } from "react";
import { storage } from "../../Firebase/Firebase";
import { listAll, ref as stRef, uploadBytes } from "firebase/storage";
import { AppContext } from "./../../Context/AppContext";
import Compressor from "compressorjs";
import ParentUploadingCom from "../../Reuseable Components/ParentUploadingCom";
import useNavToLoginCom from "../../Hooks/useNavToLogin";
import { useParams } from "react-router-dom";

const UploadToProject = () => {
  const {
    setLoadingState,
    uploadItems,
    setUploadItems,
    setCurrUploadingIndex,
  } = useContext(AppContext);
  const [projectFiles, setProjectFiles] = useState({
    lastVideoIndex: 0,
    lastImageIndex: 0,
  });

  useNavToLoginCom();

  const folderName = useParams();

  const uploadingOpreation = useCallback(() => {
    if (!uploadItems.length) return;

    const result = [...uploadItems].map((item, index) => {
      const file = new File(
        [item],
        item.type.includes("mp4")
          ? `animation (${projectFiles.lastVideoIndex + 1 + index}).mp4`
          : `extra (${projectFiles.lastImageIndex + 1 + index}).jpg`,
        { type: item.type }
      );
      file.oldName = item.name;
      return file;
    });

    setLoadingState(true);

    async function uploading(index) {
      if (index < 0) {
        setUploadItems([]);
        setLoadingState(false);
        return;
      }
      let file = result[index];
      if (file.type.includes("image")) {
        file = await new Promise(
          (resolve) =>
            new Compressor(file, {
              quality: 0.6,
              convertTypes: "image/jpg",
              convertSize: 700000,
              width: 1200,
              height: 1600,
              success(blob) {
                resolve(new File([blob], file.name, { type: "image/jpg" }));
              },
            })
        );
      }
      const projectRef = stRef(
        storage,
        `Projects/${folderName.name}/${file.name}`
      );
      try {
        await uploadBytes(projectRef, file);
        setCurrUploadingIndex((prev) => prev - 1);
        uploading(index - 1);
      } catch (error) {
        console.error(error);
        setLoadingState(false);
      }
    }

    setCurrUploadingIndex(result.length - 1);
    uploading(result.length - 1);
  }, [
    uploadItems,
    projectFiles,
    setUploadItems,
    setLoadingState,
    setCurrUploadingIndex,
    storage,
    folderName.name,
  ]);

  useEffect(() => {
    const listItemsRef = stRef(storage, `Projects/${folderName.name}`);
    listAll(listItemsRef).then(({ items }) => {
      setProjectFiles({
        lastVideoIndex: items.filter((item) => item.name.includes("mp4"))
          .length,
        lastImageIndex: items.filter((item) => item.name.includes("jpg"))
          .length,
      });
    });
  }, [folderName.name]);

  return <ParentUploadingCom uploadingOpreation={uploadingOpreation} />;
};

export default UploadToProject;
