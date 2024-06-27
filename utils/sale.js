import { readFile } from 'fs/promises' 

const fileVentas= await readFile('./data/sales.json', 'utf-8') 
const VentasItems = JSON.parse(fileVentas) 

export const get_ventas_byId = (Id)=>{
    return VentasItems.find(e => e.id === Id)
}