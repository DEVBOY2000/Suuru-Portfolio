import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Modal = () => {
  const { toggleEditHandler } = useContext(AppContext);

  return (
    <main
      id="Modal"
      className="w-full h-full fixed top-0 left-0 bg-black/70 z-40 animate-fadeIn"
      onClick={() => toggleEditHandler()}
    ></main>
  );
};

export default Modal;
