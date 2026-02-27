// src/model/book.js

const {v4 : uuidv4} = require("uuid");

const createBook = (data = {}) => {
    const now = new Date().toISOString();

    return {
        bookId : data.bookId ?? uuidv4(),
        title : typeof data.title == "string" ? data.title.trim() : "",
        author : typeof data.author == "string" ? data.author.trim() : "",
        genre : typeof data.genre == "string" ? data.genre.trim() : "",
        price : typeof data.price == "number" && data.price >= 0 ? data.price : 0,
        stock: Number.isInteger(data.stock) && data.stock >= 0 ? data.stock : 0,
        coverImageUrl: typeof data.coverImageUrl === "string" ? data.coverImageUrl : null,
        createdAt: now,
        updatedAt: now
    };
};

const updateBook = (existingBook = {}, updates = {}) => {
    const allowedFields = [
        "title",
        "author",
        "genre",
        "price",
        "stock",
        "coverImageUrl"
    ];

    const cleanedUpdates = {};

    for(const key of allowedFields)
    {
        if(key in updates)
        {
            if (key === "price" && typeof updates.price === "number" && updates.price >= 0) {
                cleanedUpdates.price = updates.price;
            } 
            else if (key === "stock" && Number.isInteger(updates.stock) && updates.stock >= 0) {
                cleanedUpdates.stock = updates.stock;
            } 
            else if (typeof updates[key] === "string") {
                cleanedUpdates[key] = updates[key].trim();
            }
        }
    }

    return {
        ...existingBook,
        ...cleanedUpdates,
        updatedAt : new Date().toISOString()
    };
};

module.exports = {
    createBook,
    updateBook
};