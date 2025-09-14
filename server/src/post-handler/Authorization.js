import { signPayload } from '../utilis/jwt.js';
import { addResponseCodeWithMessage, addResponseCodeWithMessageAndSend, internalServerException } from '../utilis/response.js';
import { getHash } from '../utilis/hash.js';
import { queryAsync } from '../databaseBean/databaseconnection.js';
import { GetUser } from '../databaseBean/queryBean.js';
import Joi from 'joi';

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(40).required(),
    password: Joi.string().required(),
})
export class Authorization {
    getToken = async (req, res) => {
        try {
            const validationResult = loginSchema.validate(req.body);
            if (validationResult.error) {
                addResponseCodeWithMessageAndSend(400, res, "Validation error")
                return
            }
            const { username, password } = validationResult.value;
            const response = await queryAsync(GetUser, [username])
            if (response.length == 0) {
                addResponseCodeWithMessageAndSend(400, res, "User not found")
                return
            }
            const hash = getHash(password)
            if (hash != response[0].password) {
                addResponseCodeWithMessageAndSend(401, res, "You are unauthorized to access the resources")
                return
            }
            const payload = {
                "username": username,
                "userType": response[0].userType,
                "TokenCreation":new Date().toISOString()
            }
            const usertoken = signPayload(payload)
            payload.token = usertoken
            addResponseCodeWithMessage(200, res, "Login Sucessful")
            res.json(payload)
        } catch (error) {
            console.log(`Error generating token`)
            internalServerException(error)
        }
    }

}

