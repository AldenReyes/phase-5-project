import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { toast } from "react-toastify";

const initialValues = {
  username: "",
  password: "",
};

function showLoginSuccess() {
  toast.success("Log in successful, you can now create dream logs", {
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

function showLoginFailure() {
  toast.error("login failed, please try again", {
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

export default function Login() {
  return (
    <div className="login">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 10) {
            errors.password = "Password must be at least 10 characters long.";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Sign Up Failure");
              }
              return response.json();
            })
            .then((data) => {
              showLoginSuccess();
            })
            .catch((error) => {
              showLoginFailure();
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form>
            <SemanticForm.Field>
              <label htmlFor="username">Username</label>
              <SemanticForm.Input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={values.username}
              />
              <ErrorMessage name="username" component="div" />
            </SemanticForm.Field>

            <SemanticForm.Field>
              <label htmlFor="password">Password</label>
              <SemanticForm.Input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={values.password}
              />
              <ErrorMessage name="password" component="div" />
            </SemanticForm.Field>

            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
