import fs from 'fs';

const filePath = '../frontend/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add import jsPDF at the top
if (!code.includes('import { jsPDF }')) {
  code = code.replace(/import \{api\} from "\.\/api";/, 'import {api} from "./api";\nimport { jsPDF } from "jspdf";');
}

// Add downloadReceipt function inside Payments
const pdfFunc = `
  const downloadReceipt = (p: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("TuitionPro", 20, 20);
    doc.setFontSize(16);
    doc.text("Fee Receipt", 20, 30);
    doc.setFontSize(12);
    doc.text(\`Receipt No: \${p.receiptNo || "N/A"}\`, 20, 50);
    doc.text(\`Date: \${new Date().toLocaleDateString()}\`, 20, 60);
    doc.text(\`Student Name: \${p.student?.name || "N/A"}\`, 20, 70);
    doc.text(\`Month: \${p.month}\`, 20, 80);
    doc.text(\`Amount Paid: Rs. \${p.amount}\`, 20, 90);
    doc.text(\`Payment Method: \${p.method || "Offline"}\`, 20, 100);
    doc.save(\`Receipt_\${p.month.replace(/ /g, "_")}_\${p.student?.name?.replace(/ /g, "_")}.pdf\`);
  };
`;

if (!code.includes('downloadReceipt')) {
  code = code.replace(/const filtered=filter==="All"\?rows:rows\.filter\(\(r:any\)=>r\.status===filter\);/, (match) => match + "\n" + pdfFunc);
}

// Add a button in the action column for "Paid" status, or just change the Receipt column to have a button.
const replaceTarget = /<td><span className="font-monospace small text-muted">\{p\.receiptNo\}<\/span><\/td>/;
const newContent = `<td>{p.status === "Paid" ? <button className="btn btn-sm btn-outline-secondary font-monospace" onClick={() => downloadReceipt(p)}>📄 {p.receiptNo || "Download"}</button> : <span className="font-monospace small text-muted">{p.receiptNo || "—"}</span>}</td>`;

if (code.match(replaceTarget)) {
  code = code.replace(replaceTarget, newContent);
}

fs.writeFileSync(filePath, code);
console.log("Injected PDF download");
