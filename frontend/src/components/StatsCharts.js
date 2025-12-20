import React from 'react';
import {
    ComposedChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

function StatsCharts({ person }) {
    if (!person || !person.stats) return null;

    const { stats } = person;

    const getStat = (val) => (typeof val === 'number' ? val : 0);

    const meanValue = getStat(stats.media);
    const stdDevValue = getStat(stats.desvio);

    const meanData = stats.media_chart || [];
    const varianceData = stats.variancia_chart || [];
    const stdDevData = stats.desvio_chart || [];

    return (
        <div className="mt-3">
            <div className="row">
                {/* Mean - Bar Chart + Reference Line */}
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header text-center">Média (Input Values + Mean Line)</div>
                        <div className="card-body" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={meanData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="index" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" name="Valor Input" />
                                    <ReferenceLine
                                        y={meanValue}
                                        stroke="red"
                                        strokeDasharray="3 3"
                                        label={{
                                            value: `Média: ${meanValue.toFixed(2)}`,
                                            fill: '#333',
                                            fontWeight: 'bold',
                                            position: 'top'
                                        }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Variance - Line Chart (Fluctuation) */}
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header text-center">Variância (Fluctuation)</div>
                        <div className="card-body" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={varianceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="index" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Valor Input" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Std Dev - Line + Deviation Bars */}
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header text-center">Desvio Padrão (Individual Deviations)</div>
                        <div className="card-body" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={stdDevData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="index" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#ffc658" name="Valor Input" strokeWidth={2} />
                                    <Bar dataKey="deviation" fill="#8884d8" name="Desvio da Média" />
                                    <ReferenceLine
                                        y={stdDevValue}
                                        label={{
                                            value: `Desvio Padrão: ${stdDevValue.toFixed(2)}`,
                                            fill: '#333',
                                            fontWeight: 'bold'
                                        }}
                                        stroke="green"
                                        strokeDasharray="3 3"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsCharts;
