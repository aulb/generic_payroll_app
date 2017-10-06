# Why I'm proud of this implementation/what I did well
I'm proud because I get to learn and practice my skills. I get to learn what I can do, what I need to work on, and what I can improve. As a sidenote, I'm in NYC right now attending Recurse Center, a free retreat where I can work on becoming a better software engineer and just getting this challenge done (in a timely manner) is directly contributing to the cause.

In the end this app boils down to:
*Django* - RESTful API backend to interact with 
*React* - Interactive UI frontend

I'm also proud to dive a little bit into Django even though it was overkill, I could've used and also had completely forgotten about its mini sized alternative, Flask. Also continuing to work with React as it helps me better my mental model and design.

There are two bundles. One for the backend and one for the frontend. There is a gif demo under `demo.gif`.

# How to run, dependencies
## Backend 
- python 3.6
- pip 9.0.1
- django 11.9.0
- django-rest-framework 3.6.4

To run the server...
`cd payroll_backend`
`python manage.py runserver`

The sample sqlite is commited along with this app, so there are some initial data. However for job group specifically, I've created a fixtures file that is meant to be run initially if the sqlite is empty (we'll talk about this later!).

## Frontend
- node v8.6.0
- npm 5.4.2

To run the frontend...
`npm install`
`npm start`
Go to localhost:3000 and interact

# Design Decisions
Please read the TLDREADME.md, its on the same folder as README.md.

# How does it work?
I attach a gif on how things work (demo.gif)
1) Select file
2) Payroll information will be displayed
3) Press upload
4) If selected file has the same report id as one previously submitted, error
5) Otherwise successful upload
6) Refresh page or select another file
