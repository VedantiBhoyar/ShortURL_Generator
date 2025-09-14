import { queryAsync } from "../databaseBean/databaseconnection.js";
import { GetMetaInfoQuery } from "../databaseBean/queryBean.js"
import { internalServerException, addResponseCodeWithMessage, addResponseCodeWithMessageAndSend } from "../utilis/response.js"

export class GetMetaData {
    getMetaInfo = async (req, res) => {
        try {
            
            if (req.userType !== 'Admin') {
                return addResponseCodeWithMessageAndSend(401, res, "You are unauthorized to access the resource")
            }

            const shortCode = req.params.shortCode;
            if (!shortCode) {
                return addResponseCodeWithMessageAndSend(400, res, "Short code is required");
            }
            const response = await queryAsync(GetMetaInfoQuery, [shortCode]);
            if (response.length === 0) {
                return addResponseCodeWithMessageAndSend(404, res, "Short URL Stats not found");
            }
            addResponseCodeWithMessage(200, res, "Stats fetched successfully")
            return res.json({
                message: "Stats fetched successfully",
                response: response[0]
            });


        } catch (error) {
            console.log(`Error while fetching stats`, error)
            internalServerException(error)
        }
    }
}