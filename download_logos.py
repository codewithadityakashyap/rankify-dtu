"""
Copies SVG files from locally installed simple-icons npm package.
"""
import os, shutil, json

LOGOS_DIR = "public/logos"
SI_DIR = "node_modules/simple-icons/icons"

os.makedirs(LOGOS_DIR, exist_ok=True)

def make_badge(initials, color, size=80):
    fs = size // 3
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'<rect width="{size}" height="{size}" rx="14" fill="{color}"/>'
            f'<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" '
            f'font-family="system-ui,sans-serif" font-weight="700" font-size="{fs}" fill="white">{initials}</text>'
            f'</svg>')

LOGOS = [
    ("amazon",           "amazon",            "#FF9900", "AM"),
    ("google",           "google",            "#4285F4",  "G"),
    ("microsoft",        "microsoft",         "#00A4EF", "MS"),
    ("adobe",            "adobe",             "#FF0000", "AD"),
    ("salesforce",       "salesforce",        "#00A1E0", "SF"),
    ("flipkart",         "flipkart",          "#2874F0", "FK"),
    ("uber",             "uber",              "#000000", "UB"),
    ("expedia",          "expedia",           "#00355F", "EX"),
    ("meesho",           "meesho",            "#F43397", "ME"),
    ("sprinklr",         "sprinklr",          "#0FA5AE", "SP"),
    ("unifyapps",        None,                "#6366F1", "UA"),
    ("cvent",            "cvent",             "#0072CE", "CV"),
    ("magicpin",         None,                "#E63946", "MP"),
    ("oracle",           "oracle",            "#F80000", "OR"),
    ("cisco",            "cisco",             "#1BA0D7", "CS"),
    ("optum",            "optum",             "#FC6423", "OP"),
    ("goldmansachs",     "goldmansachs",      "#6DB4C2", "GS"),
    ("bain",             None,                "#CC0000", "BC"),
    ("kpmg",             "kpmg",              "#00338D", "KP"),
    ("zsassociates",     "zs",                "#E31937", "ZS"),
    ("blackrock",        "blackrock",         "#00205B", "BR"),
    ("jpmorgan",         "jpmorgan",          "#003087", "JP"),
    ("texasinstruments", "texasinstruments",  "#BB0000", "TI"),
    ("qualcomm",         "qualcomm",          "#3253DC", "QC"),
    ("nxp",              "nxpsemiconductors", "#F4A21E", "NX"),
    ("exxonmobil",       "exxonmobil",        "#D22630", "XM"),
    ("schlumberger",     "slb",               "#EA2127", "SL"),
    ("accenture",        "accenture",         "#A100FF", "AC"),
    ("samsung",          "samsung",           "#1428A0", "SA"),
    ("paytm",            "paytm",             "#002970", "PA"),
    ("amdocs",           None,                "#FF0000", "AM"),
    ("bain",             None,                "#CC0000", "BA"),
]

copied = 0; badges = 0

for filename, slug, color, initials in LOGOS:
    dest = os.path.join(LOGOS_DIR, f"{filename}.svg")

    if slug:
        src = os.path.join(SI_DIR, f"{slug}.svg")
        if os.path.exists(src):
            shutil.copy2(src, dest)
            print(f"  OK copied  : {filename} <- {slug}.svg")
            copied += 1
            continue
        else:
            print(f"  ? missing : {slug}.svg in simple-icons")

    # Badge fallback
    with open(dest, "w") as f:
        f.write(make_badge(initials, color))
    print(f"  - badge   : {filename} [{initials}] {color}")
    badges += 1

print(f"\nDONE {copied} from simple-icons  |  {badges} badges")
