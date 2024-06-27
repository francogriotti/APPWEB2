import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_ventas_byId } from "../utils/sale.js"

const router = Router()

const fileSales = await readFile('./data/sales.json', 'utf-8')
const salesData = JSON.parse(fileSales)

router.get('/byID/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const result = get_ventas_byId(id)
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json(`No se encontró la venta con el ID ${id}`);
    }
});

router.get('/byDate/:from/:to', (req, res) => {
    const from = req.params.from
    const to = req.params.to

    const result = salesData.filter(e => e.fecha >= from && e.fecha <= to)

    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(404).json(`No hay ventas entre ${from} y ${to}`)
    }
})

router.post('/detail', (req, res) => {
    const id = parseInt(req.body.id);

    try {
        const sale = get_ventas_byId(id)
        if(sale) {
            const detail = {
                id: sale.id,
                id_usuario: sale.id_usuario,
                fecha: sale.fecha,
                total: sale.total,
                id_producto: sale.id_producto,
                direccion: sale.direccion,
                ciudad: sale.ciudad,
                codigop: sale.codigop,
                telefono: sale.telefono
            };
            res.status(200).json(detail)
        } else {
            res.status(404).json(`No se encontró ventas con el número de ID ${id}`)
        }
    } catch (error) {
        res.status(500).json('Error al buscar.')
    }
})

router.post('/createSales', async (req, res) => {
    const { id_usuario, total, id_producto, direccion, ciudad, codigop, telefono } = req.body

    console.log('Datos recibidos:', req.body)

    if (!id_usuario || !total || !id_producto || !direccion || !ciudad || !codigop || !telefono) {
        return res.status(400).json('Todos los campos son obligatorios')
    }

    try {
        const fileSales = await readFile('./data/sales.json', 'utf-8')
        const salesData = JSON.parse(fileSales)

        const maxId = Math.max(...salesData.map(sale => sale.id), 0)
        const id = maxId + 1
        const fecha = new Date().toISOString().split('T')[0]

        const newSale = { id, id_usuario, fecha, total, id_producto, direccion, ciudad, codigop, telefono }
        salesData.push(newSale)

        await writeFile("./data/sales.json", JSON.stringify(salesData, null, 2));
        console.log('Venta creada con éxito:', newSale)
        res.status(201).json("Venta cargada con éxito")
    } catch (error) {
        console.error('Error al crear venta:', error)
        res.status(500).json('Error al crear venta...')
    }
});

router.post('/sensitiveData', (req, res) => {
    try {
        const { id, fecha } = req.body

        if (id === undefined || !fecha) {
            res.status(400).json('Todos los campos son requeridos')
        }

        const result = salesData.find(e => e.id === id && e.fecha === fecha)

        if (result) {
            const sensitiveData = {
                id: result.id,
                fecha: result.fecha,
                id_usuario: result.id_usuario,
                id_suc: result.id_suc,
                id_producto: result.id_producto.map(prod => ({
                    id: prod.id,
                    cant: prod.cant
                }))
            }
            res.status(200).json(sensitiveData)
        } else {
            res.status(404).json('No se encontró ninguna venta con los parámetros especificados')
        }
    } catch(error) {
        return res.status(500).json('Ocurrió un error en el servidor')
    }
})

router.put('/updateSales', (req, res) => {
    const { id, id_usuario, total, id_producto } = req.body

    if (id === undefined) {
        return res.status(400).json('El campo ID es requerido')
    }

    const saleIndex = salesData.findIndex(sale => sale.id === id)
    if (saleIndex === -1) {
        return res.status(404).json('Venta no encontrada')
    }

    if (id_usuario === undefined || total === undefined || !id_producto) {
        return res.status(400).json('Todos los campos son requeridos')
    }

    salesData[saleIndex].id_usuario = id_usuario;
    salesData[saleIndex].total = total;
    salesData[saleIndex].id_producto = id_producto.map(prod => ({
        id: prod.id,
        cant: prod.cant
    }))

    try {
        writeFile('./data/sales.json', JSON.stringify(salesData, null, 2), 'utf-8')
        res.status(200).json({ mensaje: 'Venta actualizada con éxito', venta: salesData[saleIndex] })
    } catch(error) {
        res.status(500).json('Error al actualizar la venta')
    }
});

router.delete('/deleteSale/:id', (req, res) => {
    const saleId = parseInt(req.params.id, 10)

    const saleIndex = salesData.findIndex(sale => sale.id === saleId)
    if (saleIndex === -1) {
        return res.status(404).json('Venta no encontrada')
    }

    const deletedSale = salesData.splice(saleIndex, 1)[0]

    try {
        writeFile('./data/sales.json', JSON.stringify(salesData, null, 2), 'utf-8')
        res.status(200).json('Venta eliminada con éxito')
    } catch(error) {
        res.status(500).json('Error al eliminar la venta')
    }
})

export default router