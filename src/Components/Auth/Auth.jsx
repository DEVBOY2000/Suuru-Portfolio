import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { loginVideos } from "../../Utils/constants";
import googleIcon from "./Google icon.png";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider } from "../../Firebase/Firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";

const Auth = () => {
  const { setSignIn, rememberMe, setRememberMe } = useContext(AppContext);

  const [randomNumber, setRandomNumber] = useState(null);

  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const { displayName, photoURL, email } = user;

        setSignIn({ displayName, photoURL, email });
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ displayName, photoURL, email })
        );
        navigation.back();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loginForm = (e) => {
    e.preventDefault();
    const {
      email: { value: emailValue },
      password: { value: passwordValue },
    } = e.target;

    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        const { displayName, photoURL, email } = user;
        setSignIn({ displayName, photoURL, email });
        rememberMe &&
          sessionStorage.setItem(
            "auth",
            JSON.stringify({ displayName, photoURL, email })
          );
        navigation.back();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(
        () => (e.target.email.value = ""),
        (e.target.password.value = "")
      );
  };

  useEffect(() => {
    setRandomNumber(
      Math.floor(Math.random() * Object.keys(loginVideos).length)
    );
  }, [randomNumber]);

  return (
    <div className="relative text-white normal-case h-full">
      <div className="absolute w-full h-full top-0 left-0">
        <div className="relative w-full h-full">
          {/* <img src={img} className="w-full h-full object-cover object-left" /> */}
          <video
            autoPlay
            muted
            loop
            className={`w-full h-full object-cover`}
            src={loginVideos[randomNumber]?.src}
            style={{
              objectPosition: loginVideos[randomNumber]?.position,
            }}
          >
            <source src={loginVideos[randomNumber]?.src} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="w-[90%] xs:w-[350px] bg-black/35 backdrop-blur-sm rounded-md absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-7 gap-6">
        <h1 className="font-bold text-4xl text-center">login</h1>
        <form
          onSubmit={(e) => loginForm(e)}
          className="[&>div>input]:w-full [&>div>input]:text-xs [&>div>input]:text-black flex flex-col gap-5"
        >
          <div className="relative flex rounded-full overflow-hidden bg-white">
            <input
              name="email"
              type="text"
              placeholder="email"
              className="p-2 pl-4 outline-none normal-case"
              autoFocus
            />
            <span className="p-2 pr-3 text-black ">
              <FontAwesomeIcon icon={faUser} size="sm" />
            </span>
          </div>
          <div className="relative flex rounded-full overflow-hidden bg-white">
            <input
              name="password"
              type="password"
              placeholder="password"
              className="p-2 pl-4 outline-none normal-case"
            />
            <span className="p-2 pr-3 text-black ">
              <FontAwesomeIcon icon={faLock} size="sm" />
            </span>
          </div>
          <div className="flex justify-between text-xs xs:text-sm">
            <div>
              <input
                onChange={() => setRememberMe(!rememberMe)}
                checked={rememberMe}
                type="checkbox"
                id="remember-me"
                className="mr-2"
              />
              <label htmlFor="remember-me">remember me</label>
            </div>
            <a className="hover:text-blue-500 cursor-pointer">
              forget password ?
            </a>
          </div>
          <button
            type="submit"
            className="capitalize bg-white text-black rounded-full p-2 font-semibold active:scale-105"
          >
            login
          </button>
          <div className="relative flex justify-between items-center">
            <hr className="w-[44%]" />
            <span className="normal-case">or</span>
            <hr className="w-[44%]" />
          </div>
          <button
            onClick={googleSignIn}
            type="button"
            className="flex justify-center items-center capitalize bg-white text-black rounded-full p-2 font-semibold text-sm active:scale-105"
          >
            <img src={googleIcon} className="w-[30px] mr-2" />
            sign in with google
          </button>
        </form>
        <h6 className="text-center">
          don't have any account ?{" "}
          <a className="font-bold hover:text-blue-500 cursor-pointer">
            register
          </a>
        </h6>
      </div>
    </div>
  );
};

export default Auth;
