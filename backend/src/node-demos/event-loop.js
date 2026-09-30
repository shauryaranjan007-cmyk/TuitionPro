console.log("1. Script Start (Synchronous)");

setTimeout(() => {
  console.log("4. setTimeout (Macro-task queue)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise resolved (Micro-task queue)");
});

console.log("2. Script End (Synchronous)");
