import { useContext, useEffect } from "react";
import { getDownloadURL, list, ref } from "firebase/storage";
import { storage } from "../Firebase/Firebase";
import { AppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";

const useProjectStorage = () => {
  const {
    currentProjectItems,
    setCurrentProjectItems,
    MoreItems,
    setMoreItems,
    prevProjectName,
  } = useContext(AppContext);

  const { name } = useParams();

  //use list insted of listAll to use maxResult property
  useEffect(() => {
    const listItemsRef = ref(storage, `Projects/${name}`);
    const dataStorage = async () =>
      await list(listItemsRef, {
        maxResults: 10,
        pageToken: MoreItems.pageToken,
      });
    const getItems = async () => {
      const { items, nextPageToken } = await dataStorage();
      return Promise.all(
        items.map(async (item) => await getDownloadURL(item))
      ).then((response) => {
        setMoreItems({
          state: false,
          pageToken: nextPageToken,
          noMoreITems: nextPageToken ? false : true,
        });
        return response;
      });
    };

    dataHandler();

    async function dataHandler() {
      if (!MoreItems.noMoreITems) {
        if (
          !currentProjectItems.lenght &&
          !MoreItems.state &&
          !MoreItems.pageToken
        ) {
          const firstItems = await getItems();
          setCurrentProjectItems([...firstItems]);
        } else if (MoreItems.state && MoreItems.pageToken) {
          const restItems = await getItems();
          setCurrentProjectItems([...currentProjectItems, ...restItems]);
        }
      }
    }
  }, [
    name,
    prevProjectName,
    currentProjectItems.lenght,
    MoreItems.state,
    MoreItems.pageToken,
    MoreItems.noMoreITems,
  ]);
};

export default useProjectStorage;
