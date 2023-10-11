import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { toast } from "react-toastify";

export default function Navbar() {
  function showLogoutSuccess() {
    toast.success("Logout successful", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function showLogoutFailure() {
    toast.error("Logout failed, please try again", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          showLogoutSuccess();
        } else {
          showLogoutFailure();
        }
      })
      .catch((error) => {
        console.error("There was a problem logging out:", error);
      });
  }

  return (
    <Menu className="ui menu">
      <Menu.Item as={NavLink} to="/" name="Home" />
      <Menu.Item as={NavLink} to="/dreamlogs" name="Public Dream Logs" />
      <Menu.Item as={NavLink} to="/personallogs" name="Personal Dream Logs" />
      <Menu.Item as={NavLink} to="/create" name="Create a Dream Log" />
      <Menu.Menu position="right">
        <Menu.Item name="Logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
