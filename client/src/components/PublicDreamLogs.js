import React, { useState, useEffect } from "react";
import { Container, Card } from "semantic-ui-react";
import DreamLog from "./DreamLog";

export default function PublicDreamLogs() {
  const [dreamLogs, setDreamLogs] = useState([]);

  useEffect(() => {
    fetch("/dream-logs")
      .then((res) => res.json())
      .then((data) => setDreamLogs(data));
  }, []);

  return (
    <Container>
      <h1>Public Dream Logs</h1>
      <Card.Group>
        {dreamLogs.map((log) => (
          <DreamLog key={log.id} log={log} />
        ))}
      </Card.Group>
    </Container>
  );
}
