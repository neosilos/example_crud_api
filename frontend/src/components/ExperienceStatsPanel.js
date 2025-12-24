// This component displays statistics about years of experience of all persons

import { useEffect, useState } from "react";
import {
    startExperienceStatisticsTask,
    getLatestExperienceStatistics
} from "../api";

function ExperienceStatsPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecompute = async () => {
        setLoading(true);
        await startExperienceStatisticsTask();

        setTimeout(async () => {
            const data = await getLatestExperienceStatistics();
            setStats(data);
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        getLatestExperienceStatistics()
            .then(setStats)
            .catch(() => {});
    }, []);

    return (
        <div className="card p-3 mt-4">
            <h5>Experience Statistics</h5>

            <button
                className="btn btn-warning mb-3"
                onClick={handleRecompute}
                disabled={loading}
            >
                {loading ? "Computing..." : "Recompute Statistics"}
            </button>

            {stats && (
                <div className="row text-center">
                    <div className="col">
                        <strong>Average</strong>
                        <div>{stats.mean} years</div>
                    </div>
                    <div className="col">
                        <strong>Std Deviation</strong>
                        <div>{stats.std_dev}</div>
                    </div>
                    <div className="col">
                        <strong>Sample Size</strong>
                        <div>{stats.count}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExperienceStatsPanel;
