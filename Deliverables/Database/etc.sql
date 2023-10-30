CREATE DATABASE vflashcards;
-- \l to list all database and confirm that it has been created
-- \c vflashcards to connect to the database
-- "\! cls" to clear screen
-- "\!" to switch to terminal


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

-- Delete ALL data from vfc_user
-- CASCADE is used due to foreign key references.
TRUNCATE TABLE vfc_user CASCADE;

-- INNER JOIN vfc_user and vflashcard_set via vfc_user_id on both tables
SELECT * FROM vfc_user INNER JOIN vflashcard_set ON vfc_user.vfc_user_id = vflashcard_set.vfc_user_id;

-- Add additional column to vflashcard_set table:
-- vfc_set_view_access
-- Column shows the view type, which can be either public or private
ALTER TABLE vflashcard_set
ADD COLUMN vfc_set_view_access view NOT NULL;

--View all public viewable flashcard sets
SELECT vfc_set_title FROM vflashcard_set WHERE vfc_set_view_access = 'public';

-- Alter vfc_set_view_access so that the default value is 'private'
ALTER TABLE vflashcard_set ALTER COLUMN vfc_set_view_access SET DEFAULT 'private';

-- Shorten vflashcard_set to vfc_set
ALTER TABLE vflashcard_set RENAME TO vfc_set;

-- Copy database within the same server (for testing purpose)
-- See the following link for detail:
-- https://www.postgresqltutorial.com/postgresql-administration/postgresql-copy-database/
CREATE DATABASE vfc_test WITH TEMPLATE vflashcards;

-- If server is in used, either closed out of existing session or
-- Query active connections:
SELECT pid, usename, client_addr FROM pg_stat_activity WHERE datname 'vflashcards';

-- Terminate active connections
SELECT pg_terminate_backend (pid) FROM pg_state_activity WHERE datname = 'vflashcards';

-- For test server - 'vfc_test'
-- Changing the datatype for vfc_id.
ALTER TABLE vflashcard ALTER COLUMN vfc_id TYPE SERIAL;

-- PROD Database - Shorten column name: vfc_set_view_access --> vfc_set_access
ALTER TABLE vfc_set RENAME COLUMN vfc_set_view_access TO vfc_set_access;

-- Shorten table name: vflashcard --> vfc
ALTER TABLE vflashcard RENAME TO vfc;