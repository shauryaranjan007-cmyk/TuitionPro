import fs from 'fs';

const filePath = '../frontend/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Fix Subjects
const subjectAdminForm = `
  {admin && (
    <div className="card p-3 mb-4 shadow-sm border-0">
      <h6 className="fw-bold mb-3">Add New Subject</h6>
      <form className="row g-2" onSubmit={async (e) => {
        e.preventDefault();
        try {
          const name = (e.target as any).name.value;
          const code = (e.target as any).code.value;
          await api.post("/subjects", { name, code });
          (e.target as any).reset();
          load();
        } catch(err) { alert("Failed to add subject"); }
      }}>
        <div className="col-md-5"><input name="name" className="form-control" placeholder="Subject Name" required /></div>
        <div className="col-md-4"><input name="code" className="form-control" placeholder="Subject Code (e.g. IT301)" required /></div>
        <div className="col-md-3"><button type="submit" className="btn btn-primary w-100">Add Subject</button></div>
      </form>
    </div>
  )}
  {subs.length === 0 && <div className="alert alert-info">No subjects found. Add them via admin backend.</div>}
`;
code = code.replace(/{subs\.length === 0 && <div className="alert alert-info">No subjects found\. Add them via admin backend\.<\/div>}/, subjectAdminForm);

// 2. Fix GmailDemo
const realGmail = `
function GmailDemo() {
 const [to, setTo] = useState("");
 const [subject, setSubject] = useState("");
 const [text, setText] = useState("");
 const [msg, setMsg] = useState("");
 const [loading, setLoading] = useState(false);

 const send = async (e:any) => {
   e.preventDefault();
   setLoading(true); setMsg("");
   try {
     await api.post("/gmail/send", { to, subject, text });
     setMsg("Email sent successfully!");
     setTo(""); setSubject(""); setText("");
   } catch(err:any) {
     setMsg("Failed: " + (err.response?.data?.message || "Error"));
   }
   setLoading(false);
 };

 return (
  <div className="card shadow-sm border-0 p-4">
   <h4>Mail Center</h4>
   <p className="text-muted mb-4">Send automated emails to parents regarding attendance or marks.</p>
   {msg && <div className="alert alert-info">{msg}</div>}
   <form onSubmit={send}>
    <div className="mb-3">
     <label className="form-label fw-bold small">To</label>
     <input className="form-control" type="email" required value={to} onChange={e=>setTo(e.target.value)} placeholder="parent@example.com" />
    </div>
    <div className="mb-3">
     <label className="form-label fw-bold small">Subject</label>
     <input className="form-control" required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Attendance Warning" />
    </div>
    <div className="mb-3">
     <label className="form-label fw-bold small">Message</label>
     <textarea className="form-control" required rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Dear Parent..." />
    </div>
    <button type="submit" className="btn btn-primary px-4" disabled={loading}>
      {loading ? "Sending..." : "Send Email"}
    </button>
   </form>
  </div>
 );
}
`;
code = code.replace(/function GmailDemo\(\) \{[\s\S]*?(?=function ExperimentsIndex)/, realGmail);

// 3. Fix AIAssistant
const realAI = `
function AIAssistant() {
 const [question, setQuestion] = useState("");
 const [answer, setAnswer] = useState("");
 const [loading, setLoading] = useState(false);

 const ask = async (e:any) => {
   e.preventDefault();
   setLoading(true); setAnswer("");
   try {
     const res = await api.post("/ai/ask", { question });
     setAnswer(res.data.answer);
   } catch (err:any) {
     setAnswer("Error: " + (err.response?.data?.message || "Failed to contact AI"));
   }
   setLoading(false);
 };

 return (
  <div className="card shadow-sm border-0 p-4">
   <h4>AI Assistant</h4>
   <p className="text-muted mb-4">Ask questions about student performance or syllabus details.</p>
   <form onSubmit={ask} className="mb-4 d-flex gap-2">
     <input className="form-control" required value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. Which students have low attendance?" />
     <button type="submit" className="btn btn-primary px-4" disabled={loading}>
       {loading ? "Asking..." : "Ask"}
     </button>
   </form>
   {answer && (
     <div className="p-3 bg-light rounded border border-primary-subtle" style={{whiteSpace:"pre-wrap"}}>
       <strong>AI:</strong><br/>{answer}
     </div>
   )}
  </div>
 );
}
`;
code = code.replace(/function AIAssistant\(\) \{[\s\S]*?(?=function GmailDemo)/, realAI);

fs.writeFileSync(filePath, code);
console.log("Injected fixes");
