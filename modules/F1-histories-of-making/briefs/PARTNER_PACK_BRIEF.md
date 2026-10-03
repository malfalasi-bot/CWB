# Brief: one partner-voice knowledge pack for F1

You are writing the F1 knowledge pack for one of the program's partner voices. A partner voice is an AI partner with a declared agenda, speaking to learners inside units. The Historian pack already exists; it is the model for shape, depth and rigour.

## Read first

1. **The model.** `/home/claude/creative-world/docs/03-partner-voices/historian/index.md` (Historian pack v2, about 3,700 words). Copy its section structure:
   - who the voice is;
   - behaviour rules;
   - modes, and where the voice appears in F1;
   - what it knows;
   - prompt architecture: the system prompt and context blocks;
   - sample exchanges;
   - an evaluation set and versioning.
2. **The program's definition of the voices.** `/home/claude/creative-world/docs/01-structure/final-structure-v3/index.md`, lines 250–275, section 9: the seven voices, each one's line, where it appears and what it reads. Also read the "standing in for peers and specialists" paragraphs.
3. **The program voice guide.** `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/voice/VOICE_GUIDE.md`. All copy follows it. A partner reply is one of its surfaces.
4. **Every F1 unit spec that uses your voice**, in `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/specs/`. Read each one's Partner row, both Apply steps, Lab, cases and section 9. Your pack must serve exactly what those units ask of the voice: the voice's question, the test it ends with, and the artifact fields it reads.
5. **The learners and personas.** `/home/claude/creative-world/docs/02-program/phase-4-foundations/index.md` (personas, the SRC schema, and the learner data policy option A: recordings stay on the device).

## What the pack must contain

- **Who it is.**
  - Its line, verbatim from Final Structure section 9.
  - Its declared agenda: what it wants and what it is not.
  - What it reads (only the inputs section 9 allows; for example, the Stranger reads the DNA or the brief only, never the conversation).
  - What it never does.
- **Behaviour rules (12–20).** Include the program-wide ones that apply:
  - never take a side in a live debate (H20);
  - people are never goods (H9);
  - confidence stated in words;
  - "earliest known", never "first";
  - the community's own name first;
  - no generated images of historical objects;
  - learner data stays on device.

  Add the voice's own rules: how it pushes back, when it stops, how it hands over to the Historian for facts, and how it avoids grading taste.
- **Modes.** Which modes it runs in, and a table of where it appears in F1: unit, step, the question it asks, the test it ends with, the artifact field it reads or writes.
- **What it knows.** The domain knowledge it needs for F1, drawn from the specs.
  - Planet: material chains, the PLW field, numbers only from opened and dated sources.
  - Fabricator: materials, processes and tolerances in historical making, and reconstruction method (F1.28a).
  - Client: the six commissioning regimes (F1.17), briefs, platforms (F1.21).
  - Mirror: what the artifact fields say, and how to reflect without judging.
  - Stranger: building only from rules, and drift.

  Give sources where it states facts. Where a fact belongs to the Historian, it says so and hands over.
- **Prompt architecture.**
  - A full system prompt, ready to use, about 500–800 words, carrying the rules.
  - The context blocks it is given per unit, in a schema-like list.
  - How it refuses, and how it handles an off-topic or unsafe request.
- **Sample exchanges (5–6).** Each is a learner turn and the voice's reply, built on real material from the specs. Don't invent historical facts; use only facts the specs state.
  - At least one shows the voice pushing back.
  - At least one shows it handing over to the Historian.
  - At least one shows it stopping on a protocol issue (sacred material, a person described as goods, a learner trying to "authentically" copy a community's design).
- **Evaluation set (12–18 cases).** Each case gives an input, the expected behaviour, and the pass and fail criteria. Include adversarial cases and protocol cases.
- **Versioning.** v1, dated 2 October 2026, with what would trigger v2.
- **Open questions.** Where the specs disagree about this voice, or leave a gap.

## Rules

- **Length.** About 2,800–3,800 words.
- **Sources.** Quote no more than 25 words from any outside source. Never invent a URL.
- **Web use.** Only if you need it. The session's WebSearch budget is used up, so use WebFetch, Exa (`mcp__Exa__web_search_exa`), Tavily or Parallel Search if you must look anything up; load them through ToolSearch.
- **Saving.** Save to `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/voices/<voice>/PACK.md`. Edit no other file.
- **Report back.**
  - The units served.
  - Counts of rules, samples and evaluation cases.
  - The open questions.
  - Any inconsistency you found between the specs and the program definition.
