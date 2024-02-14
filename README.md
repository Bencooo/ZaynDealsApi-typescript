# ZaynDeals API Documentation

## Overview

The ZaynDeals API provides developers with the ability to integrate user management functionalities and deal-related services into their applications, leveraging Firebase for authentication and data storage.

## Authentication

## Endpoints

### Create User

#### Description

This endpoint allows for the creation of a new user in Firebase Authentication and adds a corresponding document in the 'users' collection. The user's role is set to 'customer' by default but can be customized if provided.

#### URL

`POST https://us-central1-zayn-deals.cloudfunctions.net/api/users/create`

#### HTTP Method

`POST`

#### Request Body Parameters

| Field        | Type   | Description                                 | Required |
|--------------|--------|---------------------------------------------|----------|
| `email`      | String | The user's email address.                   | Yes      |
| `password`   | String | The user's password.                        | Yes      |
| `firstName`  | String | The user's first name.                      | Yes      |
| `lastName`   | String | The user's last name.                       | Yes      |
| `phoneNumber`| String | The user's phone number.                    | No       |
| `role`       | String | The user's role (default: 'customer').      | No       |

#### Responses

##### 201 Created

User created successfully.

```json
{
  "message": "OK"
}
```
##### 400 Bad Request

Missing a required field.

```json
{
  "message": "Unprocessable entity."
}
```
##### 409 Conflict

The provided email already exists.

```json
{
  "message": "Conflict."
}
```
##### 500 Internal Server Error

Internal server error.

```json
{
  "message": "Internal Server Error",
  "error": "[Error Description]"
}
```
#### Example Request

```bash
curl -X POST 'https://us-central1-zayn-deals.cloudfunctions.net/api/users/create' \
-H 'Content-Type: application/json' \
-d '{
  "email": "example@domain.com",
  "password": "password",
  "firstName": "First",
  "lastName": "Last",
  "phoneNumber": "0123456789",
  "role": "customer"
}'
```

#### Additional Notes

The phoneNumber field is optional and will only be included in the database if provided.
The user's role is set to 'customer' by default but can be customized via the role field.
Ensure that the password is strong enough to meet Firebase Authentication's security policies.
If the error auth/email-already-exists occurs, it indicates that the provided email is already in use by another account.


### Get Merchant by Category

#### Description

This endpoint retrieves merchants based on category and subCategory criteria. It supports pagination through the `lastDocId` parameter and limits the number of results returned with the `limit` parameter.

#### URL

`GET https://us-central1-zayn-deals.cloudfunctions.net/api/merchants/getByCategory`

#### HTTP Method

`GET`

#### Query Parameters

| Field         | Type    | Description                                             | Required |
|---------------|---------|---------------------------------------------------------|----------|
| `category`    | String  | The category to filter merchants by.                    | No       |
| `subCategory` | String  | The subCategory to further filter merchants within a category. | No       |
| `lastDocId`   | String  | The document ID of the last merchant received, for pagination. | No       |
| `limit`       | Integer | The maximum number of merchants to return. Defaults to 25 if not specified. | No       |

#### Responses

##### 200 OK

Returns a list of merchants matching the criteria.

```json
[
  {
    "id": "merchantId",
    "name": "Merchant Name",
    "category": "Merchant Category",
    "subCategory": "Merchant SubCategory",
    "tags": ["tag1", "tag2"],
    "address": "Merchant Address",
    "imageUrls": ["url1", "url2"]
  }
]
```
##### 404 Not Found

No merchants found matching the criteria.

```json
{
  "message": "No merchants found matching the criteria"
}
```
##### 500 Internal Server Error

Internal server error.

```json
{
  "message": "Error getting merchants",
  "error": "[Error Description]"
}
```
#### Example Request

```bash
curl -G 'https://us-central1-zayn-deals.cloudfunctions.net/api/merchants/getByCategory' \
--data-urlencode "category=Food" \
--data-urlencode "subCategory=Italian" \
--data-urlencode "limit=10"
```

#### Additional Notes

The category and subCategory parameters are used to filter merchants. They are optional, and when not provided, all merchants are returned.
Pagination is supported through the lastDocId parameter, which should be the ID of the last merchant received by the client. This is useful for fetching the next set of results.
The limit parameter controls the maximum number of merchants returned by the request. It defaults to 25 if not specified.

