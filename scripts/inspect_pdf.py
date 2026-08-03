import sys
import PyPDF2

def extract_text(pdf_path, max_pages=2):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for i, page in enumerate(reader.pages):
                if i >= max_pages:
                    break
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        return f"Error with PyPDF2: {e}"

if __name__ == "__main__":
    pdf_path = r"d:\DTU Result\dtu-result-portal\data\sem 6 result\E26_BTECH_VI_CS_1957.pdf"
    text = extract_text(pdf_path)
    with open(r"d:\DTU Result\dtu-result-portal\data\sample_pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Extraction done.")
