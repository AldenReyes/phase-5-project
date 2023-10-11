import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to Dream Logs</h1>
      <div>
        <Link to="/login">
          <Button primary>Login</Button>
        </Link>
        <Link to="/signup">
          <Button secondary>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
