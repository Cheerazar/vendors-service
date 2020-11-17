# Vendors microservice

## Getting started
1. If you don't have [nvm](https://github.com/nvm-sh/nvm) installed, install that first.
1. Run `nvm use`. 
    1. If you get an error like this `N/A: version "lts/fermium -> N/A" is not yet installed.` running the previous command, you'll need to run `nvm install lts/fermium` first.
    1. Run `nvm use` once that's finished installing.
1. Run `docker run --hostname conf-vendors-db --name conf-vendors-db -e MYSQL_ROOT_PASSWORD=pconf-mso-vendors-db -p 3306:3306 -d mysql:8.0.22` to install mysql
  Once you have the mysql container installed you'll need to fix an issue with the root password package that's used.
    1. Run `docker ps` to get the list of containers
    1. Find the container id for `conf-vendors-db`.
    1. Run `docker exec -it <container id here> mysql -u root -p`
    1. Enter the password: `pconf-mso-vendors-db`.
    1. Run `ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'pconf-mso-vendors-db';`.
    1. Run `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pconf-mso-vendors-db';`.
    1. Run `SELECT plugin from mysql.user WHERE User = 'root';`
      * You should see that both rows show `mysql_native_password` in the `plugin` column.
    1. Run `CREATE DATABASE vendors`. This creates the `vendors` for `typeorm` to interact with.
    1. Type `\q` to exit the mysql interface.
1. Run `yarn build`
1. Run `yarn start`. If you want to specify the port, you can add `PORT_NUMBER=<number here>` to the `start` script in the `package.json`.
    * **Note:** This is served on port `3017` by default.


--------------------

ENDPOINTS

```
POST `/v1/vendors`
PATCH `/v1/vendors/:id`
GET `/v1/vendors?eventName=name`
GET `/v1/vendors/:id`
```

## Create a vendor (POST `/v1/vendors`)

Create a vendor for an event.

### Parameters
--------------------------
`companyName` required

The company name of the vendor.

------------------------------------------

`eventName` required

The name of the event to create the vendor for.

--------------------------

`boothAssignment` required `object`

The booth the vendor is assigned at the event.

childProperties:
```
boothNumber (number)
mezzanine (number)
```
---------------------------

`paymentInfo` required `object`

The payment information for the vendor.

childProperties:
```
name: string
address: string
cardNumber: string
expDate: string (MM/YY)
```

### Returns

#### Success
Status code `201` upon successful creation of vendor and the newly created vendor information.

#### Error

Returns status code `403` if creating requested vendor would put it over the maximum number of vendors for event.

Returns status code `404` for malformed request.

### RabbitMQ event broadcast on successful creation

Upon the successful creation of a vendor, the following information will be broadcast on the `vendor.created` channel.

Event example:

```json
{
  "id": 7,
  "eventName": "Triwizard Tournament",
  "boothAssignment": {
    "boothNumber": 5,
    "mezzanine": 2
  },
  "companyName": "Hogwarts School of Witchcraft and Wizardry",
  "badgesToCreate": [
    {
      "type": "vendor",
      "companyName": "Hogwarts School of Witchcraft and Wizardry" 
    },
    {
      "type": "vendor",
      "companyName": "Hogwarts School of Witchcraft and Wizardry" 
    }
  ]
}
```

--------------------------

## Update a vendor's booth location (PATCH `/v1/vendors/:id`)

Update the booth location for a vendor.

### Parameters
------------------
`eventName` required

The name of the event to create the vendor for.

--------------------------

`boothAssignment` required `object`

The booth the vendor is assigned at the event.

childProperties:
```
boothNumber (number)
mezzanine (number)
```
---------------------------

### Returns

#### Success

Status code `200`.

#### Error

Status code `404`

---------------------

## Get a list of vendors for an event (GET `/v1/vendors?eventName=name`)

Returns the list of vendors for the event name specified in the query parameter

### Returns

#### Success

Status code `200`.

Response body example:

```json
[
  {
    "id": 3,
    "eventName": "Triwizard Tournament",
    "boothAssignment": {
      "boothNumber": 13,
      "mezzanine": 1
    },
    "companyName": "Durmstrang Institute",
  },
  {
    "id": 7,
    "eventName": "Triwizard Tournament",
    "boothAssignment": {
      "boothNumber": 5,
      "mezzanine": 2
    },
    "companyName": "Hogwarts School of Witchcraft and Wizardry",
  }
]
```

If there is no vendors for the event name, it will return:

```json
{
  "vendors": null
}
```

#### Error

Status code `404`

------------------------

## Get the details of a vendor (GET `/v1/vendors/:id`)

Get the details for the specified vendor id.

### Returns

#### Success

Status code `200`.

Example response body:

```json
{
  "eventName": "Triwizard Tournament",
  "boothAssignment": {
    "boothNumber": 5,
    "mezzanine": 2
  },
  "companyName": "Hogwarts School of Witchcraft and Wizardry"
}
```

If there is no vendor with that id, it will return:

```json
{
  "vendor": null
}
```

#### Error

Status code `404`.
