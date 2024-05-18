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
    MoreItems,
    setMoreItems,
    currentRestItems, setCurrentRestItems
  } = useContext(AppContext);

  const { name } = useParams();

  const componentRef = useRef();

  useScrollToElement("items", deletionState);


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
          setCurrentRestItems([...videos, ...imgs].slice(0, 10))
        })
      )
    );
  }, [name]);

  useEffect(() => {
    const length = 10;
    let timer;

      if (MoreItems && currentRestItems.length) {
        timer = setTimeout(() => {currentRestItems
          setCurrentRestItems(currentProjectItems.slice(0, length + currentRestItems.length))
          setMoreItems(false)
        }, 700);        
      }

      return () => clearTimeout(timer)
    
  }, [currentRestItems.length,MoreItems])

  return (
    <>
      <div
        ref={componentRef}
        id="items"
        className="min-h-[calc(100vh_-_(57px_+_24px_+_72px))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 auto-rows-[450px] lg:auto-rows-[500px] gap-3 p-3 dark:bg-dark-color bg-white relative z-20"
      >
        {currentRestItems.map((item, i) => (
          <Item item={item} index={i} key={i} />
        ))}
      </div>
    </>
  );
  s;
};

export default Items;
