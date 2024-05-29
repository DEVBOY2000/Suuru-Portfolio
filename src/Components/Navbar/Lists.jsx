import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { navbarLists } from "../../Utils/constants";
import Theme from "./Theme";
import { AppContext } from "../../Context/AppContext";
import Account from "./Account";

const Lists = ({ StylesHandler }) => {
  const { signIn } = useContext(AppContext);

  return (
    <ul className="gap-5 flex items-center">
      {Object.keys(navbarLists).map((list, i) => {
        if (signIn?.email && list === "sign in") {
          return <Account key={i} />;
        }
        return (
            <li key={i} className={`${list === "sign in" ? `order-3` : ""}`}>
              <Link
                className={`cursor-pointer p-3 py-1 transition-colors ${StylesHandler(
                  {
                    active: "hover:bg-black hover:text-white",
                    unactive: "hover:bg-white hover:text-black",
                  }
                )}`}
                to={navbarLists[list]}
              >{list}
              </Link>
            </li>
        );
      })}
      <Theme StylesHandler={StylesHandler} />
    </ul>
  );
};

export default Lists;
