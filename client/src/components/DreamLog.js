import React from "react";
import { Card, Icon } from "semantic-ui-react";

function DreamLog({ log }) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{log.title}</Card.Header>
        <Card.Meta>
          <span className="date">{log.date}</span>
        </Card.Meta>
        <Card.Description>{log.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {log.username}
      </Card.Content>
    </Card>
  );
}

export default DreamLog;
