from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import textwrap
import os

files = [
    'workflow-planning-template.md',
    'funnel-planning-worksheet.md',
    'discovery-call-form.md',
    'pipeline-blueprint-template.md',
    'client-onboarding-checklist.md'
]


def create_pdf(md_filename):
    pdf_filename = md_filename.rsplit('.', 1)[0] + '.pdf'
    with open(os.path.join('resources', md_filename), 'r', encoding='utf-8') as f:
        lines = f.readlines()

    c = canvas.Canvas(os.path.join('resources', pdf_filename), pagesize=letter)
    width, height = letter
    margin = 0.75 * inch
    x = margin
    y = height - margin
    heading1_size = 18
    heading2_size = 16
    heading3_size = 14
    normal_size = 12

    def add_text(text, size=normal_size, leading=None):
        nonlocal y
        if leading is None:
            leading = size + 2
        wrapper = textwrap.wrap(text, width=95)
        for wrapped in wrapper:
            if y < margin + leading:
                c.showPage()
                y = height - margin
            c.setFont('Helvetica-Bold' if size >= heading2_size else 'Helvetica', size)
            c.drawString(x, y, wrapped)
            y -= leading
        if not wrapper:
            y -= leading

    for raw in lines:
        line = raw.rstrip('\n')
        if line.startswith('# '):
            add_text(line[2:].strip(), heading1_size, heading1_size + 2)
            y -= 4
        elif line.startswith('## '):
            add_text(line[3:].strip(), heading2_size, heading2_size + 2)
            y -= 2
        elif line.startswith('### '):
            add_text(line[4:].strip(), heading3_size, heading3_size + 2)
            y -= 2
        elif line.startswith('- '):
            text = '• ' + line[2:]
            add_text(text, normal_size)
        elif line.startswith('* '):
            text = '• ' + line[2:]
            add_text(text, normal_size)
        elif line.startswith('|') and '---' not in line:
            add_text(line, normal_size)
        elif line.strip() == '---':
            y -= 6
        elif line.strip() == '':
            y -= normal_size
        else:
            text = line.replace('**', '')
            add_text(text, normal_size)

    c.save()
    print(f'Created {pdf_filename}')


for md_filename in files:
    create_pdf(md_filename)
