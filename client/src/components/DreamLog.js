import React from "react";
import { Card, Icon } from "semantic-ui-react";

function DreamLog({ log }) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{log.title}</Card.Header>
        <Card.Meta>
          <span className="date">{log.published_at}</span>
        </Card.Meta>
        <Card.Description>{log.text_content}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {log.user["username"]}
      </Card.Content>
    </Card>
  );
}

export default DreamLog;
