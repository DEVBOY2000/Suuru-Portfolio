import { useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Theme = ({ StylesHandler }) => {
  const [themeMenu, setThemeMenu] = useState(false);
  const [currTheme, setCurrTheme] = useState("dark");

  const modes = [
    { name: "light", icon: <FontAwesomeIcon icon={faSun} /> },
    { name: "dark", icon: <FontAwesomeIcon icon={faMoon} /> },
  ];

  useEffect(() => {
    document.body.className = currTheme;
  }, [currTheme]);

  return (
    <li
      className={`relative cursor-pointer p-3 py-1 transition-colors list-none ${StylesHandler(
        {
          active: "hover:bg-black hover:text-white",
          unactive: "hover:bg-white hover:text-black",
        }
      )}`}
      onClick={() => setThemeMenu(!themeMenu)}
    >
      <span>Theme</span>
      {themeMenu && (
        <ul className="absolute top-[47px] right-0 bg-white hover:bg-white hover:text-black text-black z-20">
          {modes.map((mode) => (
            <li
              onClick={() => setCurrTheme(mode.name)}
              key={mode.name}
              className={`p-2 px-3 flex ${
                currTheme === mode.name ? "text-white bg-slate-800" : false
              }`}
            >
              <span className="mr-4 w-[16px] h-[16px]">{mode.icon}</span>
              <span className="flex-grow">{mode.name}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Theme;
