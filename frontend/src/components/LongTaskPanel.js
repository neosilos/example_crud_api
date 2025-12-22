// This component displays the panel for long asynchronous tasks.
import { useEffect, useState } from "react";
import { startLongTask, getTaskStatus } from "../api";

function LongTaskPanel() {
    const [taskStatus, setTaskStatus] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleStartLongTask = async () => {
        setLoading(true);
        try {
            console.log("Starting long task...");
            const data = await startLongTask();
            setTaskId(data.task_id);
            console.log("Started task with ID:", data.task_id);
            setTaskStatus("STARTED");
        }
        catch (err) {
            alert("Error starting long task");
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!taskId) return;

        const interval = setInterval(async () => {
            try {
                const data = await getTaskStatus(taskId);
                setTaskStatus(data.state);
                if (data.state === "SUCCESS" || data.state === "FAILURE") {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Error fetching task status", err);
                clearInterval(interval);
            }
        }, 2000); // Updates every 2 seconds

        return () => clearInterval(interval);
    }, [taskId]);

    return (
        <>
            <br />
            <div className="card p-3 mb-4">
                <h5>Long Async Task</h5>
                <button className="btn btn-warning" onClick={handleStartLongTask} disabled={loading}>
                    {loading ? "Starting..." : "Start Task"}
                </button>
                {taskStatus && (
                    <>

                        <div className="mt-2">Status: { }
                            Status:{" "}
                            <span className={`badge ${taskStatus === "SUCCESS" ? "bg-success" :
                                    taskStatus === "FAILURE" ? "bg-danger" :
                                        "bg-warning text-dark"
                                }`}>
                                {taskStatus}
                            </span>
                        </div>
                        <div className="mb-2">
                            <strong>Task ID:</strong><br />
                            <code>{taskId}</code>
                        </div>
                    </>
                )}
            </div>
        </>

    );
}

export default LongTaskPanel;
