export function internalServerException(e, res) {
    console.error(e)
    let m = e 
    if (m.getResponseCode) {
        addResponseCodeWithMessage(m.getResponseCode(), res, m.getResponseDetails())
        return res.send()
    }
    addResponseCodeWithMessage(5, res, "Internal Server Error. Contact Admin")
    return res.status(500).send()
}

export function addResponseCode(responseCode, res) {
    res.setHeader('response_code', responseCode)
}
export function addResponseCodeWithMessageAndSend(responseCode, res, message) {
    res.setHeader('response_code', responseCode)
    res.setHeader('response_details', message)
    res.send()
}
export function addResponseCodeWithMessage(responseCode, res, message) {
    res.setHeader('response_code', responseCode)
    res.setHeader('response_details', message)
}

export function unauthorizedException(res) {
    addResponseCodeWithMessage(13, res, "You are unauthorized to access this resource")
    return res.status(401).send()
}

export class ErrorWithResponse extends Error {
    responseCode
    constructor(responseCode, responseDetails) {
        super(responseDetails)
        this.responseCode = responseCode;
        this.message = responseDetails
    }
    message
    getResponseCode = () => {
        return this.responseCode
    }
    getResponseDetails = () => {
        return this.message
    }
}
