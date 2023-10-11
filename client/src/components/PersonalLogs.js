import React, { useEffect, useState } from "react";
import { Container, Card } from "semantic-ui-react";
import DreamLog from "./DreamLog";
import "../styles/DreamLogs.css";

export default function PersonalLogs() {
  const [logs, setLogs] = useState([]);

  const user_id = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="))
    ?.split("=")[1];

  useEffect(() => {
    if (user_id) {
      const userIdNumber = Number(user_id);
      fetch("/dream-logs")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const userLogs = data.filter((log) => log.user.id === userIdNumber);
          console.log(userLogs);
          setLogs(userLogs);
        })
        .catch((err) => {
          console.error("Failed to fetch logs: ", err);
        });
    }
  }, [user_id]);

  if (!user_id) {
    return <h1>Please signup/log in to view your dream logs.</h1>;
  }

  return (
    <Container>
      <h2>Your Dream Logs</h2>
      <Card.Group className="card-group">
        {logs.length === 0 ? (
          <h4>No logs found.</h4>
        ) : (
          logs.map((log) => <DreamLog key={log.id} log={log} />)
        )}
      </Card.Group>
    </Container>
  );
}
