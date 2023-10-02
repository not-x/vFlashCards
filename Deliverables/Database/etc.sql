CREATE DATABASE vflashcards;
-- \l to list all database and confirm that it has been created
-- \c vflashcards to connect to the database

-- Create the tables:

CREATE TABLE user(
    user_id  SERIAL PRIMARY KEY,  
);

-- For card set
CREATE TYPE view  AS ENUM ('private', 'public');

-- To view existing enum types:
select n.nspname as enum_schema,  
       t.typname as enum_name,  
       e.enumlabel as enum_value
from pg_type t 
   join pg_enum e on t.oid = e.enumtypid  
   join pg_catalog.pg_namespace n ON n.oid = t.typnamespace;



-- Drop previous tables created with double quotes
DROP TABLE "USER", "VFLASHCARD", "VFLASHCARD_SET";

-- Install uuid module so that it can be used to generate primary key
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Can verify whether DB can generate uuid by issuing either of the following statements:
SELECT uuid_generate_v1();
SELECT uuid_generate_v4();

-- Create user table and relevant columns
CREATE TABLE user(
    user_id uuid DEFAULT uuid_generate_v4();
    user_fname character varying(127),
    user_lname character varying(127),
    user_email character varying(255) NOT NULL UNIQUE,
    user_password character varying(255), NOT NULL
    PRIMARY KEY(user_id)
);

-- Create vflashcard_set table with relevant columns
CREATE TABLE vflashcard_set(

)