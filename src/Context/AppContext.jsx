import React, { createContext, useState } from "react";
import {
  nextView,
  prevView,
  toggleEditHandler,
  resetEditingStateHandler,
  selectedItemsHandler,
  downloadItemsHandler,
  deletedItemsHandler,
  uplodingItemsHandler,
} from "./Actions";

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [searchedProjects, setSearchedProjects] = useState([]);
  const [currentProjectItems, setCurrentProjectItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentView, setCurrentView] = useState("");
  const [editState, setEditState] = useState(false);
  const [optBtnsState, setOptBtnsState] = useState(false);
  const [currentIcon, setCurrentIcon] = useState("fa-solid fa-pen-to-square");
  const [editingOpration, setEditingOpration] = useState({
    type: "",
    state: false,
  });
  const [uploadingState, setUploadingState] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [signIn, setSignIn] = useState(() => {
    return JSON.parse(sessionStorage.getItem("auth"))
      ? JSON.parse(sessionStorage.getItem("auth"))
      : {};
  });
  const [MoreItems, setMoreItems] = useState(false);
  const [currentRestItems, setCurrentRestItems] = useState([]);



  const sharedValues = {
    projects,
    setProjects,
    searchedProjects,
    setSearchedProjects,
    currentProjectItems,
    selectedItems,
    setSelectedItems,
    currentView,
    setCurrentProjectItems,
    setCurrentView,
    editState,
    setEditState,
    optBtnsState,
    setOptBtnsState,
    currentIcon,
    setCurrentIcon,
    editingOpration,
    setEditingOpration,
    uploadingState, setUploadingState,
    rememberMe,
    setRememberMe,
    signIn,
    setSignIn,
    MoreItems, setMoreItems,
    currentRestItems, setCurrentRestItems,

    nextView: () => nextView(currentRestItems, currentView, setCurrentView),
    prevView: () => prevView(currentRestItems, currentView, setCurrentView),
    // del_undel_handler: (currTargetView) =>
    //   del_undel_handler(
    //     setDeletionState,
    //     setDeletedItems,
    //     deletionState,
    //     currTargetView
    //   ),
    toggleEditHandler: (currIconName, id) =>
      toggleEditHandler(
        editState,
        setEditState,
        setOptBtnsState,
        setCurrentIcon,
        currIconName,
        setEditingOpration,
        id
      ),
    resetEditingStateHandler: () =>
      resetEditingStateHandler(
        setCurrentIcon,
        setEditingOpration,
        setSelectedItems
      ),
    selectedItemsHandler: (item) =>
      selectedItemsHandler(item, setSelectedItems),

    downloadItemsHandler: (name) =>
      downloadItemsHandler(
        selectedItems,
        name,
        setCurrentIcon,
        setEditingOpration,
        setSelectedItems
      ),
    deletedItemsHandler: (name) =>
      deletedItemsHandler(
        selectedItems,
        name,
        setCurrentProjectItems,
        setCurrentIcon,
        setEditingOpration,
        setSelectedItems
      ),
    uplodingItemsHandler: (name, uploadItems) => uplodingItemsHandler(),
  };

  return (
    <AppContext.Provider value={sharedValues}>{children}</AppContext.Provider>
  );
};
