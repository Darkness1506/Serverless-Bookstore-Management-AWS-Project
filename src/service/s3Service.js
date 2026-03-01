// src/service/s3Service.js

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.COVERS_BUCKET || "bookstore-covers";

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

// Generate Pre-Signed Upload URL
const generateUploadUrl = async (bookId, contentType = "image/jpeg") => {

    const objectKey = `covers/${bookId}/${Date.now()}.jpg`;

    if (!contentType.startsWith("image/")) {
        throw new Error("Invalid content type");
    }

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300 // 5 minutes
    });

    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;

    return {
        uploadUrl,
        objectKey,
        publicUrl,
        expiresIn: "300 seconds"
    };
};

// Delete Cover Image
const deleteCoverImage = async (objectKey) => {

    if (!objectKey) return;

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey
        })
    );
};

// Extract S3 Key From Public URL
const extractKeyFromUrl = (s3Url) => {

    if (!s3Url) return null;

    const marker = ".amazonaws.com/";
    const index = s3Url.indexOf(marker);

    if (index === -1) return null;

    return s3Url.substring(index + marker.length);
};


module.exports = {
    generateUploadUrl,
    deleteCoverImage,
    extractKeyFromUrl
};