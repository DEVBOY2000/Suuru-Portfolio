import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import CircleLoading from "../../Reuseable Components/CircleLoading";

const RestItems = () => {
  const [loadingState, setLoadingState] = useState(false);
  const { setMoreItems, MoreItems } = useContext(AppContext);
  const restItemsRef = useRef();

  function startLoadingMore() {
    let timer;
    timer = setTimeout(
      () => setLoadingState(true),
      setMoreItems({
        state: true,
        pageToken: MoreItems.pageToken,
        noMoreITems: false,
      }),
      300
    );
    return () => loadingState && clearTimeout(timer);
  }

  useEffect(() => {
    if (!MoreItems.state) {
      setLoadingState(false);
    }
  }, [MoreItems.state]);

  return (
    <div
      role="status"
      className="h-[80px] flex justify-center items-center relative dark:bg-dark-color bg-white "
      ref={restItemsRef}
    >
      {loadingState ? (
        <CircleLoading />
      ) : (
        <button
          className="px-3 py-2 dark:bg-white bg-black dark:text-black text-white capitalize rounded-md active:scale-95"
          onClick={startLoadingMore}
        >
          load more
        </button>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default RestItems;
