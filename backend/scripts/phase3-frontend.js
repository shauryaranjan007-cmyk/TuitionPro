import fs from 'fs';

const filePath = '../frontend/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Update Subjects component
const newSubjects = `function Subjects(){
 const u=user(); const admin=u?.role==="admin";
 const [uploading, setUploading] = useState<string|null>(null);
 const [subs,setSubs]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");

 const load=()=>{
   setLoading(true);
   api.get("/subjects").then(r=>{setSubs(r.data);setLoading(false);}).catch(()=>{setError("Failed to load subjects.");setLoading(false);});
 };
 useEffect(()=>{load();},[]);

 const handleUpload = async (subjectId:string, e:any) => {
   const file = e.target.files[0];
   if(!file) return;
   setUploading(subjectId);
   const formData = new FormData();
   formData.append("file", file);
   try {
     await api.post(\`/subjects/\${subjectId}/materials\`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
     load();
   } catch (err) {
     alert("Upload failed");
   }
   setUploading(null);
 };

 if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;

 return <>
  <div className="d-flex justify-content-between align-items-start mb-4">
   <div>
    <h2 className="fw-bold mb-1">📚 Subjects & Materials</h2>
    <p className="text-muted mb-0">Course notes, real video lectures, and assignments.</p>
   </div>
   <span className="badge bg-success fs-6 px-3 py-2">Live API</span>
  </div>

  {subs.length === 0 && <div className="alert alert-info">No subjects found. Add them via admin backend.</div>}

  <div className="row g-4">
   {subs.map(s=><div className="col-lg-4 col-md-6" key={s.id}>
    <motion.div whileHover={{y:-4}} className="card h-100 shadow-sm border-0 bg-white d-flex flex-column">
     <div className="card-header bg-primary text-white border-0 py-3">
      <h5 className="mb-0 fw-bold">{s.name}</h5>
      <small className="opacity-75 font-monospace">{s.code}</small>
     </div>
     <div className="card-body flex-grow-1">
      <h6 className="fw-bold text-primary mb-3"><span className="me-2">📖</span>Study Materials</h6>
      <ul className="list-group list-group-flush mb-4">
       {s.notes.map((n:any)=><li className="list-group-item px-0 d-flex justify-content-between align-items-center" key={n.id}>
        <a href={n.link} target="_blank" rel="noreferrer" className="text-decoration-none fw-semibold text-dark text-truncate me-2" style={{maxWidth:"65%"}} title={n.title}>{n.title}</a>
        <span className="badge border bg-light text-dark fw-bold border-secondary-subtle" style={{fontSize:"10px"}}>{n.type}</span>
       </li>)}
      </ul>
      <h6 className="fw-bold text-warning-emphasis mb-3"><span className="me-2">📝</span>Assignments</h6>
      <ul className="list-group list-group-flush">
       {s.assignments.map((a:any)=><li className="list-group-item px-0" key={a.id}>
        <div className="d-flex justify-content-between align-items-center mb-1">
         <span className="fw-semibold text-truncate me-2" style={{maxWidth:"75%"}}>{a.title}</span>
         {a.status==="Completed"?<span className="badge bg-success">Done</span>:<span className="badge bg-warning text-dark">Due</span>}
        </div>
        <small className="text-muted">Due: {a.due}</small>
       </li>)}
      </ul>
     </div>
     {admin&&<div className="card-footer bg-light border-top py-3 mt-auto">
      {uploading === s.id ? (
        <div className="text-center text-muted small fw-bold">
          <span className="spinner-border spinner-border-sm me-2"/>Uploading...
        </div>
      ) : (
        <div className="position-relative overflow-hidden w-100 text-center">
          <button className="btn btn-outline-primary w-100 fw-bold">⬆️ Upload Any File</button>
          <input type="file" className="position-absolute top-0 start-0 opacity-0 w-100 h-100" style={{cursor:"pointer"}} onChange={(e)=>handleUpload(s.id, e)} />
        </div>
      )}
     </div>}
    </motion.div>
   </div>)}
  </div>
 </>;
}`;

