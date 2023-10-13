import React, { useEffect, useState } from "react";
import { Container, Card } from "semantic-ui-react";
import DreamLog from "./DreamLog";
import "../styles/DreamLogs.css";

export default function PersonalDreamLogs() {
  const [logs, setLogs] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);

  const user_id = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="))
    ?.split("=")[1];

  const userIdNumber = Number(user_id);

  useEffect(() => {
    if (user_id) {
      const userIdNumber = Number(user_id);
      fetch("/dream-logs")
        .then((response) => response.json())
        .then((data) => {
          const userLogs = data.filter((log) => log.user.id === userIdNumber);
          setLogs(userLogs);
        })
        .catch((err) => {
          console.error("Failed to fetch logs: ", err);
        });
    }
  }, [user_id, updateStatus]);

  if (!user_id) {
    return <h1>Please signup/log in order to view your dream logs.</h1>;
  }

  function handleDelete(logId) {
    fetch(`/dream-logs/${logId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setLogs(logs.filter((log) => log.id !== logId));
        }
      })
      .catch((error) => {
        console.error("Failed to delete log: ", error);
      });
  }

  return (
    <Container>
      <h2>Your Dream Logs</h2>
      <h3>Title / Content can be edited on click</h3>
      <Card.Group className="card-group">
        {logs.length === 0 ? (
          <h4>No logs found.</h4>
        ) : (
          logs.map((log) => (
            <DreamLog
              key={log.id}
              log={log}
              onDelete={handleDelete}
              userId={userIdNumber}
              updateStatus={updateStatus}
              setUpdateStatus={setUpdateStatus}
            />
          ))
        )}
      </Card.Group>
    </Container>
  );
}
