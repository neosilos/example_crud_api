import { useEffect, useState } from "react";
import { pollAsyncTask } from "../api";

/**
 * @typedef {Object} Task
 * @property {string} taskState
 * @property {any} taskResult
 */

/**
 * Poll for a specific running task and get its status and result
 * 
 * @param {string} taskId - UUID of the task
 * @param {number} interval - polling interval in milliseconds
 * @returns {Task}
 */
export function useTaskPoller(taskId, interval=2000) {
    const [state, setState] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!taskId) return;

        let timer;

        const poll = async () => {
            const data = await pollAsyncTask(taskId);
            if (!data) {
                console.error("polling failed for task:", taskId);
                setState("RETRY");
                return;
            }

            setState(data.state);
            setResult(data.result);

            if (data.state !== "SUCCESS" && data.state !== "FAILURE") {
                timer = setTimeout(poll, interval);
            }
        };

        poll();

        return () => clearTimeout(timer);
    }, [taskId]);

    return { taskState: state, taskResult: result };
}
