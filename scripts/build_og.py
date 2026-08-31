"""Compose public/og.jpg — the share card.

Ids are content-derived, so these stay valid unless the image itself is
replaced. Run after scripts/build_media.py.
"""
import subprocess, os
W, H = 1200, 630
G = "public/gallery/card"
OUT = "public/og.jpg"
INK, CREAM, TEAL, GREY = "#0A0A0B", "#F6F3ED", "#0097B2", "#8A867F"
DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
FUT   = "/System/Library/Fonts/Supplemental/Futura.ttc"
HELV  = "/System/Library/Fonts/Helvetica.ttc"   # has ₦; Futura does not

def run(a): subprocess.run(a, check=True, capture_output=True)

run(["magick", "-size", f"{W}x{H}", f"xc:{INK}", "/tmp/og_0.png"])

# gallery wall on the right; the outer two are trimmed by the frame edge so it
# reads as a slice of something larger rather than three lonely cards
cards = [("cd4a58eb", 588, 96, 224, 300),
         ("n60b5f5b", 828, 46, 224, 340),
         ("c1559c12", 1068, 96, 224, 300)]
layer = "/tmp/og_0.png"
for i, (sid, x, y, cw, ch) in enumerate(cards):
    tmp = f"/tmp/og_c{i}.png"
    run(["magick", f"{G}/{sid}.webp", "-resize", f"{cw}x{ch}^", "-gravity", "north",
         "-extent", f"{cw}x{ch}", "-bordercolor", "#ffffff1f", "-border", "1", tmp])
    nxt = f"/tmp/og_l{i}.png"
    run(["magick", layer, tmp, "-geometry", f"+{x}+{y}", "-composite", nxt])
    layer = nxt

# second row, offset, sunk right back so it suggests depth without competing
row2 = [("c6082a66", 700, 410, 224, 300), ("na43419e", 940, 410, 224, 300)]
for i, (sid, x, y, cw, ch) in enumerate(row2):
    tmp = f"/tmp/og_d{i}.png"
    run(["magick", f"{G}/{sid}.webp", "-resize", f"{cw}x{ch}^", "-gravity", "north",
         "-extent", f"{cw}x{ch}", "-fill", INK, "-colorize", "45%",
         "-bordercolor", "#ffffff14", "-border", "1", tmp])
    nxt = f"/tmp/og_e{i}.png"
    run(["magick", layer, tmp, "-geometry", f"+{x}+{y}", "-composite", nxt])
    layer = nxt

# left-to-right scrim so the type side is solid and the wall fades in
run(["magick", layer,
     "(", "-size", f"{H}x{W}", f"gradient:{INK}-none", "-rotate", "270",
     "-resize", f"{W}x{H}!", ")", "-compose", "over", "-composite", "/tmp/og_s.png"])
run(["magick", "/tmp/og_s.png",
     "(", "-size", f"{W}x{H}", "xc:none", "-fill", INK,
     "-draw", "rectangle 0,0 470,630", "-blur", "0x45", ")",
     "-compose", "over", "-composite", "/tmp/og_s2.png"])

run(["magick", "public/brand/mark-dark.png", "-resize", "60x60", "/tmp/og_m.png"])
run(["magick", "/tmp/og_s2.png", "/tmp/og_m.png", "-geometry", "+64+54", "-composite", "/tmp/og_m2.png"])

run(["magick", "/tmp/og_m2.png",
     "-font", DIDOT, "-fill", CREAM, "-pointsize", "33",
     "-annotate", "+140+95", "Dave Studio",
     "-font", FUT, "-fill", TEAL, "-pointsize", "16", "-kerning", "3.6",
     "-annotate", "+66+212", "GRADUATION & NYSC PORTRAITS",
     "-font", DIDOT, "-fill", CREAM, "-pointsize", "74",
     "-annotate", "+64+310", "You already",
     "-annotate", "+64+384", "earned the",
     "-annotate", "+64+458", "photos.",
     "-font", HELV, "-fill", GREY, "-pointsize", "17", "-kerning", "0.8",
     "-annotate", "+66+542", "529 looks   ·   from ₦10,000   ·   ready in 24 hours",
     "-quality", "90", OUT])
print("wrote", OUT, os.path.getsize(OUT)//1024, "KB")
