import { nanoid } from 'nanoid';
import validator from 'validator';
import { queryAsync } from '../databaseBean/databaseconnection.js';
import { addResponseCodeWithMessage, addResponseCodeWithMessageAndSend } from '../utilis/response.js'
import { CHECK_EXISTING_SHORTID_QUERY,INSERT_URL_QUERY } from '../databaseBean/queryBean.js';

export class PostLongUrls {
    convertToShortUrl = async (req, res) => {
        try {
            const { originalUrl, customAlias, expiresAt } = req.body;
            const BASE_URL = process.env.BASE_URL;

            // Validate original URL
            if (!originalUrl || !validator.isURL(originalUrl, { require_protocol: true })) {
                return addResponseCodeWithMessageAndSend(400, res, "Invalid URL");
            }

            // Validate custom alias
            let shortId = customAlias ? customAlias.trim() : nanoid(8);
            if (customAlias && !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
                return addResponseCodeWithMessageAndSend(400, res, "Invalid custom alias. Allowed: a-z, A-Z, 0-9, -, _, length 3-30 chars");
            }

            // Check if shortId exists
            const existing = await queryAsync(CHECK_EXISTING_SHORTID_QUERY, [shortId]);
            if (existing.length > 0) {
                return addResponseCodeWithMessageAndSend(409, res, "Custom alias already in use");
            }

            // Handle expiration
            let expirationDate = null;
            if (expiresAt) {
                const date = new Date(expiresAt);
                if (isNaN(date.getTime())) {
                    return addResponseCodeWithMessageAndSend(400, res, "Invalid expiration date");
                }
                expirationDate = date.toISOString().slice(0, 19).replace('T', ' ');
            }

            // Insert into database
            await queryAsync(INSERT_URL_QUERY, [originalUrl, shortId, expirationDate,req.userName]);

            const shortUrl = `${BASE_URL}/${shortId}`;
            addResponseCodeWithMessage(201, res, "Short URL created successfully");
            res.json({
                originalUrl,
                shortUrl,
                expiresAt: expirationDate,
                createdBy:req.userName || "Unknown"
            })

        } catch (error) {
            console.error('Error creating short URL:', error);
            return internalServerError(res);
        }
    }
}
