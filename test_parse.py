import pandas as pd
import re

df = pd.read_excel('data/placementstst.xlsx', header=None)
records = []
errors = []

for i, row in enumerate(df.iloc[1:].itertuples(), start=1):
    val = str(row._1).strip()
    if not val or val.lower().startswith('roll no'):
        continue
    
    # 1. Extract Roll No
    roll_no_match = re.search(r'^([a-zA-Z0-9]+/[a-zA-Z]+/[0-9]+)\s+', val)
    if not roll_no_match:
        errors.append(f"Row {i} Roll No not found: {val}")
        continue
    roll_no = roll_no_match.group(1)
    rem = val[roll_no_match.end():]
    
    # 2. Extract CGPA
    cgpa_match = re.search(r'\s+(\d+\.\d+|\d+)\s+', rem)
    if not cgpa_match:
        errors.append(f"Row {i} CGPA not found: {val}")
        continue
    
    name = rem[:cgpa_match.start()].strip()
    cgpa = float(cgpa_match.group(1))
    rem = rem[cgpa_match.end():]
    
    # 3. Extract the end: Count, Type, Branch
    end_match = re.search(r'\s+(\d+)\s+((?:Non\s+)?Tech|Core(?:\s*Engineer)?)\s+([A-Z]{2})$', rem, re.IGNORECASE)
    if not end_match:
        errors.append(f"Row {i} End not found: {rem}")
        continue
        
    count = int(end_match.group(1))
    type_ = end_match.group(2).strip()
    branch = end_match.group(3).strip()
    
    rem = rem[:end_match.start()].strip()
    
    # Extract CTC
    ctc_match = re.search(r'([0-9\.]+)\s*(?:lpa|LPA|lacs)(?:[^\d]*)$', rem, re.IGNORECASE)
    ctc_val = 0.0
    if ctc_match:
        try:
            ctc_val = float(ctc_match.group(1))
        except:
            pass
    
    # Just grab first word as company name for stats
    company_name = rem.split(' ')[0]
    
    records.append({
        'roll_no': roll_no,
        'name': name,
        'cgpa': cgpa,
        'companyRaw': company_name,
        'rem': rem,
        'ctc': ctc_val,
        'type': type_,
        'branch': branch
    })

print(f"Parsed {len(records)} records, {len(errors)} errors")
if errors:
    for e in errors[:5]:
        print(e)
    if len(errors) > 5:
        print("...")

df_res = pd.DataFrame(records)
print("\nCompanies:")
print(df_res['companyRaw'].value_counts().head(30).to_string())
if len(records) > 0:
    print("\nSample records:")
    print(df_res[['name', 'companyRaw', 'ctc', 'type', 'branch']].head(5).to_string())
