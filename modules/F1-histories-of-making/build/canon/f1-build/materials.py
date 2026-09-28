from helper import build
from mat_a import ROWS_MA
from mat_b import ROWS_MB
OUT = "/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_materials.csv"
build(ROWS_MA+"\n"+ROWS_MB, "MAT", "material", "Things", OUT)
