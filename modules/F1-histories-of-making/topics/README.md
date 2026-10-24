# Topics

One folder per Atlas concept unit: an art form, a movement, a school, a style, a network. Ballet is the first. Each topic keeps its learner-facing content next to the research it was written from, so a reader can always trace a sentence back to a source, and a writer can always see when the research under a page has changed.

## Layout of a topic

```
topics/<topic>/
  README.md            what the topic is, where things are, its status
  CHANGELOG.md         dated entries: research added, content versions released, decisions
  MANIFEST.md          generated: every file, its size, its version or last change
  CONTENT_INDEX.md     generated: every learner file, its version and status, stale sources
  research/            sources and findings (scope files by angle, works, registers, products)
  planning/            briefs, plans, reviews, decisions, and the pages made from them
  learner/             learner-facing content, versioned (see below)
    <content>/
      <content>.md     the current version, with front matter
      history/         a snapshot of every earlier version, named <version>.md
```

The claims register for a topic stays with the Atlas data, at `atlas/data/register/units/<topic>.yaml`, because the Atlas jobs read it; each learner file names it in its front matter.

## Versioning learner content

Every learner file starts with a front-matter block: `content_id`, `title`, `kind`, `topic`, `version` (MAJOR.MINOR.PATCH), `status` (draft, in-review, approved, published, superseded), `updated`, `authors`, `claims_register`, `body_sha256`, `derived_from` (the research files it was written from, each with the git blob sha it had at the time) and `changes` (newest first: version, date, what changed).

- **The text cannot change without a new version.** The check fails if the body's hash no longer matches.
- **Every earlier version is kept** as `history/<version>.md`, written by the tool when a version is bumped.
- **Stale research is flagged.** If a source file listed in `derived_from` has changed since the version was written, the check warns. The writer reads the change and either bumps the content or confirms that the sources still hold.
- **Which part to bump.** Patch: wording and corrections that do not change what is taught. Minor: a section added, cut or reordered, or a fact that changes what is taught. Major: a new structure or a new place in the course.
- **Releases are tagged** in git as `<content_id>@<version>` (for example `ballet.the-shoe@0.3.0`).

```bash
python tools/content_versions.py check                     # run by CI on every push
python tools/content_versions.py bump FILE --part minor --summary "what changed"
python tools/content_versions.py confirm FILE              # sources re-read; text unchanged
python tools/content_versions.py init FILE --id ID --title T --kind K --topic TOPIC --sources P [P ...]
python tools/content_versions.py index                     # writes each topic's CONTENT_INDEX.md
python tools/content_versions.py manifest                  # writes each topic's MANIFEST.md
```

Research and planning files are versioned by git: their history is the commit log, and `MANIFEST.md` shows the commit and date of each file's last change. Research files are not edited silently: a correction is dated in the file ("corrected 25 Oct 2026 after review R2") and logged in the topic's `CHANGELOG.md`.

## Starting a new topic

Copy `_template/`, fill its README, and follow `briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md` for the research angles, the unit's shape and the writing.
