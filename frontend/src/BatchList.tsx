import { useState, useEffect } from 'react';
import { api } from './api';

export default function BatchList() {
    // State to store the data from the backend
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect triggers the API call when the component loads
    useEffect(() => {
        api.get('/batches')
            .then(res => {
                setBatches(Array.isArray(res.data) ? res.data : (res.data?.data || []));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching batches:', error);
                setLoading(false);
            });
    }, []); // Empty array ensures this runs only once on mount

    return (
        <div className="batch-container" style={{ padding: '20px' }}>
            <h2>Live TuitionPro Batches</h2>
            <p>Data fetched directly from the Node.js Express API:</p>

            {loading ? (
                <p>Loading backend data...</p>
            ) : (
                <ul style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    {batches.map((batch: any) => (
                        <li key={batch.id} style={{ margin: '10px 0', fontSize: '18px' }}>
                            <strong>{batch.name}</strong> — {batch.time}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}