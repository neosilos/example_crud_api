import React, { useState, useEffect } from 'react';
import { startLongTask, getLongTaskStatus } from '../api';

function LongTaskPanel() {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('IDLE');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval = null;

    if (taskId && (status === 'PENDING' || status === 'STARTED' || status === 'RETRY')) {
      interval = setInterval(async () => {
        try {
          const result = await getLongTaskStatus(taskId);
          setStatus(result.state);

          if (result.state === 'SUCCESS' || result.state === 'FAILURE') {
            if (interval) clearInterval(interval);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error checking task status:', error);
          if (interval) clearInterval(interval);
          setLoading(false);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [taskId, status]);

  const handleStartTask = async () => {
    setLoading(true);
    try {
      const result = await startLongTask();
      setTaskId(result.task_id);
      setStatus('PENDING');
    } catch (error) {
      console.error('Error starting task:', error);
      setLoading(false);
      alert('Failed to start task: ' + error.message);
    }
  };

  const statusDisplayMap = {
    IDLE: 'IDLE',
    PENDING: 'PENDING',
    STARTED: 'STARTED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    RETRY: 'RETRY'
  };

  const getStatusDisplay = () => statusDisplayMap[status] || "UNKNOWN";

  return (
    <div>
      <h5>Long Async Task</h5>
      <button
        className="btn btn-warning mb-2"
        onClick={handleStartTask}
        disabled={loading || (taskId && status !== 'SUCCESS' && status !== 'FAILURE')}
      >
        {loading ? 'Starting...' : 'Start Task'}
      </button>
      {taskId && (
        <>
          <div>Status: {getStatusDisplay()}</div>
          <div className="mb-2">
            <strong>Task ID:</strong>
            <br />
            <code>{taskId}</code>
          </div>
        </>
      )}
    </div>
  );
}

export default LongTaskPanel;
