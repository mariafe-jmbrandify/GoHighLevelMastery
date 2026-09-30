import os
import urllib.request

SHEET_ID = "1Vd1_mrTNa-w5dWiVQEfiKr8aGw1Gejul4aD98BSh7aQ"
SHEET_GID = "1241651133"
CSV_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "resources", "roadmap_sheet.csv")


def download_sheet():
    print(f"Downloading Google Sheet {SHEET_ID}...")
    with urllib.request.urlopen(CSV_URL) as response:
        data = response.read().decode("utf-8")

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8", newline="") as outfile:
        outfile.write(data)

    row_count = data.count("\n")
    print(f"Saved {OUTPUT_PATH} ({row_count} lines)")


if __name__ == "__main__":
    download_sheet()
