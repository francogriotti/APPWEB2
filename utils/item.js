import { readFile } from 'fs/promises' 

const fileItems = await readFile('./data/items.json', 'utf-8') 
const productosItems = JSON.parse(fileItems) 

export const get_producto_byId = (Id)=>{
    return productosItems.find(e => e.id === Id)
}