import fs from "fs";

const filename = "node-demo-fs.txt";

console.log("1. Writing to file synchronously...");
fs.writeFileSync(filename, "Experiment 7 File System works.\nNode JS File System Demo.");

console.log("2. Reading from file synchronously...");
const data = fs.readFileSync(filename, "utf8");
console.log("\n--- File Content ---");
console.log(data);
console.log("--------------------\n");

console.log("3. Cleaning up (Deleting file)...");
fs.unlinkSync(filename);
console.log("File deleted successfully.");
