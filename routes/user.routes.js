import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { get_user_byId, readUsersJSON } from "../utils/user.js";

const router = Router();

const fileUsers = await readFile('./data/users.json', 'utf-8');
const userData = JSON.parse(fileUsers);

router.get('/byID/:Id', async (req, res) => {
    const id = parseInt(req.params.Id);
    const userData = await readUsersJSON();

    const result = get_user_byId(id, userData);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json(`El ID ${id} no se ha encontrado, por favor verifique los datos e intente nuevamente`);
    }
});

router.get('/byEmail/:email', async (req, res) => {
    const email = req.params.email;
    const userData = await readUsersJSON();

    const result = userData.find((user) => user.email === email);
    if (!result) {
        return res.status(404).json(`El usuario ${email} no se ha encontrado, verifíquelo e intente nuevamente.`);
    } else {
        return res.json(result);
    }
});

router.post('/login', async (req, res) => {
    const correo = req.body.email;
    const pass = req.body.password;
    try {
        const userData = await readUsersJSON();

        const result = userData.find(e => e.email === correo && e.password === pass);
        if (result) {
            res.status(200).json({ success: true, message: `Bienvenido ${result.nombre} ${result.apellido}`, data: result });
        } else {
            res.status(404).json({ success: false, message: `El correo o la contraseña son incorrectos` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al intentar acceder' });
    }
});

router.post('/createUser', async (req, res) => {
    const { nombre, apellido, direccion, email, password } = req.body;

    try {
        const userData = await readUsersJSON();

        const userExist = userData.find(user => user.email === email);
        if (userExist) {
            res.status(400).json(`El email ${email} ya se encuentra creado`);
            return;
        }

        const maxId = Math.max(...userData.map(user => user.Id), 0); // Generar un nuevo ID basado en el ID máximo existente en userData
        const Id = maxId + 1;

        const newUser = { Id, nombre, apellido, direccion, email, password };
        userData.push(newUser);

        await writeFile('./data/users.json', JSON.stringify(userData, null, 2));
        res.status(200).json({ Mensaje: 'Usuario creado con éxito', Usuario: newUser });
    } catch (error) {
        res.status(500).json('Error al crear usuario');
    }
});

router.post('/createSales', async (req, res) => {
    const { id_usuario, fecha, total, id_producto } = req.body;

    try {
        const maxId = Math.max(...salesData.map(sale => sale.id), 0);
        const id = maxId + 1;

        const newSale = { id, id_usuario, fecha, total, id_producto };
        salesData.push(newSale);

        await writeFile("./data/sales.json", JSON.stringify(salesData, null, 2));
        res.status(201).json("Venta cargada con éxito");
    } catch (error) {
        res.status(500).json('Error al crear venta...');
    }
});

router.put('/updatePassword', async (req, res) => {
    const { Id, newPassword } = req.body;

    const userData = await readUsersJSON();
    const userIndex = userData.findIndex(user => user.Id === Id);
    if (userIndex === -1) {
        res.status(404).json(`Usuario con ID ${Id} no ha podido encontrar, verifique los datos`);
        return;
    }

    userData[userIndex].password = newPassword;
    try {
        await writeFile('./data/users.json', JSON.stringify(userData, null, 2));
        res.status(200).json({ Mensaje: 'Contraseña actualizada con éxito', Usuario: userData[userIndex] });
    } catch (error) {
        res.status(500).json('Error al actualizar la contraseña');
    }
});

export default router;