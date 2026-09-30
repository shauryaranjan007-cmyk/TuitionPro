import nodemailer from "nodemailer";
export function gmailEnabled(){return !!(process.env.GMAIL_USER&&process.env.GMAIL_APP_PASSWORD)}
export async function sendMail({to,subject,text}){
 if(!gmailEnabled()) return {mode:"demo",message:"Gmail is not configured. Demo mode accepted the message.",to,subject};
 const transporter=nodemailer.createTransport({service:"gmail",auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});
 const info=await transporter.sendMail({from:process.env.GMAIL_USER,to,subject,text});
 return {mode:"gmail",messageId:info.messageId};
}
