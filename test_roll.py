import pdfplumber

def check_roll():
    with pdfplumber.open("d:/DTU Result/dtu-result-portal/data/Result/2029/sem 1 result/O25_BTECH_I_CS_R2_1932.pdf") as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                import re
                matches = re.findall(r'25/\w+/\d+', text)
                if matches:
                    print(text[:2000])
                    break

if __name__ == "__main__":
    check_roll()
