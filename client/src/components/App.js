import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import DreamLogs from "./PublicDreamLogs";
import PersonalLogs from "./PersonalLogs";
import CreateLog from "./CreateLog";
import About from "./About";
import "../styles/App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/dreamlogs" component={DreamLogs} />
          <Route path="/about" component={About} />
          <Route path="/personallogs" component={PersonalLogs} />
          <Route path="/create" component={CreateLog} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
