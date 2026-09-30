import React, { useState, useEffect, useRef, Component } from 'react';
import { Link, useParams, Routes, Route } from 'react-router-dom';

const EXPERIMENTS = [
  { id: 1, title: 'Bootstrap registration + JS validation', objective: 'Create a responsive form with JS validation', file: 'frontend/src/App.tsx' },
  { id: 2, title: 'ES6 Programs', objective: 'Demonstrate ES6 features, prompt/confirm, arrays, events', file: 'frontend/src/Experiments.tsx' },
  { id: 3, title: 'React components, props, state', objective: 'Demonstrate functional components, props, state and architecture', file: 'frontend/src/Experiments.tsx' },
  { id: 4, title: 'SPA with React Router, hooks, lifecycle', objective: 'Demonstrate SPA routing, useState, useEffect, useRef, and class component lifecycle', file: 'frontend/src/Experiments.tsx' },
  { id: 5, title: 'MongoDB CRUD', objective: 'Demonstrate MongoDB shell commands and CRUD operations', file: 'backend/scripts/collegedb.mongosh.js' },
  { id: 6, title: 'Mongoose Models & Validation', objective: 'Demonstrate schemas, validation, constraints and indices', file: 'backend/src/models/Student.js' },
  { id: 7, title: 'Node.js Built-in Modules', objective: 'Demonstrate http, events, fs, streams and buffers', file: 'backend/src/node-demos/' },
  { id: 8, title: 'Express REST API + Postman', objective: 'Create and test REST API with authentication and HTTP methods', file: 'postman/TuitionPro.postman_collection.json' },
  { id: 9, title: 'React + Express + MongoDB + Axios', objective: 'Full MERN integration with loading and error states', file: 'frontend/src/App.tsx' },
  { id: 10, title: 'MERN Cloud Deployment', objective: 'Configure deployment to Render, Vercel, and MongoDB Atlas', file: 'DEPLOYMENT.md' }
];

