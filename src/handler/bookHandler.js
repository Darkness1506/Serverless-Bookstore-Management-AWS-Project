// src/handler/bookHandler.js

const dynamoDb = require("../service/dynamoDbService");
const s3 = require("../service/s3Service");
const { createBook, updateBook } = require("../model/book");
const { success, error, buildResponse } = require("../model/apiResponse");

exports.handler  = async (event) => 
{
    console.log("Request", event.httpMethod, event.path);
    const method = event.httpMethod;
    const path = event.path;
    const bookId = event.pathParameters?.id; 

    try{

        //get -> /books
        if(method === "GET" && path === "/books")
        {
            const books = await dynamoDb.getAllBooks();
            return success(200, books, "Books fetched Sucessfully");
        }

        // GET -> /books/{id}
        if (method === "GET" && bookId && !path.includes("upload-url"))
        {
            const book = await dynamoDb.getBookById(bookId);
            if (!book) return error(404, "Book not found");
            return success(200, book);
        }

        //post -> /books
        if(method === "POST" && path === "/books")
        {
            if(!event.body) return error(400, "Request body required");

            const body = JSON.parse(event.body);

            if(!body.title || !body.author)
            {
                return error(400, "Title and author are required");
            }

            const book = createBook(body);
            const created = await dynamoDb.createBook(book);

            return success(201, created,"Book Created Successfully")
        }

        //put -> /books/{id}
        if(method === "PUT" && bookId && !path.includes("upload-url"))
        {
            if (!event.body) return error(400, "Request body required");

            const updates = JSON.parse(event.body);

            const existing = await dynamoDb.getBookById(bookId);
            if (!existing) return error(404, "Book not found");

            const updated = updateBook(existing, updates);
            await dynamoDb.updateBook(bookId, updated);

            return success(200, updated, "Book updated successfully");
        }

        //DELETE -> /books/{id}
        if (method === "DELETE" && bookId) {
            const book = await dynamoDb.getBookById(bookId);
            if (!book) return error(404, "Book not found");

            if (book.coverImageUrl) 
            {
                const key = s3.extractKeyFromUrl(book.coverImageUrl);
                if (key) await s3.deleteCoverImage(key);
            }

            await dynamoDb.deleteBook(bookId);
            return success(200, null, "Book deleted successfully");
        }

        // POST /books/{id}/upload-url
        if (method === "POST" && path.endsWith("/upload-url") && bookId) 
        {
            const contentType = event.queryStringParameters?.contentType || "image/jpeg";

            const book = await dynamoDb.getBookById(bookId);
            if (!book) return error(404, "Book not found");

            const urlData = await s3.generateUploadUrl(bookId, contentType);

            return success(200, urlData, "Upload URL generated");
        }

        // OPTIONS (CORS preflight)
        if (method === "OPTIONS") 
        {
            return buildResponse(200, {});
        }

        // Default
        return error(404, `Route not found: ${method} ${path}`);
    }
    catch(err)
    {
        console.error("Error: ", err);
        return error(500, err.message)
    }
};