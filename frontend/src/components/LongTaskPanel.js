import { useState } from "react";
import { pollAsyncTask, startAsyncTask } from "../api";
import { useToast } from "../ToastProvider";

/**
 * LongTaskPanel allows for starting and tracking an asycnhronous task.
 * Once the task is started, the component polls for the task's status every 2 seconds.
 */
export default function LongTaskPanel() {
    const notify = useToast();
    const [status, setStatus] = useState("NOT STARTED");
    const [taskId, setTaskId] = useState("");

    async function startTask() {
        const task = await startAsyncTask();
        if (!task) {
            notify("Failed to start task.", "danger");
            return;
        }

        setTaskId(task.task_id);
        setStatus(task.status);

        const polling = setInterval(async () => {
            const response = await pollAsyncTask(task.task_id);
            setStatus(response.state);

            if (response.state === "RETRY") {
                notify("Async task possibly failed. Please retry.", "warning", 0);
                clearInterval(polling);
            }
            else if (response.state === "FAILURE") {
                notify("Async task failed.", "danger", 0);
                clearInterval(polling);
            }
            else if (response.state === "SUCCESS") {
                notify("Async task finished successfully.", "success");
                clearInterval(polling);
            }
        }, 2000);
    }

    return (
        <div>
            <h5>Long Async Task</h5>
            <button
                onClick={startTask}
                className="btn btn-warning"
                disabled={status === "accepted" || status === "PENDING" || status === "STARTED"}
            >
                Start Task
            </button>
            <div>Status: {status}</div>
            <div className="mb-2">
                <strong>Task ID:</strong>
                <br />
                <code>{taskId ? taskId : "N/A"}</code>
            </div>
        </div>
    );
}
