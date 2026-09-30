import fs from "fs";

const filePath = "../frontend/src/App.tsx";
let code = fs.readFileSync(filePath, "utf8");

// 1. Dashboard
code = code.replace(
  `const [chart,setChart]=useState<any[]>([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:87}]);`,
  `const [chart,setChart]=useState<any[]>([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:87}]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");`
);
code = code.replace(
  `   setChart([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:attRate}]);
  }).catch(()=>{});`,
  `   setChart([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:attRate}]);
   setLoading(false);
  }).catch(()=>{setError("Failed to load dashboard data. Please try again.");setLoading(false);});`
);
code = code.replace(
  ` return <><motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="hero p-5 mb-4"><div className="position-relative"><h1 className="items-6 fw-bold">Good to see you, Admin.</h1>`,
  ` if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;

 return <><motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="hero p-5 mb-4"><div className="position-relative"><h1 className="items-6 fw-bold">Good to see you, Admin.</h1>`
);

// 2. Students
code = code.replace(
  `const [form,setForm]=useState<any>({studentCode:"",name:"",email:"",phone:"",course:"Information Technology",batch:"IT-A",monthlyFee:5000,status:"Active"});\n const load=()=>api.get("/students").then(r=>setItems(r.data)).catch(()=>{});\n useEffect(()=>{load();},[]);`,
  `const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [form,setForm]=useState<any>({studentCode:"",name:"",email:"",phone:"",course:"Information Technology",batch:"IT-A",monthlyFee:5000,status:"Active"});
 const load=()=>{
   setLoading(true);
   api.get("/students").then(r=>{setItems(r.data);setLoading(false);setError("");}).catch(()=>{setError("Failed to load students.");setLoading(false);});
 };
 useEffect(()=>{load();},[]);`
);
code = code.replace(
  `{msg&&<div className="alert alert-warning alert-dismissible">{msg}<button className="btn-close" onClick={()=>setMsg("")}/></div>}\n\n  <div className="row g-3 mb-3">`,
  `{msg&&<div className="alert alert-warning alert-dismissible">{msg}<button className="btn-close" onClick={()=>setMsg("")}/></div>}\n  {error&&<div className="alert alert-danger">{error}</div>}\n  {loading ? <div className="p-5 text-center"><span className="spinner-border text-primary"/></div> : <>\n  <div className="row g-3 mb-3">`
);
code = code.replace(
  `      </tr>)}\n     </tbody>\n    </table>\n   </div>\n  </div>\n </motion.div>;\n}`,
  `      </tr>)}\n     </tbody>\n    </table>\n   </div>\n  </div>\n  </>}\n </motion.div>;\n}`
);

// 3. Attendance
code = code.replace(
  `const [date,setDate]=useState(new Date().toISOString().slice(0,10));\n\n const dummySummary`,
  `const [date,setDate]=useState(new Date().toISOString().slice(0,10));\n const [loading,setLoading]=useState(true);\n const [error,setError]=useState("");\n\n const dummySummary`
);
code = code.replace(
  `useEffect(()=>{\n  api.get("/students").then(r=>setStudents(r.data)).catch(()=>{});\n  api.get("/attendance").then(r=>setRows(r.data)).catch(()=>{});\n },[]);`,
  `useEffect(()=>{\n  Promise.all([api.get("/students"),api.get("/attendance")])\n  .then(([s,a])=>{setStudents(s.data);setRows(a.data);setLoading(false);})\n  .catch(()=>{setError("Failed to load attendance data.");setLoading(false);});\n },[]);`
);
code = code.replace(
  ` return <>\n  <h2 className="fw-bold mb-1">Attendance Intelligence</h2>`,
  ` if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;\n if(error) return <div className="p-5 text-center text-danger">{error}</div>;\n return <>\n  <h2 className="fw-bold mb-1">Attendance Intelligence</h2>`
);

// 4. Payments
code = code.replace(
  `const [msgType,setMsgType]=useState("success");\n\n const load=()=>Promise.all([\n   api.get("/students"),\n   api.get("/payments"),\n   api.get("/payments/summary")\n ]).then(([s,p,sum])=>{\n   setStudents(s.data);\n   setRows(p.data);\n   setSummary(sum.data);\n });`,
  `const [msgType,setMsgType]=useState("success");\n const [loadingData,setLoadingData]=useState(true);\n const [error,setError]=useState("");\n\n const load=()=>{\n  setLoadingData(true);\n  Promise.all([\n    api.get("/students"),\n    api.get("/payments"),\n    api.get("/payments/summary")\n  ]).then(([s,p,sum])=>{\n    setStudents(s.data);\n    setRows(p.data);\n    setSummary(sum.data);\n    setLoadingData(false);\n  }).catch(()=>{setError("Failed to load payments.");setLoadingData(false);});\n };`
);
code = code.replace(
  ` return <>\n  <div className="d-flex justify-content-between align-items-start mb-4">`,
  ` if(loadingData) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;\n if(error) return <div className="p-5 text-center text-danger">{error}</div>;\n return <>\n  <div className="d-flex justify-content-between align-items-start mb-4">`
);

fs.writeFileSync(filePath, code);
console.log("App.tsx successfully updated with loading and error states.");
