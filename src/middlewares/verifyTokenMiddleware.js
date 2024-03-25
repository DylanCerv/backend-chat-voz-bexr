import jwt from 'jsonwebtoken';

export function verifyTokenMiddleware(req, res, next) {

    const authorizationHeader = req.headers.authorization;

    // Verificar si el token existe
    if (!authorizationHeader) {
        return res.status(401).json({ status: 'error', message: 'Token de autenticación no proporcionado' });
    }
    const [tokenType, token] = authorizationHeader.split(' ');

    // Verificar y decodificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', message: 'Token de autenticación inválido', err, decoded });
        } else {
            req.user = decoded;
            next();
        }
    });
}
