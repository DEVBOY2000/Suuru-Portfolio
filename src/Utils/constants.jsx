import {
  faXTwitter,
  faPatreon,
  faDeviantart,
} from "@fortawesome/free-brands-svg-icons";
import DownloadButton from "../Components/OptionButtons/DownloadButton";
import UploadButton from "../Components/OptionButtons/UploadButton";
import DeleteButton from "../Components/OptionButtons/DeleteButton";

export const navbarLists = {
  home: "",
  "upload project": "uploadProject",
  "sign in": "login",
};

export const footerIconsArray = [
  {
    name: "Patreon",
    icon: faPatreon,
    url: "https://www.patreon.com/suuru",
  },
  {
    name: "Twitter",
    icon: faXTwitter,
    url: "https://twitter.com/Suuru_",
  },
  {
    name: "Deviantart",
    icon: faDeviantart,
    url: "https://www.deviantart.com/suuruart",
  },
];

export const optionButtons = [
  {
    class: "bottom-[50px] right-[70px]",
    id: "DeleteButton",
    component: <DeleteButton />,
    name: "fa-solid fa-trash",
  },
  {
    class: "bottom-[80px] right-[25px]",
    id: "DownloadButton",
    component: <DownloadButton />,
    name: "fa-solid fa-download",
  },
  {
    class: "bottom-[0px] right-[80px]",
    id: "UploadButton",
    component: <UploadButton />,
    name: "fa-solid fa-upload",
  },
];

export const loginVideos = [
  { src: "auth (1)", position: "30%" },
  { src: "auth (2)", position: "left" },
  { src: "auth (3)", position: "10%" },
  { src: "auth (4)", position: "75%" },
  { src: "auth (5)", position: "38%" },
];

export const unEncodedStr = (string) => {
  const matchOBj = { "%20": " ", "%5B": "[", "%5D": "]", "%2F": "/" };
  Object.keys(matchOBj).map((e) => {
    const reg = new RegExp(e, "g");
    string = string.replace(reg, matchOBj[e]);
  });
  return string;
};

export const clearString = (string) => {
  return string.replace(/[\[\]\(\)]/gi, "");
};

export const parentAppComStyle = (pathname) => {
  const fullHightScreen =
    "min-h-[calc(100vh_-_92px)] h-[calc(100vh_-_96px)] sm:h-[calc(100vh_-_72px)]";

  const routesStyleObject = {
    home: "mb-[92px] sm:mb-[72px]",
    project:
      "min-h-[calc(100vh_-_92px)] min-h-[calc(100vh_-_96px)] sm:min-h-[calc(100vh_-_72px)] pt-[57px] mb-[-60px]",
    uploading: `${fullHightScreen} pt-[64px] sm:mb-[72px] overflow-auto`,
    login: `${fullHightScreen} h-[100vh_!important]`,
  };

  if (pathname === "/Suuru-Portfolio" || pathname === "/Suuru-Portfolio/") {
    return routesStyleObject.home;
  } else if (pathname.includes("/project")) {
    return routesStyleObject.project;
  } else if (
    pathname.includes("/uploadProject") ||
    pathname.includes("/uploadToProject")
  ) {
    return routesStyleObject.uploading;
  } else if (pathname.includes("/login")) {
    return routesStyleObject.login;
  }
};

export const uploadURLHandler = async (uploadItems, setUploadItems) => {
  const prompt = window.prompt("type your link");
  if (prompt) {
    const xhr = new XMLHttpRequest();

    // Use JSFiddle logo as a sample image to avoid complicating
    // this example with cross-domain issues.
    xhr.open("GET", prompt, true);

    // Ask for the result as an ArrayBuffer.
    xhr.responseType = "arraybuffer";

    xhr.onload = function (e) {
      // Obtain a blob: URL for the image data.
      const arrayBufferView = new Uint8Array(this.response);
      const types = ["mp4", "jpg"];
      const getType = types.find((e) => prompt.includes(e));

      const blob = new Blob([arrayBufferView], {
        type: `${getType === "mp4" ? "video/mp4" : "image/jpg"}`,
      });
      // const urlCreator = window.URL || window.webkitURL;
      // const imageUrl = urlCreator.createObjectURL(blob);
      const file = new File([blob], `img (${uploadItems.length})`, {
        type: blob.type,
      });
      setUploadItems((prev) => [...prev, file]);
    };

    xhr.send();
  }
};

export const activePreview = (item, projects, name) => {
  return item.includes("mp4")
    ? projects.find((project) => project.name === name)?.video
    : projects
        .find((project) => project.name === name)
        ?.image.replace("Prviews%2F", "");
};
