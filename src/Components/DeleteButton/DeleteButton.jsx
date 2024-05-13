import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

const DeleteButton = () => {
  const {
    deletedItems,
    setDeletedItems,
    setCurrentProjectItems,
    currentProjectItems,
    setDeletionState,
  } = useContext(AppContext);

  const deletingSelectedItems = () => {
    deletedItems.forEach((item) => {
      const itemRef = ref(storage, `${item}`);
      deleteObject(itemRef).finally(
        () =>
          setCurrentProjectItems(() => {
            const filteredItems = currentProjectItems.filter(
              (item) => !deletedItems.includes(item)
            );
            return filteredItems;
          }),
        setDeletionState(false),
        setDeletedItems([])
      );
    });
  };

  return (
    <div
      onClick={deletingSelectedItems}
      className="cursor-pointer active:scale-95 select-none sticky bottom-5 mb-[96px] sm:mb-[72px] float-right translate-x-[-25px] z-10 w-[60px] h-[60px] rounded-full shadow-xl shadow-gray dark:bg-white bg-dark-color dark:text-black text-white transition-colors flex justify-center items-center"
    >
      <FontAwesomeIcon icon={faTrash} />
      <span className="absolute right-0 -top-3 dark:text-black dark:bg-white text-white bg-black text-xs line-clamp-[1.3rem] text-center w-[20px] h-[20px] rounded-full">
        {deletedItems.length}
      </span>
    </div>
  );
};

export default DeleteButton;
