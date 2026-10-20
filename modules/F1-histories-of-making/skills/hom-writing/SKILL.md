---
name: hom-writing
description: How to write a learner-facing page for the F1 "Histories of making" course: the learner, objectives, the thesis, reading orders (an object taken apart, a workshop walked, one work re-made, a bench read outward, a route followed, a dispute posed), the paragraph, captions, voice, what to leave out, length, guesses and the closing contribution, when not to build. Use for any prose a learner will read: a unit, a page, a lecture, a caption, a card, a content note. Assumes hom-constitution.
---

# Writing for the learner

The prose comes before any HTML. Write the page as text with its captions and its objectives; the toolbox dresses it afterwards. The learner is an adult with no background in the subject who has twenty minutes and a phone.

## 1. Before the first sentence: the brief

Write from the unit's brief (`hom-research` makes it): the thesis, five to seven claims with their strongest source, three verified objects, one argument, one living maker, what the sources leave out, the spine the subject suggests. If there is no brief, write one first; a page without a thesis becomes a catalogue.

## 2. The opening

- **Objectives, in the second person, before anything else.** "By the end you will be able to…" three lines, each a verb a reader can test on themselves (date a print from its margin; name the four trades and who the law named; explain why the maker's name is missing). Drawn from the unit spec's success criteria, written by the editor.
- **The thesis in one sentence**, and the first object within the first 150 words.
- **The five terms the page will use** that the reader does not know (nishiki-e, kiwame; flow, relay; pointe, turnout), each glossed in a clause the first time it appears, never in a glossary alone.
- Where the subject carries a content note, it comes once, here, with a persistent control to skip the stations it covers; never repeated station by station.

## 3. Reading orders

Choose the one the subject has; name it in the brief; do not mix two in one page.

- **An object taken apart**: wearer or user → material → why that material then → construction, step by step → care and afterlife. The London Museum's Pavlova costume is the exemplar. Each step headed, each with its own picture, so the reader can stop after any.
- **A workshop walked**: room by room, one craft per room, one concrete number per room, a photograph of the room not the finished thing, the maker named where they are and "maker unknown" where they are not.
- **One work re-made**: the same work in three or four makings (date, place, makers, budget, bodies), so the reader sees making repeated under different conditions.
- **A bench read outward**: one maker, one object, one chain of names, from the raw material to the stage or the shop.
- **A route followed**: one object or material from where it was made to where it was found, stop by stop with the dates the sources give and dashed where they do not.
- **A dispute posed**: the question, the evidence in the order a reader needs it, then the two readings, then the reader's lean.

Edo's lecture-and-beats pattern (`references/beats.md`) is one more order, for a unit that has full lectures; it is optional.

## 4. The paragraph

- One idea per paragraph; the sentence that carries the date carries it in words a reader can hold ("about 1830", "the 1590s", "between 1841 and 1843"), never a decimal, never "c. 1830–32" in running prose (that form is for captions and readouts).
- The maker is named in the first paragraph that shows their work, as the record names them; "maker unknown" is written, not skipped.
- The hedge is in the sentence: "probably goose, pending analysis"; "the Met's record says"; "historians disagree about when". Never a bracket, a superscript or a code in the learner view.
- One concrete number per panel or section, with who counted it in the sentence or the caption.
- Sentences: median 14–24 words, none over 40; a first sentence under 16 words. Reading level about grade 8–9. A technical term is explained the first time it appears.
- Voice: second person for objectives and prompts, third person for the history, present tense for what the object is and past for what happened. No "we write", "we hold", "this unit", "the register", "the course": the project does not speak on the page.
- Banned in the learner view (they are the tooling's words): tick, tile, lens, station, instrument, focus mask, register, claim, record id, beat, scene player, stepper, component, build, placeholder, "as defined by", "membership confidence", "documented".

## 5. Captions

Under the image, never over it. A caption says what the eye cannot see ("Prussian blue in the dark stripes, indigo under it"), not what it can ("a wave"). The credit line follows the caption in smaller type: holder · accession · date · materials · licence, and the maker. Alt text describes the picture for someone who cannot see it and does not repeat the caption. Where the picture is a placeholder for an image not yet fetched, the learner view shows nothing in that slot; the editor view shows the frame.

## 6. What to leave out

The thesis chooses. A fact that does not serve one of the brief's claims goes back to the dossier, however good it is. A page's reading is 400–900 words; a unit is a twenty-minute read; what does not fit is a link, not a paragraph. Every page ends with one short paragraph on what its sources leave out, in the reader's terms: the people it could not name, the places the record does not reach.

## 7. Guesses, arguments and the ending

- A guess is a commitment: no answer visible before the choice; two responses, one for each way the reader chose; no hint that quotes the answer.
- An argued card records the reader's lean and shows the evidence against it with one sentence for the reader who leaned the other way.
- One spaced return per unit (a question from two sections back) and one across units.
- The unit ends with something the learner makes: the attribution line, the SRC line, the margin read, written by the learner with a worked example first. That is the assessment; there are no points.
- Then the self-check: the three objectives again, as questions.

## 8. When not to build

Say so in a paragraph a commissioning editor would accept, and build the smaller thing:

- Five places in a list do not need a globe; a list with dates is the page.
- A journey with no dated legs gets a bar with the line "no leg of this route carries a date", not a scene.
- A subject under the content thresholds (fewer than five open objects, under 60 % dated) gets its reading and its cards, and a "what waits" table in the editor view.
- An interactive that reveals what a paragraph could hold is cut; film is for touch and time, a still image for evidence.

## 9. Two views from one source

The same source renders a learner view (objectives, the reading, the pictures with captions, the guesses, the ending, one Sources line) and an editor view (everything: record ids, confidence on every value, "as defined by", rights, honesty lines, what waits, the colophon). Build notes never reach the learner view.

## 10. Before it is called done

Run `hom-lint`'s prose lint (sentence lengths, banned words, priority claims for the judge, doubled labels) and the claims lint; read the learner view cold on a phone; then the human read. The page is finished when a reader can say the thesis in their own words and name the first thing they learned.
