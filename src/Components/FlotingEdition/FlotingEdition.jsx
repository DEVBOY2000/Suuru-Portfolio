import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import OptionButton from "./OptionButton";
import { optionButtons } from "../../Utils/constants";
import { useParams } from "react-router-dom";

const FlotingEdition = () => {
  const {
    editState,
    optBtnsState,
    toggleEditHandler,
    currentIcon,
    editingOpration,
    selectedItems,
    resetEditingStateHandler,
    downloadItemsHandler,
    deletedItemsHandler,
    signIn,
  } = useContext(AppContext);

  const { name } = useParams();

  const editingButtonHandler = () => {
    if (!editingOpration.state) {
      toggleEditHandler();
    }

    switch (editingOpration.type) {
      case "DeleteButton":
        deletedItemsHandler(name);
        break;
      case "DownloadButton":
        downloadItemsHandler(name);
        break;
    }
  };

  useEffect(() => {
    if (editState) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [editState]);

  useEffect(() => {
    resetEditingStateHandler();
  }, [name]);

  return (
    <div className="sticky bottom-5 float-right right-5 min-h-[60px] mb-[92px] sx:mb-[96px] sm:mb-[72px] z-50 flex gap-2">
      <button
        className="active:scale-95 select-none relative z-30 w-[60px] h-[60px] rounded-full shadow-xl shadow-gray dark:bg-white bg-dark-color dark:text-black text-white transition-colors flex justify-center items-center"
        onClick={editingButtonHandler}
      >
        <FontAwesomeIcon icon={currentIcon} />
        {editingOpration.state && selectedItems.length ? (
          <span className="absolute right-0 -top-3 dark:text-black dark:bg-white text-white bg-dark-color text-xs line-clamp-[1.3rem] text-center w-[20px] h-[20px] rounded-full">
            {selectedItems.length}
          </span>
        ) : (
          false
        )}
      </button>
      {editingOpration.state && (
        <button
          className="active:scale-95 select-none relative z-30 w-[60px] h-[60px] rounded-full shadow-xl shadow-gray dark:bg-white bg-dark-color dark:text-black text-white transition-colors flex justify-center items-center"
          onClick={resetEditingStateHandler}
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      )}
      {editState &&
        optionButtons.map((button) => (
          <OptionButton
            key={button.id}
            style={button.class}
            id={button.id}
            state={optBtnsState}
            name={button.name}
            signInState={signIn?.email ? true : false}
          >
            {button.component}
          </OptionButton>
        ))}
    </div>
  );
};

export default FlotingEdition;
