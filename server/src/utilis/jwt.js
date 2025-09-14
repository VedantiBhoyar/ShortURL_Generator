import jwt from 'jsonwebtoken';
import 'dotenv/config'

const secret_key = process.env.secret_key

export function signPayload(payLoad) {
    return jwt.sign(payLoad, secret_key, { algorithm: "HS512", expiresIn: "2h" })
}

export function verifyToken(token) {

    try {
        if (token) {
            let t = token.split('.');
            if (t.length === 3) {
                return (jwt.verify(token.substring(7), secret_key))
            }
        }
    }
    catch (e) {
        if (!(e instanceof TokenExpiredError))
            console.log(e)
    }
}