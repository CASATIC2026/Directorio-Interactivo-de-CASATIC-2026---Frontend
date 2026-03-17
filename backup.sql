--
-- PostgreSQL database dump
--

\restrict ButJdSwl9FiOtvNjz1lB5ECDilbTGMjgoH0s9Ing1cGBLSEuRhrADyyNETuTmBa

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
    "Fecha" timestamp with time zone DEFAULT now() NOT NULL
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
    "EmailContacto" text DEFAULT '' NOT NULL,
    "MapaUrl" text DEFAULT '' NOT NULL,
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

COPY public.formularios_contacto ("Id", "SocioId", "Nombre", "Correo", "Mensaje", "Fecha") FROM stdin;
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
d5721d67-8b19-44db-98e6-566927f9591f	VisitaMicroSitio	2026-03-11 14:50:50.78962+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
d3668c65-c321-480e-a5fe-7c26b9bfe3d2	VisitaMicroSitio	2026-03-11 14:50:50.842197+00	\N	e5758755-51e6-4dbf-9adf-356f7222b3f3	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
e230eaef-81cd-452d-8b96-e406b6c55c26	VisitaMicroSitio	2026-03-11 14:56:24.38051+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
a8d94d92-569e-4926-a6d7-eb17ff7feb7d	VisitaMicroSitio	2026-03-11 14:56:24.406832+00	\N	ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	\N	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
8e541b39-4f7d-4d38-90e2-11588690f6f2	CrudSocio	2026-03-11 16:18:40.190089+00	Crear: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
0bff53a2-2601-4179-ac6e-9e3d0d8a87fd	CrudSocio	2026-03-11 16:19:16.200998+00	Editar: 2IT Jobs S.A. de C.V.	\N	\N	\N	\N
ec9d70e4-bc61-4b2c-9c3c-715e3f0d2052	CrudSocio	2026-03-11 16:21:59.491779+00	Editar: "AFP Crecer	\N	\N	\N	\N
\.


