import { React, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Button,
  Form as SemanticForm,
  Dropdown,
  Checkbox,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

const initialValues = {
  title: "",
  text_content: "",
  is_public: true,
  rating: "",
  tags: [],
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  text_content: Yup.string().required("Content is required"),
});

export default function CreateLog() {
  const ratingOptions = ["Good Dream", "Neutral Dream", "Bad Dream"];
  const [tagInput, setTagInput] = useState([]);
  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="));

  if (!username) {
    return <h1>Please signup/log in order to create a dream log.</h1>;
  }

  return (
    <div className="create-log">
      <h2>Create a Dream Log</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/dream-logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then((data) => {
              toast.success("Dream log created!");
              setSubmitting(false);
            })
            .catch((err) => {
              toast.error("Failed to create dream log");
              setSubmitting(false);
            });
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <SemanticForm.Field>
              <label htmlFor="title">Title</label>
              <Field
                as={SemanticForm.Input}
                type="text"
                id="title"
                name="title"
              />
              <ErrorMessage name="title" component="div" />
            </SemanticForm.Field>

            <SemanticForm.Field>
              <label htmlFor="text_content">Content</label>
              <Field
                as={SemanticForm.TextArea}
                id="text_content"
                name="text_content"
                rows={8}
                style={{ minWidth: 500 }}
              />
              <ErrorMessage name="text_content" component="div" />
            </SemanticForm.Field>

            <SemanticForm.Field>
              <Dropdown
                placeholder="Select Rating"
                selection
                options={ratingOptions.map((option) => ({
                  key: option,
                  value: option,
                  text: option,
                }))}
                onChange={(e, { value }) => setFieldValue("rating", value)}
                value={values.rating}
              />
              <label>Make Public?</label>
              <Checkbox
                id="is_public"
                name="is_public"
                checked={values.is_public}
                onChange={() => setFieldValue("is_public", !values.is_public)}
              />
              <ErrorMessage name="is_public" component="div" />
            </SemanticForm.Field>
            <SemanticForm.Field>
              <label htmlFor="tagInput">Add Tag</label>
              <SemanticForm.Input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  if (tagInput && !values.tags.includes(tagInput)) {
                    setFieldValue("tags", [...values.tags, tagInput]);
                  }
                  setTagInput("");
                }}
              >
                Add Tag
              </Button>
            </SemanticForm.Field>

            <SemanticForm.Field>
              <label>Current Tags Attached:</label>
              <div>
                {values.tags.map((tag) => (
                  <span key={uuidv4()} style={{ marginRight: "10px" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </SemanticForm.Field>

            <Button type="submit">Create Log</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
