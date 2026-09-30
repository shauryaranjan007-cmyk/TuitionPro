import jwt from "jsonwebtoken";

function cookieToken(req) {
  const raw = req.headers.cookie || "";
  const pair = raw.split(";").map(x => x.trim()).find(x => x.startsWith("tp_token="));
  return pair ? decodeURIComponent(pair.slice("tp_token=".length)) : null;
}

export function getToken(req) {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : cookieToken(req);
}

export function protect(req,res,next){
  const token = getToken(req);
  if(!token) return res.status(401).json({message:"Authentication required"});
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({message:"Invalid or expired token"});
  }
}

export function adminOnly(req,res,next){
  if(req.user?.role!=="admin") return res.status(403).json({message:"Admin access required"});
  next();
}

export function studentOrAdmin(req,res,next){
  if(req.user?.role==="admin" || req.user?.role==="student") return next();
  return res.status(403).json({message:"Access denied"});
}
