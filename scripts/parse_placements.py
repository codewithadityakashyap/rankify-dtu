import pandas as pd
import re
import json
import os

VALID_BRANCHES = {'CO', 'IT', 'EC', 'EE', 'ME', 'CE', 'CH', 'BT', 'SE', 'MC', 'PE', 'AE', 'EP', 'EN'}
VALID_TYPES = {'tech', 'non tech', 'core'}

def normalize_type(t: str) -> str:
    t = t.strip().lower()
    if 'non' in t:
        return 'Non-Tech'
    if 'core' in t:
        return 'Core'
    if 'tech' in t:
        return 'Tech'
    return 'Unknown'

def parse_placements():
    df = pd.read_excel('data/Updated_Placement.xlsx', header=None)
    records = []

    for i, row in enumerate(df.iloc[1:].itertuples(), start=1):
        val = str(row._1).strip()
        if not val or val.lower().startswith('roll no') or val == 'nan':
            continue

        # 1. Roll No
        roll_no_match = re.search(r'^([a-zA-Z0-9]+/[a-zA-Z]+/[0-9]+)\s+', val)
        if not roll_no_match:
            continue

        roll_no = roll_no_match.group(1)
        rem = val[roll_no_match.end():]

        # 2. CGPA — first decimal-like number after the name
        cgpa_match = re.search(r'\s+(\d+\.\d+|\d+)\s+', rem)
        if not cgpa_match:
            continue

        name = rem[:cgpa_match.start()].strip()
        cgpa = float(cgpa_match.group(1))
        rem = rem[cgpa_match.end():]

        # 3. End: Count Type Branch — extract from the right
        #    Pattern: <count> <type> <branch>  e.g.  12 Tech CO  or  3 Non Tech IT
        end_match = re.search(
            r'\s+(\d+)\s+((?:Non\s+)?Tech|Core)\s+([A-Z]{2,6})$',
            rem, re.IGNORECASE
        )
        if not end_match:
            records.append({
                'rollNumber': roll_no, 'name': name, 'cgpa': cgpa,
                'company': rem.split(' ')[0] if rem else 'Unknown',
                'roleDetails': rem, 'ctc': 0.0,
                'type': 'Unknown', 'branch': 'Unknown'
            })
            continue

        count   = int(end_match.group(1))
        type_   = normalize_type(end_match.group(2))
        branch  = end_match.group(3).strip().upper()
        if branch not in VALID_BRANCHES:
            branch = 'Unknown'

        rem = rem[:end_match.start()].strip()

        # 4. CTC — last number followed by lpa / LPA / lacs
        ctc_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:lpa|LPA|lacs)', rem)
        ctc_val = 0.0
        if ctc_match:
            try:
                ctc_val = float(ctc_match.group(1))
            except Exception:
                pass

        # 5. Company name — first token
        company_name = rem.split(' ')[0] if rem else 'Unknown'

        # 6. Role — try to isolate the role word
        role = 'Unknown'
        role_keywords = ['SDE', 'Analyst', 'GET', 'Intern', 'Trainee', 'Engineer',
                         'Consultant', 'Manager', 'Developer', 'Associate', 'PMT',
                         'Software', 'Data', 'Systems', 'Product', 'Research', 'TDP',
                         'DSE', 'SDET', 'RPM', 'SDR', 'nFinia', 'Payfinia', 'SW']
        for kw in role_keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', rem, re.IGNORECASE):
                role = kw
                break

        records.append({
            'rollNumber': roll_no,
            'name': name,
            'cgpa': round(cgpa, 3),
            'company': company_name,
            'role': role,
            'roleDetails': rem,
            'ctc': ctc_val,
            'type': type_,
            'branch': branch
        })

    os.makedirs('src/data', exist_ok=True)
    with open('src/data/placements.json', 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"Parsed {len(records)} placement records.")

if __name__ == "__main__":
    parse_placements()
