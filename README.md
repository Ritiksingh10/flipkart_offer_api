# 🛍️ Flipkart Offers API

This project provides an API to manage and retrieve Flipkart offers with features such as storing offers, identifying payment instruments, and fetching the best discounts. Built using Node.js, Express, MongoDB Atlas, and Mongoose.

---

## 🚀 Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ritiksingh10/flipkart_offer_api.git
cd flipkart_offer_api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add your MongoDB URI:

```env
MONGODB_URI=your_mongodbCompass_connection_string
PORT=2000
```

> **Note:** Make sure your MongoDB cluster is whitelisted to accept your current IP.

### 4. Run the Server
nodemon run server.js

> **Note:** If nodemon is not installed then install it using command "npm i -g nodemon"

---

## 📁 Project Structure

```
flipkart_offer_api/
│
├── controllers/
│   ├── offerController.js
│   └── discountController.js
│
├── models/
│   └── Offer.js
│
├── routes/
│   ├── offerRoutes.js
│   └── discount.js
│
├── config/
│   └── db.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## ✅ Assumptions Made

- All offers are provided via a consistent format and include required fields such as title, description, and bank name.
- Duplicate offers are determined using the bank name, offerText, and offerDescriptionText fields.
- Offers can be filtered based on payment instruments like 'CREDIT', 'EMI_OPTIONS', 'DEBIT', 'UPI', 'NETBANKING' and 'OTHERS'.
- If no payment instrument is explicitly matched, it is categorized as `"OTHERS"`.

---

## 🧠 Design Choices

- **Node.js + Express:** Lightweight, fast, and scalable for REST APIs.
- **MongoDB Atlas + Mongoose:** Flexible document-based database ideal for unstructured offer data. Mongoose simplifies data modeling.
- **Controllers & Routes Split:** Helps in maintaining separation of concerns and modular code.
- **Regex-Based Filtering:** Used to identify keywords (like “credit”, “emi”, etc.) from unstructured offer text.
- **Dotenv:** Secure handling of sensitive environment variables like DB URI.

---

## ⚖️ How to Scale `GET /highest-discount` to 1000 RPS

To handle 1,000 requests per second:

- **Indexing:** Ensure MongoDB has indexes on `bank`, `amountToPay`, and `maxDiscount` fields for efficient querying.
- **Caching:** Use Redis or in-memory caching to store frequently accessed results (especially for repeated bank+amount combinations).
- **Horizontal Scaling:** Deploy multiple instances behind a load balancer.
- **Rate Limiting:** Apply throttling/rate-limiting per user/IP to prevent abuse.
- **Optimize Query:** Use MongoDB aggregation pipelines with `$match`, `$sort`, and `$limit` for high efficiency.

---

## 📈 Improvements with More Time

-	🔍 Integrate an LLM model to dynamically analyze offerDescriptionText and offerText for more complex and unstructured discount patterns and payment instrument detection.
-	🔐 Add authentication and authorization to secure the API and build an admin dashboard to manage offers more efficiently.
-	🖥️ Develop a front-end interface for users to visualize, search, and apply the available offers in an intuitive UI.
-	📊 Analytics dashboard to track which offers are performing best and provide insights on usage patterns.

---

## 🧪 Example Request

**POST /offers**

```json
{
  "flipkartOfferApiResponse": {
    "paymentOptions": {
      "items": [
        {
          "type": "OFFER_LIST",
          "data": {
            "offerSummary": {
              "title": "₹4,000 Off",
              "subTitle": "Claim now with payment offers",
              "iconsInfo": {
                "remainingOffersCount": 3,
                "icons": [
                  "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/KOTAK.svg",
                  "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/SBI.svg"
                ]
              }
            },
            "offers":{
              "headerTitle": "Offers on online payment",
              "offerList": [{
              "provider": ["KOTAK"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/KOTAK.svg",
              "offerText": {
                  "text": "Save ₹4,000"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701135913URKRF",
                  "text": "₹4000 Off On Kotak Bank Credit Card Transactions."
              }
              }, {
              "provider": ["SBI"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/SBI.svg",
              "offerText": {
                  "text": "Save ₹4,000"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701131849BIJPO",
                  "text": "₹4000 Off On SBI  Credit Card Transactions."
              }
              }, {
              "provider": ["ICICI"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/ICICI.svg",
              "offerText": {
                  "text": "Save ₹4,000"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701155311529BE",
                  "text": "₹4000 Off On ICICI Bank Credit Non EMI, Credit and Debit Card EMI Transactions"
              }
              }, {
              "provider": [],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/green-offer-tag.svg",
              "offerText": {
                  "text": "Get ₹10 cashback"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250626172916JI4VZ",
                  "text": "Flat ₹10 Cashback on Paytm UPI Trxns. Min Order Value ₹500. Valid once per Paytm account"
              }
              }, {
              "provider": ["KOTAK"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/KOTAK.svg",
              "offerText": {
                  "text": "No cost EMI offer"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701170727J92YJ",
                  "text": "No Cost EMI on Credit Card Transaction"
              }
              }, {
              "provider": ["FLIPKARTAXISBANK"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/AXIS.svg",
              "offerText": {
                  "text": "Get 5% cashback"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250619134128USHPF",
                  "text": "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter"
              }
              }, {
              "provider": ["ICICI"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/ICICI.svg",
              "offerText": {
                  "text": "No cost EMI offer"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701165523OZO64",
                  "text": "No Cost EMI on Credit and Debit Card Transaction"
              }
              }, {
              "provider": ["FLIPKARTAXISBANK"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/AXIS.svg",
              "offerText": {
                  "text": "Get 5% cashback"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250619135528ZQIZW",
                  "text": "5% cashback on Axis Bank Flipkart Debit Card up to ₹750"
              }
              }, {
              "provider": ["BAJAJFINSERV"],
              "logo": "/FK_STATIC_ASSET/apex-static/images/payments/banks/BFL_V2.svg",
              "offerText": {
                  "text": "Save ₹0"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO25062716163486CIQ",
                  "text": "No Cost EMI on Bajaj Finserv"
              }
              }, {
              "provider": ["SBI"],
              "logo": "/FK_STATIC_ASSET/fk-p-linchpin-web/fk-gringotts/images/banks/SBI.svg",
              "offerText": {
                  "text": "No cost EMI offer"
              },
              "offerDescription": {
                  "type": "tenure.detail.offer.terms.conditions",
                  "tncText": "Terms and conditions",
                  "id": "FPO250701164220DDNI4",
                  "text": "No Cost EMI on Credit Card Transaction"
              }
              }
              ]
            }
          }
        }
      ]
    }
  }
}
```

**GET /highest-discount?amountToPay=6000&bankName=ICICI&instrument=emi_options**

---
