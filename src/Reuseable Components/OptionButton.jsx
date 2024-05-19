import { memo, useContext } from "react";
import "../Components/OptionButtons/OptionButtons.css";
import { AppContext } from "../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const OptionButton = ({ children, style, id, state, name, signInState }) => {
  const { toggleEditHandler } = useContext(AppContext);
  const navTo = useNavigate();
  const { name: projectName } = useParams();
  const stateHandler = () => (state ? "active" : "not-active");
  const elementClass = `${id === "DownloadButton" ? (signInState ? "active:scale-95" : "") : ""} select-none absolute ${style} w-[40px] h-[40px] rounded-full shadow-xl shadow-gray dark:bg-white bg-dark-color dark:text-black text-white transition-colors flex justify-center items-center`;
  const logIn = signInState
    ? "cursor-pointer opacity-1"
    : id === "UploadButton" || id === "DeleteButton"
    ? "cursor-not-allowed opacity-[0.4] pointer-event-auto"
    : "cursor-pointer";

  const scrollToViewHandler = () => {
    const rect = document.getElementById("items").getBoundingClientRect();
    const navbarHeight = document.getElementById("navbar").offsetHeight;

    if (rect.top >= window.innerHeight / 2) {
      window.scrollBy({
        top: rect.top - navbarHeight - 24,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const buttonEventHandler = () => {
    if (id !== "UploadButton") {
      scrollToViewHandler();
    } else {
      navTo(`uploadToProject/${projectName}`);
    }
    toggleEditHandler(name, id);
  };
  return (
    <button
      id={id}
      className={`${stateHandler()} ${elementClass} ${logIn}`}
      onClick={buttonEventHandler}
      disabled={!signInState ? (id === "DownloadButton" ? false : true) : false}
    >
      {children}
    </button>
  );
};
export default memo(OptionButton);
