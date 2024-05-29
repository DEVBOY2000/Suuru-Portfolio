import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { footerIconsArray } from "../../Utils/constants";
import { useLocation } from "react-router-dom";

import kemonoIcon from "./../../Utils/Images/kemono.png";
const Footer = () => {
  const { pathname } = useLocation();

  const handlingClass = () =>
    pathname === "/Surru-Portfolio/uploadProject" ? "" : "fixed -z-10 bottom-0";

  const loginRouteClassess = () =>
    pathname.includes("login")
      ? "dark:bg-dark-color/50 bg-white/45 backdrop-blur-sm z-10"
      : "dark:bg-dark-color bg-white";

  return (
    <footer
      id="footer"
      className={`${loginRouteClassess()} ${handlingClass()} py-3 w-full dark:text-white transition-colors text-black`}
    >
      <div className="flex justify-between items-center px-5 flex-col sm:flex-row-reverse">
        <ul className="flex">
          {footerIconsArray.map((list) => (
            <li key={list.name} className="m-3 block">
              <a href={list.url} target="_blank" title={list.name} aria-label={`go to ${list.url}`}>
                <FontAwesomeIcon icon={list.icon} className="text-xl" />
              </a>
            </li>
          ))}
          <li className="m-3 block">
            <a
              href="https://kemono.su/patreon/user/35774903"
              target="_blank"
              title="Kemono"
              aria-label="go to patreon"
            >
              <img
                src={kemonoIcon}
                className="w-[20px] h-[20px] mt[2px] invert dark:invert-0"
                alt="kemonoIcon"
              />
            </a>
          </li>
        </ul>
        <p className="text-sm xs:text-base">
          © {new Date().getFullYear()} Suuru Art, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
