import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { loginVideos } from "../../Utils/constants";
import googleIcon from "./Google icon.png";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider, storage } from "../../Firebase/Firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
// import useHeaderVideo from "../../Hooks/useHeaderVideo";
import { getDownloadURL, listAll, ref } from "firebase/storage";

const Auth = () => {
  const { signIn, setSignIn, rememberMe, setRememberMe } =
    useContext(AppContext);

  const [randomVideo, setRandomVideo] = useState("");

  const randomNumber =
    Math.floor(Math.random() * Object.keys(loginVideos).length) ||
    Math.floor(Math.random() * Object.keys(loginVideos).length) + 1;

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

  const navTo = useNavigate();

  useEffect(() => {
    if (signIn?.email) {
      navTo("/Suuru-Portfolio");
    }
  }, [signIn?.email]);

  // const video = useHeaderVideo(`auth (${randomNumber}).mp4`);

  useEffect(() => {
    if (!randomVideo) {
      const refrance = ref(storage, `/Banner`);
      listAll(refrance).then(({ items }) => {
        const filteredItemsRef = items.filter((item) =>
          item.name.includes("auth")
        );
        const randomNum = Math.floor(Math.random() * filteredItemsRef.length);
        getDownloadURL(filteredItemsRef[randomNum]).then((data) =>
          setRandomVideo(data)
        );
      });
    }
  }, [randomVideo]);

  return (
    <section className="relative text-white normal-case h-full">
      <article className="absolute w-full h-full top-0 left-0">
        <div className="relative w-full h-full">
          <div className="w-full h-full absolute top-0 left-0 z-10">
            {/*prevent access video cotrolls */}
          </div>
          <video
            autoPlay
            loop
            muted
            className={`w-full h-full object-cover object-center`}
            src={randomVideo}
            preload="auto"
          >
            {/* <source src={video} type="video/mp4" /> */}
          </video>
        </div>
      </article>
      <article className="w-[90%] xs:w-[350px] bg-black/35 backdrop-blur-sm rounded-md absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-7 gap-6">
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
      </article>
    </section>
  );
};

export default Auth;
