# Software Practical Empirical Evidence Database (SPEED)
ENSE701: Contemporary Issues in Software Engineering Assignmnet 1B

Hello and Welcome to group W202-8 repository. This project has been developed for Auckland University of Technology (AUT), for ENSE701: CISE.

### W202-8 Group members:
- Alloysius Manlutac 
- Caleb S
- Edward Voung
- Sukhdev Sukh

## Overview
SPEED is a peer-reviewed database of software engineering articles. The community will be able to forward submissions which will be reviewed by a team of moderators and analysts to determine if the claims are supported by academic evidence before publication.

## Features
- User-Friendly Interface: Easy accessible platform for browsing, submitting, and searching articles.
- Article Submission form: A easy process for users to submit new articles, including necessary fields like DOI, Author, Title, and more.
- Advanced Search/Filter: Users can filter results by title, author, keywords, publication date. Users can also search by SE empirical categories.
- Role-based Control: Users, Moderators and  Researchers/Analysts
- Notifications System: Email notifications for users when: Their submitted articles are reviewed and have been accepted or Rejected. Moderator and Analysts gets email notifications when any articles are in queue and ready for review.
- Article Rating and Feedback: Users can rate articles.

## Setup
#### Ensure you have the following installed:
- Node.js
- Node package manager (NPM)

#### Clone Repository
``` git clone https://github.com/AlloysiusM/SPEED-W202_08.git```

#### Install Dependencies
Once the project has been set up and the repo has been cloned, you need to install the following dependencies:

```
   cd frontend
   npm install
```
```
   cd backend
   npm install
```
npm install
Run the Application (In development mode)
Frontend: In one terminal Window:
'''

#### Run Application in Terminal
```
   cd frontend
   npm run dev
```
```
   cd backend
   npm run start
```
#### Access the Website
To access the frontend application navigate to ```http://localhost:3000``` 

To access the backend navigate to ```http://localhost:8082``` 

Note: 
Database and emailing features will not be functioning, as private API keys will not be supplied. To access these functionalities you will to create a Mongo DB account and create a database cluster, linking this database to an .env in the backend.


## Licence
This project and its contents are the intellectual property of the project team and are intended exclusively for educational purposes. Reproduction, copying, or distribution without the authors' prior permission is prohibited.
