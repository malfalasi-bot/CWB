# Published links (claude.ai Artifacts)

| Piece | Folder | Link |
|---|---|---|
| Edo and the floating world (v4; includes the Desks, Workshop and Views rooms) | build/units/edo | https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6 |
| Atlas of Making (the hub) | build/atlas-hub | https://claude.ai/artifact/EpQh77TKiuqa5ot5dMowQ8 |

| Edo Concept Composer (all versions, feasibility, teaching methods, final brief) | build/compiler | https://claude.ai/artifact/FztXX3RBg7D8KcR2AQ14Aa |

Superseded on 4 October 2026 (published by an earlier pass that planned separate pieces; their content now lives inside the Edo unit and the Atlas above):
The Print Desks https://claude.ai/artifact/Qu4AiUxBdmiaycRs9AcjKp · Edo Print Workshop https://claude.ai/artifact/UMadfVGh6pAasUYG1UdRFX · Atlas of Making (first version) https://claude.ai/artifact/KofGwdTPrtaCgLG8ykoBYi.

## Hand-off between pieces
Each artifact has its own origin and storage, so pieces pass progress in the link.
Only a plain `#token` (letters, digits, `.` `_` `~` `-`) reaches `location.hash`.

Format: `#ink.<unit>.<items>` where `<unit>` is a short unit code (`edo`) and `<items>` is a `~`-joined list of
node or step codes the learner engaged, e.g. `#ink.edo.tsutaya~hokusai~e1842~desk-seal~wave`.
- Atlas reads `#ink.*`, stores it in its own localStorage (try/catch), and inks the matching nodes and the unit territory.
- The Atlas links into a piece with `#from.atlas` (the piece shows a "Back to the Atlas" link).
- Pieces link to each other with a plain anchor of a scene id, e.g. `.../73RSURL2MWqJpyJuh4mdh6#b4-3`.
