import {
  faXTwitter,
  faPatreon,
  faDeviantart,
} from "@fortawesome/free-brands-svg-icons";
import DownloadButton from "../Components/OptionButtons/DownloadButton";
import UploadButton from "../Components/OptionButtons/UploadButton";
import DeleteButton from "../Components/OptionButtons/DeleteButton";

import video1 from "../Components/Auth/videos/video (1).mp4";
import video2 from "../Components/Auth/videos/video (2).mp4";
import video3 from "../Components/Auth/videos/video (3).mp4";
import video4 from "../Components/Auth/videos/video (4).mp4";

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
  { src: video1, position: "30%" },
  { src: video2, position: "left" },
  { src: video3, position: "10%" },
  { src: video4, position: "75%" },
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
  if (pathname.replace(/\//g, "") === "Suuru-Portfolio") {
    return "mb-[92px] sm:mb-[72px]" 
  } else if (pathname.includes("/project")) {
    return "mb-[-60px] min-h-[calc(100vh_-_92px)] min-h-[calc(100vh_-_96px)] sm:min-h-[calc(100vh_-_72px)] pt-[57px]";
  } else if (pathname.includes("/uploadProject") || pathname.includes("/uploadToProject")) {
    return "min-h-[calc(100vh_-_92px)] h-[calc(100vh_-_96px)] sm:h-[calc(100vh_-_72px)] pt-[64px] sm:mb-[72px] overflow-auto"
  } else if (pathname.includes("/login")) {
    return "min-h-[calc(100vh_-_92px)] h-[calc(100vh_-_96px)] sm:h-[calc(100vh_-_72px)] h-[100vh_!important]"
  }
}
