import React from "react";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MobMenuIcon = ({ listsState, setListsState }) => {
  return (
    <div
      className="cursor-pointer ml-auto mr-2"
      onClick={() => setListsState(!listsState)}
    >
      {listsState ? (
        <FontAwesomeIcon icon={faXmark} />
      ) : (
        <FontAwesomeIcon icon={faChevronDown} />
      )}
    </div>
  );
};

export default React.memo(MobMenuIcon);
