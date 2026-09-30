# Node.js REPL & Core Demos

## 1. Node.js REPL (Read-Eval-Print Loop)

The REPL is an interactive environment for executing JavaScript code.
To start the Node.js REPL:
1. Open your terminal.
2. Type `node` and press Enter.
3. You can execute JavaScript directly:
   ```javascript
   > const appName = "TuitionPro";
   > appName.toUpperCase();
   'TUITIONPRO'
   > [1, 2, 3].map(n => n * 2);
   [ 2, 4, 6 ]
   ```
4. Type `.exit` or press `Ctrl+C` twice to quit.

## 2. Node Core Modules Demos

We have separated the Node core concepts into individual files to clearly demonstrate each concept. Run these commands from the `backend` directory:

- **HTTP Server**: Demonstrates creating a basic web server.
  ```bash
  npm run demo:http
  ```

- **Event Loop**: Demonstrates synchronous code vs micro-tasks (Promises) vs macro-tasks (setTimeout).
  ```bash
  npm run demo:event-loop
  ```

- **File System (fs)**: Demonstrates synchronous writing, reading, and deleting files.
  ```bash
  npm run demo:fs
  ```

- **Buffer**: Demonstrates binary data manipulation and encoding conversions (Base64, Hex).
  ```bash
  npm run demo:buffer
  ```

- **Streams**: Demonstrates handling data in chunks (useful for large files).
  ```bash
  npm run demo:streams
  ```
