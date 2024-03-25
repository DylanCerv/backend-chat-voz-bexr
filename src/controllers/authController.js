import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';
import { Profile } from '../models/profile.js';


export class AuthController {

    /**
     * Register a user
     */
    // POST /api/auth/register
    static async register(req, res) {
        try {
            const { email, password, name, lastname, phone, nickname, glb } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ['name', 'nickname', 'email', 'password'];
            const missingFields = [];
            requiredFields.forEach(field => {
                if (!req.body[field]) {
                    missingFields.push(field);
                }
            });

            if (missingFields.length > 0) {
                return res.status(400).json({ error: `Los siguientes campos son requeridos: ${missingFields.join(', ')}` });
            }

            // Validar si el email tiene un formato válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            const newProfile = new Profile({userId: newUser._id, name, lastname, phone, nickname, glb });
            await newProfile.save();

            // Generar token de autenticación
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ message: 'Usuario registrado correctamente', token });

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }

    /**
     * Login a user
     */
    // POST /api/auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token de autenticación
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Inicio de sesión exitoso', token });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

}
