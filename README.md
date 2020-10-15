# Irongrounds Portal

## Description

Online entertainment website, where hosts user-generated games.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I can access each game without login.
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **game list** - As a user I want to see all the games available so that I can choose which ones I want to play
- **game create** - As a game owner I want to create a game so that I can make it public.
- **game detail** - As a user I want to see the game details and attendee list of one game so that I can play.  
- **game detail edit** - As a game owner I want to be able to edit the detail of the game.
- **game detail review** - As a user I want to be able to review and comment on the game.
- **author detail** - As a user I want to be able to see the details(profile, other games) of the author.
- **author detail edit** - As a game owner I want to be able to edit the details of the profile.


## Backlog

List of other features outside of the MVPs scope

Review:
- add comment
- add rate 

Search:
- Search by game title

## ROUTES:

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

- GET /games
  - renders the game list page
  - List games by genre


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

User model
 
```
username: String
password: String
timestamps: true
```


Game model

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

Review model

```
author: [ObjectId<User>]
comment: String
rate: Number

``` 

## Links

### Google Doc

[Link to kanban board](https://docs.google.com/document/d/1rL6N-UTQiaV5wIHTPQe-AgBBTvY2tGLS0AyNrI-_L_A/edit) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/SantAndresP/irongrounds-portal)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
