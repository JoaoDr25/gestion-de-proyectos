import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer')
        ? authHeader.split(' ')[1]
        : null;

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ mensaje: 'JWT_SECRET no definido en el entorno' });
    }

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token expirado' });
        }
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};

export default protect;
