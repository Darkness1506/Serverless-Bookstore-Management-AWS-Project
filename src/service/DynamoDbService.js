// src/service/dynamoDbService.js

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({region: process.env.AWS_REGION});

const dynamoDb = DynamoDBDocumentClient.from(client);

const tableName = process.env.BOOKS_TABLE || "BookstoreBooks";

// CREATE
const createBook = async (book) => {
    const now = new Date().toISOString();

    const newBook = {
        ...book,
        bookId: uuidv4(),
        createdAt: now,
        updatedAt: now
    };

    await dynamoDb.send(new PutCommand ({
            TableName: tableName,
            Item: newBook,
            ConditionExpression: "attribute_not_exists(bookId)"
        })
    );

    return newBook;
};

// READ ONE
const getBookById = async (bookId) => {
    const result = await dynamoDb.send(new GetCommand ({
            TableName: tableName,
            Key: { bookId }
        })
    );

    return result.Item || null;
};

// READ ALL (Scan — fine for small dataset)
const getAllBooks = async () => {
    const result = await dynamoDb.send(new ScanCommand ({
            TableName: tableName
        })
    );

    return result.Items || [];
};

// UPDATE (Partial Update using UpdateExpression)
const updateBook = async (bookId, updates) => {

    const existing = await getBookById(bookId);
    if (!existing) return null;

    const updateExpressions = [];
    const expressionValues = {};
    const expressionNames = {};

    const allowedFields = ["title", "author", "genre", "price", "stock", "coverImageUrl"];

    for (const field of allowedFields) {
        if (field in updates) {
            updateExpressions.push(`#${field} = :${field}`);
            expressionValues[`:${field}`] = updates[field];
            expressionNames[`#${field}`] = field;
        }
    }

    // Always update updatedAt
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionValues[":updatedAt"] = new Date().toISOString();
    expressionNames["#updatedAt"] = "updatedAt";

    const result = await dynamoDb.send(new UpdateCommand({
            TableName: tableName,
            Key: { bookId },
            UpdateExpression: "SET " + updateExpressions.join(", "),
            ExpressionAttributeValues: expressionValues,
            ExpressionAttributeNames: expressionNames,
            ReturnValues: "ALL_NEW"
        })
    );

    return result.Attributes;
};

// DELETE
const deleteBook = async (bookId) => {

    const existing = await getBookById(bookId);
    if (!existing) return false;

    await dynamoDb.send(new DeleteCommand({
            TableName: tableName,
            Key: { bookId }
        })
    );

    return true;
};


module.exports = {
    createBook,
    getBookById,
    getAllBooks,
    updateBook,
    deleteBook
};