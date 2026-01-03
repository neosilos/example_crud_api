import { useState } from "react";
import { pollAsyncTask, startAsyncTask } from "../api";
import { useToast } from "../ToastProvider";
import { useTaskPoller } from "../hooks/useTaskPoller";

/**
 * LongTaskPanel allows for starting and tracking an asycnhronous task.
 * Once the task is started, the component polls for the task's status every 2 seconds.
 */
export default function LongTaskPanel() {
    const [taskId, setTaskId] = useState("");
    const { taskState, taskResult } = useTaskPoller(taskId, 2000);

    async function startTask() {
        const res = await startAsyncTask();
        setTaskId(res.task_id);
    }

    return (
        <div>
            <h5>Long Async Task</h5>
            <button
                onClick={startTask}
                className="btn btn-warning"
                disabled={taskState === "accepted" || taskState === "PENDING" || taskState === "STARTED"}
            >
                Start Task
            </button>
            <div>Status: {taskState}</div>
            <div className="mb-2">
                <strong>Task ID:</strong>
                <br />
                <code>{taskId ? taskId : "N/A"}</code>
            </div>
        </div>
    );
}
