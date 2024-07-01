import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_producto_byId } from '../utils/item.js'

const router = Router()

const fileItems = await readFile('./data/items.json', 'utf-8')
const itemsData = JSON.parse(fileItems)

router.get('/byiD/:id', (req, res) => {
    const id = req.params.id

    const result = get_producto_byId(id)
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json(`El producto ${id} no se ha encontrado`)
    }
})

router.get('/byCategory/:category', (req, res) => {
    const category = req.params.category

    const result = itemsData.filter(e => e.categoria && e.categoria.nombre === category)
    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(404).json(`${category} no se encuentra, verifique los datos e intente nuevamente`)
    }
})

router.get('/byPrice/:price', (req, res) => {
    const price = parseFloat(req.params.price)
    
    const result = itemsData.filter(e => e.precio === price)
    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(404).json(`No se encontraron productos con el precio de ${price}`)
    }
})

router.post('/createItem', (req, res) => {
    const newItem = req.body
    
    if (!newItem.id || !newItem.titulo || !newItem.categoria || !newItem.precio) {
        res.status(400).json('Todos los campos son requeridos')
        return
    }

    const itemExists = itemsData.some(item => item.id === newItem.id)
    if (itemExists) {
        res.status(400).json('El ID ya se encuentra creado')
        return
    }

    if (typeof newItem.precio !== 'number' || newItem.precio <= 0) {
        res.status(400).json('El precio debe ser un número positivo')
        return
    }

    itemsData.push(newItem)
    try {
        writeFile('./data/items.json', JSON.stringify(itemsData, null, 2))
        res.status(200).json({ Mensaje: 'Item creado con éxito', Producto: newItem })
    } catch(error) {
        res.status(500).json('Error al crear el item')
    }
})

router.post('/sensitiveData', (req, res) => {
    const { id } = req.body
    
    try {
        const result = itemsData.find(e => e.id === id)
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json('ID incorrecto, por favor verifique y vuelva a intentar')
        }
    }catch(error) {
        res.status(500).json('Ocurrió un error en el servidor')
    }
})

router.put('/updatePrice', (req, res) => {
    const { id, newPrice } = req.body

    const itemIndex = itemsData.findIndex(item => item.id === id)
    if (itemIndex === -1) {
        res.status(400).json(`El producto con ${id} no se encuentra`)
        return;
    }

    itemsData[itemIndex].precio = newPrice
    try {
        writeFile('./data/items.json', JSON.stringify(itemsData, null, 2))
        res.status(200).json({ Mensaje: 'Precio actualizado con éxito', Producto: itemsData[itemIndex] })
    } catch (error) {
        res.status(500).json('Error al actualizar el precio')
    }
})

export default router