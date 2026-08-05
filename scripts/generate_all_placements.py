import pandas as pd
import json
import math
import os

def generate_placements():
    df = pd.read_excel('data/Updated_Placement.xlsx')
    
    # 1. Generate placements.json
    placements = []
    for _, row in df.iterrows():
        # Handle nan values gracefully
        roll_no = str(row['Roll No.']).strip() if pd.notna(row['Roll No.']) else 'Unknown'
        name = str(row['Name']).strip() if pd.notna(row['Name']) else 'Unknown'
        cgpa = 0.0
        if pd.notna(row['CGPA']):
            import re
            match = re.search(r'([0-9]+\.[0-9]+)', str(row['CGPA']))
            if match:
                cgpa = float(match.group(1))
        company = str(row['Company']).strip() if pd.notna(row['Company']) else 'Unknown'
        if company == 'Texas Instrumetns':
            company = 'Texas Instruments'
        role = str(row['Role']).strip() if pd.notna(row['Role']) else 'Unknown'
        branch = str(row['Branch']).strip() if pd.notna(row['Branch']) else 'Unknown'
        type_ = str(row['Type']).strip() if pd.notna(row['Type']) else 'Unknown'
        
        # Package might be string with ranges or just number
        ctc_raw = row['Package(LPA)']
        ctc = 0.0
        if pd.notna(ctc_raw):
            try:
                if isinstance(ctc_raw, str):
                    # extract first number
                    import re
                    match = re.search(r'([0-9]+\.?[0-9]*)', ctc_raw)
                    if match:
                        ctc = float(match.group(1))
                else:
                    ctc = float(ctc_raw)
            except Exception:
                pass
                
        duration = str(row['Duration']).strip() if pd.notna(row['Duration']) else ''
        role_details = f"{role} {duration}".strip()
        
        placements.append({
            'rollNumber': roll_no,
            'name': name,
            'cgpa': round(cgpa, 3),
            'company': company,
            'role': role,
            'roleDetails': role_details,
            'duration': duration,
            'ctc': ctc,
            'type': type_,
            'branch': branch
        })
        
    with open('src/data/placements.json', 'w', encoding='utf-8') as f:
        json.dump(placements, f, indent=2, ensure_ascii=False)
        
    print(f"Generated src/data/placements.json with {len(placements)} records.")
    
    # 2. Generate placement_data.json
    company_groups = {}
    for p in placements:
        comp = p['company']
        if comp not in company_groups:
            company_groups[comp] = {
                'name': comp,
                'minCgpa': p['cgpa'],
                'maxCtc': p['ctc'],
                'type': p['type'],
                'branches': set([p['branch']])
            }
        else:
            if p['cgpa'] > 0 and p['cgpa'] < company_groups[comp]['minCgpa']:
                company_groups[comp]['minCgpa'] = p['cgpa']
            if p['ctc'] > company_groups[comp]['maxCtc']:
                company_groups[comp]['maxCtc'] = p['ctc']
            company_groups[comp]['branches'].add(p['branch'])
            
    companies = []
    for comp_data in company_groups.values():
        branches = list(comp_data['branches'])
        if len(branches) > 5:
            branches = ["ALL"]
            
        companies.append({
            "name": comp_data['name'],
            "minCgpa": round(comp_data['minCgpa'], 2),
            "package": f"{comp_data['maxCtc']} LPA",
            "type": comp_data['type'],
            "branches": branches
        })
        
    # Sort companies by package descending
    companies.sort(key=lambda x: float(x['package'].split()[0]), reverse=True)
    
    with open('src/data/placement_data.json', 'w', encoding='utf-8') as f:
        json.dump({"companies": companies}, f, indent=2, ensure_ascii=False)
        
    print(f"Generated src/data/placement_data.json with {len(companies)} companies.")

if __name__ == "__main__":
    generate_placements()
