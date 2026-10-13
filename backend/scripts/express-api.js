import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// Middleware to parse incoming JSON bodies

// Simulated Database (In-memory array for API testing)
let activeBatches = [
    { id: 1, name: 'Class 10 - Mathematics', time: '5:00 PM' },
    { id: 2, name: 'Class 12 - Physics', time: '6:30 PM' }
];

// GET: Retrieve all batches
app.get('/api/batches', (req, res) => {
    console.log('[GET] Client requested all batches');
    res.status(200).json({
        success: true,
        count: activeBatches.length,
        data: activeBatches
    });
});

// POST: Add a new batch
app.post('/api/batches', (req, res) => {
    const { name, time } = req.body;

    if (!name || !time) {
        return res.status(400).json({ success: false, message: 'Name and time are required' });
    }

    const newBatch = {
        id: activeBatches.length + 1,
        name: name,
        time: time
    };

    activeBatches.push(newBatch);
    console.log(`[POST] New batch added: ${name}`);

    res.status(201).json({ success: true, data: newBatch });
});

// DELETE: Remove a batch by ID
app.delete('/api/batches/:id', (req, res) => {
    const batchId = parseInt(req.params.id);
    const initialLength = activeBatches.length;

    activeBatches = activeBatches.filter(batch => batch.id !== batchId);

    if (activeBatches.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    console.log(`[DELETE] Batch ID ${batchId} removed`);
    res.status(200).json({ success: true, message: 'Batch successfully deleted' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`TuitionPro Express API Server running on http://localhost:${PORT}`);
});