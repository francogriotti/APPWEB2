import { readFile } from 'fs/promises' 

const fileUsers = await readFile('./data/users.json', 'utf-8') 
const userItems = JSON.parse(fileUsers) 

export const get_user_byId = (id, userItems)=>{
    return userItems.find(e => e.Id === id)
}

export const readUsersJSON = async () => {
    try {   
        const fileUsers = await readFile('./data/users.json', 'utf-8')
        const userItems = JSON.parse(fileUsers) 
        return userItems
    } catch (error){
        console.log('Error al leer el archivo de usuarios:', error)
        throw error;
    }
}