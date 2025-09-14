import { addResponseCodeWithMessage, internalServerException, addResponseCodeWithMessageAndSend } from "../utilis/response.js";
import { queryAsync } from "../databaseBean/databaseconnection.js";
import { IncrementVisitCountQuery,InsertAccessLogQuery,GetLongUrlsQuery } from "../databaseBean/queryBean.js";
export class GetLongUrls {
    getUrls = async (req, res) => {
        try {
            const shortCode = req.params.shortCode;
            if (!shortCode) {
                return addResponseCodeWithMessageAndSend(400, res, "Short code is required");
            }
            const response = await queryAsync(GetLongUrlsQuery, [shortCode]);
            if (response.length === 0) {
                return addResponseCodeWithMessageAndSend(404, res, "Short URL not found or expired");
            }
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
            const userAgent = req.headers['user-agent'] || 'Unknown';
          
            await Promise.all([
                queryAsync(IncrementVisitCountQuery, [response[0].id]),
                queryAsync(InsertAccessLogQuery, [response[0].id, ipAddress, userAgent])
            ]).then(() => {
                console.log('Visit count incremented and access log inserted');
            }).catch((err) => {
                console.error('Error updating visit count or inserting access log:', err);
            });

            addResponseCodeWithMessage(302, res, "Redirecting to original URL");
            return res.redirect(response[0].originalUrl);

        } catch (error) {
            console.error('Error fetching long URL:', error);
            return internalServerException(res);
        }
    }
}
