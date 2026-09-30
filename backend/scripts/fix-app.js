import fs from "fs";

const filePath = "../frontend/src/App.tsx";
let code = fs.readFileSync(filePath, "utf8");

// Remove duplicate lines from Dashboard
code = code.replace(
` const [chart,setChart]=useState<any[]>([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:87}]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");`,
` const [chart,setChart]=useState<any[]>([{m:"May",v:72},{m:"Jun",v:79},{m:"Jul",v:84},{m:"Aug",v:81},{m:"Sep",v:87}]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");`
);

code = code.replace(
` if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;

 if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;`,
` if(loading) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;`
);

// Fix Payments component errors
code = code.replace(
` const [filter,setFilter]=useState("All");
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
 });`,
` const [filter,setFilter]=useState("All");
 const [loading,setLoading]=useState(false);
 const [loadingData,setLoadingData]=useState(true);
 const [error,setError]=useState("");
 const [msg,setMsg]=useState("");
 const [msgType,setMsgType]=useState("success");

 const load=()=>{
   setLoadingData(true);
   Promise.all([
     api.get("/students"),
     api.get("/payments"),
     api.get("/payments/summary")
   ]).then(([s,p,sum])=>{
     setStudents(s.data);
     setRows(p.data);
     setSummary(sum.data);
     setLoadingData(false);
   }).catch(()=>{setError("Failed to load payments.");setLoadingData(false);});
 };`
);

code = code.replace(
` return <>
  <div className="d-flex justify-content-between align-items-start mb-4">`,
` if(loadingData) return <div className="p-5 text-center"><span className="spinner-border text-primary"/></div>;
 if(error) return <div className="p-5 text-center text-danger">{error}</div>;
 return <>
  <div className="d-flex justify-content-between align-items-start mb-4">`
);

fs.writeFileSync(filePath, code);
console.log("App.tsx duplicate states fixed");
