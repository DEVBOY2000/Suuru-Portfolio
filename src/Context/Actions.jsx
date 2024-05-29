import JSZip from "jszip";
import { saveAs } from "file-saver";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../Firebase/Firebase";
import { unEncodedStr } from "../Utils/constants";

export const nextView = (items, currView, handler) => {
  const index = items.findIndex((e) => e === currView);

  return index < items.length - 1
    ? handler(items[index + 1])
    : handler(items[0]);
};

export const prevView = (items, currView, handler) => {
  const index = items.findIndex((e) => e === currView);

  return index > 0
    ? handler(items[index - 1])
    : handler(items[items.length - 1]);
};

export const toggleEditHandler = (
  editState,
  setEditState,
  setOptBtnsState,
  setCurrentIcon,
  currIconName = "fa-solid fa-pen-to-square",
  setEditingOpration,
  id
) => {
  let time;
  if (!editState) {
    setEditState(true);
    setOptBtnsState(true);
    setCurrentIcon("fa-solid fa-xmark");
  } else {
    const modal = document.getElementById("Modal");
    modal.classList.replace("animate-fadeIn", "animate-fadeOut");
    time = setTimeout(() => {
      setEditState(false);
    }, 300);
    setCurrentIcon(currIconName);
    setOptBtnsState(false);
  }
  if (currIconName !== "fa-solid fa-pen-to-square") {
    setEditingOpration({ type: id, state: true });
  } else {
    setEditingOpration({ type: "", state: false });
  }
  return () => clearTimeout(time);
};

export const selectedItemsHandler = (item, setSelectedItems) => {
  setSelectedItems((prev) => {
    const index = prev.indexOf(item);
    return index === -1 ? [...prev, item] : prev.filter((e) => e !== item);
  });
};

export const resetEditingStateHandler = (
  setCurrentIcon,
  setEditingOpration,
  setSelectedItems
) => {
  setEditingOpration({ type: "", state: false });
  setCurrentIcon("fa-solid fa-pen-to-square");
  setSelectedItems([]);
};

export const deletedItemsHandler = (
  selectedItems,
  name,
  setCurrentProjectItems,
  setCurrentIcon,
  setEditingOpration,
  setSelectedItems
) => {
  selectedItems.forEach((item) => {
    const itemRef = ref(storage, `${item}`);
    deleteObject(itemRef).finally(() => {
      function filteringItems(prevState) {
        const filteredItems = prevState.filter(
          (item) => !selectedItems.includes(item)
        );
        return filteredItems;
      }
      setCurrentProjectItems((prev) => filteringItems(prev));
      resetEditingStateHandler(
        setCurrentIcon,
        setEditingOpration,
        setSelectedItems
      );
    });
  });
};

export const downloadItemsHandler = async (
  selectedItems,
  name,
  setCurrentIcon,
  setEditingOpration,
  setSelectedItems
) => {
  const zip = new JSZip();
  const folder = zip.folder(name);
  return Promise.all(
    selectedItems.map(async (url) => {
      const projectNameIndex = url.indexOf(name.split(/\s/)[0]);
      const questionMarkIndex = url.indexOf("?");
      const fileName = unEncodedStr(
        url.substring(projectNameIndex, questionMarkIndex)
      );
      const imgBlob = await (await fetch(url)).blob();
      const file = new File([imgBlob], fileName);
      folder.file(file.name, file);
    })
  ).then(
    () =>
      folder.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${name}.zip`);
      }),
    resetEditingStateHandler(
      setCurrentIcon,
      setEditingOpration,
      setSelectedItems
    )
  );
};

export const uplodingItemsHandler = (setSelectedItems, item) => {};
