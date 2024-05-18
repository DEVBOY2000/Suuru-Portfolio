import React, { useContext, useState } from "react";
import { storage } from "../../Firebase/Firebase";
import {
  ref as stRef,
  uploadBytes,
} from "firebase/storage";
import { AppContext } from "./../../Context/AppContext";
import Compressor from "compressorjs";
import ParentUploadingCom from "../../Reuseable Components/ParentUploadingCom";
import useNavToLoginCom from "../../Hooks/useNavToLogin";

const UploadToProject = () => {
  const { currentProjectItems, setUploadingState } = useContext(AppContext);

  const [uploadItems, setUploadItems] = useState([]);

  useNavToLoginCom()

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
  };

  return  <ParentUploadingCom uploadingOpreation={uploadingOpreation}/>;
};

export default UploadToProject;
