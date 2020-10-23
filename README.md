# Irongrounds Portal

## Description

Online entertainment website, where hosts user-generated games.

## Backlog
- Implement ranking function for signed up users.

## Routes

- GET / 
  - renders the homepage
- GET /signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /signup
  - redirects to / if user logged in
  - body:
    - username
    - password
- GET /login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /logout
  - body: (empty)


- GET /games/:gameId
  - renders the game detail page
  - includes the game screen
  - play button if user want to play on new tab

- POST /profile/:id/create 
  - redirects to / if user is anonymous
  - post new game
  - body: 
    - title
    - about
    - link

- POST /profile/:id/edit 
  - redirects to / if user is anonymous
   - body: 
    - username
    - about
    - image Url


## Models

#### User model
 
```
username: String
password: String
timestamps: true
```


##### Game model

```
title: String
author: [ObjectId<User>]
views: String
date: Date
score: Number
genre: String
authorComments: String
review: [ObjectId<Review>]
``` 

##### Comment model

```
author: [ObjectId<User>]
comment: String
``` 

## Links

#### Git
[Repository](https://github.com/SantAndresP/irongrounds-portal) | [Deployment](https://irongrounds.herokuapp.com/)

#### Slides
[Slides](https://docs.google.com/presentation/d/1fQ0tC4vUQOW51UFGZZ09WzBaA8g9M1w5f-pAgGDxgcU/edit?usp=sharing)
