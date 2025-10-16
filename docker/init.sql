--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* storing access control lists (ACLs) for functions, which can be important for security
-- see https://www.postgresql.org/docs/current/sql-createfunction.html for details
CREATE SCHEMA IF NOT EXISTS public;
ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_profile (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    company_name text NOT NULL,
    address text NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    postal_code character varying(20) NOT NULL,
    website character varying(255),
    logo_url text,
    banner_url text,
    industry character varying(100) NOT NULL,
    founded_date date,
    description text,
    social_links jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.company_profile OWNER TO postgres;

--
-- Name: company_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.company_profile_id_seq OWNER TO postgres;

--
-- Name: company_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_profile_id_seq OWNED BY public.company_profile.id;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50),
    email character varying(255) NOT NULL,
    password text NOT NULL,
    full_name character varying(255) NOT NULL,
    profile_photo text,
    google_uid character varying(255),
    signup_type character varying(1) DEFAULT 'e'::character varying,
    location text,
    resume text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role integer DEFAULT 3,
    dob date,
    preference integer,
    ac_status integer DEFAULT 1,
    gender character(1),
    heading character varying(200),
    is_mail_verified boolean DEFAULT false,
    is_mo_verified boolean DEFAULT false,
    first_name character varying(255),
    last_name character varying(255),
    CONSTRAINT gender_check CHECK (((gender IS NULL) OR (gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar])))),
    CONSTRAINT users_ac_status_check CHECK ((ac_status = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT users_signup_type_check CHECK (((signup_type)::text = ANY (ARRAY[('g'::character varying)::text, ('e'::character varying)::text, ('m'::character varying)::text, ('t'::character varying)::text))),
    CONSTRAINT valid_preference CHECK ((preference = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT valid_roles CHECK ((role = ANY (ARRAY[1, 2, 3])))
);

ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: company_profile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile ALTER COLUMN id SET DEFAULT nextval('public.company_profile_id_seq'::regclass);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Data for Name: company_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_profile (id, owner_id, company_name, address, city, state, country, postal_code, website, logo_url, banner_url, industry, founded_date, description, social_links, created_at, updated_at) FROM stdin;

\.

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, full_name, profile_photo, google_uid, signup_type, location, resume, created_at, updated_at, role, dob, preference, ac_status, gender, heading, is_mail_verified, is_mo_verified, first_name, last_name) FROM stdin;

\.

--
-- Name: company_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_profile_id_seq', 3, true);

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 160, true);

--
-- Name: company_profile company_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile
    ADD CONSTRAINT company_profile_pkey PRIMARY KEY (id);

--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);

--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);

--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

--
-- Name: users users_google_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_uid_key UNIQUE (google_uid);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: company_profile company_profile_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile
    ADD CONSTRAINT company_profile_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);

--
-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamp
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profile_updated_at BEFORE UPDATE ON public.company_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--
-- PostgreSQL database dump complete
--