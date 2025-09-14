import { addResponseCodeWithMessage, internalServerException, addResponseCodeWithMessageAndSend } from "../utilis/response.js";
import { queryAsync } from "../databaseBean/databaseconnection.js";
import { GetAllUrls } from "../databaseBean/queryBean.js";
export class GetUrlsList {
    getUrls = async (req, res) => {
        try {
            let formattedQuery =''
            let data =[]
            if (req.userType == 'Admin') {
                formattedQuery = GetAllUrls.replace('#','')
            }
            else{
                formattedQuery = GetAllUrls.replace('#',`WHERE createdBy =?`)
                data.push(req.userName)
            }

            const response = await queryAsync(formattedQuery,data);
            if (response.length > 0) {
                addResponseCodeWithMessage(200, res, "Urls fetched successfully")
                return res.json(response)
            }
            addResponseCodeWithMessage(404, res, "No Data found")
            return res.json([])

        } catch (error) {
            console.error('Error fetching long URL:', error);
            return internalServerException(res);
        }
    }
}
