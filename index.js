import express from 'express'
import dotenv from 'dotenv'
import 'dotenv/config'

import userRouter from './routes/user.routes.js'
import itemsRouter from './routes/items.routes.js'
import saleRouter from './routes/sales.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())

/*para levantar nuestro FRONT-END*/
app.use(express.static('public'))

/*rutas de END-POINT*/
app.use('/user', userRouter)
app.use('/item', itemsRouter)
app.use('/sale', saleRouter)

app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})