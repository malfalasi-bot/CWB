-- Creative World: content store (generated)
create or replace function public.cw_text(v jsonb) returns text
language sql immutable set search_path = '' as $f$
  select case when jsonb_typeof(v) = 'array'
    then coalesce((select string_agg(s, '' order by o) from jsonb_array_elements_text(v) with ordinality e(s, o)), '')
    else v #>> '{}' end
$f$;
comment on function public.cw_text(jsonb) is 'Joins a text value that was split into segments for loading';
create table public.canon_nodes (
  "id" text not null primary key,
  "name" text not null,
  "other_names" text not null,
  "kind" text not null,
  "family" text not null,
  "world" text not null,
  "sub_regions" text not null,
  "start_year" text not null,
  "end_year" text not null,
  "date_note" text not null,
  "making_significance" text not null,
  "materials_techniques" text not null,
  "object_types" text not null,
  "functions" text not null,
  "defined_by" text not null,
  "leaves_out" text not null,
  "sensitivity" text not null,
  "free_sources" text not null,
  "tier" text not null,
  "units" text not null,
  "confidence" text not null,
  "notes" text not null,
  "source_file" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.canon_nodes enable row level security;
comment on table public.canon_nodes is 'Canon register: every named thing the Atlas points to (4,228 nodes, 26 id prefixes). Source: modules/F1-histories-of-making/atlas/data/canon/*.csv. Schema: schemas.canon-node.schema.json';
create table public.f1_world_set (
  "id" text not null primary key,
  "kind" text not null,
  "status" text not null,
  "title" text not null,
  "date" text not null,
  "holder" text not null,
  "accession" text not null,
  "licence" text not null,
  "holder_and_licence_note" text not null,
  "provenance" text not null,
  "provenance_test" text not null,
  "test_basis" text not null,
  "history_gap" text not null,
  "action" text not null,
  "units" text not null,
  "roles" text not null,
  "verified_in" text not null,
  "met_object_id" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.f1_world_set enable row level security;
comment on table public.f1_world_set is 'F1 world-set register v0: objects with holder, licence and 1970 provenance test';
create table public.f1_claims (
  "id" text not null primary key,
  "unit" text not null,
  "topic" text not null,
  "claim" text not null,
  "confidence" text not null,
  "confidence_note" text not null,
  "source" text not null,
  "from" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.f1_claims enable row level security;
comment on table public.f1_claims is 'F1 claims register v0 with confidence (documented, probable, contested, interpretive)';
create table public.f1_practices (
  "id" text not null primary key,
  "practice" text not null,
  "holders" text not null,
  "places" text not null,
  "source" text not null,
  "status" text not null,
  "units" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.f1_practices enable row level security;
comment on table public.f1_practices is 'F1 living practices register v0';
create table public.f1_source_routes (
  "id" text not null primary key,
  "name" text not null,
  "type" text not null,
  "covers_worlds" text not null,
  "covers_sub_regions" text not null,
  "access" text not null,
  "cost" text not null,
  "licence_content" text not null,
  "licence_metadata" text not null,
  "commercial_safe" text not null,
  "what_it_fills" text not null,
  "known_limits" text not null,
  "verified" text not null,
  "verification_url" text not null,
  "notes" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.f1_source_routes enable row level security;
comment on table public.f1_source_routes is 'Zero-cost source routes with licence and commercial-safe flag';
create table public.f1_primary_texts (
  "id" text not null primary key,
  "title" text not null,
  "author_or_maker" text not null,
  "date" text not null,
  "world" text not null,
  "units" text not null,
  "language" text not null,
  "original_status" text not null,
  "best_free_translation" text not null,
  "translation_status" text not null,
  "where_free" text not null,
  "notes" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.f1_primary_texts enable row level security;
comment on table public.f1_primary_texts is 'Primary texts on making with public-domain status and free translations';
create table public.program_modules (
  "code" text not null primary key,
  "title" text not null,
  "level" text not null,
  "level_name" text not null,
  "units" text not null,
  "version" text not null,
  "status" text not null,
  "folder" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.program_modules enable row level security;
comment on table public.program_modules is 'Creative World module registry (levels, modules, unit counts)';
create table public.documents (
  "path" text not null primary key,
  "title" text not null,
  "kind" text not null,
  "module" text not null,
  "format" text not null,
  "artifact_url" text not null,
  "docs_id" text not null,
  "tab_name" text not null,
  "rev" text not null,
  "content" text not null,
  "pdf_path" text not null,
  "sha256" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.documents enable row level security;
comment on table public.documents is 'Every program and module document as full text (Markdown, or HTML for mockup artboards), exported from Claude Docs and the repository';
create table public.schemas (
  "name" text not null primary key,
  "content" jsonb not null,
  loaded_at timestamptz not null default now()
);
alter table public.schemas enable row level security;
comment on table public.schemas is 'Program JSON schemas and registries (schema/*.json in the repository)';
create table public.repo_files (
  "path" text not null primary key,
  "bytes" text not null,
  "sha256" text not null,
  "extension" text not null,
  "in_database" text not null,
  loaded_at timestamptz not null default now()
);
alter table public.repo_files enable row level security;
comment on table public.repo_files is 'Manifest of every file in the Creative World repository, with sha256; in_database says whether its content is stored here';
create index canon_nodes_kind_idx on public.canon_nodes (kind);
create index canon_nodes_world_idx on public.canon_nodes (world);
create index documents_fts_idx on public.documents using gin (to_tsvector('simple', title || ' ' || content));
