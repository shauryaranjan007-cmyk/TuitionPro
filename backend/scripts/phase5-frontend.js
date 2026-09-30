import fs from 'fs';

const filePath = '../frontend/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const duesCode = `
function Dues() {
  const u=user();
  if(u?.role!=="admin") return <div className="alert alert-warning">Admin access required.</div>;
  
  const [payments,setPayments] = useState<any[]>([]);
  const [students,setStudents] = useState<any[]>([]);
  const [batches,setBatches] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("October 2026");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [p, s, b] = await Promise.all([
        api.get("/payments"),
        api.get("/students"),
        api.get("/batches")
      ]);
      setPayments(p.data);
      setStudents(s.data);
      setBatches(b.data);
    } catch(e) {}
  };

  useEffect(() => { load(); }, []);

  const generate = async () => {
    setLoading(true); setMsg("");
    try {
      const r = await api.post("/payments/generate", { month: selectedMonth });
      setMsg(r.data.message);
      load();
    } catch(e:any) {
      setMsg("Failed: " + (e.response?.data?.message || "Error"));
    }
    setLoading(false);
  };

  const sendReminder = async (email:string, studentName:string, amount:number, month:string) => {
    if(!email) return alert("Student has no email");
    try {
      await api.post("/gmail/send", {
        to: email,
        subject: \`Fee Reminder: \${month}\`,
        text: \`Dear \${studentName},\\n\\nThis is a reminder that your fee of ₹\${amount} for \${month} is pending. Please pay as soon as possible.\\n\\nThanks,\\nTuitionPro\`
      });
      alert("Reminder sent to " + email);
    } catch(e) { alert("Failed to send email"); }
  };

  const filtered = payments.filter(p => p.status === "Pending" && p.month === selectedMonth && (selectedBatch === "All" || p.student?.batch?._id === selectedBatch || p.student?.batch === selectedBatch));
  
  const totalPending = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h2 className="fw-bold mb-1">Fee Dues Tracker</h2>
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate Pending Fees"}
        </button>
      </div>
      
      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small">Month</label>
            <input className="form-control" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Batch</label>
            <select className="form-select" value={selectedBatch} onChange={e=>setSelectedBatch(e.target.value)}>
              <option value="All">All Batches</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <div className="alert alert-warning mb-0 p-2 text-center fw-bold">
              Total Pending: ₹{totalPending.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <table className="table align-middle">
          <thead className="table-light"><tr><th>Student</th><th>Email</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-3">No pending dues found for these filters.</td></tr>}
            {filtered.map(p => (
              <tr key={p._id}>
                <td>{p.student?.name}</td>
                <td>{students.find(s=>s._id===p.student?._id)?.email}</td>
                <td>₹{p.amount?.toLocaleString("en-IN")}</td>
                <td><span className="badge bg-warning text-dark">Pending</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>{
                    const s = students.find(s=>s._id===p.student?._id);
                    sendReminder(s?.email, s?.name, p.amount, p.month);
                  }}>Send Reminder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
`;

code = code.replace(/function Payments\(\)[\s\S]*?(?=function Subjects)/m, (match) => {
  return match + "\n\n" + duesCode + "\n\n";
});

fs.writeFileSync(filePath, code);
console.log("Injected Dues");
