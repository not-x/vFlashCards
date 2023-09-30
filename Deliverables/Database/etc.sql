CREATE DATABASE vflashcards;
-- \l to list all database and confirm that it has been created
-- \c vflashcards to connect to the database

-- Create the tables:

CREATE TABLE user(
    user_id  SERIAL PRIMARY KEY,  
);

-- For card set
CREAT TYPE view  AS ENUM ('private', 'public');