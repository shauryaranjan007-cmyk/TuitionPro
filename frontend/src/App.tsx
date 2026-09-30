import {BrowserRouter,Routes,Route,NavLink,Link,Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,BarChart,Bar,PieChart,Pie,Cell,Legend} from "recharts";
import {api} from "./api";
import { jsPDF } from "jspdf";
import { ExperimentsIndex, ExperimentViewer } from "./Experiments";

const user=()=>JSON.parse(localStorage.getItem("tp_user")||"null");

function ProtectedRoute({children}:{children:any}){
 const u=user();
 if(!u) return <Navigate to="/login" replace />;
 return children;
}

function Layout({children}:{children:any}){
 const nav=useNavigate(); const u=user();
 const [open, setOpen] = useState(true);
 const logout=async()=>{try{await api.post("/auth/logout")}finally{localStorage.removeItem("tp_user");nav("/login")}};

 if(!u) {
  return <><nav className="navbar bg-white border-bottom"><div className="container"><Link className="navbar-brand text-primary fw-bold" to="/">TuitionPro ✦</Link></div></nav><main className="container py-5">{children}</main></>;
 }

 return <div className="d-flex min-vh-100" style={{backgroundColor:"#f8fafc"}}>
  <style>{`
    .sidebar-link { color: #94a3b8; transition: all 0.2s ease; font-size: 0.95rem; }
    .sidebar-link:hover { color: #f8fafc; background-color: rgba(255,255,255,0.08); }
    .sidebar-link.active { background-color: #3b82f6 !important; color: #ffffff !important; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); }
    .sidebar-header { font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; padding-left: 1rem; }
  `}</style>
  <AnimatePresence>
  {open && <motion.aside initial={{width:0, opacity:0}} animate={{width:260, opacity:1}} exit={{width:0, opacity:0}} className="d-flex flex-column shadow-lg sticky-top overflow-hidden text-nowrap" style={{height:"100vh", backgroundColor:"#0f172a", zIndex:1000}}>
   <div className="p-3 d-flex flex-column h-100">
    <div className="d-flex justify-content-between align-items-center mb-4 mt-2 px-2">
     <Link className="navbar-brand text-white fw-bold fs-4 d-flex align-items-center gap-2" to="/">
       <div className="bg-primary rounded px-2 py-1 text-white shadow-sm" style={{fontSize:"1.2rem"}}>T</div>
       <span>TuitionPro</span>
     </Link>
     <button className="btn btn-sm text-white-50 border-0 fw-bold p-0 fs-5" onClick={()=>setOpen(false)}>✕</button>
    </div>
    
    <div className="nav flex-column gap-1 flex-grow-1 overflow-auto pe-1" style={{scrollbarWidth:"none"}}>
     <div className="sidebar-header mt-1">Main Menu</div>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/">Dashboard</NavLink>
     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/students">Students</NavLink>}
     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/courses">Courses</NavLink>}
     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/batches">Batches</NavLink>}     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/attendance">Attendance</NavLink>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/payments">Payments</NavLink>
     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/dues">Fee Dues</NavLink>}
     
     <div className="sidebar-header">Academics</div>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/subjects">Subjects</NavLink>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/tests">Tests</NavLink>
     
     <div className="sidebar-header">System</div>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/settings">Profile & Settings</NavLink>
     <NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/ai">AI Tools</NavLink>
     {u.role==="admin"&&<NavLink className="nav-link sidebar-link rounded px-3 py-2" to="/gmail">Mail Center</NavLink>}
     <NavLink className="nav-link sidebar-link rounded px-3 py-2 fw-bold text-info" to="/experiments">Lab Experiments</NavLink>
    </div>
    
    <div className="mt-auto pt-4">
     <div className="d-flex align-items-center mb-3 px-2 bg-dark rounded p-2" style={{backgroundColor:"rgba(255,255,255,0.05)"}}>
      <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-bold me-2 shadow-sm" style={{width:36,height:36,minWidth:36}}>{u.name[0]}</div>
      <div className="overflow-hidden text-white w-100">
        <div className="small fw-bold text-truncate">{u.name}</div>
        <div className="text-white-50" style={{fontSize:"11px",textTransform:"uppercase"}}>{u.role}</div>
      </div>
     </div>
     <button className="btn btn-danger w-100 fw-bold shadow-sm" onClick={logout}>Logout</button>
    </div>
   </div>
  </motion.aside>}
  </AnimatePresence>

  <div className="flex-grow-1 d-flex flex-column" style={{minWidth:0}}>
   <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top shadow-sm" style={{zIndex:900}}>
    <div className="d-flex align-items-center gap-3">
     {!open && <button className="btn btn-light shadow-sm border d-flex align-items-center justify-content-center p-2 rounded" onClick={()=>setOpen(true)}>☰</button>}
     <div className="input-group d-none d-md-flex shadow-sm rounded" style={{width:"300px"}}>
      <span className="input-group-text bg-light border-end-0 text-muted border-light-subtle">🔍</span>
      <input type="text" className="form-control bg-light border-start-0 ps-0 border-light-subtle" placeholder="Search students, payments..." />
     </div>
    </div>
    <div className="d-flex align-items-center gap-3">
     <button className="btn btn-light position-relative p-2 rounded-circle d-flex align-items-center justify-content-center border-0 bg-light" style={{width:40,height:40}}>
      🔔<span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"><span className="visually-hidden">New alerts</span></span>
     </button>
     <div className="border-start ps-3 d-flex align-items-center gap-2">
      <span className="small fw-bold d-none d-md-inline text-secondary">{u.name}</span>
      <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width:34,height:34}}>{u.name[0]}</div>
     </div>
    </div>
   </header>
   <main className="p-4 p-md-5 flex-grow-1 overflow-auto">
    {children}
   </main>
  </div>
 </div>;
}

