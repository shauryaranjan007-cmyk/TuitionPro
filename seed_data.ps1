$loginBody = '{"email":"admin@tuitionpro.com","password":"TuitionProAdmin@2026"}'
$loginResp = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
$jwt = [System.Uri]::UnescapeDataString((($loginResp.Headers['Set-Cookie'] -split ';')[0] -replace 'tp_token=',''))
$headers = @{"Authorization"="Bearer $jwt"}

$r = Invoke-WebRequest -Uri "http://localhost:5000/api/students" -Headers $headers -UseBasicParsing
$students = $r.Content | ConvertFrom-Json

Write-Host "Found $($students.Count) students. Seeding data..."

$dates = @("2026-09-30", "2026-09-29", "2026-09-28", "2026-09-27", "2026-09-26")
$statuses = @("Present", "Present", "Present", "Present", "Late", "Absent", "Present", "Excused")
$months = @("August 2026", "September 2026")

$pCount = 0
$aCount = 0

foreach ($s in $students) {
  # 1. Add Payments (1 or 2 per student)
  $mCount = Get-Random -Minimum 1 -Maximum 3
  for ($i = 0; $i -lt $mCount; $i++) {
    $isPaid = (Get-Random -Minimum 0 -Maximum 4) -ne 0 # 75% paid
    $pStatus = if($isPaid){"Paid"}else{"Pending"}
    $body = @{
      student = $s._id;
      amount = $s.monthlyFee;
      month = $months[$i];
      status = $pStatus;
      method = if($isPaid){"Razorpay"}else{""};
      transactionId = if($isPaid){"pay_demo_$(Get-Random)"}else{""}
    } | ConvertTo-Json -Compress
    
    try {
      Invoke-WebRequest -Uri "http://localhost:5000/api/payments/record" -Method POST -Body $body -ContentType "application/json" -Headers $headers -UseBasicParsing > $null
      $pCount++
    } catch { }
  }

  # 2. Add Attendance (5 days per student)
  foreach ($d in $dates) {
    $st = $statuses[(Get-Random -Minimum 0 -Maximum $statuses.Length)]
    $check = if($st -eq 'Late'){"10:15"}elseif($st -eq 'Present'){"09:55"}else{""}
    $body = @{
      student = $s._id;
      date = $d;
      status = $st;
      checkIn = $check
    } | ConvertTo-Json -Compress
    
    try {
      Invoke-WebRequest -Uri "http://localhost:5000/api/attendance" -Method POST -Body $body -ContentType "application/json" -Headers $headers -UseBasicParsing > $null
      $aCount++
    } catch { }
  }
}

Write-Host "Done! Added $pCount payments and $aCount attendance records."
