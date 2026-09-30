export function errorHandler(err,req,res,next){
 console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
 if(err?.name==="ValidationError") return res.status(400).json({message:"Invalid request data"});
 if(err?.name==="CastError") return res.status(400).json({message:"Invalid resource ID"});
 if(err?.code===11000) return res.status(409).json({message:"A record with that unique value already exists"});
 res.status(err.status||500).json({message:process.env.NODE_ENV==="production"?"Internal server error":(err.message||"Server error")});
}
