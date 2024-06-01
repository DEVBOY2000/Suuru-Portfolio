import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../Firebase/Firebase";

const useHeaderVideo = (name) => {
  const [video, setVideo] = useState("");

  useEffect(() => {
    if (!video) {
      const refrance = ref(storage, `/Banner/${name}`);
      getDownloadURL(refrance).then((data) => setVideo(data));
    }
  }, [video]);

  return video;
};

export default useHeaderVideo;
