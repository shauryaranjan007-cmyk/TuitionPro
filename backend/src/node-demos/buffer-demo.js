import { Buffer } from "buffer";

const str = "TuitionPro";
const buf = Buffer.from(str);

console.log("Original String:", str);
console.log("Buffer (Raw Hex):", buf);
console.log("Buffer to Base64:", buf.toString("base64"));
console.log("Buffer to Hex String:", buf.toString("hex"));
console.log("Buffer back to UTF-8:", buf.toString("utf8"));
