-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE EXTENSION unaccent;

CREATE TEXT SEARCH CONFIGURATION sr ( COPY = english );
ALTER TEXT SEARCH CONFIGURATION sr
        ALTER MAPPING FOR hword, hword_part, word
        WITH unaccent, english_stem;

CREATE TABLE IF NOT EXISTS public.persons
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    pol character varying COLLATE pg_catalog."default",
    srpsko_prezime character varying COLLATE pg_catalog."default",
    srpsko_ime character varying COLLATE pg_catalog."default",
    srpski_nadimak character varying COLLATE pg_catalog."default",
    prezime character varying COLLATE pg_catalog."default",
    ime character varying COLLATE pg_catalog."default",
    srednje_slovo character varying COLLATE pg_catalog."default",
    nadimak character varying COLLATE pg_catalog."default",
    "rođenje" character varying COLLATE pg_catalog."default",
    smrt character varying COLLATE pg_catalog."default",
    groblje character varying COLLATE pg_catalog."default",
    mesto character varying COLLATE pg_catalog."default",
    "opština" character varying COLLATE pg_catalog."default",
    upravni_okrug character varying COLLATE pg_catalog."default",
    region character varying COLLATE pg_catalog."default",
    fts tsvector GENERATED ALWAYS AS (to_tsvector('sr'::regconfig, (((ime)::text || ' '::text) || (prezime)::text))) STORED,
    CONSTRAINT persons_pkey PRIMARY KEY (id),
    CONSTRAINT persons_id_key UNIQUE (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.persons
    OWNER to postgres;

ALTER TABLE IF EXISTS public.persons
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.persons TO anon;

GRANT ALL ON TABLE public.persons TO authenticated;

GRANT ALL ON TABLE public.persons TO postgres;

GRANT ALL ON TABLE public.persons TO service_role;
CREATE INDEX IF NOT EXISTS persons_fts
    ON public.persons USING gin
    (fts)
    TABLESPACE pg_default;
