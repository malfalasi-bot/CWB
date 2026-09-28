from helper import build
from tech_a import ROWS_A
from tech_b import ROWS_B
from tech_c import ROWS_C
from tech_d import ROWS_D
from tech_e import ROWS_E
from tech_f import ROWS_F
OUT = "/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_techniques.csv"
build("\n".join([ROWS_A,ROWS_B,ROWS_C,ROWS_D,ROWS_E,ROWS_F]), "TEC", "technique", "Things", OUT)
