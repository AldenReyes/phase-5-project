import React from "react";
import { Card, Icon, Label, Button } from "semantic-ui-react";
import { v4 as uuid } from "uuid";

function DreamLog({ log, onEdit, onDelete, userId }) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{log.title}</Card.Header>
        <Card.Meta>{new Date(log.published_at).toLocaleDateString()}</Card.Meta>
        <Card.Description>{log.text_content}</Card.Description>
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
            <Button onClick={() => onEdit(log)} size="tiny" color="blue">
              Edit
            </Button>
            <Button onClick={() => onDelete(log.id)} size="tiny" color="red">
              Delete
            </Button>
          </>
        )}
      </Card.Content>
    </Card>
  );
}

export default DreamLog;
