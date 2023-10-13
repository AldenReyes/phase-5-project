import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import DreamLogs from "./PublicDreamLogs";
import PersonalDreamLogs from "./PersonalDreamLogs";
import CreateLog from "./CreateLog";
import "../styles/App.css";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="/personallogs" component={PersonalDreamLogs} />
          <Route path="/create" component={CreateLog} />
        </Switch>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
