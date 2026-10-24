# F1: decisions of 25 October 2026

Taken by the course owner on 25 October 2026, with what each one changes. Decisions 1 to 5 are taken. Decisions 6 and 7 have a default that stands unless the owner says otherwise.

## Taken

| # | Decision | What it replaces |
|---|---|---|
| 1 | **History first.** Every subject, concept and newly introduced topic opens with its history, lineage and stories, and demonstrates its concepts and elements through them. | The opening-move menu of the final structure v3, in which ten moves were equal choices |
| 2 | **Prediction first is dropped.** No unit, chapter or page opens on a guess, a quiz or a tap-and-reveal. A question may follow a story, never stand in for one. | Prediction first (form 15 as an opener); template v3.1's storyboard rule "at most one one-tap prediction per chapter" as an opening device |
| 3 | **Object first only for an object.** A unit or chapter that teaches something specific about an object may open on it, and then widens to its history, making, technique and methods, told as a story. | Object first as a general-purpose hook |
| 4 | **The long version is the Atlas concept unit.** Every novel concept in the Atlas (an art form, a movement, a school, a style, a network) is taught as a comprehensive unit of its own; ballet is the first. Template: `briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md`. Blueprint: `topics/ballet/planning/BLUEPRINT.md`. | The grouping page of `PAGE_TEMPLATES_v1.md` §1 as the whole of a concept's treatment (it stays, as the unit's record layer) |
| 5 | **Learner content sits next to its research and is versioned.** Topics live in `topics/<topic>/` with `research/`, `planning/` and `learner/`; every learner file carries front matter, a version, its sources with their git blob shas, and a history of earlier versions; CI runs `tools/content_versions.py check`. Rules: `topics/README.md`. | Learner files in `build/units/<unit>/` with versions as file-name suffixes (`-v1`, `-v2`) |

## With a default

| # | Decision | Default |
|---|---|---|
| 6 | **The worked example and the macro view** (the owner: "we need one fully worked example, but perhaps we are forgetting the macro perspective"). The study is `topics/ballet/planning/decisions/EXEMPLAR_STUDY.md`. It found that the two are not rivals: a worked example first, then varied cases set side by side, is what transfers. It assessed five designs; the owner's wish for an internationally known world is design D, a real spine. | **Design E, with the owner's recognition point met in the openers and the atlas:** Salt Road stays the spine that is built forwards and fed to the engines, and gets a researched lineage; the Bauhaus is the historical twin worked fully in M2 (reserve: *The Nutcracker*); a field atlas is drawn from a fixed cast of eight real worlds; every module opens on history from its lead world in the cast. Within each Atlas concept unit the same pattern holds at small scale: one worked example (*Giselle* for ballet) and comparison walls. |
| 7 | **The specs' openers.** The F1 specs were written under the old menu. Of 38 specs, 35 open with a prompt answered by one tap and revealed "within seconds"; four open with Prediction first (F1.2, F1.8, F1.12a, F1.15) and five add a prediction to another move (F1.6, F1.7, F1.9a, F1.12, F1.13). | Each spec is rewritten when its unit is next written, not in one silent pass: the opener becomes a story (or, where the unit teaches an object, the object widened to its story); the claim and counter-claim stay and are told inside the story; the tap prompt is cut or moved after the story as a say-back. The template v3.1 storyboard line changes to "no prediction or quiz openers; questions follow the story". F1.2 is the first to rewrite. |

## Why design D (a real spine) is not the default

The owner asked why the program teaches from one narrow, unknown world. A famous real world as the spine (the Bauhaus, *The Nutcracker*) answers recognition and history. Its limits, from the study (§5.2 and §5.3):

- **The engines.** The spine is fed to the Stranger Lab and the area engines, which generate objects, images and briefs. Rule Q32 forbids generated images of historical objects, people or places, so a real spine cannot do that job.
- **Rights.** The spine appears in every unit, engine and export; the commercial build would make most of a real world's images link-only.
- **Copying.** A famous worked example is the one most copied (the fixation studies in §2.3).
- **Reach.** One culture's history would sit at the centre of every module.
- **Schema.** `learner_world.kind: seed` holds the three fictional worlds; a real world is not a seed.

What a real world does well (recognition, documents, stories) is kept by putting real worlds in the openers, the twin and the atlas, where nothing is generated from them.

## Impact list

| Where | Change | Who |
|---|---|---|
| Final structure v3 (Claude Docs), opening moves | Rewrite the menu: Story first as the rule, Object first for objects, the rest as moves inside a chapter, not openers | Course owner, in the Hub |
| Phase 4 foundations (Claude Docs), P5 | Record decision 6 and its sub-decisions (P5 amended, P5a to P5d) | Course owner, in the Hub |
| `specs/F1.*.md` | Openers rewritten unit by unit (decision 7) | Unit writers |
| Template v3.1 storyboard rule | As decision 7 | This repository |
| `skills/hom-writing` | Already forbids opening questions (§2); add "history first" as §1's first line | This repository |
| `briefs/PAGE_TEMPLATES_v1.md` | Points to the concept-unit template for concepts | This repository |
| Atlas grouping pages | Each novel concept gains a `topics/<topic>/` folder when its unit is planned | Atlas editors |
