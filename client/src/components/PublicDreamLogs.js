import React, { useState, useEffect } from "react";
import { Container, Card } from "semantic-ui-react";
import DreamLog from "./DreamLog";
import "../styles/PublicDreamLogs.css";

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
      <Card.Group className="card-group" doubling={true}>
        {dreamLogs.map((log) => (
          <DreamLog key={log.id} log={log} />
        ))}
      </Card.Group>
    </Container>
  );
}
