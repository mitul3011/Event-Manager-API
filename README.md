# Event-Manager-API

This API is created using `Node.JS` and `MongoDB` is used as database.

It is an Event Manager API and it contains following requests,
* Create Event
* Get Events
* Update Event
* Delete Event

## 1. Create Event
Request Type: `POST`
Request URL to create event: 
```
localhost:3000/api/v3/app/events
```
Payload as `form-data`:

```
name
image
tagline
schedule (Date and Time for Event to be scheduled)
description
moderator
category
sub_category
rigor_rank
icon for event
```
when this request along with payload is send to server then it will send `EventID` of event with `HTTP status code 200` as response if there is no error like shown below
  
![Create Event request in postman]

If there is some error related to imaage then server will send error message with `HTTP status code 400` otherwise for common or server-side errors it will send `HTTP status code 404` be shown as belolw

![Create Event request error]

## 2. Update Event
Request Type: `PUT`
Request URL to update an existing event: 
```
localhost:3000/api/v3/app/events/idOfEvent
```
Payload as `form-data`:

```
name
image
tagline
schedule (Date and Time for Event to be scheduled)
description
moderator
category
sub_category
rigor_rank
icon for event
```
when this request along with payload is send to server then it will send `HTTP status code 200` as response if there is no error like shown below

![Update Event request in postman]

If there is some error related to imaage then server will send error message with `HTTP status code 400` otherwise for common or server-side errors it will send `HTTP status code 404` be shown as belolw

![Update Event request error]

**Note: Images are stored in `base64` format using [multer](https://www.npmjs.com/package/multer) library and images for event cover will be cropped to size 500x500px and images for event icon will be cropped to size 250x250px and all uploaded images will be converted to .png format using [sharp](https://www.npmjs.com/package/sharp) library.**


## 3. Get Event
Request Type: `GET`

**A. Request URL to read event by `EventID`:**
```
localhost:3000/api/v3/app/events?id=idOfEvent
```
when this request is send to server then it will send event with `HTTP status code 200` as response if there exist event like shown below

![Get Event by ID request in postman]

If there doest not exist event on provided `EventID` then server will send error message with `HTTP status code 404` be shown as belolw

![Get Event ID request error]

**B. Request URL to read events by it's recency and with pagination:**
```
localhost:3000/api/v3/app/events?type=latest&limit=1&skip=3
```
when this request is send to server then it will send events as per values given to type, limit, skip query with `HTTP status code 200` as response if there exist event like shown below

![Get Events request in postman]

## 4. Delete Event
Request Type: `DELETE`
Request URL to create event: 
```
localhost:3000/api/v3/app/events/idOfEvent
```
when this request is send to server then it will send `HTTP status code 200` as response if there exist event like shown below

![Delete Event by ID request in postman]

If there doest not exist event on provided `EventID` then server will send error message with `HTTP status code 404` be shown as belolw

![Delete Event by ID request error]
