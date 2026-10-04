# World band cards

One card is one cell of the Time lens: **one band × one world chapter**. A card never covers two bands or two chapters; a grouping that straddles a band edge appears on both cards, marked "straddles" (briefs/PAGE_TEMPLATES_v1.md §3, rules B1 to B12). The bands are the eleven of `atlas/tools/codes.py` (B01 before 8000 BCE to B11 1900 to now); the chapters are the nine world chapters of F1. That makes 99 cells, plus the eleven world rows that join each band's nine cards into one tour (§3.6). A cell with no people yet (`NO_PEOPLE_YET` in codes.py) says so and stays a card.

Files are named `B<nn>_<chapter>_<slug>.md`, for example `B08_F1.10_islamic_world.md`; the slug is optional and names the chapter in plain words. The worked model is `B08_F1.10_islamic_world.md` (drafted 4 October 2026). Every other cell is to write.

## The grid (11 bands × 9 chapters)

| Band | F1.6 Africa | F1.7 Americas | F1.8 East Asia | F1.9 South and Southeast Asia | F1.9a West Asia before Islam | F1.10 Islamic world | F1.11 Europe and the Mediterranean | F1.12 Australia and the Pacific | F1.12a Steppe and Central Asia |
|---|---|---|---|---|---|---|---|---|---|
| B01 before 8000 BCE | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B02 8000–4000 BCE | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B03 4000–2000 BCE | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B04 2000–1000 BCE | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B05 1000 BCE–1 CE | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B06 1–500 | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B07 500–1000 | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B08 1000–1400 | to write | to write | to write | to write | to write | **written** (`B08_F1.10_islamic_world.md`) | to write | to write | to write |
| B09 1400–1700 | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B10 1700–1900 | to write | to write | to write | to write | to write | to write | to write | to write | to write |
| B11 1900–now | to write | to write | to write | to write | to write | to write | to write | to write | to write |

Cells: 99. Written: 1. To write: 98. World rows (one per band, always Ring 1): 11, all to write.

## What a card must carry

Lead sentence · responsibility block · overview (250 to 350 words) · facts block (cell; who was making what; key events; groupings active; anchor objects; period definitions; elsewhere at this date; recurrences; absence line; backbone ids; rights line; reader status) · claims (six to twelve) · nodes · open objects · people and credit · visual plan · the station · success criteria · readings and risks · sources · fact-check list · lint line. The "elsewhere" lines are copied from the other eight cards of the same band, never written anew; until a card exists its line reads "not yet written". Chapters whose span ends before a band (F1.9a) or begins after it still get a card, which says what the chapter's communities were making under the band's polities, or `NO_PEOPLE_YET`.
