// This component displays the panel for long asynchronous tasks.
import { useState } from "react";

//   <h5>Long Async Task</h5>
//   <button class="btn btn-warning">Start Task</button>
//   <div>Status: STARTED</div>
//   <div class="mb-2"><strong>Task ID:</strong><br><code>33489ea7-fb00-4e21-9ac2-17fcd6930b53</code></div>
function LongTaskPanel() {
    const [taskStatus, setTaskStatus] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [loading, setLoading] = useState(false);

    const startLongTask = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/long_task", { method: "POST" });
            const data = await response.json();
            setTaskId(data.task_id);
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
    return (
        
        <>        
        <br/>
        <div className="card p-3 mb-4">
            <h5>Long Async Task</h5>
            <button className="btn btn-warning" onClick={startLongTask} disabled={loading}>
                {loading ? "Starting..." : "Start Task"}
            </button>
            {taskStatus && (
                <>

                    <div className="mt-2">Status: {taskStatus}</div>
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
