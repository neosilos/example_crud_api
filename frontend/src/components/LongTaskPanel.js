import React, { useState } from "react";
import { startLongTask, pollTask } from "../api";

export default function LongTaskPanel() {
  const [taskId, setTaskId] = useState(null);
  const [state, setState] = useState(null);

  async function start() {
    setState("STARTING");

    const response = await startLongTask();
    setTaskId(response.task_id);
    setState("PENDING");

    const interval = setInterval(async () => {
      const result = await pollTask(response.task_id);
      setState(result.state);

      if (result.state === "SUCCESS" || result.state === "FAILURE") {
        clearInterval(interval);
      }
    }, 2000);
  }

  return (
    <div className="mt-4">
      <h5>Long Async Task</h5>

      <button
        className="btn btn-warning mb-3"
        onClick={start}
        disabled={state === "PENDING" || state === "STARTED"}
      >
        Start Task
      </button>

      {taskId && (
        <div className="mb-2">
          <strong>Task ID:</strong>
          <br />
          <code>{taskId}</code>
        </div>
      )}

      {state && (
        <div>
          <strong>Status:</strong> {state}
        </div>
      )}
    </div>
  );
}
