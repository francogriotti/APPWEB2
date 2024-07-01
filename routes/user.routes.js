import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { get_user_byId, readUsersJSON } from "../utils/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { decodeToken } from "../utils/middleware.js"
import 'dotenv/config'

const router = Router();
const SECRET = process.env.SECRET

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

        const result = userData.find(e => e.email === correo);
        if (!result) {
            return res.status(404).send({ success: false, message: `El correo o la contraseña son incorrectos` });
        }

        const controlPass = bcrypt.compareSync(pass, result.password);
        if (!controlPass) {
            return res.status(401).send({ success: false, message: `El correo o la contraseña son incorrectos` });
        }

        const token = jwt.sign({ ...result }, SECRET, { expiresIn: 86400 });

        res.status(200).json({ success: true, token, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al intentar acceder' });
    }
});


router.post('/createUser', async (req, res) => {
    const { nombre, apellido, direccion, email, password } = req.body

    try {
        const userData = await readUsersJSON();
        const hashedPass = bcrypt.hashSync(password, 8)

        const userExist = userData.find(user => user.email === email)
        if (userExist) {
            res.status(400).json(`El email ${email} ya se encuentra creado`)
            return;
        }

        const maxId = Math.max(...userData.map(user => user.Id), 0)
        const Id = maxId + 1

        const newUser = { Id, nombre, apellido, direccion, email, password:hashedPass }
        userData.push(newUser)

        await writeFile('./data/users.json', JSON.stringify(userData, null, 2))
        res.status(200).json({ Mensaje: 'Usuario creado con éxito', Usuario: newUser })
    } catch (error) {
        res.status(500).json('Error al crear usuario')
    }
});

router.post('/decodeToken',async (req,res)=>{
    const token = req.body.token

    const result = await decodeToken(token)
    console.log(result)
    res.status(200).json(result)
})

router.put('/updatePassword', async (req, res) => {
    const { Id, newPassword } = req.body;

    const userData = await readUsersJSON();
    const userIndex = userData.findIndex(user => user.Id === Id);
    if (userIndex === -1) {
        res.status(404).json(`Usuario con ID ${Id} no ha podido encontrar, verifique los datos`);
        return;
    }

    const hashedPass = bcrypt.hashSync(newPassword, 8);
    userData[userIndex].password = hashedPass;
    try {
        await writeFile('./data/users.json', JSON.stringify(userData, null, 2));
        res.status(200).json({ Mensaje: 'Contraseña actualizada con éxito', Usuario: userData[userIndex] });
    } catch (error) {
        res.status(500).json('Error al actualizar la contraseña');
    }
});

export default router;