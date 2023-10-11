import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DreamLogs from "./components/DreamLogs";
import PersonalLogs from "./components/PersonalLogs";
import CreateLog from "./components/CreateLog";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in here
    // Set isLoggedIn accordingly
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/dreamlogs" component={DreamLogs} />
          {isLoggedIn && (
            <>
              <Route path="/personallogs" component={PersonalLogs} />
              <Route path="/create" component={CreateLog} />
            </>
          )}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
