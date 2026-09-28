# Unit spec template (v3)

Every unit in every module is specified on this template before its gate. F1.17 set the standard for depth and voice (decision B5), and template v3 adds ten sections after the table (F1 Round 2). F1's batch-1 specs in `modules/F1-histories-of-making/specs/` are the worked examples.

## File

`modules/<module>/specs/<unit>.md`. It starts with `## <unit> <title>`, then one lead sentence giving the unit's point, then **Spec** (the table), then the ten sections with bold labels. Length is about 2,000–3,000 words, most of it sources.

## The table, in this order

| Row | What it holds |
|---|---|
| Essential question | The one question the unit answers |
| Opening move | A claim and counter-claim, or a prediction or object that opens the unit, and one case |
| Lab or main interactive | What the learner does with their hands or the interface |
| Concept | Length in words and what it covers |
| Cases | Usually three, each an object story |
| Apply — maker | The maker lane's task |
| Apply — briefer | The briefer lane's task |
| Partner | The partner voice, its question, and the test it ends with |
| Forms | Presentation form numbers (see `program.json`) |
| Consumption forms | Five-minute · Session · Reference |
| Media | Where every image, sound and film comes from |
| Artifact fields | Concept DNA field codes the unit writes (see `concept-dna.schema.json`) |
| Threads | Which of the six threads it advances, and how |
| Closing contribution | The one line the learner adds to their record |
| Claims sheet | Pointer to section 3 |

## The ten sections

1. **Responsibility block.** The canon groupings, object types, sub-regions and periods the unit must reach (canon ids), and what the Atlas carries instead. A thematic F1 unit must reach at least four of the nine world chapters with a case or example. Other modules set their own reach rule.
2. **Protocol screen.** Run before any searching. Never human remains, sacred or secret material, or anything a descendant community asks not to show. Other grave goods and altar objects appear only with their origin and a content note. Every Indigenous community's material carries a Notice. People are never described as goods.
3. **Claims (12–20).** Each claim gives:
   - the claim in plain words;
   - its confidence (documented, probable, contested with both readings, or interpretive);
   - the source actually opened (URL);
   - how deep that source goes.
   The unit's own framing is declared as an interpretive claim. Write "earliest known", never "first".
4. **Nodes.** The canon ids that carry each case and claim, and proposed new canon rows (name, kind).
5. **Candidate open objects (3–6).** Real records verified at source. Each gives:
   - the holder and accession;
   - the date range;
   - the licence as the holder states it;
   - the 1970 status;
   - the record URL.
   If no open object exists, say so and propose a drawing of our own, a living practice or a link out.
6. **People and credit.** Named makers where the record allows, and who the credit leaves out.
7. **Visual plan (zero cost).** For each form, where its images come from: open record, national licence, attribution licence, our own drawing, map or diagram, or link out. No generated images of historical objects, people or places.
8. **Success criteria.** Three observable criteria, none of which takes a side in a live debate.
9. **Readings and risks.** What the partner voice's pre-read should check, and which sensitive steps wait until a reader clears them.
10. **Fact-check list.** Every row a checker must confirm at source before the gate: canon rows used, living people, endonyms, UNESCO claims and licences.

## Writing standard (applies to all prose)

- Start from the object, place or person.
- The first sentence of a paragraph is 16 words or fewer; every sentence is under 25 words.
- Say who made it, even when unnamed.
- Give dates as ranges, with the source's qualifier.
- Put confidence in the words.
- Name violence plainly. Put perpetrators' terms in quotation marks and attribute them.
- Use the community's own name first.
- Never write "primitive", "tribal", "lost civilisation", "exotic", "mysterious", or "discovered" for places people knew.
- No AI filler: "rich tapestry", "testament to", "stands as". The canon validator checks for these (`x-banned-phrases` in `canon-node.schema.json`).
- Admit what is not known.
- Use plain words and no adjectives of praise.

## Zero-cost rules (Q27)

- Use only free sources.
- Show images only where the licence class allows it (see `licence-classes.json`); link everything else.
- Never invent a URL, accession number or identifier. If something could not be verified, write "not verified".
