// src/util/jsonUtil.js

// Convert object to JSON string
const toJson = (obj) => {
    try {
        return JSON.stringify(obj);
    } catch (err) {
        return JSON.stringify({
            error: `Serialization failed: ${err.message}`
        });
    }
};

// Convert JSON string to object
const fromJson = (json) => {
    try {
        return JSON.parse(json);
    } catch (err) {
        throw new Error(`Invalid JSON: ${err.message}`);
    }
};

// Build simple error JSON
const errorJson = (message) => {
    return JSON.stringify({
        error: message
    });
};

// Build simple message JSON
const messageJson = (message) => {
    return JSON.stringify({
        message
    });
};

module.exports = {
    toJson,
    fromJson,
    errorJson,
    messageJson
};