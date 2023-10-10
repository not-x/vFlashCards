CREATE DATABASE vflashcards;
-- \l to list all database and confirm that it has been created
-- \c vflashcards to connect to the database
-- \! cls to clear screen

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

-- Verify whether DB can generate uuid by issuing either of the following statements:
SELECT uuid_generate_v1();
SELECT uuid_generate_v4();

-- Create user table and relevant columns
CREATE TABLE vfc_user (
    vfc_user_id uuid DEFAULT uuid_generate_v4(),
    vfc_user_fname character varying(127),
    vfc_user_lname character varying(127) NOT NULL,
    vfc_user_email character varying(255) NOT NULL UNIQUE,
    vfc_user_password character varying(255) NOT NULL,
    PRIMARY KEY(vfc_user_id)
);

-- Create vflashcard_set table with relevant columns
CREATE TABLE vflashcard_set(
    vfc_set_id uuid DEFAULT uuid_generate_v4(),
    vfc_user_id uuid NOT NULL,
    vfc_set_title character varying(255) NOT NULL,
    PRIMARY KEY (vfc_set_id),
    CONSTRAINT fk_vfc_user_id FOREIGN KEY(vfc_user_id) REFERENCES vfc_user(vfc_user_id)
);


-- Create vflashcard table
CREATE TABLE vflashcard (
    vfc_id uuid DEFAULT uuid_generate_v4(),
    vfc_set_id uuid NOT NULL,
    vfc_question character varying(255) NOT NULL,
    vfc_answer character varying(255) NOT NULL,
    PRIMARY KEY (vfc_id),
    CONSTRAINT fk_vfc_set_id FOREIGN KEY(vfc_set_id) REFERENCES vflashcard_set(vfc_set_id)
);

-- Delete data from a single table
DELETE FROM vfc_user WHERE vfc_last_name = 'Guy';