// Update Tests component
const newTests = `function Tests(){
 const u=user(); const admin=u?.role==="admin";
 const [students,setStudents]=useState<any[]>([]);
 const [tests,setTests]=useState<any[]>([]);
 const [testId,setTestId]=useState("");
 const [marksList,setMarksList]=useState<any[]>([]);
 const [marksMap,setMarksMap]=useState<any>({});
 const [saved,setSaved]=useState(false);
 const [loading,setLoading]=useState(true);

 const load=()=>{
   setLoading(true);
   Promise.all([
     api.get("/students"),
     api.get("/tests"),
     api.get("/tests/marks")
   ]).then(([s,t,m])=>{
     setStudents(s.data);
     setTests(t.data);
     setMarksList(m.data);
     if (t.data.length > 0 && !testId) setTestId(t.data[0]._id);
     
     // map marks
     const mmap:any = {};
     m.data.forEach((markItem:any) => {
       mmap[\`\${markItem.test._id}_\${markItem.student._id}\`] = markItem.marks;
     });
     setMarksMap(mmap);
     setLoading(false);
   }).catch(()=>{setLoading(false);});
 };

 useEffect(()=>{ load(); },[]);

 const handleMark=(sid:string, val:string)=>{
   const v = Number(val);
   const tst = tests.find(t=>t._id===testId);
   if(tst && (v < 0 || v > tst.maxMarks)) return; // prevent typing outside bounds
   setMarksMap({...marksMap, [\`\${testId}_\${sid}\`]: val===""?"":v});
   setSaved(false);
 };

 const saveMarks=async()=>{
   // save all modified marks for this test
   for (let s of students) {
     const val = marksMap[\`\${testId}_\${s._id}\`];
     if (val !== undefined && val !== "") {
       try {
         await api.post(\`/tests/\${testId}/marks\`, { studentId: s._id, marks: val });
       } catch(e) {}
     }
   }
   setSaved(true);
   setTimeout(()=>setSaved(false), 3000);
   load();
 };

 const tst = tests.find(t=>t._id===testId);
 const chartData = admin ? students.filter(s=>marksMap[\`\${testId}_\${s._id}\`] !== undefined && marksMap[\`\${testId}_\${s._id}\`] !== "").map(s=>({ name: s.name.split(" ")[0], mark: marksMap[\`\${testId}_\${s._id}\`] })) : [];
 const avgMark = chartData.length ? Math.round(chartData.reduce((acc,curr)=>acc+curr.mark,0)/chartData.length) : 0;

 if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;

 return <>
  <div className="d-flex justify-content-between align-items-start mb-4">
   <div>
    <h2 className="fw-bold mb-1">💯 Test & Marks Entry</h2>
    <p className="text-muted mb-0">Record student performance across multiple tests and subjects.</p>
   </div>
   <span className="badge bg-success fs-6 px-3 py-2">Live API</span>
  </div>

  <div className="row g-3 mb-4">
   <div className="col-lg-3">
    <div className="card p-4 h-100 border-primary border-top border-4">
     <label className="form-label small fw-semibold text-muted">Select Test</label>
     <select className="form-select mb-3 fw-bold text-primary" value={testId} onChange={e=>setTestId(e.target.value)}>
      {tests.map(t=><option key={t._id} value={t._id}>{t.name} ({t.subject?.name})</option>)}
     </select>
     {tst && <div className="text-muted small">Max Marks: {tst.maxMarks}<br/>Batch: {tst.batch}</div>}
    </div>
   </div>
   <div className="col-lg-9">
    <div className="card p-4 h-100">
     <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-semibold mb-0">Class Performance Overview</h5>
      {chartData.length>0&&<span className="badge bg-success fs-6">Avg: {avgMark}/{tst?.maxMarks}</span>}
     </div>
     {chartData.length>0 ? (
      <ResponsiveContainer width="100%" height={160}>
       <BarChart data={chartData}>
        <XAxis dataKey="name" tick={{fontSize: 12}}/>
        <Tooltip cursor={{fill:'transparent'}}/>
        <Bar dataKey="mark" fill="#3b82f6" radius={[4,4,0,0]} barSize={40}/>
       </BarChart>
      </ResponsiveContainer>
     ) : (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
       No performance chart available.
      </div>
     )}
    </div>
   </div>
  </div>

  <div className="card p-0 shadow-sm border-0">
   <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
    <h5 className="mb-0 fw-bold">Student Marks Roster</h5>
    {admin&&<button className={\`btn btn-\${saved?"success":"primary"} px-4\`} onClick={saveMarks}>
     {saved?"✓ Saved Successfully":"💾 Save Marks"}
    </button>}
   </div>
   <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
     <thead className="table-light">
      <tr>
       <th className="px-4">Student Code</th>
       <th>Name</th>
       <th>Course Batch</th>
       <th style={{width:'200px'}} className="px-4 text-end">Marks {tst? \`(out of \${tst.maxMarks})\`:''}</th>
      </tr>
     </thead>
     <tbody>
      {admin && students.length===0 && <tr><td colSpan={4} className="text-center py-4 text-muted">No students found.</td></tr>}
      {admin && students.map(s=>{
       const val = marksMap[\`\${testId}_\${s._id}\`] !== undefined ? marksMap[\`\${testId}_\${s._id}\`] : "";
       return <tr key={s._id}>
        <td className="px-4 font-monospace small text-muted">{s.studentCode}</td>
        <td className="fw-semibold">{s.name}</td>
        <td><span className="badge bg-light text-dark border">{s.batch}</span></td>
        <td className="px-4">
          <input type="number" className="form-control form-control-sm text-end fw-bold text-primary" min="0" max={tst?.maxMarks||100} value={val} onChange={e=>handleMark(s._id, e.target.value)} />
        </td>
       </tr>;
      })}
      {!admin && marksList.map((m:any) => {
        if(m.test._id !== testId) return null;
        return <tr key={m._id}>
          <td className="px-4 font-monospace small text-muted">{m.student?.studentCode}</td>
          <td className="fw-semibold">{m.student?.name}</td>
          <td><span className="badge bg-light text-dark border">Student View</span></td>
          <td className="px-4 text-end fw-bold text-primary fs-5">{m.marks} / {m.test.maxMarks}</td>
        </tr>;
      })}
     </tbody>
    </table>
   </div>
  </div>
 </>;
}`;

code = code.replace(/function Subjects\(\)\{[\s\S]*?(?=function Tests\(\))/m, newSubjects + "\n\n");
code = code.replace(/function Tests\(\)\{[\s\S]*?(?=export default App;)/m, newTests + "\n\n");

fs.writeFileSync(filePath, code);
console.log("Replaced Subjects and Tests components in App.tsx");
