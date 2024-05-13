import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Modal = () => {
  const { toggleEditHandler } = useContext(AppContext);

  return (
    <div
      id="Modal"
      className="w-full h-full fixed top-0 left-0 bg-black/70 z-20 animate-fadeIn"
      onClick={() => toggleEditHandler()}
    />
  );
};

export default Modal;
