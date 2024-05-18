import { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const useNavToLoginCom = () => {

    const {signIn} = useContext(AppContext)
    const navTo = useNavigate();
    
    useEffect(() => {
        document.body.classList.remove("overflow-hidden");
        if (!signIn?.email) {
          navTo("/Suuru-Portfolio/login");
        }
    }, [signIn]);
}
 
export default useNavToLoginCom;