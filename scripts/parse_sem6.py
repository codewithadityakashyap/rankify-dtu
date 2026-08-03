import os
import re
import json
import PyPDF2

def parse_pdfs(pdf_dir, json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        results = json.load(f)
    
    student_map = { s['rollNumber']: s for s in results }
    
    roll_pattern = re.compile(r"((?:2K\d{2}|\d{2})/[A-Z0-9]+/\d+)")
    sgpa_pattern = re.compile(r"(\d+\.\d{2})\s+(\d+)")
    grades_set = {'O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', 'I'}
    
    matched_count = 0
    not_found_count = 0

    for filename in os.listdir(pdf_dir):
        if not filename.endswith('.pdf'):
            continue
        filepath = os.path.join(pdf_dir, filename)
        
        try:
            with open(filepath, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if not text:
                        continue
                    lines = text.split('\n')
                    i = 0
                    while i < len(lines):
                        line = lines[i]
                        i += 1
                        if len(line.strip()) < 10:
                            continue
                        
                        m_roll = roll_pattern.search(line)
                        m_sgpa = sgpa_pattern.search(line)
                        
                        if m_roll and not m_sgpa:
                            # SGPA might be wrapped to the next line
                            if i < len(lines):
                                next_line = lines[i]
                                i += 1
                                line = line + " " + next_line
                                m_sgpa = sgpa_pattern.search(line)
                        
                        if m_roll and m_sgpa:
                            # check if it's a valid row (starts with Sr No)
                            first_token = line.strip().split()[0]
                            if not first_token.isdigit():
                                continue
                            
                            roll_no = m_roll.group(1)
                            sgpa = float(m_sgpa.group(1))
                            
                            start_idx = m_roll.end()
                            remainder = line[start_idx:m_sgpa.start()].strip()
                            
                            rem_parts = remainder.split()
                            name_parts = []
                            for p in rem_parts:
                                if p in grades_set:
                                    break
                                name_parts.append(p)
                            name = " ".join(name_parts).strip()
                            branch = roll_no.split('/')[1] if '/' in roll_no else 'UNK'

                            if roll_no in student_map:
                                student = student_map[roll_no]
                                if 'sgpa' not in student:
                                    student['sgpa'] = {}
                                student['sgpa']['sem6'] = sgpa
                                student['latestSgpa'] = sgpa
                                matched_count += 1
                            else:
                                new_student = {
                                    "name": name,
                                    "rollNumber": roll_no,
                                    "branch": branch,
                                    "sgpa": {
                                        "sem6": sgpa
                                    },
                                    "latestSgpa": sgpa,
                                    "cgpa": sgpa,
                                    "overallRank": 9999,
                                    "branchRank": 9999,
                                    "semesterRank": 9999
                                }
                                results.append(new_student)
                                student_map[roll_no] = new_student
                                not_found_count += 1
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    # Remove duplicates if any (just in case)
    unique_results = list({v['rollNumber']:v for v in results}.values())

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(unique_results, f, indent=2)

    print(f"Extraction complete! Matched and updated {matched_count} existing students. Added {not_found_count} new students.")

if __name__ == "__main__":
    pdf_dir = r"d:\DTU Result\dtu-result-portal\data\sem 6 result"
    json_path = r"d:\DTU Result\dtu-result-portal\public\data\results.json"
    parse_pdfs(pdf_dir, json_path)
