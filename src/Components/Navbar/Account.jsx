import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";

const Account = () => {
  const { signIn, setSignIn } = useContext(AppContext);

  const [menuState, setMenuState] = useState(false);

  const signOutHandler = () => {
    signOut(auth)
      .then(() => setSignIn({}), sessionStorage.removeItem("auth"))
      .catch((error) => console.error(error));
  };

  return (
    <div className="relative rounded-full order-3">
      <div
        className="cursor-pointer active:scale-95"
        onClick={() => setMenuState(!menuState)}
      >
        {!signIn.displayName ? (
          <FontAwesomeIcon icon="fa-solid fa-circle-user" size="2x" />
        ) : (
          <img
            src={signIn.photoURL}
            title={signIn.displayName}
            className="w-[33px] rounded-full"
          />
        )}
      </div>
      {menuState && (
        <div className="absolute p-2 rounded-md bg-white top-[47px] right-0 dark:text-black border-2 border-gray-200">
          <div className="w-[150px] flex gap-2 items-center">
            <span>name : </span>
            <span className="w-[90px] text-sm inline-block overflow-hidden text-ellipsis whitespace-nowrap">
              {signIn.displayName || signIn.email}
            </span>
          </div>
          <button
            onClick={signOutHandler}
            className="bg-white hover:bg-dark-color hover:text-white text-gray-800 font-semibold py-1 px-2 mx-auto block mt-4 capitalize border-2 border-slate-900 text-sm rounded shadow"
          >
            sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
