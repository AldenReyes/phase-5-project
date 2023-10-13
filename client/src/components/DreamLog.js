import React, { useState } from "react";
import { Card, Icon, Label, Button } from "semantic-ui-react";
import { v4 as uuid } from "uuid";

export default function DreamLog({
  log,
  onDelete,
  userId,
  updateStatus,
  setUpdateStatus,
}) {
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    title: log.title,
    text_content: log.text_content,
  });

  function handleEditField(fieldName) {
    setEditingField(fieldName);
  }

  function handleBlur() {
    fetch(`/dream-logs/${log.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fieldValues),
    })
      .then((response) => response.json())
      .then((data) => {
        setEditingField(null);
        setUpdateStatus(!updateStatus);
      })
      .catch((error) => {
        console.error("Failed to update log, please try again", error);
      });
  }

  return (
    <Card>
      <Card.Content>
        {editingField === "title" ? (
          <input
            value={fieldValues.title}
            onBlur={handleBlur}
            onChange={(e) =>
              setFieldValues({ ...fieldValues, title: e.target.value })
            }
          />
        ) : (
          <Card.Header onClick={() => handleEditField("title")}>
            {log.title}
          </Card.Header>
        )}
        <Card.Meta>{new Date(log.published_at).toLocaleDateString()}</Card.Meta>
        {editingField === "text_content" ? (
          <textarea
            value={fieldValues.text_content}
            onBlur={handleBlur}
            onChange={(e) =>
              setFieldValues({ ...fieldValues, text_content: e.target.value })
            }
          />
        ) : (
          <Card.Description onClick={() => handleEditField("text_content")}>
            {log.text_content}
          </Card.Description>
        )}
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {log.user["username"]} had a {log["rating"]}
      </Card.Content>
      <Card.Content extra>
        <div>
          <strong>Tags: </strong>
          {log.tags && log.tags.length > 0
            ? log.tags.map((tag) => (
                <Label key={uuid()} color="blue">
                  {tag.name}
                </Label>
              ))
            : "No tags available"}
        </div>
        {userId === log.user.id && (
          <>
            <Button onClick={() => onDelete(log.id)} size="tiny" color="red">
              Delete
            </Button>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
