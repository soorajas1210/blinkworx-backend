# Project Name

## 📌 Description

This is a test project for a company interview. It is built by using Node.js, Express and Postresql.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git https://github.com/soorajas1210/blinkworx-backend.git
nmp install

```

#### .env

create a .env file in the root of the repository
with the following

PORT=5000
DB_USER= username
DB_HOST= hostname
DB_NAME= dbname
DB_PASSWORD= dbpassword
DB_PORT= 5432

ORIGIN_URL=http://localhost:5173

#### Run the code

```sh
npm run start
```

## Notes

## -- Extra apis

1. To add new product(POST-method): "http://localhost:5000/api/add-product"
   body-json : {
   "productName":"name",
   "productDescription":"This is name of the product"
   }

---

2. To delete product(DELETE-method):"http://localhost:5000/api/products/:id"

---
