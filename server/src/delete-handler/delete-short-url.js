import { queryAsync } from "../databaseBean/databaseconnection.js";
import { DeleteShortUrlQuery } from "../databaseBean/queryBean.js"
import { internalServerException, addResponseCodeWithMessage, addResponseCodeWithMessageAndSend } from "../utilis/response.js"

export class DeleteShortUrl {
    deleteUrl = async (req, res) => {
        try {
            
            if (req.userType !== 'Admin') {
                return addResponseCodeWithMessageAndSend(401, res, "You are unauthorized to access the resource")
            }

            const shortCode = req.params.shortCode;
            if (!shortCode) {
                return addResponseCodeWithMessageAndSend(400, res, "Short code is required");
            }
            const result = await queryAsync(DeleteShortUrlQuery, [shortCode]);
            if (result.affectedRows > 0) {
                return addResponseCodeWithMessageAndSend(200, res, "ShortUrl deleted successfully");
            } else {
                return addResponseCodeWithMessageAndSend(404, res, "ShortUrl not found");
            }

        } catch (error) {
            console.log(`Error while fetching stats`, error)
            internalServerException(error)
        }
    }
}