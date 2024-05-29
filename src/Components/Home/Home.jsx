import React, { Fragment, useRef } from "react";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";

const Home = () => {

  // const observer = new IntersectionObserver();

  const projecstRef = useRef(null);

  console.log(projecstRef.current)

  return (
    <Fragment>
      <Header />
      <Projects ref={projecstRef}/>
    </Fragment>
  );
};

export default Home;
