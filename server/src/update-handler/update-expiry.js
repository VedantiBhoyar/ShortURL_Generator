import { queryAsync } from "../databaseBean/databaseconnection.js";
import { UpdateExpiryQuery } from "../databaseBean/queryBean.js";
import {
    internalServerException,
    addResponseCodeWithMessageAndSend
} from "../utilis/response.js";

export class UpdateExpiry {
    update = async (req, res) => {
        try {
            
            if (req.userType !== 'Admin') {
                return addResponseCodeWithMessageAndSend(401, res, "You are unauthorized to access the resource")
            }

            const { shortCode } = req.params;
            const { expiry } = req.query;

            if (!shortCode) {
                return addResponseCodeWithMessageAndSend(400, res, "Short code is required");
            }

            if (!expiry) {
                return addResponseCodeWithMessageAndSend(400, res, "Expiry time is missing");
            }
            const result = await queryAsync(UpdateExpiryQuery, [expiry, shortCode]);

            if (result.affectedRows > 0) {
                return addResponseCodeWithMessageAndSend(200, res, "Short URL expiry updated successfully");
            } else {
                return addResponseCodeWithMessageAndSend(404, res, "Short URL not found");
            }

        } catch (error) {
            console.error("Error while updating expiry:", error);
            return internalServerException(res, error);
        }
    };
}
