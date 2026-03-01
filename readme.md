# Serverless Bookstore API

A fully serverless REST API for managing books, built using AWS Lambda, API Gateway, DynamoDB, and S3.

This project demonstrates a cloud-native backend architecture using the Serverless Framework and modern AWS services.

---

## Architecture

Frontend (Static HTML / JS)
        ↓
API Gateway (HTTP API)
        ↓
AWS Lambda (Node.js 18)
        ↓
DynamoDB (Book Data) + S3 (Cover Images)

---

## Tech Stack

- Node.js 18
- AWS Lambda
- API Gateway (HTTP API)
- DynamoDB (NoSQL Database)
- Amazon S3 (Object Storage)
- AWS SDK v3
- Serverless Framework

---

## Features

- Create, Read, Update, Delete Books (CRUD)
- Partial updates using DynamoDB UpdateExpression
- Upload book cover images using S3 Pre-Signed URLs
- Stage-based deployment (dev / prod)
- IAM least-privilege configuration
- CORS enabled
- Fully serverless architecture
- CloudFormation-managed infrastructure

---

##  Project Structure

bookstore-serverless-api/
├── serverless.yml
├── package.json
├── src/
│ ├── handler/
│ │ └── bookHandler.js
│ ├── service/
│ │ ├── dynamoDbService.js
│ │ └── s3Service.js
│ ├── model/
│ │ ├── book.js
│ │ └── apiResponse.js
│ └── util/
│ └── jsonUtil.js


---

## DynamoDB Schema

| Attribute       | Type   | Description        |
|----------------|--------|-------------------|
| bookId         | String | Partition Key     |
| title          | String | Book title        |
| author         | String | Book author       |
| genre          | String | Book genre        |
| price          | Number | Book price        |
| stock          | Number | Available stock   |
| coverImageUrl  | String | S3 image URL      |
| createdAt      | String | ISO timestamp     |
| updatedAt      | String | ISO timestamp     |

---

## API Endpoints

### GET /books  
Returns all books

### GET /books/{id}  
Returns a single book by ID

### POST /books  
Creates a new book

### PUT /books/{id}  
Updates an existing book

### DELETE /books/{id}  
Deletes a book

### POST /books/{id}/upload-url  
Generates an S3 pre-signed upload URL for uploading book cover images

---

## S3 Upload Flow

1. Client requests upload URL  
2. Lambda generates pre-signed URL  
3. Client uploads image directly to S3  
4. Client updates book with returned public URL  

This avoids Lambda size limits and improves performance.

---

## 🌍 Environment Variables

Defined inside `serverless.yml`:

- `BOOKS_TABLE`
- `COVERS_BUCKET`

Stage-based naming is used to support multiple environments (dev / prod).

---

## Cost Considerations

This project runs within AWS Free Tier limits for light usage:

- AWS Lambda: 1 million free requests per month
- DynamoDB: On-demand pricing
- S3: 5GB free storage

---

## Future Improvements

- Pagination for book listing
- Search by title or genre
- Authentication using AWS Cognito
- CloudFront distribution for S3
- Rate limiting and API keys
- CI/CD pipeline integration

---

## Author

Your Name - Om Sharad Shinde
Built using AWS Serverless Architecture
