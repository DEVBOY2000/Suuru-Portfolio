import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../Firebase/Firebase";

const useProjectsStorage = () => {
    const [projectsStorage,setProjectsStorage] = useState({});

    //get projects folders
    useEffect(() => {
    if (!projectsStorage.length) {
      const listItemsRef = ref(storage, "Projects");
      listAll(listItemsRef).then(({ prefixes }) => {
        const object = {};
        prefixes.map((item) => {
          object[item.name] = [];
          const itemRef = ref(storage, `Projects/${item.name}`);
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

  return projectsStorage;
};

export default useProjectsStorage;