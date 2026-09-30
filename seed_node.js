(async () => {
  try {
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email:'admin@tuitionpro.com', password:'TuitionProAdmin@2026'})
    });
    const setCookie = login.headers.get('set-cookie');
    const token = decodeURIComponent(setCookie.split(';')[0].replace('tp_token=',''));
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' };
    
    const studentsRes = await fetch('http://localhost:5000/api/students', {headers});
    const students = await studentsRes.json();
    console.log(`Found ${students.length} students.`);
    
    let pCount = 0, aCount = 0;
    const dates = ["2026-09-30", "2026-09-29", "2026-09-28", "2026-09-27", "2026-09-26"];
    const statuses = ["Present", "Present", "Present", "Late", "Absent", "Excused"];
    
    // We will do this sequentially to avoid rate limiting
    for (const s of students) {
      for (const m of ["August 2026", "September 2026"]) {
        const isPaid = Math.random() > 0.3;
        try {
          const pr = await fetch('http://localhost:5000/api/payments/record', {
            method:'POST', headers,
            body: JSON.stringify({
              student: s._id, amount: s.monthlyFee, month: m, status: isPaid ? "Paid" : "Pending", method: isPaid ? "UPI" : "Demo"
            })
          });
          if(pr.ok) pCount++;
        } catch(e) {}
      }
      
      for (const d of dates) {
        const st = statuses[Math.floor(Math.random() * statuses.length)];
        try {
          const ar = await fetch('http://localhost:5000/api/attendance', {
            method:'POST', headers,
            body: JSON.stringify({
              student: s._id, date: d, status: st, checkIn: st==="Late" ? "10:15" : (st==="Present" ? "09:55" : "")
            })
          });
          if(ar.ok) aCount++;
        } catch(e) {}
      }
    }
    console.log(`Done! Added ${pCount} payments and ${aCount} attendance records.`);
  } catch(err) { console.error(err); }
})();
