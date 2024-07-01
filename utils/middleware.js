import jwt from 'jsonwebtoken';
import 'dotenv/config'

const SECRET = process.env.SECRET

export const verifyToken = async (token) => {

    console.log(token)
    if (!token) {
      return false; 
    }
  
    try {
      const decode = await jwt.verify(token, SECRET);
      console.log(decode)
      return true;  
    } catch (error) {
      console.log(error);
      return false
    }
} 

export const decodeToken= async (token) => { 

    if(!verifyToken){
        return false
    }
    const decode = await jwt.verify(token, SECRET)
    return decode
}