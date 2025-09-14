import { verifyToken } from "./jwt.js";
import { addResponseCodeWithMessageAndSend } from "./response.js";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        addResponseCodeWithMessageAndSend(401, res, 'token missing or malformed');
        return;
    };
    const token = verifyToken(authHeader);
    if (!token) {
        addResponseCodeWithMessageAndSend(401, res, 'invalid token');
        return;
    }
    req.userType = token.userType || 'Unknown';
    req.userName = token.username;

    next();
};
