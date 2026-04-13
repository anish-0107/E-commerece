import rateLimit from "express-rate-limit";
 
export const globalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  standardHeaders:true,
  max: 500,
  message: { status : 429, error: "Too many attempts, please try again later." }
});