import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default function Navbar() {
  return (
    <Menu className="ui menu">
      <Menu.Item as={NavLink} to="/" name="Home" />
      <Menu.Item as={NavLink} to="/dreamlogs" name="Public Dream Logs" />
      <Menu.Item as={NavLink} to="/personallogs" name="Personal Dream Logs" />
      <Menu.Item as={NavLink} to="/create" name="Create a Dream Log" />
      <Menu.Menu position="right">
        <Menu.Item name="Logout">Logout</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
