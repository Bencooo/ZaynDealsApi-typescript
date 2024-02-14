# ZaynDealsApi-typescript
TypeScript Api with firebase


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

```json
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
