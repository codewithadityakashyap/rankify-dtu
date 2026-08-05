import pdfplumber
import sys

def inspect(pdf_path):
    print(f"Inspecting {pdf_path}...")
    with pdfplumber.open(pdf_path) as pdf:
        if len(pdf.pages) == 0:
            print("No pages found.")
            return
            
        page = pdf.pages[0]
        print(f"Page 1 size: {page.width} x {page.height}")
        
        # Extract text to see raw string
        text = page.extract_text()
        print("\n--- RAW TEXT ---")
        print(text[:1000] if text else "None")
        print("...\n")
        
        # Extract tables to see grid data
        tables = page.extract_tables()
        print(f"Found {len(tables)} tables.")
        if len(tables) > 0:
            print("\n--- FIRST TABLE PREVIEW ---")
            for row in tables[0][:10]:  # Print first 10 rows
                print(row)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect(sys.argv[1])
    else:
        print("Usage: python inspect_pdf.py <path_to_pdf>")
