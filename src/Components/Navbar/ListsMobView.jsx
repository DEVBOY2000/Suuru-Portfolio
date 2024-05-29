import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { navbarLists } from "../../Utils/constants";
import { AppContext } from "../../Context/AppContext";

const ListsMobView = () => {
  const { pathname } = useLocation();

  const { signIn } = useContext(AppContext);

  const activeLinkHandler = (route) => {
    return pathname === `/Suuru-Portfolio${route}` ||
      pathname === `/Suuru-Portfolio/${route}`
      ? "text-black"
      : "text-gray-400";
  };

  return (
    <div className="fixed bg-white flex-col w-full p-3 -ml-3 top-[57px]">
      <ul>
        {Object.keys(navbarLists).map((item, i) => {
          if (signIn?.email && item === "sign in") return;
          return (
            <Link key={i} to={navbarLists[item]}>
              <li
                className={`py-3 active:text-black hover:text-black transition-colors ${activeLinkHandler(
                  navbarLists[item]
                )}`}
              >
                {item}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default ListsMobView;