export function ExperimentsIndex() {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Web Lab Experiments</h2>
      <div className="list-group">
        {EXPERIMENTS.map(exp => (
          <Link key={exp.id} to={`/experiments/${exp.id}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 shadow-sm mb-2 rounded border-0">
            <div>
              <h5 className="mb-1 text-primary">Experiment {exp.id}: {exp.title}</h5>
              <p className="mb-0 text-muted">{exp.objective}</p>
            </div>
            <span className="badge bg-primary rounded-pill px-3 py-2">View Demo</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Exp2() {
  const [output, setOutput] = useState("");

  const showDate = () => setOutput(`Current Date/Time: ${new Date().toLocaleString()}`);
  
  const calcFactorial = () => {
    const n = parseInt(prompt("Enter a number for factorial:") || "0");
    if(isNaN(n) || n < 0) return alert("Invalid number");
    let f = 1;
    for(let i=1; i<=n; i++) f *= i;
    setOutput(`Factorial of ${n} is ${f}`);
  };

  const showTable = () => {
    const n = parseInt(prompt("Enter a number for multiplication table:") || "0");
    if(isNaN(n)) return alert("Invalid number");
    const table = Array.from({length:10}, (_, i) => `${n} x ${i+1} = ${n*(i+1)}`).join('\n');
    setOutput(`Multiplication Table of ${n}:\n${table}`);
  };

  const sumN = () => {
    if(!confirm("Do you want to calculate sum of N numbers?")) return;
    const n = parseInt(prompt("Enter N:") || "0");
    if(isNaN(n) || n < 0) return alert("Invalid N");
    const arr = Array.from({length:n}, (_,i) => i+1);
    const sum = arr.reduce((a, b) => a + b, 0);
    setOutput(`Sum of first ${n} numbers is ${sum}\nArray used: [${arr.join(', ')}]`);
  };

  const es6Demo = () => {
    const arr = [1, 2, 3, 4, 5];
    const doubled = arr.map(x => x * 2);
    const evens = arr.filter(x => x % 2 === 0);
    const arr2 = [...arr, 6, 7]; 
    const { length } = arr2; 

    setOutput(`ES6 Demo Results:
Original Array: ${arr}
Mapped (x*2): ${doubled}
Filtered (even): ${evens}
Spread Operator: ${arr2}
Template Literals: Array length is ${length}`);
  };

  return (
    <div>
      <h4 className="mb-3">ES6 Interactive Demos</h4>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className="btn btn-outline-primary" onClick={showDate}>Current Date & Time</button>
        <button className="btn btn-outline-secondary" onClick={calcFactorial}>Factorial</button>
        <button className="btn btn-outline-info" onClick={showTable}>Multiplication Table</button>
        <button className="btn btn-outline-warning" onClick={sumN}>Sum of N Numbers</button>
        <button className="btn btn-outline-dark" onClick={es6Demo}>ES6 Array/Spread Demo</button>
      </div>

      {output && (
        <div className="card bg-dark text-light p-3 mb-4 shadow-sm">
          <pre className="mb-0" style={{fontFamily:"monospace"}}>{output}</pre>
        </div>
      )}

      <h4 className="mt-4 mb-3">ES5 vs ES6 Comparison</h4>
      <table className="table table-bordered table-hover shadow-sm bg-white">
        <thead className="table-light">
          <tr><th>Feature</th><th>ES5</th><th>ES6</th></tr>
        </thead>
        <tbody>
          <tr><td>Variable Decl.</td><td><code>var</code></td><td><code>let</code>, <code>const</code></td></tr>
          <tr><td>Functions</td><td><code>function() &#123;&#125;</code></td><td><code>() =&gt; &#123;&#125;</code> (Arrow functions)</td></tr>
          <tr><td>Strings</td><td><code>"Hello " + name</code></td><td><code>`Hello $&#123;name&#125;`</code> (Template literals)</td></tr>
          <tr><td>Modules</td><td><code>require()</code> / <code>module.exports</code></td><td><code>import</code> / <code>export</code></td></tr>
        </tbody>
      </table>
    </div>
  );
}

const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div className={`card shadow-sm border-0 bg-${color} text-white`}>
    <div className="card-body">
      <h6 className="card-title text-white-50 text-uppercase fw-bold">{title}</h6>
      <h3 className="mb-0">{value}</h3>
    </div>
  </div>
);

const StudentBadge = ({ name, role }: { name: string, role: string }) => (
  <span className={`badge bg-${role === 'admin' ? 'danger' : 'primary'} p-2 shadow-sm`}>
    👤 {name} ({role})
  </span>
);

function Exp3() {
  const [count, setCount] = useState(0);
  const [toggled, setToggled] = useState(false);

  return (
    <div>
      <h4 className="mb-3">React Application Architecture</h4>
      <div className="alert alert-secondary shadow-sm border-0">
        <p><strong>Component Tree:</strong> React applications are built as a tree of nested components. A parent component passes data down to its children using <em>props</em>.</p>
        <p className="mb-0"><strong>One-Way Data Flow:</strong> Data in React only flows downwards. If a child needs to update parent data, the parent passes down a callback function as a prop, which the child calls to trigger state changes.</p>
      </div>

      <h4 className="mt-4 mb-3">Reusable Functional Components (Props)</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Total Students" value="1,245" color="primary" /></div>
        <div className="col-md-4"><StatCard title="Active Courses" value="12" color="success" /></div>
        <div className="col-md-4"><StatCard title="Pending Fees" value="₹45K" color="warning" /></div>
      </div>
      
      <div className="mb-4">
        <h5>Student Badges (Props)</h5>
        <div className="d-flex gap-2">
          <StudentBadge name="Harsh Ranjan" role="student" />
          <StudentBadge name="Admin User" role="admin" />
          <StudentBadge name="Jane Doe" role="student" />
        </div>
      </div>

      <h4 className="mt-4 mb-3">Component State Example (useState)</h4>
      <div className="card shadow-sm border-0 p-4 bg-light">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div>
            <h5 className="mb-3">Counter State: <span className="badge bg-dark fs-5">{count}</span></h5>
            <div className="btn-group shadow-sm">
              <button className="btn btn-outline-danger" onClick={() => setCount(c => c - 1)}>- Decrease</button>
              <button className="btn btn-outline-success" onClick={() => setCount(c => c + 1)}>+ Increase</button>
            </div>
          </div>
          <div className="vr d-none d-md-block"></div>
          <div>
            <h5 className="mb-3">Toggle State: {toggled ? <span className="text-success fw-bold">ON</span> : <span className="text-danger fw-bold">OFF</span>}</h5>
            <button className={`btn btn-${toggled ? 'success' : 'danger'} shadow-sm`} onClick={() => setToggled(!toggled)}>
              Turn {toggled ? 'Off' : 'On'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

class LifecycleDemo extends React.Component<any, any> {
  interval: any;
  state: any;

  constructor(props: any) {
    super(props);
    this.state = { timer: 0 };
  }

  componentDidMount() {
    console.log("Class Component Mounted");
    this.interval = setInterval(() => {
      (this as any).setState({ timer: (this as any).state.timer + 1 });
    }, 1000);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const currentTimer = (this as any).state.timer;
    if (prevState.timer !== currentTimer && currentTimer % 5 === 0) {
      console.log("Class Component Updated - Timer hit multiple of 5");
    }
  }

  componentWillUnmount() {
    console.log("Class Component Unmounted");
    clearInterval(this.interval);
  }

  render() {
    return <div className="alert alert-warning border-0 shadow-sm h-100"><strong>Class Component Lifecycle:</strong> Timer running... {(this as any).state.timer} seconds<br/><small>(Check browser console for logs)</small></div>;
  }
}

function HooksDemo() {
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("Hooks Demo Mounted");
    if(inputRef.current) inputRef.current.focus();
    return () => console.log("Hooks Demo Unmounted (Cleanup)");
  }, []);

  useEffect(() => {
    if (val) console.log("Hooks Demo Updated with value:", val);
  }, [val]);

  return (
    <div className="alert alert-success border-0 shadow-sm h-100">
      <strong>Hooks Demo (useState, useEffect, useRef):</strong>
      <input ref={inputRef} className="form-control mt-2 shadow-sm border-0" value={val} onChange={e => setVal(e.target.value)} placeholder="Type here..." />
    </div>
  );
}

function Exp4() {
  const [showLifecycle, setShowLifecycle] = useState(false);

  return (
    <div>
      <h4 className="mb-3">React Router SPA Demo</h4>
      <div className="card shadow-sm border-0 overflow-hidden mb-4 rounded-4">
        <div className="card-header bg-dark text-white d-flex gap-4 py-3">
          <Link to="home" className="text-white text-decoration-none">🏠 Home</Link>
          <Link to="about" className="text-white text-decoration-none">ℹ️ About</Link>
          <Link to="contact" className="text-white text-decoration-none">📞 Contact</Link>
        </div>
        <div className="card-body p-4 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '150px' }}>
          <Routes>
            <Route path="/" element={<p className="text-muted fs-5">Select a tab above to navigate without page reload (SPA).</p>} />
            <Route path="home" element={<h5>Welcome to the Home Page!</h5>} />
            <Route path="about" element={<h5>Learn more on the About Page!</h5>} />
            <Route path="contact" element={<h5>Get in touch via the Contact Page!</h5>} />
          </Routes>
        </div>
      </div>

      <h4 className="mb-3">Hooks & Lifecycle Methods</h4>
      <button className="btn btn-primary shadow-sm mb-3 px-4 fw-bold" onClick={() => setShowLifecycle(!showLifecycle)}>
        {showLifecycle ? "Unmount Components" : "Mount Components"}
      </button>

      {showLifecycle && (
        <div className="row g-3">
          <div className="col-md-6"><LifecycleDemo /></div>
          <div className="col-md-6"><HooksDemo /></div>
        </div>
      )}
    </div>
  );
}

export function ExperimentViewer() {
  const { id } = useParams();
  const exp = EXPERIMENTS.find(e => e.id === Number(id));
  
  if (!exp) return <div className="alert alert-danger m-4">Experiment not found</div>;

  return (
    <div className="container py-4">
      <Link to="/experiments" className="btn btn-link text-decoration-none mb-3 fw-bold">← Back to Experiments</Link>
      <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 px-4">
          <h5 className="mb-0">Experiment {exp.id}: {exp.title}</h5>
        </div>
        <div className="card-body p-4 bg-light">
          <p className="mb-2"><strong>Objective:</strong> {exp.objective}</p>
          <p className="mb-0"><strong>File Implementation:</strong> <code className="bg-white px-2 py-1 rounded shadow-sm">{exp.file}</code></p>
        </div>
      </div>
      
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {exp.id === 1 && (
            <div className="alert alert-info border-0 shadow-sm">
              <strong>Experiment 1</strong> is implemented on the Registration page. 
              <br/><br/>
              <Link to="/register" className="btn btn-primary">Go to Registration Demo</Link>
            </div>
          )}
          {exp.id === 2 && <Exp2 />}
          {exp.id === 3 && <Exp3 />}
          {exp.id === 4 && <Exp4 />}
          {exp.id >= 5 && (
            <div className="alert alert-info border-0 shadow-sm">
              <strong>Experiment {exp.id}</strong> does not have an interactive frontend component here. 
              Please review the specified file (<strong>{exp.file}</strong>) or documentation for implementation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
