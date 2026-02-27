// src/model/ApiResponse.js

const defaultHeaders = {
    "Content-type" : "application/json",
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS"
};

const buildResponse = (statusCode, payload) => {
    return {
        statusCode,
        headers : defaultHeaders,
        body : JSON.stringify(payload ?? {}),
        isBase64Encoded : false
    };
};

const success = (statusCode = 200, body = null, message = "Success") => {
    return buildResponse (statusCode, {
        success : true,
        body,
        message
    });
};

const error = (statusCode = 500, details = null, message = "Internal Server Error") => {
    return buildResponse (statusCode, {
        success : false,
        message, 
        ...(details && {details})
    });
};