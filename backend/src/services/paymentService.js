import Razorpay from "razorpay";
import crypto from "crypto";

export function razorpayEnabled(){return !!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET)}
export async function createOrder(amount,receipt){
 if(!razorpayEnabled()){
  if(process.env.NODE_ENV==="production") throw new Error("Razorpay is not configured");
  return {mode:"demo",id:"demo_order_"+Date.now(),amount:amount*100,currency:"INR",receipt};
 }
 const rp=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
 return await rp.orders.create({amount:Math.round(amount*100),currency:"INR",receipt});
}
export function verifySignature(orderId,paymentId,signature){
 if(!razorpayEnabled()) return false;
 const expected=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(orderId+"|"+paymentId).digest("hex");
 return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(signature));
}
