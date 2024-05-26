import React, { useContext, useEffect, useState } from "react";
import { storage } from "../../Firebase/Firebase";
import {
  listAll,
  ref as stRef,
  uploadBytes,
} from "firebase/storage";
import { AppContext } from "./../../Context/AppContext";
import Compressor from "compressorjs";
import ParentUploadingCom from "../../Reuseable Components/ParentUploadingCom";
import useNavToLoginCom from "../../Hooks/useNavToLogin";
import { useParams } from "react-router-dom";
import useProjectsStorage from "../../Hooks/useProjectsStorage";

const UploadToProject = () => {
  const { currentProjectItems, setUploadingState, uploadItems, setUploadItems, setCurrUploadingIndex} = useContext(AppContext);
  let {currUploadingIndex} = useContext(AppContext);
  const [projectFiles, setProjectFiles] = useState({lastVideoIndex: 0, lastImageIndex : 0});

  useNavToLoginCom()

  const folderName = useParams();

  const uploadingOpreation = () => {
    if (!uploadItems.length) return;
    //rename files to extra ...
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
    
    setUploadingState(true);
    uploading();

    function uploading() {
      if (currUploadingIndex >= 0) {
        if (result[currUploadingIndex].type.includes("image")) {
          return new Compressor(result[currUploadingIndex], {
            quality: 0.6,
            convertTypes: "image/jpg",
            convertSize: 700000,
            width: 1200,
            height: 1600,
            success(blob) {
              return uploadingByType(blob, "image/jpg");
            },
          });
        } else return uploadingByType(result[currUploadingIndex], "video/mp4");
      } else {
        setUploadItems([]);
        setUploadingState(false)
      }

      function uploadingByType(fileOBJ, type) {
        let timer;
        const newFile = new File([fileOBJ], fileOBJ.name, { type });
        const projectRef = stRef(
          storage,
          `Projects/${folderName.name}/${fileOBJ.name}`
        );
        timer = setTimeout(async() => {
          if (currUploadingIndex >= 0) {
            try {
              await uploadBytes(projectRef, newFile)
              setUploadItems(uploadItems.slice(0, currUploadingIndex))
              setCurrUploadingIndex(currUploadingIndex -=1 );
              currUploadingIndex < 0 && clearTimeout(timer);
              uploading()
            } catch (error) {
              console.log(error)
            }
          }
        }, 300)
      };
    }
  };


  useEffect(() => {
    const listItemsRef = stRef(storage, `Projects/${folderName.name}`);
      listAll(listItemsRef).then(({items}) => {
        setProjectFiles({
          lastVideoIndex : items.filter(item => item.name.includes("mp4")).length,
          lastImageIndex : items.filter(item => item.name.includes("jpg")).length
        })
      })
  }, [folderName.name])

  return  <ParentUploadingCom uploadingOpreation={uploadingOpreation}/>;
};

export default UploadToProject;
