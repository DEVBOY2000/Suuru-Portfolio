import React, {
  useContext,
  useEffect,
  lazy,
  useRef,
} from "react";
import { getDownloadURL, list, ref } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import { useScrollToElement } from "../../Hooks/useScrollToElement";
const Item = lazy(() => import("./Item"));

const Items = () => {
  const {
    currentProjectItems,
    setCurrentProjectItems,
    deletionState,
    MoreItems,
    setMoreItems,
    prevProjectName,
  } = useContext(AppContext);

  const { name } = useParams();

  const componentRef = useRef();

  useScrollToElement("items", deletionState);

  //get currentProjectItems
  //use list insted of listAll to use maxResult property
  useEffect(() => {
    const listItemsRef = ref(storage, `Projects/${name}`);
    const dataStorage = async () => await list(listItemsRef, {maxResults : 10, pageToken : MoreItems.pageToken});
    const getItems = async () => {
      const {items, nextPageToken} = await dataStorage();
      return Promise.all(items.map(async (item) => await getDownloadURL(item))).then((response) => {
        setMoreItems({state : false, pageToken : nextPageToken, noMoreITems : (nextPageToken ? false : true )})
        return response
      })
    }

    dataHandler();

    async function dataHandler(){
      if (!MoreItems.noMoreITems) {
        if ((!currentProjectItems.lenght && !MoreItems.state && !MoreItems.pageToken)) {
          const firstItems = await getItems();
          setCurrentProjectItems([...firstItems]);
        } else if ((MoreItems.state && MoreItems.pageToken)) {
          const restItems = await getItems();
          setCurrentProjectItems(([...currentProjectItems, ...restItems]));
        }
      }
    } 

  }, [name, prevProjectName ,currentProjectItems.lenght, MoreItems.state, MoreItems.pageToken, MoreItems.noMoreITems]);

  return (
    <>
      <section
        ref={componentRef}
        id="items"
        className="min-h-[calc(100vh_-_(57px_+_24px_+_72px))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 auto-rows-[450px] lg:auto-rows-[500px] gap-3 p-3 dark:bg-dark-color bg-white relative z-20"
      >
        {currentProjectItems.map((item, i) => (
          <Item item={item} index={i} key={i} />
        ))}
      </section>
    </>
  );
  s;
};

export default Items;
