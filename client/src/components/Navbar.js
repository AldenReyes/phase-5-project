import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Button } from "semantic-ui-react";

export default function Navbar() {
  return (
    <Menu className="ui menu">
      <Menu.Item as={NavLink} to="/" name="Home" />
      <Menu.Item as={NavLink} to="/dreamlogs" name="Public Dream Logs" />
      <Menu.Item as={NavLink} to="/personallogs" name="Personal Dream Logs" />
      <Menu.Item as={NavLink} to="/create" name="Create a Dream Log" />
      <Menu.Item as={NavLink} to="/about" name="About" />
      <Menu.Menu position="right">
        <Menu.Item name="Login">
          <Button>Login</Button>
        </Menu.Item>
        <Menu.Item name="Logout">
          <Button>Logout</Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