--
-- Data for Name: socios; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.socios ("Id", "NombreEmpresa", "Slug", "Descripcion", "Especialidades", "Servicios", "RedesSociales", "Telefono", "Direccion", "LogoUrl", "EmailContacto", "MapaUrl", "MarcasRepresenta", "EstadoFinanciero", "Habilitado", "CreatedAt", "UpdatedAt") FROM stdin;
2d78c51a-52bd-4aac-add1-e6f6b84d3b9e	Inversiones Torres M&A, S.A. de C.V.	torres-legal	Mas all+� de ser una firma legal, son una firma de negocios que re+�ne la pr+�ctica de un despacho tradicional junto con las necesidades de innovaci+�n y tecnolog+�a actuales. Fundada en el a+�o 2009 por abogados con experiencia de m+�s de 30 a+�os de ejercicio y abogados j+�venes y altamente capacitados en materia legal y empresarial tanto en El Salvador como en el extranjero, lo que nos convierte en una firma s+�lida para ser sus mejores aliados legales.	{"\\"Derecho Corporativo\\"","\\"Derecho Laboral\\"","\\"Derecho Migratorio\\"","\\"Derecho Tributario\\"","\\"FinTech\\"","\\"InsurTech\\"","\\"Neobanking\\"","\\"Asesor+�a Empresarial\\""}	{"\\"Consultor+�a legal\\"","\\"Asesor+�a corporativa\\"","\\"Asesor+�a fiscal y tributaria\\"","\\"Servicios notariales\\"","\\"Constituci+�n de empresas\\"","\\"Consultor+�a financiera\\"","\\"Cumplimiento regulatorio\\"","\\"Asesor+�a en innovaci+�n y tecnolog+�a\\""}	{"website": "https://www.torres.legal", "youtube": "https://www.youtube.com/@torreslegal", "facebook": "https://www.facebook.com/torreslegal", "linkedin": "https://sv.linkedin.com/company/torres-legal", "instagram": "https://www.instagram.com/torres_legal"}	+503 2538-6300"	Calle Cuscatl+�n #4312, Colonia Escal+�n	https://i0.wp.com/torres.legal/wp-content/uploads/2022/06/logo.edada7e0.png?fit=275%2C90&ssl=1				AlDia	t	2026-03-09 21:11:03.227991+00	2026-03-09 21:11:03.227991+00
74a51d9d-944d-4bca-9038-ccfb440b13bb	"AFP Crecer	afp-crecer	Es la AFP que administra +�tica y eficientemente el ahorro previsional de sus afiliados. Sus compromisos son: Garantizar el mejor servicio al otorgar las prestaciones de Invalidez, Vejez y Sobrevivencia a nuestros clientes; cuidar el rendimiento de nuestros accionistas trabajando siempre con entusiasmo y responsabilidad social en la comunidad.	{"Administraci+�n de fondos de pensiones","Gesti+�n de ahorro previsional","Inversiones de fondos de pensi+�n","Asesor+�a previsional","Educaci+�n financiera"}	{"Afiliaci+�n al sistema de pensiones","Gesti+�n de cuentas individuales","Consulta de saldo y estado de cuenta","Tr+�mite de pensi+�n por vejez","Tr+�mite de pensi+�n por invalidez","Tr+�mite de pensi+�n por sobrevivencia","Asesor+�a para planificaci+�n de retiro","Atenci+�n y soporte al afiliado."}	{"youtube": "https://www.youtube.com/@afpcrecer", "facebook": "https://www.facebook.com/afpcrecer", "linkedin": "https://www.linkedin.com/company/afp-crecer", "instagram": "https://www.instagram.com/afpcrecer"}	 2211-9363	Alameda Manuel Enrique Araujo 1100, San Salvador CP 1101	\thttps://www.crecer.com.sv/web/wp-content/uploads/2025/09/logo_azul_descriptores.png				AlDia	t	2026-03-09 19:18:59.410929+00	2026-03-11 16:21:59.482295+00
da98df6e-fd7d-44b1-9ac5-7aed9f83d0af	Bufete Dr. F.A. Arias S.A. de C.V.	arias-law,	Arias es una firma legal +�nica en la regi+�n. Opera como una sola entidad regional y no como una afiliaci+�n de firmas legales. Arias cuenta con siete oficinas que se extienden en los seis pa+�ses de Centroam+�rica: Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica y Panam+�.	{"\\"Derecho corporativo y comercial\\"","\\"Banca y finanzas\\"","\\"Fusiones y adquisiciones\\"","\\"Litigios y arbitraje\\"","\\"Derecho laboral\\"","\\"Derecho migratorio\\"","\\"Propiedad intelectual\\"","\\"Derecho tributario\\""}	{"\\"Asesor+�a legal corporativa\\"","\\"Servicios de abogados y notarios\\"","\\"Consultor+�a legal para empresas\\"","\\"Representaci+�n en litigios\\"","\\"Asesor+�a laboral y migratoria\\"","\\"Planificaci+�n fiscal y tributaria\\"","\\"Registro y protecci+�n de propiedad intelectual\\"","\\"Asesor+�a en inversiones y negocios\\""}	{"twitter": "https://twitter.com/ariaslaw", "website": "https://www.ariaslaw.com", "youtube": null, "facebook": "https://www.facebook.com/ariaslaw", "linkedin": "https://www.linkedin.com/company/arias-law", "instagram": "https://www.instagram.com/ariaslaw"}	+503 2257-0900	     San Salvador, El Salvador.	https://ariaslaw.com/_nuxt/img/log-arias-red.cafbdab.png				AlDia	t	2026-03-09 20:21:58.157421+00	2026-03-09 21:12:01.932871+00
8a30ff65-8480-47d0-978d-908eb4c7c0df	Creativa Consultores, S.A. DE C.V.	creativa-consultores	Se dedica a la prestaci+�n de servicios de consultor+�a en las diferentes Tecnolog+�as de Informaci+�n. Son partners de ORACLE (gold partners), MicroStrategy, Microsoft, HASTQB. Cuentan con m+�s de 75 consultores certificados y capacitads en tecnolog+�as como ORACLE, AS/400, Microsoft, Java, Tecnolog+�as m+�viles, JavaScript y aseguramiento de calidad.	{"\\"Consultor+�a empresarial\\"","\\"Desarrollo tecnol+�gico\\"","\\"Transformaci+�n digital\\"","\\"Gesti+�n de proyectos\\"","\\"Investigaci+�n ambiental\\"","\\"Innovaci+�n empresarial\\""}	{"\\"Consultor+�a estrat+�gica\\"","\\"Desarrollo de software\\"","\\"Capacitaci+�n profesional\\"","\\"Investigaci+�n y desarrollo\\"","\\"Formulaci+�n de proyectos\\"","\\"Control y aseguramiento de calidad\\"","\\"Marketing estrat+�gico\\""}	{"twitter": "https://twitter.com/creativa_sv", "website": "http://www.creativaconsultores.com", "youtube": "https://www.youtube.com/@creativaconsultores", "facebook": "https://www.facebook.com/creativaconsultores", "linkedin": "https://www.linkedin.com/company/creativa-consultores", "instagram": "https://www.instagram.com/creativaconsultores"}	503 2202-7500	Colonia San Francisco, Avenida Las Camelias #12,San Salvador, El Salvador.	https://www.casatic.org/gallery/Socios/b47ac525-c90b-4bab-8e07-409ce8c2279d.png			"MicroStrategy",     "HASTQB",     "ISTQB",     "Microsoft",     "Salesforce",     "Odoo"	AlDia	t	2026-03-09 21:31:30.213823+00	2026-03-09 21:34:49.72941+00
ce40fc65-1da1-4f64-9a77-92d61ac4bbf9	EON Consultant	eon-consultant	Cualquiera puede crear un sitio web o gestionar cuentas en redes sociales, recibir el pago y pasar al siguiente cliente. Menos del 3% de los llamados expertos pueden hacer eso mientras entienden tu negocio y obtienen resultados medibles. Por eso trabajamos usando los avances tecnol+�gicos y la la psicolog+�a humana para que los complejos procesos de crear, mantener o expandir tu negocio en l+�nea se traduzcan en pasos simples que tu empresa pueda seguir.	{"\\"Business Development\\"","\\"Marketing Digital\\"","\\"SEO\\"","\\"SEM\\"","\\"Branding\\"","\\"Desarrollo Web\\""}	{"\\"Consultor+�a empresarial\\"","\\"Desarrollo web\\"","\\"Gesti+�n de redes sociales\\"","\\"Publicidad digital\\"","\\"Estrategia de marketing\\"","\\"Contenido digital\\""}	{"website": "https://eonconsultant.com", "facebook": "https://www.facebook.com/eonconsultant", "linkedin": "https://www.linkedin.com/company/eon-consultant", "instagram": "https://www.instagram.com/eonconsultant"}	+506 2226-6550	Sector Los Sauces, San Jos+�, Provincia de San Jos+�, Costa Rica	https://eonconsultant.com/wp-content/uploads/2023/12/EON_1080X1080_Blue-150x150.png				AlDia	t	2026-03-09 22:01:15.606427+00	2026-03-09 22:01:15.606427+00
e5758755-51e6-4dbf-9adf-356f7222b3f3	IT CONSULTING SA DE CV	it-consulting	IT Consulting es una empresa chilena con oficinas en San Salvador, Santiago y Panam+� que se caracteriza por asesorar y entrenar a sus clientes en estrategias corporativas de tecnolog+�as de la informaci+�n, redise+�o de procesos e innovaci+�n y su integraci+�n con el negocio brindando soluciones creativas a problemas cr+�ticos en las compa+�+�as globales de hoy.	{"\\"Consultor+�a en tecnolog+�a\\"","\\"Estrategia de TI\\"","\\"Innovaci+�n empresarial\\"","\\"Redise+�o de procesos\\"","\\"Seguridad de la informaci+�n\\"","\\"Servicios de datacenter\\""}	{"\\"Consultor+�a tecnol+�gica\\"","\\"Estrategias de TI\\"","\\"Implementaci+�n de soluciones tecnol+�gicas\\"","\\"Gesti+�n de infraestructura tecnol+�gica\\"","\\"Capacitaci+�n en tecnolog+�a\\"","\\"Optimizaci+�n de procesos empresariales\\""}	{"twitter": "https://x.com/itconsultingsv", "website": "https://itconsultinglatam.com", "facebook": "https://www.facebook.com/itconsultinglatam", "linkedin": "https://linkedin.com/company/it-consulting-s-a-de-c-v-"}	2524-5893	Edificio Insigne Oficina 602, Avenida Las Magnolias #206, Colonia San Benito, San Salvador, El Salvador.	https://www.casatic.org/gallery/Socios/694fb3c1-0127-4d7f-884d-dd066289fae7.png				AlDia	t	2026-03-11 14:40:36.852546+00	2026-03-11 14:40:36.852546+00
93cbb414-0255-4acf-ab47-cb2d34c528d9	2IT Jobs S.A. de C.V.	2it-jobs	2IT Jobs es un punto de encuentro entre profesionales en el +�rea de IT y empresarios en busca de talento especializado es por esto que nuestra plataforma re+�ne a todas las personas del mundo de IT en un solo lugar donde podr+�n tener acceso a oportunidades de empleo, cursos formativos y foros de su +�rea de inter+�s.	{"\\"Reclutamiento IT\\"","\\"Headhunting tecnol+�gico\\"","\\"Outsourcing de talento\\"","\\"Staffing tecnol+�gico\\"","\\"Comunidad profesional IT\\""}	{"\\"Reclutamiento de personal tecnol+�gico\\"","\\"Outsourcing de talento IT\\"","\\"Headhunting especializado\\"","\\"Publicaci+�n de ofertas laborales\\"","\\"Conexi+�n entre empresas y profesionales IT\\""}	{"website": "https://www.2itjobs.com", "facebook": "https://www.facebook.com/2itjobs", "linkedin": "https://www.linkedin.com/company/2it-jobs", "instagram": "https://www.instagram.com/2itjobs"}	+503 2264-8442	9na Calle Poniente y 89 Avenida Norte #4615, Colonia Escal+�n, San Salvador, El Salvador	https://www.casatic.org/gallery/Socios/55070f0a-00ab-4a47-b942-8f1c0f57c819.png				AlDia	t	2026-03-11 16:18:40.147464+00	2026-03-11 16:19:16.170758+00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: casatic
--

COPY public.usuarios ("Id", "Email", "PasswordHash", "Rol", "PrimerLogin", "Activo", "CreatedAt", "SocioId") FROM stdin;
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

\unrestrict ButJdSwl9FiOtvNjz1lB5ECDilbTGMjgoH0s9Ing1cGBLSEuRhrADyyNETuTmBa

