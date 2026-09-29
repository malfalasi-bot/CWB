insert into public.program_modules ("code", "title", "level", "level_name", "units", "version", "status", "folder")
select public.cw_text(x->0), public.cw_text(x->1), public.cw_text(x->2), public.cw_text(x->3), public.cw_text(x->4), public.cw_text(x->5), public.cw_text(x->6), public.cw_text(x->7)
from jsonb_array_elements($cwb$[
[
"O1",
"How to see",
"0",
"Orientation",
"4",
"",
"not started",
""
],
[
"F1",
"Histories of making",
"1",
"Foundations",
"35",
"v3.6",
"phase 4: specs batch 1 done",
"modules/F1-histories-of-making"
],
[
"F2",
"Form",
"1",
"Foundations",
"15",
"",
"not started",
""
],
[
"F3",
"Body and senses",
"1",
"Foundations",
"13",
"",
"not started",
""
],
[
"F4",
"Material and meaning",
"1",
"Foundations",
"14",
"",
"not started",
""
],
[
"F5",
"Systems and consequences",
"1",
"Foundations",
"11",
"",
"not started",
""
],
[
"M1",
"Research and premise",
"2",
"Method",
"16",
"",
"not started",
""
],
[
"M2",
"Concept DNA",
"2",
"Method",
"20",
"",
"not started",
""
],
[
"M3",
"World architecture",
"2",
"Method",
"10",
"",
"not started",
""
],
[
"M4",
"Make and test",
"2",
"Method",
"12",
"",
"not started",
""
],
[
"S1",
"Space and experience",
"3",
"Practice areas",
"34",
"",
"not started",
""
],
[
"S2",
"Object and product",
"3",
"Practice areas",
"40",
"",
"not started",
""
],
[
"S3",
"Body and wearables",
"3",
"Practice areas",
"46",
"",
"not started",
""
],
[
"S4",
"Art and installation",
"3",
"Practice areas",
"37",
"",
"not started",
""
],
[
"S5",
"Identity and communication",
"3",
"Practice areas",
"24",
"",
"not started",
""
],
[
"S6",
"Digital product and interface",
"3",
"Practice areas",
"20",
"",
"not started",
""
],
[
"T1",
"Seeing and drawing",
"T",
"Tools",
"5",
"",
"not started",
""
],
[
"T2",
"Parametric thinking",
"T",
"Tools",
"5",
"",
"not started",
""
],
[
"T3",
"Working with AI",
"T",
"Tools",
"5",
"",
"not started",
""
],
[
"T4",
"Simulation and interface",
"T",
"Tools",
"5",
"",
"not started",
""
],
[
"T5",
"Honest evidence",
"T",
"Tools",
"4",
"",
"not started",
""
],
[
"T6",
"Reality capture",
"T",
"Tools",
"3",
"",
"not started",
""
],
[
"T7",
"Data visualisation",
"T",
"Tools",
"4",
"",
"not started",
""
],
[
"T8",
"Physical computing",
"T",
"Tools",
"4",
"",
"not started",
""
],
[
"T9",
"Environmental analytics",
"T",
"Tools",
"2",
"",
"not started",
""
],
[
"T10",
"Fabrication",
"T",
"Tools",
"3",
"",
"not started",
""
],
[
"R1",
"The world as venture",
"4",
"Venture and release",
"12",
"",
"not started",
""
],
[
"R2",
"Money, law and rights",
"4",
"Venture and release",
"11",
"",
"not started",
""
],
[
"R3",
"Making it real",
"4",
"Venture and release",
"12",
"",
"not started",
""
],
[
"R4",
"Responsibility",
"4",
"Venture and release",
"8",
"",
"not started",
""
],
[
"R5",
"Defence and dossier",
"4",
"Venture and release",
"9",
"",
"not started",
""
]
]$cwb$::jsonb) x
on conflict ("code") do nothing;
