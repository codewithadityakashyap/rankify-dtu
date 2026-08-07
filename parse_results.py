import pdfplumber
import pandas as pd
import json
import glob
import os
import re

def parse_all_pdfs(directory, sem_key, all_students, subject_map):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    pdf_files = glob.glob(os.path.join(directory, "**/*.pdf"), recursive=True)
    print(f"\n--- Processing {sem_key} in {directory} ---")
    print(f"Found {len(pdf_files)} PDF files.")
    
    for pdf_path in pdf_files:
        print(f"Processing {os.path.basename(pdf_path)}...")
        try:
            with pdfplumber.open(pdf_path) as pdf:
                # 1. Extract subject mappings from raw text across all pages
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        # DTU Format: "CODE : SUBJECT NAME" often followed by another or newline
                        # e.g., "AM101 : MATHEMATICS-I CO101 : PROGRAMMING FUNDAMENTALS"
                        matches = re.findall(r'([A-Z0-9a-z]+)\s*:\s*([^:]+?)(?=\s+[A-Z0-9a-z]+\s*:|$|\n)', text)
                        for code, name in matches:
                            code = code.strip()
                            name = name.strip()
                            # Filter out false positives (e.g., "Result Declaration Date : 05-03-2024 Notification No: 1661")
                            if len(code) <= 7 and not code.startswith("Date"):
                                subject_map[code] = name
                
                # Global state across pages for tables that span page breaks
                current_subject_cols = []
                current_roll_idx = -1
                current_name_idx = -1
                current_sgpa_idx = -1
                
                # 2. Extract tabular data
                for page in pdf.pages:
                    tables = page.extract_tables()
                    for table in tables:
                        if not table or len(table) == 0:
                            continue
                            
                        # Find header row index
                        header_idx = -1
                        for i, row in enumerate(table):
                            if row and 'Roll No.' in row:
                                header_idx = i
                                break
                                
                        if header_idx != -1:
                            header_row = table[header_idx]
                            
                            # Find indices of key columns
                            try:
                                header_row_clean = [str(x).replace('\n', ' ').strip() if x else '' for x in header_row]
                                current_roll_idx = header_row_clean.index('Roll No.')
                                current_name_idx = header_row_clean.index('Name of Student')
                                current_sgpa_idx = header_row_clean.index('SGPA')
                            except ValueError:
                                current_roll_idx = -1
                                continue # Not a valid result table
                                
                            # Check if the next row is a credits row or a student row
                            first_student_idx = header_idx + 1
                            credits_row = None
                            if first_student_idx < len(table):
                                next_row = table[first_student_idx]
                                # If the roll number is empty, it's a credits row
                                if not next_row[current_roll_idx] or str(next_row[current_roll_idx]).strip() == "":
                                    credits_row = next_row
                                    first_student_idx += 1
                            
                            # Identify subject columns (columns between Name and SGPA)
                            current_subject_cols = []
                            for i in range(current_name_idx + 1, current_sgpa_idx):
                                code = header_row[i]
                                if code and code.strip():
                                    cred_val = 0
                                    if credits_row and len(credits_row) > i:
                                        cred = credits_row[i]
                                        cred_val = float(cred) if cred and str(cred).replace('.','',1).isdigit() else 0
                                    current_subject_cols.append({
                                        'index': i,
                                        'code': code.strip().replace('\n', ''),
                                        'credits': cred_val
                                    })
                        else:
                            # Table without header (e.g. spanned across page)
                            if current_roll_idx == -1:
                                continue
                            first_student_idx = 0
                        
                        # Process student rows
                        for row_idx in range(first_student_idx, len(table)):
                            row = table[row_idx]
                            if not row or len(row) <= current_roll_idx or not row[current_roll_idx]:
                                continue
                                
                            roll_num = str(row[current_roll_idx]).strip()
                            # Ignore header repetition or invalid rows
                            if 'Roll No' in roll_num or len(roll_num) < 5:
                                continue
                                
                            name = str(row[current_name_idx]).strip()
                            sgpa_str = str(row[current_sgpa_idx]).strip()
                            sgpa = float(sgpa_str) if sgpa_str.replace('.','',1).isdigit() else 0.0
                            
                            subjects_list = []
                            for sc in current_subject_cols:
                                grade = str(row[sc['index']]).strip() if sc['index'] < len(row) and row[sc['index']] else "N/A"
                                subjects_list.append({
                                    "code": sc['code'],
                                    "name": subject_map.get(sc['code'], sc['code']),
                                    "credits": sc['credits'],
                                    "grade": grade
                                })
                            
                            # Add or update student
                            if roll_num not in all_students:
                                all_students[roll_num] = {
                                    "rollNumber": roll_num,
                                    "name": name,
                                    "semesters": {}
                                }
                            
                            # Merge logic for reappear results
                            if sem_key in all_students[roll_num]["semesters"]:
                                if sgpa > 0:
                                    all_students[roll_num]["semesters"][sem_key]["sgpa"] = sgpa
                                
                                existing_subjects = {s["code"]: s for s in all_students[roll_num]["semesters"][sem_key]["subjects"]}
                                for subj in subjects_list:
                                    existing_subjects[subj["code"]] = subj
                                
                                all_students[roll_num]["semesters"][sem_key]["subjects"] = list(existing_subjects.values())
                            else:
                                all_students[roll_num]["semesters"][sem_key] = {
                                    "sgpa": sgpa,
                                    "subjects": subjects_list
                                }
        except Exception as e:
            print(f"Error processing {pdf_path}: {e}")

if __name__ == "__main__":
    output_path = "src/data/transcripts.json"
    all_students = {}
    subject_map = {}
    
    # Load existing transcripts to preserve 2027 data
    if os.path.exists(output_path):
        with open(output_path, 'r') as f:
            all_students = json.load(f)
            print(f"Loaded {len(all_students)} existing students from {output_path}")

    # Process 2028 Semesters (which also contain 2027 reappears)
    parse_all_pdfs("data/Result/2028/sem 1 result", "sem1", all_students, subject_map)
    parse_all_pdfs("data/Result/2028/sem 2 result", "sem2", all_students, subject_map)
    parse_all_pdfs("data/Result/2028/sem 3 resullt", "sem3", all_students, subject_map)
    parse_all_pdfs("data/Result/2028/sem 4 result", "sem4", all_students, subject_map)

    # Write to JSON
    with open(output_path, 'w') as f:
        json.dump(all_students, f, indent=2)
    
    print(f"\nSuccessfully processed and merged {len(all_students)} students total. Data saved to {output_path}")
