import React from "react";
import { useHistory } from "react-router-dom";
import { Image } from "semantic-ui-react";
import "../styles/Home.css";

export default function Home() {
  const history = useHistory();

  const navigateToPath = (path) => {
    history.push(path);
  };

  return (
    <div className="home">
      <Image
        src="background.JPG"
        size="large"
        alt="a person sleeping, dreaming of space"
        bordered
      />
      <h1>Welcome to Dream Logger</h1>
      <div>
        <button
          className="ui primary button"
          onClick={() => navigateToPath("/login")}
        >
          Login
        </button>
        <button
          className="ui secondary button"
          onClick={() => navigateToPath("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
