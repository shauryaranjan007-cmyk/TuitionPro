import fs from 'fs';

const filePath = '../frontend/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// The new components
const newCode = `function Courses(){
 const u=user();
 if(u?.role!=="admin") return <div className="alert alert-warning">Admin access required.</div>;
 const [items,setItems]=useState<any[]>([]);
 const [edit,setEdit]=useState<any>(null);
 const [form,setForm]=useState({name:"",code:"",duration:"6 Months",fee:5000});
 const load=()=>api.get("/courses").then(r=>setItems(r.data)).catch(()=>{});
 useEffect(()=>{load();},[]);

 const save=async(e:any)=>{
  e.preventDefault();
  try{
   edit?await api.put("/courses/"+edit._id,form):await api.post("/courses",form);
   setEdit(null); setForm({name:"",code:"",duration:"6 Months",fee:5000}); load();
  }catch(e){alert("Save failed");}
 };
 const del=async(id:string)=>{if(window.confirm("Delete?")){await api.delete("/courses/"+id);load();}};

 return <div className="card p-4">
  <h4>Courses Management</h4>
  <form onSubmit={save} className="row g-2 mb-4">
   <div className="col-md-3"><input className="form-control" placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
   <div className="col-md-2"><input className="form-control" placeholder="Code" required value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></div>
   <div className="col-md-2"><input className="form-control" placeholder="Duration" required value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/></div>
   <div className="col-md-3"><input type="number" className="form-control" placeholder="Fee" required value={form.fee} onChange={e=>setForm({...form,fee:Number(e.target.value)})}/></div>
   <div className="col-md-2"><button className="btn btn-primary w-100">Save</button></div>
  </form>
  <table className="table">
   <thead><tr><th>Name</th><th>Code</th><th>Duration</th><th>Fee</th><th>Actions</th></tr></thead>
   <tbody>
    {items.map(i=><tr key={i._id}>
     <td>{i.name}</td><td>{i.code}</td><td>{i.duration}</td><td>Rs.{i.fee}</td>
     <td>
      <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>{setEdit(i);setForm(i)}}>Edit</button>
      <button className="btn btn-sm btn-outline-danger" onClick={()=>del(i._id)}>Del</button>
     </td>
    </tr>)}
   </tbody>
  </table>
 </div>;
}

function Batches(){
 const u=user();
 if(u?.role!=="admin") return <div className="alert alert-warning">Admin access required.</div>;
 const [items,setItems]=useState<any[]>([]);
 const [courses,setCourses]=useState<any[]>([]);
 const [edit,setEdit]=useState<any>(null);
 const [form,setForm]=useState({name:"",course:"",schedule:""});
 const load=async()=>{
   const [b,c] = await Promise.all([api.get("/batches"), api.get("/courses")]);
   setItems(b.data); setCourses(c.data);
 };
 useEffect(()=>{load();},[]);

 const save=async(e:any)=>{
  e.preventDefault();
  try{
   edit?await api.put("/batches/"+edit._id,form):await api.post("/batches",form);
   setEdit(null); setForm({name:"",course:"",schedule:""}); load();
  }catch(e){alert("Save failed");}
 };
 const del=async(id:string)=>{if(window.confirm("Delete?")){await api.delete("/batches/"+id);load();}};

 return <div className="card p-4">
  <h4>Batches Management</h4>
  <form onSubmit={save} className="row g-2 mb-4">
   <div className="col-md-3"><input className="form-control" placeholder="Name (e.g. IT-A)" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
   <div className="col-md-4">
    <select className="form-select" required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
     <option value="">Select Course...</option>
     {courses.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
    </select>
   </div>
   <div className="col-md-3"><input className="form-control" placeholder="Schedule" required value={form.schedule} onChange={e=>setForm({...form,schedule:e.target.value})}/></div>
   <div className="col-md-2"><button className="btn btn-primary w-100">Save</button></div>
  </form>
  <table className="table">
   <thead><tr><th>Name</th><th>Course</th><th>Schedule</th><th>Actions</th></tr></thead>
   <tbody>
    {items.map(i=><tr key={i._id}>
     <td>{i.name}</td><td>{i.course?.name || i.course}</td><td>{i.schedule}</td>
     <td>
      <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>{setEdit(i);setForm({name:i.name,course:i.course?._id||i.course,schedule:i.schedule})}}>Edit</button>
      <button className="btn btn-sm btn-outline-danger" onClick={()=>del(i._id)}>Del</button>
     </td>
    </tr>)}
   </tbody>
  </table>
 </div>;
}

function Students(){
 const u=user();
 if(u?.role!=="admin") return <div className="alert alert-warning">Admin access required.</div>;
 const [items,setItems]=useState<any[]>([]);
 const [courses,setCourses]=useState<any[]>([]);
 const [batches,setBatches]=useState<any[]>([]);
 const [edit,setEdit]=useState<any>(null);
 const [msg,setMsg]=useState("");
 const [form,setForm]=useState<any>({studentCode:"",name:"",email:"",phone:"",course:"",batch:"",monthlyFee:5000,status:"Active"});
 const load=async()=>{
   try {
     const [s,c,b] = await Promise.all([api.get("/students"), api.get("/courses"), api.get("/batches")]);
     setItems(s.data); setCourses(c.data); setBatches(b.data);
   } catch(e){}
 };
 useEffect(()=>{load();},[]);
 
 const save=async(e:any)=>{
  e.preventDefault();
  try{
   edit?await api.put("/students/"+edit._id,form):await api.post("/students",form);
   setEdit(null);
   setForm({studentCode:"",name:"",email:"",phone:"",course:"",batch:"",monthlyFee:5000,status:"Active"});
   load();
  }catch(e:any){setMsg(e.response?.data?.message||"Save failed");}
 };
 const del=async(id:string)=>{if(window.confirm("Delete student?")){await api.delete("/students/"+id);load();}};

 const statusBadge=(s:string)=>s==="Active"
  ?<span className="badge bg-success">Active</span>
  :<span className="badge bg-secondary">Inactive</span>;

 return <motion.div initial={{opacity:0}} animate={{opacity:1}}>
  <div className="d-flex justify-content-between align-items-start mb-3">
   <div>
    <h2 className="fw-bold mb-1">Students</h2>
    <p className="text-muted mb-0">Student Records</p>
   </div>
   <span className="badge bg-success align-self-start fs-6 px-3 py-2">Live API</span>
  </div>
  {msg&&<div className="alert alert-warning alert-dismissible">{msg}<button className="btn-close" onClick={()=>setMsg("")}/></div>}

  <div className="row g-3 mb-3">
   {[["Total",items.length,"primary"],["Active",items.filter((s:any)=>s.status==="Active").length,"success"],["Inactive",items.filter((s:any)=>s.status==="Inactive").length,"secondary"]].map((x:any)=>(
    <div className="col-md-4" key={x[0]}>
     <motion.div whileHover={{y:-3}} className={\`card p-3 border-2 border-\${x[2]} text-center\`}>
      <div className="small-muted">{x[0]} Students</div>
      <div className={\`fw-bold fs-2 text-\${x[2]}\`}>{x[1]}</div>
     </motion.div>
    </div>
   ))}
  </div>

  <div className="card p-4 mb-3">
   <h5 className="fw-semibold mb-3">{edit?"Edit":"Add"} Student</h5>
   <form onSubmit={save} className="row g-2">
    {["studentCode","name","email","phone"].map(k=>(
     <div className="col-md-3" key={k}>
      <input className="form-control" placeholder={k.charAt(0).toUpperCase()+k.slice(1)} required={["studentCode","name","email"].includes(k)} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
     </div>
    ))}
    <div className="col-md-4">
      <select className="form-select" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} required>
        <option value="">Select Course...</option>
        {courses.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
    </div>
    <div className="col-md-4">
      <select className="form-select" value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} required>
        <option value="">Select Batch...</option>
        {batches.filter(b=>b.course?._id === form.course || b.course === form.course).map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
      </select>
    </div>
    <div className="col-md-4"><input className="form-control" type="number" placeholder="Monthly Fee" value={form.monthlyFee} onChange={e=>setForm({...form,monthlyFee:Number(e.target.value)})}/></div>
    <div className="col-md-4"><select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Inactive</option></select></div>
    <div className="col-md-4 d-flex gap-2"><button className="btn btn-primary">Save</button>{edit&&<button type="button" className="btn btn-secondary" onClick={()=>setEdit(null)}>Cancel</button>}</div>
   </form>
  </div>

  <div className="card p-3">
   <div className="table-responsive">
    <table className="table align-middle">
     <thead className="table-light"><tr><th>Code</th><th>Name</th><th>Email</th><th>Course</th><th>Batch</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
     <tbody>
      {items.map((s:any)=><tr key={s._id}>
       <td><span className="font-monospace small">{s.studentCode}</span></td>
       <td className="fw-semibold">{s.name}</td>
       <td className="text-muted small">{s.email}</td>
       <td>{s.course?.name || s.course}</td>
       <td><span className="badge bg-light text-dark border">{s.batch?.name || s.batch}</span></td>
       <td>Rs.{(s.monthlyFee||0).toLocaleString("en-IN")}</td>
       <td>{statusBadge(s.status)}</td>
       <td>
        {<><button className="btn btn-sm btn-outline-primary me-1" onClick={()=>{setEdit(s);setForm({...s, course: s.course?._id, batch: s.batch?._id})}}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>del(s._id)}>Delete</button></>}
       </td>
      </tr>)}
     </tbody>
    </table>
   </div>
  </div>
 </motion.div>;
}`;

code = code.replace(/function Students\(\)[\s\S]*?(?=function Attendance)/m, newCode + "\n\n");

// Add routes in App
let appRoutes = code.match(/<Route path="students" element={<Layout><Students \/><\/Layout>} \/>/);
if (appRoutes) {
  code = code.replace(/<Route path="students" element={<Layout><Students \/><\/Layout>} \/>/,
    `<Route path="students" element={<Layout><Students /></Layout>} />\n    <Route path="courses" element={<Layout><Courses /></Layout>} />\n    <Route path="batches" element={<Layout><Batches /></Layout>} />`
  );
}

// Add links in Layout sidebar
let layoutLinks = code.match(/<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="\/students">Students<\/NavLink>/);
if (layoutLinks) {
  code = code.replace(/<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="\/students">Students<\/NavLink>/,
    `<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/students">Students</NavLink>\n     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/courses">Courses</NavLink>}\n     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/batches">Batches</NavLink>}`
  );
}

fs.writeFileSync(filePath, code);
console.log("Injected Courses, Batches, and updated Students");