function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");

  async function submit(e:any){
    e.preventDefault();
    setMsg("");

    try{
      const r=await api.post("/auth/login",{email,password});

      localStorage.setItem("tp_user",JSON.stringify(r.data.user));

      window.location.href="/";
    }catch(e:any){
      setMsg(e.response?.data?.message||"Login failed");
    }
  }

  return (
    <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      className="row justify-content-center"
    >
      <div className="col-lg-5">
        <div className="card p-4 mt-5">

          <h2 className="gradient-text fw-bold">
            Welcome to TuitionPro
          </h2>

          <p className="text-muted">
            Smart tuition management • MERN • Web Lab
          </p>

          {msg && (
            <div className="alert alert-danger">
              {msg}
            </div>
          )}

          <form onSubmit={submit}>

            <label>Email</label>

            <input
              className="form-control mb-3"
              type="email"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />

            <label>Password</label>

            <input
              className="form-control mb-3"
              type="password"
              minLength={6}
              required
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-100">
              Sign in
            </button>

          </form>

          <hr/>

          <div className="small-muted">
            Use the account credentials configured by the administrator.
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function Register(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [mobile,setMobile]=useState("");
  const [dob,setDob]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [errs,setErrs]=useState<any>({});
  const [msg,setMsg]=useState("");
  const nav=useNavigate();

  const validate = () => {
    const e:any = {};
    if(name.length < 2 || name.length > 80) e.name = "Name must be 2-80 characters";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if(!/^\d{10}$/.test(mobile)) e.mobile = "Mobile must be exactly 10 digits";
    const d = new Date(dob);
    if(!dob || isNaN(d.getTime()) || d > new Date() || (new Date().getFullYear() - d.getFullYear() < 5)) e.dob = "Must be at least 5 years old";
    if(password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) e.password = "Password must be >= 8 chars with letter and number";
    if(password !== confirm) e.confirm = "Passwords must match";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e:any){
    e.preventDefault();
    setMsg("");
    if(!validate()) return;
    try{
      const r=await api.post("/auth/register",{name,email,mobile,dob,password});
      localStorage.setItem("tp_user",JSON.stringify(r.data.user));
      window.location.href="/";
    }catch(e:any){
      setMsg(e.response?.data?.message||"Registration failed");
    }
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card p-4 mt-5">
          <h2 className="gradient-text fw-bold">Create Account</h2>
          <p className="text-muted">Join TuitionPro today</p>
          {msg && <div className="alert alert-danger">{msg}</div>}
          <form onSubmit={submit} className="row g-3" noValidate>
            <div className="col-md-6">
              <label>Name</label>
              <input className={`form-control ${errs.name?'is-invalid':''}`} value={name} onChange={e=>setName(e.target.value)} required/>
              <div className="invalid-feedback">{errs.name}</div>
            </div>
            <div className="col-md-6">
              <label>Email</label>
              <input type="email" className={`form-control ${errs.email?'is-invalid':''}`} value={email} onChange={e=>setEmail(e.target.value)} required/>
              <div className="invalid-feedback">{errs.email}</div>
            </div>
            <div className="col-md-6">
              <label>Mobile (10 digits)</label>
              <input type="tel" className={`form-control ${errs.mobile?'is-invalid':''}`} value={mobile} onChange={e=>setMobile(e.target.value)} required/>
              <div className="invalid-feedback">{errs.mobile}</div>
            </div>
            <div className="col-md-6">
              <label>Date of Birth</label>
              <input type="date" className={`form-control ${errs.dob?'is-invalid':''}`} value={dob} onChange={e=>setDob(e.target.value)} required/>
              <div className="invalid-feedback">{errs.dob}</div>
            </div>
            <div className="col-md-6">
              <label>Password</label>
              <input type="password" className={`form-control ${errs.password?'is-invalid':''}`} value={password} onChange={e=>setPassword(e.target.value)} required/>
              <div className="invalid-feedback">{errs.password}</div>
            </div>
            <div className="col-md-6">
              <label>Confirm Password</label>
              <input type="password" className={`form-control ${errs.confirm?'is-invalid':''}`} value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
              <div className="invalid-feedback">{errs.confirm}</div>
            </div>
            <div className="col-12 mt-4">
              <button className="btn btn-primary w-100">Register</button>
            </div>
          </form>
          <div className="small text-muted mt-3 text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard(){
 const u=user();
 const admin=u?.role==="admin";
 const [stats,setStats]=useState<any>({students:0,paid:0,pending:0,attendance:87});
 const [chart,setChart]=useState<any[]>([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:87}]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 
 useEffect(()=>{
  Promise.all([api.get("/students"), api.get("/payments/summary"), api.get("/attendance")])
  .then(([s,p,a])=>{
   let attRate = 87;
   if(a.data && a.data.length > 0){
    const total = a.data.length;
    const present = a.data.filter((x:any)=>x.status==="Present"||x.status==="Late").length;
    attRate = Math.round((present/total)*100);
   }
   const paid = p.data?.paid ?? 0;
   const pending = p.data?.pending ?? 0;
   const studentCount = admin ? s.data.length : 1;
   setStats({students:studentCount, paid, pending, attendance:attRate});
   setChart([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:attRate}]);
   setLoading(false);
  }).catch(()=>{setError("Failed to load dashboard data.");setLoading(false);});
 },[]);

 if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;

 const greeting = admin ? "Good to see you, Admin." : `Welcome back, ${u?.name || "Student"}.`;
 const subtitle = admin
  ? "Manage students, attendance, fees and AI assistance in one place."
  : "View your attendance, payments, and academic performance.";

 const statCards = admin
  ? [["Students",stats.students,"👥"],["Paid Fees","₹"+stats.paid.toLocaleString("en-IN"),"✓"],["Pending Fees","₹"+stats.pending.toLocaleString("en-IN"),"₹"],["Attendance",stats.attendance+"%","◉"]]
  : [["My Paid","₹"+stats.paid.toLocaleString("en-IN"),"✓"],["Pending Fees","₹"+stats.pending.toLocaleString("en-IN"),"₹"],["Attendance",stats.attendance+"%","◉"],["Status","Active","🟢"]];

 return <><motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="hero p-5 mb-4"><div className="position-relative"><h1 className="items-6 fw-bold">{greeting}</h1><p className="mb-0 opacity-75">{subtitle}</p></div></motion.div>
 <div className="row g-3">{(statCards as any[]).map((x:any)=><div className="col-md-3" key={x[0]}><motion.div whileHover={{y:-4}} className="card p-4"><div className="small-muted">{x[2]} {x[0]}</div><div className="stat">{x[1]}</div></motion.div></div>)}</div>
 <div className="row g-3 mt-1"><div className="col-lg-8"><div className="card p-4"><h5>Attendance trend</h5><ResponsiveContainer width="100%" height={260}><LineChart data={chart}><XAxis dataKey="m"/><YAxis domain={[60,100]}/><Tooltip/><Line type="monotone" dataKey="v" strokeWidth={3} stroke="#6366f1"/></LineChart></ResponsiveContainer></div></div><div className="col-lg-4"><div className="card p-4 h-100"><h5>Quick actions</h5><div className="d-grid gap-2 mt-3">{admin&&<Link className="btn btn-primary" to="/students">Manage Students</Link>}<Link className="btn btn-outline-primary" to="/attendance">{admin?"Mark Attendance":"View Attendance"}</Link><Link className="btn btn-outline-success" to="/payments">{admin?"Manage Payments":"View Payments"}</Link>{!admin&&<Link className="btn btn-outline-secondary" to="/tests">View My Marks</Link>}</div></div></div></div>
 </>;
}

function Courses(){
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
   <div className="col-md-2"><button className="btn btn-primary w-100">{edit?"Update":"Save"}</button>{edit&&<button type="button" className="btn btn-secondary w-100 mt-1" onClick={()=>{setEdit(null);setForm({name:"",code:"",duration:"6 Months",fee:5000})}}>Cancel</button>}</div>
  </form>
  {items.length===0&&<div className="alert alert-info">No courses yet. Add one above.</div>}
  <table className="table">
   <thead><tr><th>Name</th><th>Code</th><th>Duration</th><th>Fee</th><th>Actions</th></tr></thead>
   <tbody>
    {items.map(i=><tr key={i._id}>
     <td>{i.name}</td><td>{i.code}</td><td>{i.duration}</td><td>₹{(i.fee||0).toLocaleString("en-IN")}</td>
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
 const [search,setSearch]=useState("");
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
 const del=async(id:string)=>{
  if(!window.confirm("Delete student? This cannot be undone if they have no payments.")) return;
  try{ await api.delete("/students/"+id); load(); }
  catch(e:any){ setMsg(e.response?.data?.message||"Cannot delete: student may have existing payments. Deactivate instead."); }
 };

 const statusBadge=(s:string)=>s==="Active"
  ?<span className="badge bg-success">Active</span>
  :<span className="badge bg-secondary">Inactive</span>;

 const filtered = search.trim()
  ? items.filter((s:any)=>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    )
  : items;

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
     <motion.div whileHover={{y:-3}} className={`card p-3 border-2 border-${x[2]} text-center`}>
      <div className="small-muted">{x[0]} Students</div>
      <div className={`fw-bold fs-2 text-${x[2]}`}>{x[1]}</div>
     </motion.div>
    </div>
   ))}
  </div>

  <div className="card p-4 mb-3">
   <h5 className="fw-semibold mb-3">{edit?"Edit":"Add"} Student</h5>
   <form onSubmit={save} className="row g-2">
    {(["studentCode","name","email","phone"] as string[]).map(k=>(
     <div className="col-md-3" key={k}>
      <input className="form-control" placeholder={k.charAt(0).toUpperCase()+k.slice(1)} required={["studentCode","name","email"].includes(k)} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>
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
    <div className="col-md-4 d-flex gap-2"><button className="btn btn-primary">Save</button>{edit&&<button type="button" className="btn btn-secondary" onClick={()=>{setEdit(null);setForm({studentCode:"",name:"",email:"",phone:"",course:"",batch:"",monthlyFee:5000,status:"Active"})}}>Cancel</button>}</div>
   </form>
  </div>

  <div className="card p-3">
   <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-semibold mb-0">Student List ({filtered.length})</h5>
    <input className="form-control" style={{maxWidth:260}} placeholder="Search by name, code, email..." value={search} onChange={e=>setSearch(e.target.value)}/>
   </div>
   <div className="table-responsive">
    <table className="table align-middle">
     <thead className="table-light"><tr><th>Code</th><th>Name</th><th>Email</th><th>Course</th><th>Batch</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
     <tbody>
      {filtered.length===0&&<tr><td colSpan={8} className="text-center text-muted py-4">No students found.</td></tr>}
      {filtered.map((s:any)=><tr key={s._id}>
       <td><span className="font-monospace small">{s.studentCode}</span></td>
       <td className="fw-semibold">{s.name}</td>
       <td className="text-muted small">{s.email}</td>
       <td>{s.course?.name || s.course}</td>
       <td><span className="badge bg-light text-dark border">{s.batch?.name || s.batch}</span></td>
       <td>₹{(s.monthlyFee||0).toLocaleString("en-IN")}</td>
       <td>{statusBadge(s.status)}</td>
       <td>
        {<><button className="btn btn-sm btn-outline-primary me-1" onClick={()=>{setEdit(s);setForm({...s, course: s.course?._id||s.course, batch: s.batch?._id||s.batch})}}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>del(s._id)}>Delete</button></>}
       </td>
      </tr>)}
     </tbody>
    </table>
   </div>
  </div>
 </motion.div>;
}

function Attendance(){
 const u=user(); const admin=u?.role==="admin";
 const [students,setStudents]=useState<any[]>([]);
 const [rows,setRows]=useState<any[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [selected,setSelected]=useState("");
 const [status,setStatus]=useState("Present");
 const [note,setNote]=useState("");
 const [summary,setSummary]=useState<any>(null);
 const [date,setDate]=useState(new Date().toISOString().slice(0,10));
 const [markMsg,setMarkMsg]=useState("");
 const [markErr,setMarkErr]=useState("");

 useEffect(()=>{
  api.get("/students").then(r=>setStudents(r.data)).catch(()=>{});
  api.get("/attendance").then(r=>{setRows(r.data);setLoaded(true);}).catch(()=>{setLoaded(true);});
 },[]);
 useEffect(()=>{
  if(selected) api.get("/attendance/summary/"+selected).then(r=>setSummary(r.data)).catch(()=>{});
 },[selected]);

 const mark=async()=>{
  if(!selected){setMarkErr("Please choose a student.");return;}
  setMarkMsg("");setMarkErr("");
  try{
   await api.post("/attendance",{student:selected,date,status,checkIn:status==="Late"?"10:15":status==="Present"?"09:55":"",note});
   const [a,s]=await Promise.all([api.get("/attendance"),api.get("/attendance/summary/"+selected)]);
   setRows(a.data);setSummary(s.data);
   setMarkMsg("✅ Attendance saved!");
   setTimeout(()=>setMarkMsg(""),3000);
  }catch(e:any){setMarkErr(e.response?.data?.message||"Failed to save.");}
 };

 // Only use real data; show zeros when loaded but empty
 const emptyStats={present:0,absent:0,late:0,excused:0,percentage:0};
 const ds = loaded ? (summary || emptyStats) : {present:62,absent:12,late:8,excused:4,percentage:72};
 const dr = loaded ? rows : [];
 const PIE_COLORS=["#22c55e","#ef4444","#f59e0b","#6366f1"];
 const pieData=[
  {name:"Present",value:ds.present||0},
  {name:"Absent",value:ds.absent||0},
  {name:"Late",value:ds.late||0},
  {name:"Excused",value:ds.excused||0},
 ];
 const monthBar=[{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:ds.percentage||0}];

 const sBadge=(s:string)=>{
  if(s==="Present") return <span className="badge bg-success">Present</span>;
  if(s==="Absent")  return <span className="badge bg-danger">Absent</span>;
  if(s==="Late")    return <span className="badge bg-warning text-dark">Late</span>;
  return <span className="badge bg-secondary">{s}</span>;
 };

 return <>
  <h2 className="fw-bold mb-1">Attendance Intelligence</h2>
  <p className="text-muted mb-4">{admin?"Manage and track student attendance.":"View your attendance. Only an administrator can mark attendance."}</p>

  <div className="row g-3 mb-4">
   {([["Present",ds.present,"success"],["Absent",ds.absent,"danger"],["Late",ds.late,"warning"],["Rate %",(ds.percentage||0)+"%","primary"]] as any[]).map((x:any)=><div className="col-6 col-md-3" key={x[0]}>
    <motion.div whileHover={{y:-3}} className="card p-3 text-center">
     <div className="small-muted">{x[0]}</div>
     <div className={`fw-bold fs-3 mt-1 text-${x[2]}`}>{x[1]}</div>
    </motion.div>
   </div>)}
  </div>

  <div className="row g-3 mb-4">
   <div className="col-lg-5">
    <div className="card p-4 h-100">
     <h5 className="fw-semibold mb-1">Attendance Breakdown</h5>
     {!loaded?<div className="text-center text-muted py-4"><span className="spinner-border spinner-border-sm"/> Loading...</div>:
     <ResponsiveContainer width="100%" height={270}>
      <PieChart>
       <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({name,percent}:any)=>`${(percent*100).toFixed(0)}%`}>
        {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
       </Pie>
       <Tooltip/>
       <Legend/>
      </PieChart>
     </ResponsiveContainer>}
    </div>
   </div>

   <div className={admin?"col-lg-4":"col-lg-7"}>
    <div className="card p-4 h-100">
     <h5 className="fw-semibold mb-1">Monthly Trend</h5>
     <ResponsiveContainer width="100%" height={230}>
      <BarChart data={monthBar}>
       <XAxis dataKey="m"/><YAxis domain={[0,100]}/><Tooltip/>
       <Bar dataKey="v" fill="#6366f1" radius={[4,4,0,0]}/>
      </BarChart>
     </ResponsiveContainer>
    </div>
   </div>

   {admin&&<div className="col-lg-3">
    <div className="card p-4 h-100">
     <h5 className="fw-semibold mb-3">Mark Attendance</h5>
     {markMsg&&<div className="alert alert-success py-2 small">{markMsg}</div>}
     {markErr&&<div className="alert alert-danger py-2 small">{markErr}</div>}
     <label className="form-label small fw-semibold">Student</label>
     <select className="form-select mb-2" value={selected} onChange={e=>setSelected(e.target.value)}>
      <option value="">Choose...</option>
      {students.map((s:any)=><option value={s._id} key={s._id}>{s.name}</option>)}
     </select>
     <label className="form-label small fw-semibold">Date</label>
     <input className="form-control mb-2" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
     <label className="form-label small fw-semibold">Status</label>
     <select className="form-select mb-2" value={status} onChange={e=>setStatus(e.target.value)}>
      <option>Present</option><option>Absent</option><option>Late</option><option>Excused</option>
     </select>
     <label className="form-label small fw-semibold">Note (optional)</label>
     <input className="form-control mb-3" placeholder="e.g. Medical leave" value={note} onChange={e=>setNote(e.target.value)}/>
     <button className="btn btn-primary w-100" onClick={mark}>Save Attendance</button>
    </div>
   </div>}
  </div>

  <div className="card p-3">
   <h5 className="fw-semibold mb-3">Recent Records</h5>
   <div className="table-responsive">
    <table className="table align-middle">
     <thead className="table-light"><tr><th>Student</th><th>Date</th><th>Status</th><th>Check-in</th><th>Note</th></tr></thead>
     <tbody>
      {dr.length===0&&loaded&&<tr><td colSpan={5} className="text-center text-muted py-4">No attendance records found.</td></tr>}
      {dr.slice(0,15).map((r:any)=><tr key={r._id}>
       <td className="fw-semibold">{r.student?.name||"—"}</td>
       <td>{new Date(r.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
       <td>{sBadge(r.status)}</td>
       <td><span className="font-monospace small">{r.checkIn||"—"}</span></td>
       <td className="text-muted small">{r.note||"—"}</td>
      </tr>)}
     </tbody>
    </table>
   </div>
  </div>
 </>;
}

function Payments(){
 const u=user();
 const [students,setStudents]=useState<any[]>([]);
 const [rows,setRows]=useState<any[]>([]);
 const [studentId,setStudentId]=useState("");
 const [amount,setAmount]=useState(5000);
 const [month,setMonth]=useState("October 2026");
 const [summary,setSummary]=useState<any>({});
 const [filter,setFilter]=useState("All");
 const [loading,setLoading]=useState(false);
 const [msg,setMsg]=useState("");
 const [msgType,setMsgType]=useState("success");

 const load=()=>Promise.all([
   api.get("/students"),
   api.get("/payments"),
   api.get("/payments/summary")
 ]).then(([s,p,sum])=>{
   setStudents(s.data);
   setRows(p.data);
   setSummary(sum.data);
 }).catch(()=>{});

 useEffect(()=>{load();},[]);

 const filtered=filter==="All"?rows:rows.filter((r:any)=>r.status===filter);

  const downloadReceipt = (p: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("TuitionPro", 20, 20);
    doc.setFontSize(16);
    doc.text("Fee Receipt", 20, 30);
    doc.setFontSize(12);
    doc.text(`Receipt No: ${p.receiptNo || "N/A"}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Student Name: ${p.student?.name || "N/A"}`, 20, 70);
    doc.text(`Month: ${p.month}`, 20, 80);
    doc.text(`Amount Paid: Rs. ${p.amount}`, 20, 90);
    doc.text(`Payment Method: ${p.method || "Offline"}`, 20, 100);
    doc.save(`Receipt_${p.month.replace(/ /g, "_")}_${p.student?.name?.replace(/ /g, "_")}.pdf`);
  };


 const doRecord=async(sid:string,amt:number,mon:string)=>{
   if(!sid){setMsg("Please select a student.");setMsgType("danger");return;}
   setLoading(true);setMsg("");
   try{
     const o=await api.post("/payments/order",{studentId:sid,amount:amt,month:mon});
     await api.post("/payments/record",{student:sid,amount:amt,month:mon,status:"Paid",method:o.data?.mode==="demo"?"Demo":"Razorpay",transactionId:o.data?.id});
     setMsg(o.data?.mode==="demo"?"✅ Demo payment recorded! Add Razorpay keys for live checkout.":"✅ Razorpay order created.");
     setMsgType("success");
     load();
   }catch(e:any){
     setMsg("❌ "+(e.response?.data?.message||"Payment failed. Please try again."));
     setMsgType("danger");
   }
   setLoading(false);
 };

 const statusBadge=(s:string)=>{
   if(s==="Paid") return <span className="badge bg-success">✓ Paid</span>;
   if(s==="Pending") return <span className="badge bg-warning text-dark">⏳ Pending</span>;
   return <span className="badge bg-secondary">{s}</span>;
 };

 return <>
  <div className="d-flex justify-content-between align-items-start mb-4">
   <div>
    <h2 className="fw-bold mb-1">💳 Payments & Fees</h2>
    <p className="text-muted mb-0">Multi-state payment ledger + optional Razorpay integration.</p>
   </div>
   
  </div>

  {msg&&<div className={`alert alert-${msgType} alert-dismissible`} role="alert">
   {msg}
   <button type="button" className="btn-close" onClick={()=>setMsg("")}/>
  </div>}

  <div className="row g-3 mb-4">
   {[
    ["💰 Collected","₹"+(summary.paid||0).toLocaleString("en-IN"),"border-success"],
    ["⏳ Pending","₹"+(summary.pending||0).toLocaleString("en-IN"),"border-warning"],
    ["🧾 Transactions",summary.count||0,"border-primary"]
   ].map(x=><div className="col-md-4" key={String(x[0])}>
    <motion.div whileHover={{y:-3}} className={`card p-4 border-2 ${x[2]}`}>
     <div className="small-muted">{x[0]}</div>
     <div className="stat">{x[1]}</div>
    </motion.div>
   </div>)}
  </div>

  {u?.role==="admin"&&<div className="card p-4 mb-4">
   <h5 className="fw-semibold mb-3">📝 Record Tuition Payment</h5>
   <div className="row g-2 align-items-end">
    <div className="col-md-4">
     <label className="form-label small fw-semibold">Student</label>
     <select className="form-select" value={studentId} onChange={e=>setStudentId(e.target.value)}>
      <option value="">Choose student…</option>
      {students.map((s:any)=><option key={s._id} value={s._id}>{s.name} — {s.studentCode}</option>)}
     </select>
    </div>
    <div className="col-md-2">
     <label className="form-label small fw-semibold">Amount (₹)</label>
     <input className="form-control" type="number" min={0} value={amount} onChange={e=>setAmount(Number(e.target.value))}/>
    </div>
    <div className="col-md-3">
     <label className="form-label small fw-semibold">Month</label>
     <input className="form-control" value={month} onChange={e=>setMonth(e.target.value)} placeholder="e.g. October 2026"/>
    </div>
    <div className="col-md-3">
     <button className="btn btn-success w-100" onClick={()=>doRecord(studentId,amount,month)} disabled={loading}>
      {loading?<><span className="spinner-border spinner-border-sm me-2"/>Processing…</>:"💳 Record Payment"}
     </button>
    </div>
   </div>
  </div>}

  <div className="card p-3">
   <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-semibold mb-0">Transaction History</h5>
    <div className="btn-group btn-group-sm">
     {["All","Paid","Pending"].map(f=>(
      <button key={f} className={`btn ${filter===f?"btn-primary":"btn-outline-primary"}`} onClick={()=>setFilter(f)}>{f}</button>
     ))}
    </div>
   </div>
   <div className="table-responsive">
    <table className="table align-middle">
     <thead className="table-light">
      <tr><th>Student</th><th>Month</th><th>Amount</th><th>Status</th><th>Method</th><th>Receipt</th>{u?.role==="admin"&&<th>Action</th>}</tr>
     </thead>
     <tbody>
      {filtered.length===0&&<tr><td colSpan={u?.role==="admin"?7:6} className="text-center text-muted py-4">No {filter!=="All"?filter.toLowerCase():""} transactions found.</td></tr>}
      {filtered.map((p:any)=><tr key={p._id}>
       <td className="fw-semibold">{p.student?.name||"—"}</td>
       <td>{p.month}</td>
       <td>₹{(p.amount||0).toLocaleString("en-IN")}</td>
       <td>{statusBadge(p.status)}</td>
       <td><span className="text-muted small">{p.method||"—"}</span></td>
       <td>{p.status === "Paid" ? <button className="btn btn-sm btn-outline-secondary font-monospace" onClick={() => downloadReceipt(p)}>📄 {p.receiptNo || "Download"}</button> : <span className="font-monospace small text-muted">{p.receiptNo || "—"}</span>}</td>
       {u?.role==="admin"&&<td>
        {p.status==="Pending"&&<button className="btn btn-sm btn-outline-success" disabled={loading} onClick={()=>doRecord(p.student?._id,p.amount,p.month)}>
         {loading?"…":"Pay Now"}
        </button>}
       </td>}
      </tr>)}
     </tbody>
    </table>
   </div>
  </div>
 </>;
}




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
        subject: `Fee Reminder: ${month}`,
        text: `Dear ${studentName},\n\nThis is a reminder that your fee of ₹${amount} for ${month} is pending. Please pay as soon as possible.\n\nThanks,\nTuitionPro`
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


function Subjects(){
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
     await api.post(`/subjects/${subjectId}/materials`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
}


function Tests(){
 const u=user(); const admin=u?.role==="admin";

 const [students,setStudents]=useState<any[]>([]);
 const [tests,setTests]=useState<any[]>([]);
 const [subjects,setSubjects]=useState<any[]>([]);
 const [testId,setTestId]=useState("");
 const [marksList,setMarksList]=useState<any[]>([]);
 const [marksMap,setMarksMap]=useState<any>({});
 const [saved,setSaved]=useState(false);
 const [loading,setLoading]=useState(true);
 const [createForm,setCreateForm]=useState({name:"",subject:"",batch:"",date:"",maxMarks:100});
 const [creating,setCreating]=useState(false);

 const load=()=>{
   setLoading(true);
   Promise.all([
     api.get("/students"),
     api.get("/tests"),
     api.get("/tests/marks"),
     api.get("/subjects")
   ]).then(([s,t,m,sub])=>{
     setStudents(s.data);
     setTests(t.data);
     setMarksList(m.data);
     setSubjects(sub.data);
     if (t.data.length > 0) setTestId(prev=>prev||t.data[0]._id);
     const mmap:any = {};
     m.data.forEach((markItem:any) => {
       if(markItem.test?._id && markItem.student?._id)
         mmap[`${markItem.test._id}_${markItem.student._id}`] = markItem.marks;
     });
     setMarksMap(mmap);
     setLoading(false);
   }).catch(()=>{setLoading(false);});
 };

 useEffect(()=>{ load(); },[]);

 const handleMark=(sid:string, val:string)=>{
   const v = Number(val);
   const tst = tests.find(t=>t._id===testId);
   if(tst && val!=="" && (v < 0 || v > tst.maxMarks)) return;
   setMarksMap({...marksMap, [`${testId}_${sid}`]: val===""?"":v});
   setSaved(false);
 };

 const saveMarks=async()=>{
   for (let s of students) {
     const val = marksMap[`${testId}_${s._id}`];
     if (val !== undefined && val !== "") {
       try { await api.post(`/tests/${testId}/marks`, { studentId: s._id, marks: Number(val) }); } catch(e) {}
     }
   }
   setSaved(true);
   setTimeout(()=>setSaved(false), 3000);
   load();
 };

 const createTest=async(e:any)=>{
   e.preventDefault();
   setCreating(true);
   try{
     await api.post("/tests",createForm);
     setCreateForm({name:"",subject:"",batch:"",date:"",maxMarks:100});
     load();
   }catch(ex:any){alert(ex.response?.data?.message||"Failed to create test.");}
   setCreating(false);
 };

 const tst = tests.find(t=>t._id===testId);
 const chartData = admin ? students.filter(s=>marksMap[`${testId}_${s._id}`]!=="" && marksMap[`${testId}_${s._id}`]!==undefined).map(s=>({ name: s.name.split(" ")[0], mark: Number(marksMap[`${testId}_${s._id}`]) })) : [];
 const avgMark = chartData.length ? Math.round(chartData.reduce((acc,curr)=>acc+curr.mark,0)/chartData.length) : 0;

 if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;

 return <>
  <div className="d-flex justify-content-between align-items-start mb-4">
   <div>
    <h2 className="fw-bold mb-1">💯 Test &amp; Marks Entry</h2>
    <p className="text-muted mb-0">Record student performance across multiple tests and subjects.</p>
   </div>
   <span className="badge bg-success fs-6 px-3 py-2">Live API</span>
  </div>

  {admin&&(
   <div className="card p-4 mb-4 shadow-sm border-0">
    <h6 className="fw-bold mb-3">Create New Test</h6>
    <form onSubmit={createTest} className="row g-2">
     <div className="col-md-3"><input className="form-control" placeholder="Test Name" required value={createForm.name} onChange={e=>setCreateForm({...createForm,name:e.target.value})}/></div>
     <div className="col-md-3">
      <select className="form-select" required value={createForm.subject} onChange={e=>setCreateForm({...createForm,subject:e.target.value})}>
       <option value="">Select Subject...</option>
       {subjects.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
     </div>
     <div className="col-md-2"><input className="form-control" placeholder="Batch (e.g. IT-A)" value={createForm.batch} onChange={e=>setCreateForm({...createForm,batch:e.target.value})}/></div>
     <div className="col-md-2"><input className="form-control" type="date" value={createForm.date} onChange={e=>setCreateForm({...createForm,date:e.target.value})}/></div>
     <div className="col-md-1"><input className="form-control" type="number" placeholder="Max" min={1} value={createForm.maxMarks} onChange={e=>setCreateForm({...createForm,maxMarks:Number(e.target.value)})}/></div>
     <div className="col-md-1"><button className="btn btn-primary w-100" disabled={creating}>{creating?"...":"Add"}</button></div>
    </form>
   </div>
  )}

  {tests.length===0&&(
   <div className="alert alert-info">{admin?"No tests created yet. Use the form above to add one.":"No tests available yet. Ask your administrator."}</div>
  )}

  {tests.length>0&&<div className="row g-3 mb-4">
   <div className="col-lg-3">
    <div className="card p-4 h-100 border-primary border-top border-4">
     <label className="form-label small fw-semibold text-muted">Select Test</label>
     <select className="form-select mb-3 fw-bold text-primary" value={testId} onChange={e=>setTestId(e.target.value)}>
      {tests.map(t=><option key={t._id} value={t._id}>{t.name} ({t.subject?.name})</option>)}
     </select>
     {tst&&<div className="text-muted small">Max Marks: {tst.maxMarks}<br/>Batch: {tst.batch}</div>}
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
       {admin?"Enter marks below to see the chart.":"No marks recorded for this test yet."}
      </div>
     )}
    </div>
   </div>
  </div>}

  {tests.length>0&&<div className="card p-0 shadow-sm border-0">
   <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
    <h5 className="mb-0 fw-bold">Student Marks Roster</h5>
    {admin&&<button className={`btn btn-${saved?"success":"primary"} px-4`} onClick={saveMarks}>
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
       <th style={{width:'200px'}} className="px-4 text-end">Marks {tst?`(out of ${tst.maxMarks})`:""}</th>
      </tr>
     </thead>
     <tbody>
      {admin && students.length===0 && <tr><td colSpan={4} className="text-center py-4 text-muted">No students found.</td></tr>}
      {admin && students.map(s=>{
       const val = marksMap[`${testId}_${s._id}`] !== undefined ? marksMap[`${testId}_${s._id}`] : "";
       return <tr key={s._id}>
        <td className="px-4 font-monospace small text-muted">{s.studentCode}</td>
        <td className="fw-semibold">{s.name}</td>
        <td><span className="badge bg-light text-dark border">{s.batch?.name || s.batch}</span></td>
        <td className="px-4">
          <input type="number" className="form-control form-control-sm text-end fw-bold text-primary" min="0" max={tst?.maxMarks||100} value={val} onChange={e=>handleMark(s._id, e.target.value)} />
        </td>
       </tr>;
      })}
      {!admin && marksList.filter((m:any)=>m.test?._id===testId).length===0 && <tr><td colSpan={4} className="text-center py-4 text-muted">No marks recorded for this test yet.</td></tr>}
      {!admin && marksList.filter((m:any)=>m.test?._id===testId).map((m:any)=>(
        <tr key={m._id}>
          <td className="px-4 font-monospace small text-muted">{m.student?.studentCode}</td>
          <td className="fw-semibold">{m.student?.name}</td>
          <td><span className="badge bg-light text-dark border">Student View</span></td>
          <td className="px-4 text-end fw-bold text-primary fs-5">{m.marks} / {m.test?.maxMarks}</td>
        </tr>
      ))}
     </tbody>
    </table>
   </div>
  </div>}
 </>;
}


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
function GmailDemo() {
 const [to,setTo]=useState("");
 const [subject,setSubject]=useState("");
 const [text,setText]=useState("");
 const [msg,setMsg]=useState("");
 const [err,setErr]=useState("");
 const [sending,setSending]=useState(false);
 const send=async(e:any)=>{
  e.preventDefault();
  setSending(true);setMsg("");setErr("");
  try{
   await api.post("/gmail/send",{to,subject,text});
   setMsg("✅ Email sent successfully!");
   setTo("");setSubject("");setText("");
  }catch(ex:any){setErr(ex.response?.data?.message||"Failed to send. Check Gmail credentials in .env");}
  setSending(false);
 };
 return (
  <div className="card shadow-sm border-0 p-4">
   <h4>Mail Center</h4>
   <p className="text-muted mb-4">Send emails to students and parents regarding attendance or fees.</p>
   {msg&&<div className="alert alert-success">{msg}</div>}
   {err&&<div className="alert alert-warning">{err}</div>}
   <form onSubmit={send}>
    <div className="mb-3"><label className="form-label fw-semibold">To (Email)</label><input className="form-control" type="email" required value={to} onChange={e=>setTo(e.target.value)} placeholder="parent@example.com"/></div>
    <div className="mb-3"><label className="form-label fw-semibold">Subject</label><input className="form-control" required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Fee Reminder - October 2026"/></div>
    <div className="mb-4"><label className="form-label fw-semibold">Message</label><textarea className="form-control" rows={5} required value={text} onChange={e=>setText(e.target.value)} placeholder="Write your message here..."/></div>
    <button className="btn btn-primary px-4" disabled={sending}>{sending?"Sending...":"Send Email"}</button>
   </form>
  </div>
 );
}

function Settings() {
 const u=user();
 const [name,setName]=useState(u?.name||"");
 const [password,setPassword]=useState("");
 const [confirm,setConfirm]=useState("");
 const [msg,setMsg]=useState("");
 const [err,setErr]=useState("");
 const [loading,setLoading]=useState(false);

 const save=async(e:any)=>{
  e.preventDefault();
  setMsg(""); setErr("");
  if(password && password!==confirm){setErr("Passwords do not match.");return;}
  if(password && password.length<8){setErr("Password must be at least 8 characters.");return;}
  setLoading(true);
  try{
   const body:any={name};
   if(password) body.password=password;
   const r=await api.put("/auth/me",body);
   localStorage.setItem("tp_user",JSON.stringify(r.data.user));
   setMsg("Profile updated! Refreshing...");
   setTimeout(()=>window.location.reload(),800);
  }catch(e:any){setErr(e.response?.data?.message||"Update failed.");}
  setLoading(false);
 };

 return (
  <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
   <h2 className="fw-bold mb-1">Profile &amp; Settings</h2>
   <p className="text-muted mb-4">Manage your account information and preferences.</p>
   <div className="row g-4">
    <div className="col-lg-4">
     <div className="card border-0 shadow-sm p-4 text-center">
      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3 shadow" style={{width:80,height:80,fontSize:"2rem"}}>{u?.name?.[0]||"?"}</div>
      <h5 className="fw-bold mb-0">{u?.name}</h5>
      <p className="text-muted small mb-2">{u?.email}</p>
      <span className={`badge ${u?.role==="admin"?"bg-danger":"bg-primary"} px-3 py-2 text-uppercase`}>{u?.role}</span>
      <hr/>
      <div className="text-start small text-muted">
       <div className="d-flex justify-content-between py-1 border-bottom"><span>Role</span><span className="fw-semibold text-dark">{u?.role==="admin"?"Administrator":"Student"}</span></div>
       <div className="d-flex justify-content-between py-1 border-bottom"><span>Email</span><span className="fw-semibold text-dark text-truncate ms-2">{u?.email}</span></div>
       {u?.mobile&&<div className="d-flex justify-content-between py-1 border-bottom"><span>Mobile</span><span className="fw-semibold text-dark">{u?.mobile}</span></div>}
       {u?.dob&&<div className="d-flex justify-content-between py-1 border-bottom"><span>DOB</span><span className="fw-semibold text-dark">{new Date(u.dob).toLocaleDateString("en-IN")}</span></div>}
      </div>
     </div>
    </div>
    <div className="col-lg-8">
     <div className="card border-0 shadow-sm p-4">
      <h5 className="fw-bold mb-4">Edit Profile</h5>
      {msg&&<div className="alert alert-success py-2">{msg}</div>}
      {err&&<div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={save}>
       <div className="mb-3">
        <label className="form-label fw-semibold">Full Name</label>
        <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80}/>
       </div>
       <div className="mb-3">
        <label className="form-label fw-semibold">Email Address</label>
        <input className="form-control bg-light" value={u?.email||""} disabled/>
        <div className="form-text">Email cannot be changed. Contact admin if needed.</div>
       </div>
       <hr/>
       <h6 className="fw-bold mb-3 text-muted">Change Password <span className="fw-normal">(optional)</span></h6>
       <div className="row g-3 mb-4">
        <div className="col-md-6">
         <label className="form-label">New Password</label>
         <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 8 chars"/>
        </div>
        <div className="col-md-6">
         <label className="form-label">Confirm Password</label>
         <input className="form-control" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat new password"/>
        </div>
       </div>
       <button className="btn btn-primary px-4" disabled={loading}>{loading?"Saving...":"Save Changes"}</button>
      </form>
     </div>
    </div>
   </div>
  </motion.div>
 );
}



function NotFound() {
 return (
  <div className="p-5 text-center">
   <h1 className="display-1 text-muted fw-bold">404</h1>
   <h4 className="mb-3">Page Not Found</h4>
   <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
   <Link className="btn btn-primary px-4" to="/">Go to Dashboard</Link>
  </div>
 );
}

function App() {
 return (
  <BrowserRouter>
   <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    <Route path="/students" element={<ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>} />
    <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
    <Route path="/batches" element={<ProtectedRoute><Layout><Batches /></Layout></ProtectedRoute>} />
    <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
    <Route path="/payments" element={<ProtectedRoute><Layout><Payments /></Layout></ProtectedRoute>} />
    <Route path="/dues" element={<ProtectedRoute><Layout><Dues /></Layout></ProtectedRoute>} />
    <Route path="/subjects" element={<ProtectedRoute><Layout><Subjects /></Layout></ProtectedRoute>} />
    <Route path="/tests" element={<ProtectedRoute><Layout><Tests /></Layout></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
    <Route path="/ai" element={<ProtectedRoute><Layout><AIAssistant /></Layout></ProtectedRoute>} />
    <Route path="/gmail" element={<ProtectedRoute><Layout><GmailDemo /></Layout></ProtectedRoute>} />
    <Route path="/experiments" element={<ProtectedRoute><Layout><ExperimentsIndex /></Layout></ProtectedRoute>} />
    <Route path="/experiments/:id" element={<ProtectedRoute><Layout><ExperimentViewer /></Layout></ProtectedRoute>} />
    <Route path="*" element={<Layout><NotFound /></Layout>} />
   </Routes>
  </BrowserRouter>
 );
}

export default App;
