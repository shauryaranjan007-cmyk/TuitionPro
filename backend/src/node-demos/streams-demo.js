import { Readable } from "stream";

console.log("Starting Stream reading...\n");

const stream = Readable.from(["Hello ", "from ", "Node.js ", "Streams", "!\n"]);

stream.on("data", (chunk) => {
  process.stdout.write(`[Chunk Received]: ${chunk}`);
});

stream.on("end", () => {
  console.log("\nStream complete.");
});
