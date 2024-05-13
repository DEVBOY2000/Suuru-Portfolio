import React, {
  useContext,
  useEffect,
  Suspense,
  lazy,
  useState,
  useRef,
} from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
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
    setCurrentView,
    currentView,
  } = useContext(AppContext);

  const [currentItems, setCurrentItems] = useState([]);
  const [MoreItems, setMoreItems] = useState(false);

  const { name } = useParams();

  const componentRef = useRef();

  useScrollToElement("items", deletionState);

  // useEffect(() => {
  //   setCurrentItems(currentProjectItems[0]);
  // }, [currentView]);

  //get currentProjectItems
  useEffect(() => {
    const listItemsRef = ref(storage, `Projects/${name}`);
    const result = [];
    setCurrentView("");
    listAll(listItemsRef).then(({ items }) =>
      items.forEach((item) =>
        getDownloadURL(item).then((res) => {
          result.push(res);
          const videos = [...result.filter((e) => e.includes("mp4"))];
          const imgs = [...result.filter((e) => !e.includes("mp4"))];
          setCurrentProjectItems([...videos, ...imgs]);
        })
      )
    );
  }, [name]);

  return (
    <>
      <div
        ref={componentRef}
        id="items"
        className="min-h-[calc(100vh_-_(57px_+_24px_+_72px))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 auto-rows-[450px] lg:auto-rows-[500px] gap-3 mx-3"
      >
        {currentProjectItems.map((item, i) => (
          <Item item={item} index={i} key={i} />
        ))}
      </div>
    </>
  );
  s;
};

export default Items;
