import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lists from "./Lists";
import ListsMobView from "./ListsMobView";
import useMediaQuery from "../../Hooks/useMediaQuery";
import MobMenuIcon from "./MobMenuIcon";
import Theme from "./Theme";
import Account from "./Account";
import { AppContext } from "../../Context/AppContext";

const Navbar = () => {
  const [scrollTop, setScrollTop] = useState(false);
  const [listsState, setListsState] = useState(false);
  const { signIn } = useContext(AppContext);

  const { pathname } = useLocation();

  const lessThanDesktop = useMediaQuery("(max-width: 768px)");

  const StylesHandler = useCallback(
    //home section id
    (home) => {
      if (pathname === "/Surru-Portfolio") {
        return scrollTop ? home.active : home.unactive;
      } else {
        return home.active;
      }
    },
    [pathname, scrollTop]
  );

  const navTo = useNavigate();

  useEffect(() => {
    listsState && setListsState(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY >= 100
        ? !scrollTop && setScrollTop(true)
        : setScrollTop(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed z-30 p-3 w-full text-white flex sm:justify-between items-center transition-colors  ${StylesHandler(
        {
          active:
            "!bg-white/45 !text-black shadow-2xl shadow-black/20 shadow-black-500/50 dark:!bg-dark-color/50 dark:!text-white backdrop-blur-sm",
          unactive: "bg-transparent !text-white",
        }
      )}`}
    >
      <div onClick={() => navTo("/Suuru-Portfolio")} className="cursor-pointer">
        <h3 className="uppercase text-[16px] tracking-[7px] leading-[15px] font-bold">
          suuru
        </h3>
        <p className="text-[12px]">creative studio</p>
      </div>
      {!lessThanDesktop ? (
        <Lists StylesHandler={StylesHandler} />
      ) : (
        <>
          <MobMenuIcon listsState={listsState} setListsState={setListsState} />
          <Theme StylesHandler={StylesHandler} />
          {signIn?.email && <Account />}
        </>
      )}
      {listsState && <ListsMobView StylesHandler={StylesHandler} />}
    </nav>
  );
};

export default Navbar;
