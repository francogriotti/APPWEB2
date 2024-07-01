import { connectToDatabase } from "../connection.js"
import Sales from "../schemas/sales.schema.js"

export const createSales = async({ id_usuario, fecha, total, id_producto:[{id, cant}] })=>{ //adaptar codigo al JSON
    try{
        await connectToDatabase()
        const res = await Sales.create({ id_usuario, fecha, total, id_producto:[{id, cant}] }) //adaptar codigo al JSON

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}
export const byID = async(id)=>{
    try{
        await connectToDatabase()
        const res = await Sales.byID(id).populate({path:"products"})

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}

export const findAll = async()=>{
    try{
        await connectToDatabase()
        const res = await Sales.find().populate({path:"products"})

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}