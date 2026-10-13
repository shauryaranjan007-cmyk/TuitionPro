import http from 'http';
import fs from 'fs';
import { EventEmitter } from 'events';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module workaround for directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. EVENTS Module: Set up a custom event emitter
class TuitionEmitter extends EventEmitter { }
const myEmitter = new TuitionEmitter();

myEmitter.on('serverHit', () => console.log('\n[EVENT] 🟢 HTTP Server received a new request.'));
myEmitter.on('streamEnd', () => console.log('[EVENT] 🔴 Data stream completed successfully.'));

// 2. FS Module: Create a dummy data file for our stream to read
const filePath = path.join(__dirname, 'student-data.txt');
fs.writeFileSync(
    filePath,
    'TuitionPro Student Roster Data:\n1. Shaurya - IT\n2. Rahul - CS\n(This data is processed efficiently via Node Streams and Buffers!)'
);

// 3. HTTP Server setup
const server = http.createServer((req, res) => {
    // Trigger our custom event
    myEmitter.emit('serverHit');

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // 4. STREAMS & BUFFERS: Read the file efficiently
    const readStream = fs.createReadStream(filePath, 'utf8');

    readStream.on('data', (chunk) => {
        // chunk represents the buffer payload
        console.log(`[STREAM] Processing data chunk of ${chunk.length} characters...`);
    });

    readStream.on('end', () => {
        myEmitter.emit('streamEnd');
    });

    // Pipe the file stream directly to the HTTP response
    readStream.pipe(res);
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Node Core Modules Server running at http://localhost:${PORT}`);
    console.log('Open your browser and navigate to http://localhost:3000');
});