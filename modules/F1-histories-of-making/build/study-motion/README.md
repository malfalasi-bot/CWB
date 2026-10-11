# Edo motion study page

Renders `research_notes/Motion layers and focus/STUDY.md` as an Artifact page with the eight storyboards drawn as SVG frames.
`node src/frames.mjs` builds the coastline paths and place positions (d3-geo + world-atlas from `../atlas-hub/node_modules`);
`node src/build.mjs` writes `dist/index.html` and `dist/page.html`. Storyboards are specified in `src/storyboards.mjs`.
Published at https://claude.ai/artifact/ScB2y7em7CwFptFwphxbgR.
