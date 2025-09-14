export const INSERT_URL_QUERY = `INSERT INTO SHORT_URL (originalUrl, shortId, expires_at, createdAt,createdBy) VALUES (?, ?, ?, NOW(),?)`;
export const CHECK_EXISTING_SHORTID_QUERY = `SELECT 1 FROM SHORT_URL WHERE shortId = ? LIMIT 1`;
export const GetLongUrlsQuery = `SELECT * FROM SHORT_URL  WHERE shortId= ? AND (expires_at IS NULL OR expires_at > NOW())`;
export const IncrementVisitCountQuery = `UPDATE SHORT_URL SET clickCount = clickCount + 1 WHERE id = ?`;
export const InsertAccessLogQuery = `INSERT INTO ACCESS_LOGS (short_url_id, access_time, ip_address, user_agent) VALUES (?, NOW(), ?, ?)`;
export const GetMetaInfoQuery = `SELECT SU.originalUrl,SU.shortId,SU.clickCount, SU.expires_at,SU.createdAt,SU.createdBy,
                                 json_arrayagg(AL.user_agent) AS user_agents,json_arrayagg(AL.ip_address) AS ip_addresses FROM SHORT_URL SU
                                 LEFT JOIN ACCESS_LOGS AL ON SU.id = AL.short_url_id WHERE SU.shortId =?  GROUP BY SU.shortId`;
export const DeleteShortUrlQuery = `DELETE  FROM SHORT_URL WHERE shortId =?`
export const UpdateExpiryQuery = `UPDATE SHORT_URL SET expires_at = ? WHERE shortId = ?`;
export const GetAllUrls = `SELECT * FROM SHORT_URL #`;
export const GetUser = `SELECT * FROM USERS WHERE username=?`

