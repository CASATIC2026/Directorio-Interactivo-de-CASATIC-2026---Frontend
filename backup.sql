--
-- PostgreSQL database dump
--

\restrict jpYSUU88iPUs1EGygXHFIOfSdXY2m1JfD3jIdeandMvtkEcscj6xrc7O4wamsyi

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: formularios_contacto; Type: TABLE; Schema: public; Owner: casatic
--

CREATE TABLE public.formularios_contacto (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "SocioId" uuid NOT NULL,
    "Nombre" character varying(200) NOT NULL,
    "Correo" character varying(256) NOT NULL,
    "Mensaje" text NOT NULL,
    "Fecha" timestamp with time zone DEFAULT now() NOT NULL,
    "Leido" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.formularios_contacto OWNER TO casatic;

--
-- Name: logs_actividad; Type: TABLE; Schema: public; Owner: casatic
--

CREATE TABLE public.logs_actividad (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "TipoEvento" character varying(30) NOT NULL,
    "Fecha" timestamp with time zone DEFAULT now() NOT NULL,
    "Query" text,
    "SocioId" uuid,
    "UsuarioId" uuid,
    "Ip" text,
    "UserAgent" text
);


ALTER TABLE public.logs_actividad OWNER TO casatic;

--
-- Name: socios; Type: TABLE; Schema: public; Owner: casatic
--

CREATE TABLE public.socios (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "NombreEmpresa" character varying(300) NOT NULL,
    "Slug" character varying(300) NOT NULL,
    "Descripcion" text NOT NULL,
    "Especialidades" text[] NOT NULL,
    "Servicios" text[] NOT NULL,
    "RedesSociales" jsonb NOT NULL,
    "Telefono" text NOT NULL,
    "Direccion" text NOT NULL,
    "LogoUrl" text NOT NULL,
    "EmailContacto" text DEFAULT ''::text NOT NULL,
    "MapaUrl" text DEFAULT ''::text NOT NULL,
    "MarcasRepresenta" text NOT NULL,
    "EstadoFinanciero" character varying(20) NOT NULL,
    "Habilitado" boolean NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "SearchVector" tsvector GENERATED ALWAYS AS (to_tsvector('spanish'::regconfig, (((COALESCE("NombreEmpresa", ''::character varying))::text || ' '::text) || COALESCE("Descripcion", ''::text)))) STORED
);


ALTER TABLE public.socios OWNER TO casatic;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: casatic
--

CREATE TABLE public.usuarios (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "Email" character varying(256) NOT NULL,
    "PasswordHash" text NOT NULL,
    "Rol" character varying(20) NOT NULL,
    "PrimerLogin" boolean NOT NULL,
    "Activo" boolean NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "SocioId" uuid
);


ALTER TABLE public.usuarios OWNER TO casatic;

--
-- Data for Name: formularios_contacto; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.formularios_contacto ("Id", "SocioId", "Nombre", "Correo", "Mensaje", "Fecha", "Leido") FROM stdin;
\.


--
-- Data for Name: logs_actividad; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.logs_actividad ("Id", "TipoEvento", "Fecha", "Query", "SocioId", "UsuarioId", "Ip", "UserAgent") FROM stdin;
dc80126c-23a7-4d2a-bf4e-b980b70e748a	CrudSocio	2026-03-09 19:18:59.460957+00	Crear: "AFP Crecer	\N	\N	\N	\N
9ca7f265-6bb0-4b50-a071-f42c4e45549d	VisitaMicroSitio	2026-03-09 19:19:52.233688+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
31852a41-7309-4ea3-86c7-be33f80b00f9	VisitaMicroSitio	2026-03-09 19:19:52.275852+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
7c24f5f6-29aa-4d72-8001-8efc291e4dfb	CrudSocio	2026-03-09 19:25:30.194766+00	Editar: "AFP Crecer	\N	\N	\N	\N
30650008-3c67-4720-b3a6-6ad99ef54877	CrudSocio	2026-03-09 19:26:11.64948+00	Editar: "AFP Crecer	\N	\N	\N	\N
4cc0e40a-94e4-4588-95b2-bc65796920dd	CrudSocio	2026-03-09 19:26:44.61481+00	Editar: "AFP Crecer	\N	\N	\N	\N
cd2aa3d3-6414-4e44-afd3-9b7f77380cb1	CrudSocio	2026-03-09 19:27:42.053382+00	Editar: "AFP Crecer	\N	\N	\N	\N
2011059e-7c5a-4988-be70-71aac04f7cd4	VisitaMicroSitio	2026-03-09 19:27:58.526371+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
90915cab-d000-44e7-b701-ddf9d52f2e32	VisitaMicroSitio	2026-03-09 19:27:58.575142+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
707cc4f7-939e-4b81-b89b-600c697ecc7f	CrudSocio	2026-03-09 20:21:58.284393+00	Crear: Bufete Dr. F.A. Arias S.A. de C.V.	\N	\N	\N	\N
ea4db24d-d488-4382-8d55-530635de21a2	VisitaMicroSitio	2026-03-09 20:22:48.245963+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
fea05903-b0a8-4c6c-86cc-23a39e7eca3f	VisitaMicroSitio	2026-03-09 20:22:48.305446+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
d604dfe3-f2a7-48b9-b4b9-baf93d2ac4a5	CrudSocio	2026-03-09 21:11:03.293606+00	Crear: Inversiones Torres M&A, S.A. de C.V.	\N	\N	\N	\N
4481332b-408d-4e00-9a40-4667444b3df9	CrudSocio	2026-03-09 21:12:01.956647+00	Editar: Bufete Dr. F.A. Arias S.A. de C.V.	\N	\N	\N	\N
365f2c47-72d8-430a-955c-f272857097df	VisitaMicroSitio	2026-03-09 21:13:33.295371+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
c089e532-127e-4b1e-8d38-612e25435d00	VisitaMicroSitio	2026-03-09 21:13:33.332868+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
b7744671-1a2f-4a5e-8e6d-26d3a6d84480	VisitaMicroSitio	2026-03-09 21:15:50.015734+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
3bd0b09b-8668-4d5c-9945-cb93ac78523f	VisitaMicroSitio	2026-03-09 21:15:50.993274+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
82fe2fbd-1d9d-4e30-82c1-110158787652	CrudSocio	2026-03-09 21:31:30.25309+00	Crear: CREATIVA CONSULTORES, S.A. DE C.V.	\N	\N	\N	\N
e721ecb2-2b9e-4891-a254-7ef8b83f1f5d	VisitaMicroSitio	2026-03-09 21:33:10.94801+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
2b0c69da-699c-4a5f-acf0-a6edfaf610d0	VisitaMicroSitio	2026-03-09 21:33:10.99026+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
2f8a7dc2-0284-4262-b5c8-eae00313cfdb	VisitaMicroSitio	2026-03-09 21:33:26.779068+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
afd92900-6bcf-4fdf-a5dc-7220f55f5e52	VisitaMicroSitio	2026-03-09 21:33:26.833665+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
9734620b-b99d-4b19-bf55-c64ea8b4fba0	VisitaMicroSitio	2026-03-09 21:33:33.768249+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
bcbefc19-e0e7-43c2-a39d-c59ca7a7d67f	VisitaMicroSitio	2026-03-09 21:33:33.809653+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
d4c70ee7-b12d-4b61-98df-9d9c95a21dff	VisitaMicroSitio	2026-03-09 21:33:37.20458+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
6118cd38-6d9d-4b5d-b56c-07609cc43768	VisitaMicroSitio	2026-03-09 21:33:37.244081+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
99b22928-7150-483e-af4c-37a07e65d3ee	VisitaMicroSitio	2026-03-09 21:34:15.410171+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
64a340ec-90aa-423c-956f-67c47c25b554	CrudSocio	2026-03-09 21:34:49.740149+00	Editar: Creativa Consultores, S.A. DE C.V.	\N	\N	\N	\N
b2ccfc96-1a22-4ccf-9cd8-5529dfb91d82	VisitaMicroSitio	2026-03-09 21:54:21.273219+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
dd51153a-65f2-4cfa-be2b-6665e077cb35	VisitaMicroSitio	2026-03-09 21:54:21.316558+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
b055d679-30c9-42f0-b87c-17652ecf3fba	Login	2026-03-09 21:55:36.868143+00	\N	\N	0caa7725-56a9-42eb-80f3-60221f204f03	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
dbae8b7e-96fa-49fe-881e-c17b223c6b04	CrudSocio	2026-03-09 22:01:15.640405+00	Crear: EON Consultant	\N	\N	\N	\N
0c708174-93de-43ff-8f53-c561eb7a85f8	VisitaMicroSitio	2026-03-09 22:03:38.779918+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ff92dd45-8780-4da6-b735-042ce8f10696	VisitaMicroSitio	2026-03-09 22:03:38.8341+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ef0da470-010a-4c60-9def-81db88717eed	Login	2026-03-11 14:08:47.558282+00	\N	\N	0caa7725-56a9-42eb-80f3-60221f204f03	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
9ce70eb7-2220-42bb-b44a-ff0653130c3d	Login	2026-03-11 14:20:10.94165+00	\N	\N	0caa7725-56a9-42eb-80f3-60221f204f03	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
4eb80399-07b2-4c0b-952e-eab0f4cb0080	CrudSocio	2026-03-11 14:40:36.972789+00	Crear: IT CONSULTING SA DE CV	\N	\N	\N	\N
a1f7bc0b-2f01-4731-ba95-29160a729679	VisitaMicroSitio	2026-03-11 14:48:23.015114+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ae0820d8-79c2-4123-9431-bcf9d3c2f322	VisitaMicroSitio	2026-03-11 14:48:23.073994+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
0c1ed652-c9f2-467b-a7b1-1a41483b0aa5	VisitaMicroSitio	2026-03-11 14:48:34.346195+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
4915c51a-b52a-468b-b55a-c48474cbcbc8	VisitaMicroSitio	2026-03-11 14:48:34.389221+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
4d6f8ae2-317f-46dd-ac41-61965c026327	CrudSocio	2026-03-17 19:30:34.086332+00	Editar: Inversiones Torres M&A, S.A. de C.V.	\N	\N	\N	\N
d5721d67-8b19-44db-98e6-566927f9591f	VisitaMicroSitio	2026-03-11 14:50:50.78962+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
d3668c65-c321-480e-a5fe-7c26b9bfe3d2	VisitaMicroSitio	2026-03-11 14:50:50.842197+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
e230eaef-81cd-452d-8b96-e406b6c55c26	VisitaMicroSitio	2026-03-11 14:56:24.38051+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
a8d94d92-569e-4926-a6d7-eb17ff7feb7d	VisitaMicroSitio	2026-03-11 14:56:24.406832+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
8e541b39-4f7d-4d38-90e2-11588690f6f2	CrudSocio	2026-03-11 16:18:40.190089+00	Crear: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
0bff53a2-2601-4179-ac6e-9e3d0d8a87fd	CrudSocio	2026-03-11 16:19:16.200998+00	Editar: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
ec9d70e4-bc61-4b2c-9c3c-715e3f0d2052	CrudSocio	2026-03-11 16:21:59.491779+00	Editar: "AFP Crecer	\N	\N	\N	\N
1840e12a-21ee-4b7c-8d7e-7e8d5c5a6543	Login	2026-03-17 17:03:14.172688+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
520abbc8-1efc-481e-bfd4-06b7b4cc4e6b	Login	2026-03-17 17:03:50.194533+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8af24c29-9a13-4ea0-b89c-c0f4cca5344b	VisitaMicroSitio	2026-03-17 17:19:42.470947+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
496375d3-0dd5-424f-a36e-21c78607124a	VisitaMicroSitio	2026-03-17 17:19:42.544573+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
da85afac-a683-49d7-a072-fef73ce23472	VisitaMicroSitio	2026-03-17 17:20:34.90621+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
35d99cb8-a205-47cc-8425-a696e8516b1f	VisitaMicroSitio	2026-03-17 17:20:34.96506+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
db910af0-35d8-4d22-ad3e-bc946a60640c	VisitaMicroSitio	2026-03-17 17:21:16.724309+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a1d54006-00d5-4e3b-96ea-2e0ca9dbec3b	VisitaMicroSitio	2026-03-17 17:21:16.762866+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
45fb9647-9a43-4c55-961a-42e3ecda5c3b	VisitaMicroSitio	2026-03-17 17:25:51.305965+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b695955d-b0a3-4f66-9f7e-8a0aa0f98d6d	VisitaMicroSitio	2026-03-17 17:25:51.347502+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
988600de-6405-4c37-b642-49eb0f37aa46	VisitaMicroSitio	2026-03-17 17:29:14.15506+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d97d51da-1927-44d8-a497-b72af36507c4	VisitaMicroSitio	2026-03-17 17:29:14.183485+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
25464555-0111-40c8-a855-b6bd64819a05	VisitaMicroSitio	2026-03-17 17:40:18.254818+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b01f9a70-a76b-4f8c-9ca0-a3fe5857f79c	VisitaMicroSitio	2026-03-17 17:40:18.44691+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
72b274cc-b7af-450b-a97c-aa28a1339aca	VisitaMicroSitio	2026-03-17 17:40:28.168182+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f913f48e-4f25-42da-9bee-32f417e65556	VisitaMicroSitio	2026-03-17 17:40:28.277326+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b93c696d-5a31-4585-b367-74ca47330a67	VisitaMicroSitio	2026-03-17 17:41:13.876117+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
456a0790-7d95-40de-936c-a53f9e45db19	VisitaMicroSitio	2026-03-17 17:41:13.937158+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
aab346b3-cbaf-48ec-96bb-218ef08c66da	VisitaMicroSitio	2026-03-17 17:41:30.115437+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
65ca877b-03ee-440c-b48f-18c8489567bd	VisitaMicroSitio	2026-03-17 17:41:30.149522+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ccea5a9a-076e-432c-bb71-5d209c26de00	VisitaMicroSitio	2026-03-17 17:41:35.248762+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d7612336-3b38-4b92-bcef-3ae9d2bb9333	VisitaMicroSitio	2026-03-17 17:41:35.287438+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
5ddd24c9-b421-496c-afbe-6ce9979ad1c7	Login	2026-03-17 19:11:20.837374+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3aa8abfa-6937-495d-92cf-c48bffe23ce8	CrudSocio	2026-03-17 19:13:33.070804+00	Editar: AFP Crecer	\N	\N	\N	\N
ffa7c281-601d-4f7b-874f-8e990e164f77	VisitaMicroSitio	2026-03-17 19:14:01.728352+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a31ddea3-cdf3-40a8-b163-d1a551f61a34	VisitaMicroSitio	2026-03-17 19:14:01.771407+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
30989c50-48dc-45af-b9cb-549e5cca6449	CrudSocio	2026-03-17 19:24:17.642116+00	Editar: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
e8da2a0e-993a-48a1-89d8-45802b1f1f46	CrudSocio	2026-03-17 19:24:24.735062+00	Editar: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
1c702ba9-e0e4-47bf-b113-ad93210bc517	CrudSocio	2026-03-17 19:24:35.62034+00	Editar: AFP Crecer	\N	\N	\N	\N
d3be26ce-aa11-4990-a983-f2ab80f8b862	CrudSocio	2026-03-17 19:25:21.361154+00	Editar: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
cf8645dc-5171-4988-8bb9-0ebf27d6eaf9	CrudSocio	2026-03-17 19:25:52.740045+00	Editar: AFP Crecer	\N	\N	\N	\N
e5f2dc61-6270-45da-9c4b-0382f15e9383	CrudSocio	2026-03-17 19:27:11.271815+00	Editar: Bufete Dr. F.A. Arias S.A. de C.V.	\N	\N	\N	\N
8c2ff90f-c13f-4b63-8370-c4a38521187a	CrudSocio	2026-03-17 19:28:30.635488+00	Editar: Creativa Consultores, S.A. DE C.V.	\N	\N	\N	\N
8ed92aaa-cca8-4f86-9f50-d0a5d29050cf	CrudSocio	2026-03-17 19:29:51.088069+00	Editar: EON Consultant	\N	\N	\N	\N
ae1e5970-e133-4a25-8cbc-92dc2b84b80b	CrudSocio	2026-03-17 19:30:13.686902+00	Editar: IT CONSULTING SA DE CV	\N	\N	\N	\N
94edfa5c-8bac-4112-a4f3-b71d7fa9ea09	VisitaMicroSitio	2026-03-17 19:30:44.324907+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
cc6b2ca9-1a64-4faa-8105-398d3729c07c	VisitaMicroSitio	2026-03-17 19:30:44.372473+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
04a3d4a8-1321-4c8d-9484-8d87ade80162	VisitaMicroSitio	2026-03-17 19:30:50.725267+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
63735678-e14e-4aad-99c1-8afb626dc94d	VisitaMicroSitio	2026-03-17 19:30:50.767312+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
fcddc181-80b7-40cf-8f0f-5820b39a2ffe	VisitaMicroSitio	2026-03-17 19:38:37.858851+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
228dbb30-4228-42da-a452-d67249e277b3	VisitaMicroSitio	2026-03-17 19:38:37.900109+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e3025c2e-a0b1-4e39-a2f2-e01ee31464d9	VisitaMicroSitio	2026-03-17 19:38:47.4001+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
db1a5016-0e3d-4836-a204-175e28846c0d	VisitaMicroSitio	2026-03-17 19:38:47.430049+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b35d6c1e-9230-43a0-9737-b9674a5527a4	VisitaMicroSitio	2026-03-17 19:38:53.748023+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
37e2c9ca-be9c-4a34-89b6-4c9ac862e366	VisitaMicroSitio	2026-03-17 19:38:53.77668+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ee6d793a-6656-4d32-8ce7-f3bb4a71e99b	VisitaMicroSitio	2026-03-17 19:39:03.798522+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
25549572-bb07-40a7-bb59-44332503946a	VisitaMicroSitio	2026-03-17 19:39:03.835433+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
31bfb0ff-aa78-4a69-8c02-f399d70ef646	VisitaMicroSitio	2026-03-17 19:39:08.607438+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a40d14c7-0ecd-4959-856a-fa611ac22228	VisitaMicroSitio	2026-03-17 19:39:08.649388+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a0bb23d3-bac7-4da1-b3ef-b1fac921a036	VisitaMicroSitio	2026-03-17 19:39:17.245624+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
051a649b-cac0-469a-8bd4-584525218b5d	VisitaMicroSitio	2026-03-17 19:39:17.276462+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
9c43c716-4eb3-4026-9bb6-1c2de6db6c47	VisitaMicroSitio	2026-03-17 19:39:23.428227+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
29e9a43a-f4c8-40bd-a665-2296bd840c5c	VisitaMicroSitio	2026-03-17 19:39:23.473205+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b1fc8c3e-4d26-4211-8b23-20bd371efb75	VisitaMicroSitio	2026-03-17 19:39:31.214487+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3b7e986e-7aed-4d48-9634-ccaef9234c83	VisitaMicroSitio	2026-03-17 19:39:31.258532+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e033a3e1-e3e7-4310-a76d-d585bc87609d	VisitaMicroSitio	2026-03-17 19:39:42.034858+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
7f94b06f-3688-46de-9939-3479c070b1b7	VisitaMicroSitio	2026-03-17 19:39:42.07191+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d6527abb-0682-4184-ae65-6c19cc7eedf7	VisitaMicroSitio	2026-03-17 19:39:45.362276+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
c33ed553-f491-4ade-8e19-865769855a86	VisitaMicroSitio	2026-03-17 19:39:45.393994+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e253d918-5a93-4372-ae4e-02971b2a62a9	VisitaMicroSitio	2026-03-17 19:39:48.660112+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f6bc8cce-f478-4757-96f4-90c23017149a	VisitaMicroSitio	2026-03-17 19:39:48.701578+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e5ad33cf-a351-4f2f-8747-9b099245ac66	VisitaMicroSitio	2026-03-17 19:39:59.567523+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
519e47a1-f139-4f73-afb5-ac846389e2f9	VisitaMicroSitio	2026-03-17 19:39:59.606513+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
7e738f03-40e6-4ab5-8363-30b21e28f616	VisitaMicroSitio	2026-03-17 19:40:02.395231+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
aa84ca75-624a-4187-97cf-9e720c7ec78b	VisitaMicroSitio	2026-03-17 19:40:02.434425+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8b7fcfd9-a48d-4d1a-b2e2-383782b90952	VisitaMicroSitio	2026-03-17 19:40:08.753937+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
5c72b65c-2a19-4fec-a293-ed9b62dc9960	VisitaMicroSitio	2026-03-17 19:40:08.78582+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
110602d2-f0d0-42cb-aabd-e9bccaa1cd20	VisitaMicroSitio	2026-03-17 19:40:14.326457+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
bd2ab175-e917-4fc7-8921-420c98aeb93b	VisitaMicroSitio	2026-03-17 19:40:14.360875+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3b6d2100-887f-4689-a04c-cd2bbf3766ad	VisitaMicroSitio	2026-03-17 19:40:30.459154+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
0b2af9e4-44c0-444c-a22f-90e7364386d3	VisitaMicroSitio	2026-03-17 19:40:30.494479+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d08b4608-16a6-4920-8f23-da18c1d1f401	VisitaMicroSitio	2026-03-17 19:40:35.315055+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
c4fa0cbf-8c0c-4c48-991e-3140bdada7ed	VisitaMicroSitio	2026-03-17 19:40:35.345342+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
56278a98-1f6d-46d0-95f4-f21490643e53	VisitaMicroSitio	2026-03-17 19:41:10.049687+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e8c59d81-2cee-4aa8-b2db-2ea4197ef2ec	VisitaMicroSitio	2026-03-17 19:41:10.093957+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
cdcde2c3-3608-4dad-af2f-1843f012cff4	VisitaMicroSitio	2026-03-17 19:41:18.198975+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f2423ec7-0f62-495f-aa74-f13053886eb4	VisitaMicroSitio	2026-03-17 19:41:18.25239+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
2692d972-b672-4446-92ba-c55f6d1a280f	VisitaMicroSitio	2026-03-17 19:42:22.322628+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
89103f6e-b16c-4a23-b2a9-689a47abe96e	VisitaMicroSitio	2026-03-17 19:42:22.388034+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
12d77361-476d-4aa4-a07f-0f8236f2e2ec	VisitaMicroSitio	2026-03-17 19:42:32.120492+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
7944b0eb-d26a-4512-9474-3fd8224487fb	VisitaMicroSitio	2026-03-17 19:42:32.175543+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a3c3042a-9f31-4f6a-b575-0a431e41f6bd	VisitaMicroSitio	2026-03-17 19:41:45.338437+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
cb3f8707-9f85-4f56-a513-c092cd81372e	VisitaMicroSitio	2026-03-17 19:41:45.385063+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ae507086-7622-4f15-a7fd-c2d54f8cbff0	VisitaMicroSitio	2026-03-17 19:41:56.045826+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8544c416-c7ae-4afe-a7c4-9ea0efdf78fd	VisitaMicroSitio	2026-03-17 19:41:56.089663+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
facac597-cbe2-47a6-9ed8-49fc2554e7e9	VisitaMicroSitio	2026-03-17 19:42:08.954864+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
eaa0ea7d-191c-4be5-a8d6-3d7f51cf2f5d	VisitaMicroSitio	2026-03-17 19:42:08.999294+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
2f4d8163-5f3c-4d1c-a515-fd1f97b42db7	VisitaMicroSitio	2026-03-17 19:45:29.167945+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
cb43a2c5-78e2-42bd-a756-7a76a43957e9	VisitaMicroSitio	2026-03-17 19:45:29.210834+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f8a7a7d3-296e-4053-abc7-9f040dd03f6b	VisitaMicroSitio	2026-03-17 19:45:33.798503+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a66869f6-93a0-400d-a378-85f20d39322e	VisitaMicroSitio	2026-03-17 19:45:33.831381+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b90bbdb7-6862-4082-abb6-531778f6f6ea	VisitaMicroSitio	2026-03-17 19:45:37.558572+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
4433b0e7-caee-4be9-bdfc-6270c92f4641	VisitaMicroSitio	2026-03-17 19:45:37.592866+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
aa9f4f55-0e9e-48f1-9ad1-8fad1801cb2f	VisitaMicroSitio	2026-03-17 19:45:40.87231+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8425b2eb-a4d7-4505-bf90-d0558366e187	VisitaMicroSitio	2026-03-17 19:45:40.899841+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ad956d62-bae8-42e3-a330-d74d39f1c35a	VisitaMicroSitio	2026-03-17 19:45:45.148273+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
e0f4592e-cceb-4fbb-8f1a-553299a00e58	VisitaMicroSitio	2026-03-17 19:45:45.176881+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a88b725a-f499-4e8b-8354-43b0cdbc0fe0	VisitaMicroSitio	2026-03-17 19:45:52.85052+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d880884d-ad1f-4c7e-8674-2000ee78117d	VisitaMicroSitio	2026-03-17 19:45:52.881311+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a506d11f-ba1e-4647-adba-791733904832	Login	2026-03-17 19:46:10.841378+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
624c119f-26cd-49f4-8f74-a93e8ce9c38a	CrudSocio	2026-03-17 19:49:27.073386+00	Editar: IT CONSULTING SA DE CV	\N	\N	\N	\N
99ebdfe1-8895-4a58-9a14-94029e427054	VisitaMicroSitio	2026-03-17 19:50:24.651712+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
37fb018d-0497-4fc3-9955-114e3123ae63	VisitaMicroSitio	2026-03-17 19:50:24.688279+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
da067b15-b123-46f2-bcff-5a42969dcdca	VisitaMicroSitio	2026-03-17 19:50:31.87154+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
2ecda0e0-5e7c-40e6-a26f-29c7c39e5082	VisitaMicroSitio	2026-03-17 19:50:31.903133+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
476a5ddb-fbc7-48db-b351-07a532c1fd5b	VisitaMicroSitio	2026-03-17 19:50:43.010808+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
dae02556-3061-4c78-8ed5-0e68c726a6aa	VisitaMicroSitio	2026-03-17 19:50:43.085593+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8c8eeea8-9841-441f-bb1c-b9fc2fbb66de	VisitaMicroSitio	2026-03-17 19:51:31.091512+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
211dc5c7-8604-4eb3-8516-81670d994b1a	VisitaMicroSitio	2026-03-17 19:51:31.12538+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ee8785a2-8fec-419a-b599-db214f3d783f	VisitaMicroSitio	2026-03-17 19:58:55.426919+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b72e4121-008c-4610-b3cd-244ace98e278	VisitaMicroSitio	2026-03-17 19:58:55.460736+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
29363ca1-a47f-4bda-bd1b-0ab3cbad4164	VisitaMicroSitio	2026-03-17 19:59:08.818938+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
854824d4-c59f-4821-82cc-3dce411652f1	VisitaMicroSitio	2026-03-17 19:59:08.856402+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
8c516dc1-af5e-499a-83aa-f7e583dddcb3	VisitaMicroSitio	2026-03-17 19:59:14.215983+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
b4873d21-5ce4-4a25-b924-70fcfc4683a1	VisitaMicroSitio	2026-03-17 19:59:14.242828+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
1ea0edc2-becc-469d-9569-adb41aeb8104	VisitaMicroSitio	2026-03-17 19:59:20.932125+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
fc142075-0973-49bf-8e6e-e98a72edc799	VisitaMicroSitio	2026-03-17 19:59:20.973893+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3a3b77b4-1d25-4a1f-9736-2b7d8bf6402a	VisitaMicroSitio	2026-03-17 19:59:27.934612+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
27644106-78f1-4062-bc1f-f93cd927adbf	VisitaMicroSitio	2026-03-17 19:59:27.979642+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
2f79add1-2d6a-4ed9-8bbd-69e3c4cd44a5	VisitaMicroSitio	2026-03-17 19:59:33.66041+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d302655b-5d80-433a-841c-319d015e6997	VisitaMicroSitio	2026-03-17 19:59:33.687351+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
41682e1a-4a84-4398-a2ad-07f69b2d5a96	VisitaMicroSitio	2026-03-17 19:59:38.687188+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a5736c8f-95bd-4e65-8e77-e6cbb041768c	VisitaMicroSitio	2026-03-17 19:59:38.714176+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
c448cdc9-3bc6-41d0-b265-7348208b0b45	VisitaMicroSitio	2026-03-17 19:59:43.610762+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
daf4ba27-13d3-4049-bb13-4d9cfd0594ef	VisitaMicroSitio	2026-03-17 19:59:43.650067+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
45abbfa4-9748-4d23-8fa7-fbc94292593c	VisitaMicroSitio	2026-03-17 20:00:26.014891+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
24b35d89-e602-4367-9484-cb63c2655bb5	VisitaMicroSitio	2026-03-17 20:00:26.05861+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
bedb80ef-88ca-4f07-a616-cec97298ec92	VisitaMicroSitio	2026-03-17 20:00:30.57927+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
6a82f7f6-60d3-48e0-8cf8-30eae02d3d0e	VisitaMicroSitio	2026-03-17 20:00:30.614943+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3de3241b-a030-4cc8-bddc-44ac503d18c2	VisitaMicroSitio	2026-03-17 20:00:44.786026+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
9121ce29-5f61-4e43-83c1-9c1f0e47fb3d	VisitaMicroSitio	2026-03-17 20:00:44.814331+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f2ee9d4f-a45e-496d-90a6-43ae259f808a	VisitaMicroSitio	2026-03-17 20:03:51.238612+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3b32311b-85d3-4201-9229-aa194ef6d8b5	VisitaMicroSitio	2026-03-17 20:03:51.26841+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a47ad352-199a-430e-ac63-df3c7312a98c	VisitaMicroSitio	2026-03-17 20:04:15.752868+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
98eee6da-2a46-4eea-856f-8adece174fa5	VisitaMicroSitio	2026-03-17 20:04:15.785824+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
c1e4d26c-a2c6-4540-9b71-1dbaeb2ef8c7	VisitaMicroSitio	2026-03-17 20:04:19.804098+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
6e65503b-5302-4c6f-a8e9-17d3a740a75e	VisitaMicroSitio	2026-03-17 20:04:19.830048+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
326d0dac-c14b-49d2-89be-848e3b489417	VisitaMicroSitio	2026-03-17 20:15:52.17681+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
43f92e47-30c3-43d7-a823-9388c84e0cb4	VisitaMicroSitio	2026-03-17 20:15:52.203246+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
3636e04f-52c2-4e9b-9438-0dc062a0b1c3	VisitaMicroSitio	2026-03-17 20:16:11.096893+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
79e6c722-ff75-4661-b16b-39f1848fc938	VisitaMicroSitio	2026-03-17 20:16:11.13163+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
5bbddcf8-625c-49f7-a0e2-d8a12475410f	VisitaMicroSitio	2026-03-17 20:16:15.699463+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
fd9cb2a5-baf5-4836-8728-eb81029e4a78	VisitaMicroSitio	2026-03-17 20:16:15.736206+00	\N	74a51d9d-944d-4bca-9038-ccfb440b13bb	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
5fa0dd8e-1f7e-4244-8493-de4b8fddfc24	VisitaMicroSitio	2026-03-17 20:16:19.00967+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
527d10e4-c8be-453f-adef-1c630858e365	VisitaMicroSitio	2026-03-17 20:16:19.040198+00	\N	da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
55c6da15-6bb9-430a-a9a2-8cf7d4448fef	VisitaMicroSitio	2026-03-17 20:16:21.765793+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
0b9a1def-c709-4b5a-806c-41a973cc450e	VisitaMicroSitio	2026-03-17 20:16:21.79729+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
1ab4fcca-64b6-4542-8bfe-79d0b10dd498	VisitaMicroSitio	2026-03-17 20:16:27.235048+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
f3074da1-9326-407f-8b98-82f578fda1af	VisitaMicroSitio	2026-03-17 20:16:27.263267+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
a9902cfd-797f-414e-8488-07a82a485b0a	VisitaMicroSitio	2026-03-17 20:16:33.799485+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
94f98f2d-4424-46ee-89eb-65ee322200b3	VisitaMicroSitio	2026-03-17 20:16:33.824322+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
7b253335-56de-45fa-adb6-3245ab2f1410	VisitaMicroSitio	2026-03-17 20:18:53.527392+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
649424ba-3710-4f75-a05d-368fa018b89f	VisitaMicroSitio	2026-03-17 20:18:53.567209+00	\N	93cbb414-0255-4acf-ab47-cb2d34c528d9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
939a83e4-094a-47d0-bf09-3c0985f882be	Login	2026-03-17 20:19:27.142512+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
502edade-d708-4ade-bea7-952fcd91b109	VisitaMicroSitio	2026-03-17 20:16:49.765022+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
7f32b70b-81d2-490f-ad4b-b2500b54f817	VisitaMicroSitio	2026-03-17 20:16:49.790143+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
d7c80221-68ec-4536-b866-c1338eeffafd	VisitaMicroSitio	2026-03-17 20:20:46.83399+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
01573faf-32a1-4f6e-9346-c9e2bda82456	VisitaMicroSitio	2026-03-17 20:20:46.863427+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
12359cab-efa5-4c13-ba61-106c72f419a4	VisitaMicroSitio	2026-03-17 20:20:50.21346+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
9c55db24-2d0f-4145-91a8-3c860b3814f3	VisitaMicroSitio	2026-03-17 20:20:50.250037+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
86296af2-4692-4893-a8e0-4882fcf7e9a5	VisitaMicroSitio	2026-03-17 20:20:53.026319+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
294b2faa-337f-4fb7-ab0b-33bed52d8643	VisitaMicroSitio	2026-03-17 20:20:53.057099+00	\N	8a30ff65-8480-47d0-978d-908eb4c7c0df	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
ab117384-ae3f-483a-a349-3e880c99d9ba	VisitaMicroSitio	2026-03-17 20:20:55.842569+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
6ecca3b3-9890-4b5e-85e4-a1dd89659012	VisitaMicroSitio	2026-03-17 20:20:55.873106+00	\N	2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
75981e08-292d-449c-9dea-c3e53c2f98d9	Login	2026-03-17 20:35:29.390059+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
199cfa1f-4f1b-4e00-9f37-0b294bc912bf	Login	2026-03-17 20:38:25.484445+00	\N	\N	2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0
\.


--
-- Data for Name: socios; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.socios ("Id", "NombreEmpresa", "Slug", "Descripcion", "Especialidades", "Servicios", "RedesSociales", "Telefono", "Direccion", "LogoUrl", "EmailContacto", "MapaUrl", "MarcasRepresenta", "EstadoFinanciero", "Habilitado", "CreatedAt", "UpdatedAt") FROM stdin;
da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	Bufete Dr. F.A. Arias S.A. de C.V.	arias-law,	Arias es una firma legal única en la región. Opera como una sola entidad regional y no como una afiliación de firmas legales. Arias cuenta con siete oficinas que se extienden en los seis países de Centroamérica: Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica y Panamá.	{"Derecho corporativo y comercial","Banca y finanzas","Fusiones y adquisiciones","Litigios y arbitraje","Derecho laboral","Derecho migratorio","Propiedad intelectual","Derecho tributario"}	{"Asesoría legal corporativa","Servicios de abogados y notarios","Consultoría legal para empresas","Representación en litigios","Asesoría laboral y migratoria","Planificación fiscal y tributaria","Registro y protección de propiedad intelectual","Asesoría en inversiones y negocios"}	{"twitter": "https://twitter.com/ariaslaw", "website": "https://www.ariaslaw.com", "facebook": "https://www.facebook.com/ariaslaw", "linkedin": "https://www.linkedin.com/company/arias-law", "instagram": "https://www.instagram.com/ariaslaw"}	+503 2257-0900	     San Salvador, El Salvador.	https://ariaslaw.com/_nuxt/img/log-arias-red.cafbdab.png		https://www.google.com/maps?q=San+Salvador,+El+Salvador&output=embed		AlDia	t	2026-03-09 20:21:58.157421+00	2026-03-17 19:27:11.268979+00
ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	EON Consultant	eon-consultant	Cualquiera puede crear un sitio web o gestionar cuentas en redes sociales, recibir el pago y pasar al siguiente cliente. Menos del 3% de los llamados expertos pueden hacer eso mientras entienden tu negocio y obtienen resultados medibles. Por eso trabajamos usando los avances tecnol+?gicos y la la psicolog+?a humana para que los complejos procesos de crear, mantener o expandir tu negocio en l+?nea se traduzcan en pasos simples que tu empresa pueda seguir.	{"\\"Business Development\\"","\\"Marketing Digital\\"","\\"SEO\\"","\\"SEM\\"","\\"Branding\\"","\\"Desarrollo Web\\""}	{"\\"Consultoró?a empresarial\\"","\\"Desarrollo web\\"","\\"Gestió?n de redes sociales\\"","\\"Publicidad digital\\"","\\"Estrategia de marketing\\"","\\"Contenido digital\\""}	{"website": "https://eonconsultant.com", "facebook": "https://www.facebook.com/eonconsultant", "linkedin": "https://www.linkedin.com/company/eon-consultant", "instagram": "https://www.instagram.com/eonconsultant"}	+506 2226-6550	Sector Los Sauces, San Jos+?, Provincia de San Jos+?, Costa Rica	https://eonconsultant.com/wp-content/uploads/2023/12/EON_1080X1080_Blue-150x150.png		https://www.google.com/maps?q=Sector+Los+Sauces,+San+José,+Costa+Rica&output=embed		AlDia	t	2026-03-09 22:01:15.606427+00	2026-03-17 19:29:51.079943+00
2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	Inversiones Torres M&A, S.A. de C.V.	torres-legal	Más allá de ser una firma legal, son una firma de negocios que reúne la práctica de un despacho tradicional junto con las necesidades de innovación y tecnología actuales. Fundada en el año 2009 por abogados con experiencia de más de 30 años de ejercicio y abogados jóvenes altamente capacitados en materia legal y empresarial tanto en El Salvador como en el extranjero, lo que la convierte en una firma sólida para ser sus mejores aliados legales.	{"\\"Derecho Corporativo\\"","\\"Derecho Laboral\\"","\\"Derecho Migratorio\\"","\\"Derecho Tributario\\"","\\"FinTech\\"","\\"InsurTech\\"","\\"Neobanking\\"","\\"Asesoró?a Empresarial\\""}	{"\\"Consultoró?a legal\\"","\\"Asesoró?a corporativa\\"","\\"Asesoró?a fiscal y tributaria\\"","\\"Servicios notariales\\"","\\"Constitució?n de empresas\\"","\\"Consultoró?a financiera\\"","\\"Cumplimiento regulatorio\\"","\\"Asesoró?a en innovació?n y tecnologó?a\\""}	{"website": "https://www.torres.legal", "youtube": "https://www.youtube.com/@torreslegal", "facebook": "https://www.facebook.com/torreslegal", "linkedin": "https://sv.linkedin.com/company/torres-legal", "instagram": "https://www.instagram.com/torres_legal"}	+503 2538-6300"	Calle Cuscatl+?n #4312, Colonia Escal+?n	https://i0.wp.com/torres.legal/wp-content/uploads/2022/06/logo.edada7e0.png?fit=275%2C90&ssl=1		https://www.google.com/maps?q=San+Salvador,+El+Salvador+Torres+M%26A&output=embed		AlDia	t	2026-03-09 21:11:03.227991+00	2026-03-17 19:30:34.080867+00
e5758755-51e6-4dbf-9adf-356f7222b3f3	IT CONSULTING SA DE CV	it-consulting	IT Consulting es una empresa chilena con oficinas en San Salvador, Santiago y Panamá que se caracteriza por asesorar y entrenar a sus clientes en estrategias corporativas de tecnologías de la información, rediseño de procesos e innovación, y su integración con el negocio, brindando soluciones creativas a problemas críticos en las compañías globales de hoy.	{"Consultoría en tecnología","Estrategia de TI","Innovación empresarial","Rediseño de procesos","Seguridad de la información","Servicios de datacenter"}	{"Consultoría tecnológica","Estrategias de TI","Implementación de soluciones tecnológicas","Gestión de infraestructura tecnológica","Capacitación en tecnología","Optimización de procesos empresariales"}	{"twitter": "https://x.com/itconsultingsv", "website": "https://itconsultinglatam.com", "facebook": "https://www.facebook.com/itconsultinglatam", "linkedin": "https://linkedin.com/company/it-consulting-s-a-de-c-v-"}	2524-5893	Edificio Insigne Oficina 602, Avenida Las Magnolias #206, Colonia San Benito, San Salvador, El Salvador.	https://www.casatic.org/gallery/Socios/694fb3c1-0127-4d7f-884d-dd066289fae7.png		https://www.google.com/maps?q=San+Salvador,+El+Salvador+IT+Consulting&output=embed		AlDia	t	2026-03-11 14:40:36.852546+00	2026-03-17 19:49:27.068898+00
74a51d9d-944d-4bca-9038-ccfb440b13bb	AFP Crecer	afp-crecer	Es la AFP que administra ética y eficientemente el ahorro previsional de sus afiliados. Sus compromisos son: garantizar el mejor servicio al otorgar prestaciones de invalidez, vejez y sobrevivencia; cuidar el rendimiento de sus accionistas y trabajar con responsabilidad social.	{"Administración de fondos de pensiones","Gestión de ahorro previsional","Inversiones de fondos de pensión","Asesoría previsional","Educación financiera"}	{"Afiliación al sistema de pensiones","Gestión de cuentas individuales","Consulta de saldo y estado de cuenta","Trámite de pensión por vejez","Trámite de pensión por invalidez","Trámite de pensión por sobrevivencia","Asesoría para planificación de retiro","Atención y soporte al afiliado."}	{"youtube": "https://www.youtube.com/@afpcrecer", "facebook": "https://www.facebook.com/afpcrecer", "linkedin": "https://www.linkedin.com/company/afp-crecer", "instagram": "https://www.instagram.com/afpcrecer"}	 2211-9363	Alameda Manuel Enrique Araujo 1100, San Salvador CP 1101	\thttps://www.crecer.com.sv/web/wp-content/uploads/2025/09/logo_azul_descriptores.png		https://www.google.com/maps?q=Alameda+Manuel+Enrique+Araujo+1100,+San+Salvador&output=embed		AlDia	t	2026-03-09 19:18:59.410929+00	2026-03-17 19:25:52.733453+00
93cbb414-0255-4acf-ab47-cb2d34c528d9	2IT Jobs S.A. de C.V.	2it-jobs	2IT Jobs es un punto de encuentro entre profesionales en el área de IT y empresarios en busca de talento especializado. Es por esto que nuestra plataforma reúne a todas las personas del mundo de IT en un solo lugar donde podrán tener acceso a oportunidades de empleo, cursos formativos y foros de su área de interés.	{"Reclutamiento IT","Headhunting tecnológico","Outsourcing de talento","Staffing tecnológico","Comunidad profesional IT"}	{"Reclutamiento de personal tecnológico","Outsourcing de talento IT","Headhunting especializado","Publicación de ofertas laborales","Conexión entre empresas y profesionales IT"}	{"website": "https://www.2itjobs.com", "facebook": "https://www.facebook.com/2itjobs", "linkedin": "https://www.linkedin.com/company/2it-jobs", "instagram": "https://www.instagram.com/2itjobs"}	+503 2264-8442	9na Calle Poniente y 89 Avenida Norte #4615, Colonia Escal+?n, San Salvador, El Salvador	https://www.casatic.org/gallery/Socios/55070f0a-00ab-4a47-b942-8f1c0f57c819.png		https://www.google.com/maps?q=9na+Calle+Poniente+y+89+Avenida+Norte+4615,+Colonia+Escalón,+San+Salvador&output=embed		AlDia	t	2026-03-11 16:18:40.147464+00	2026-03-17 19:25:21.355988+00
8a30ff65-8480-47d0-978d-908eb4c7c0df	Creativa Consultores, S.A. DE C.V.	creativa-consultores	Se dedica a la prestación de servicios de consultoría en las diferentes Tecnologías de Información. Son partners de ORACLE (gold partners), MicroStrategy, Microsoft y HASTQB. Cuentan con más de 75 consultores certificados y capacitados en tecnologías como ORACLE, AS/400, Microsoft, Java, tecnologías móviles, JavaScript y aseguramiento de calidad.	{"Consultoría empresarial","Desarrollo tecnológico","Transformación digital","Gestión de proyectos","Investigación ambiental","Innovación empresarial"}	{"Consultoría estratégica","Desarrollo de software","Capacitación profesional","Investigación y desarrollo","Formulación de proyectos","Control y aseguramiento de calidad","Marketing estratégico"}	{"twitter": "https://twitter.com/creativa_sv", "website": "http://www.creativaconsultores.com", "youtube": "https://www.youtube.com/@creativaconsultores", "facebook": "https://www.facebook.com/creativaconsultores", "linkedin": "https://www.linkedin.com/company/creativa-consultores", "instagram": "https://www.instagram.com/creativaconsultores"}	503 2202-7500	Colonia San Francisco, Avenida Las Camelias #12,San Salvador, El Salvador.	https://www.casatic.org/gallery/Socios/b47ac525-c90b-4bab-8e07-409ce8c2279d.png		https://www.google.com/maps?q=Colonia+San+Francisco,+Avenida+Las+Camelias+12,+San+Salvador,+El+Salvador&output=embed	"MicroStrategy",     "HASTQB",     "ISTQB",     "Microsoft",     "Salesforce",     "Odoo"	AlDia	t	2026-03-09 21:31:30.213823+00	2026-03-17 19:28:30.632541+00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.usuarios ("Id", "Email", "PasswordHash", "Rol", "PrimerLogin", "Activo", "CreatedAt", "SocioId") FROM stdin;
2c9eee2e-01f8-4ed3-8a48-0fbf2307b0c4	admin@casatic.org	$2a$11$VuegmGToIxDfCbEh8yqESuVCbCCGL380rTCHLIceG5ftctkjRHM8S	Admin	f	t	2026-03-17 16:37:10.12843+00	\N
\.


--
-- Name: formularios_contacto PK_formularios_contacto; Type: CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.formularios_contacto
    ADD CONSTRAINT "PK_formularios_contacto" PRIMARY KEY ("Id");


--
-- Name: logs_actividad PK_logs_actividad; Type: CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.logs_actividad
    ADD CONSTRAINT "PK_logs_actividad" PRIMARY KEY ("Id");


--
-- Name: socios PK_socios; Type: CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.socios
    ADD CONSTRAINT "PK_socios" PRIMARY KEY ("Id");


--
-- Name: usuarios PK_usuarios; Type: CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_usuarios" PRIMARY KEY ("Id");


--
-- Name: IX_formularios_contacto_SocioId; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_formularios_contacto_SocioId" ON public.formularios_contacto USING btree ("SocioId");


--
-- Name: IX_logs_actividad_Fecha; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_logs_actividad_Fecha" ON public.logs_actividad USING btree ("Fecha");


--
-- Name: IX_logs_actividad_SocioId; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_logs_actividad_SocioId" ON public.logs_actividad USING btree ("SocioId");


--
-- Name: IX_logs_actividad_TipoEvento; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_logs_actividad_TipoEvento" ON public.logs_actividad USING btree ("TipoEvento");


--
-- Name: IX_socios_SearchVector; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_socios_SearchVector" ON public.socios USING gin ("SearchVector");


--
-- Name: IX_socios_Slug; Type: INDEX; Schema: public; Owner: casatic
--

CREATE UNIQUE INDEX "IX_socios_Slug" ON public.socios USING btree ("Slug");


--
-- Name: IX_usuarios_Email; Type: INDEX; Schema: public; Owner: casatic
--

CREATE UNIQUE INDEX "IX_usuarios_Email" ON public.usuarios USING btree ("Email");


--
-- Name: IX_usuarios_SocioId; Type: INDEX; Schema: public; Owner: casatic
--

CREATE INDEX "IX_usuarios_SocioId" ON public.usuarios USING btree ("SocioId");


--
-- Name: formularios_contacto FK_formularios_contacto_socios_SocioId; Type: FK CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.formularios_contacto
    ADD CONSTRAINT "FK_formularios_contacto_socios_SocioId" FOREIGN KEY ("SocioId") REFERENCES public.socios("Id") ON DELETE CASCADE;


--
-- Name: logs_actividad FK_logs_actividad_socios_SocioId; Type: FK CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.logs_actividad
    ADD CONSTRAINT "FK_logs_actividad_socios_SocioId" FOREIGN KEY ("SocioId") REFERENCES public.socios("Id") ON DELETE SET NULL;


--
-- Name: usuarios FK_usuarios_socios_SocioId; Type: FK CONSTRAINT; Schema: public; Owner: casatic
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_usuarios_socios_SocioId" FOREIGN KEY ("SocioId") REFERENCES public.socios("Id");


--
-- PostgreSQL database dump complete
--

\unrestrict jpYSUU88iPUs1EGygXHFIOfSdXY2m1JfD3jIdeandMvtkEcscj6xrc7O4wamsyi

