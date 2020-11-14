# Vendors microservice

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
Status code `201` upon successful creation of vendor.

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

#### Error

Status code `404`.
