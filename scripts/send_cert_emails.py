#!/usr/bin/env python3
"""Send certificate emails and update CSV with certificate IDs and graduate status.

Usage:
  SMTP credentials are read from environment variables:
    SMTP_HOST, SMTP_PORT (optional, default 587), SMTP_USER, SMTP_PASSWORD, FROM_EMAIL

  Example dry-run (no SMTP send, only CSV update):
    python3 scripts/send_cert_emails.py --csv resources/roadmap_sheet.csv --dry-run

  Live send:
    export SMTP_HOST=smtp.example.com SMTP_USER=you@domain.com SMTP_PASSWORD=... FROM_EMAIL="JM Brandify <no-reply@brandify.com>"; \
    python3 scripts/send_cert_emails.py --csv resources/roadmap_sheet.csv

The script expects the CSV to contain at least these columns (case-sensitive):
  email, name, program, passed
It will add/update: certificate_id, verification_reference, email_sent, graduate_status
"""
import csv
import os
import argparse
import time
from datetime import datetime
import smtplib
from email.message import EmailMessage


PROGRAM_MAP = {
    "Operations Architect": {
        "certificate_id": "JMP-OA-050010",
        "verification_reference": "JM-2026-OA050020",
        "pdf": "JMBrandify_OperationsArchitect_Certificate.pdf",
    },
    "GHL Practitioner": {
        "certificate_id": "JMP-GHLP-050010",
        "verification_reference": "JM-2026-P050010",
        "pdf": "JMBrandify_GHL Practitioner_Certificate.pdf",
    },
}


def load_template(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return None


def send_email(smtp_cfg, from_addr, to_addr, subject, plain, attachments=None):
    msg = EmailMessage()
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = subject
    msg.set_content(plain)

    attachments = attachments or []
    for path in attachments:
        try:
            with open(path, 'rb') as f:
                data = f.read()
            maintype = 'application'
            subtype = 'pdf'
            fname = os.path.basename(path)
            msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=fname)
        except Exception:
            # skip attachments that fail to load
            pass

    host = smtp_cfg.get('host')
    port = int(smtp_cfg.get('port', 587))
    user = smtp_cfg.get('user')
    pwd = smtp_cfg.get('password')

    with smtplib.SMTP(host, port, timeout=30) as s:
        s.starttls()
        if user and pwd:
            s.login(user, pwd)
        s.send_message(msg)


def normalize_passed(val):
    if val is None:
        return False
    v = str(val).strip().lower()
    return v in ('1', 'true', 'yes', 'passed', 'pass', 'graduated', 'complete', 'completed')


def generate_fallback_id(program):
    # Simple timestamp-based fallback id
    ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    safe = ''.join(c for c in program if c.isalnum())[:6].upper() or 'GEN'
    return f"JMP-{safe}-{ts[-6:]}"


def process_csv(csv_path, template_path, certificates_dir, smtp_cfg, from_email, dry_run=True):
    template = load_template(template_path) or ''
    followup_template = load_template(os.environ.get('FOLLOWUP_TEMPLATE') or os.path.join(certificates_dir, 'certification_followup_template.md')) or ''

    temp_path = csv_path + '.tmp'
    updated_rows = []
    now = datetime.utcnow().isoformat()

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        orig_fieldnames = list(reader.fieldnames or [])

        # Auto-map common header names (case-insensitive)
        lower_map = {h.lower(): h for h in orig_fieldnames}
        def find_header(candidates):
            for c in candidates:
                key = c.lower()
                if key in lower_map:
                    return lower_map[key]
            return None

        name_h = find_header(['name', 'full name', 'fullname'])
        email_h = find_header(['email', 'e-mail', 'email address', 'email_address'])
        program_h = find_header(['program', 'course', 'cert', 'certificate', 'program name'])
        passed_h = find_header(['passed', 'status', 'result', 'outcome', 'completed', 'complete'])

        fieldnames = list(orig_fieldnames)
        # ensure output fields
        for extra in ('certificate_id', 'verification_reference', 'email_sent', 'graduate_status', 'followup_sent'):
            if extra not in fieldnames:
                fieldnames.append(extra)

        for row in reader:
            # get mapped values with fallbacks
            email = (row.get(email_h) or row.get('email') or '').strip() if email_h else (row.get('email') or '').strip()
            name = (row.get(name_h) or row.get('Name') or '').strip() if name_h else (row.get('Name') or row.get('name') or '').strip()
            program = (row.get(program_h) or row.get('program') or '').strip() if program_h else (row.get('program') or '')
            passed_val = None
            if passed_h:
                passed_val = row.get(passed_h)
            else:
                # try common fallback columns
                passed_val = row.get('passed') or row.get('status') or row.get('Status')

            passed = normalize_passed(passed_val)

            # set graduate_status
            row['graduate_status'] = 'Passed' if passed else 'Failed'

            # If passed and no certificate_id yet, generate or map one
            if passed and not row.get('certificate_id'):
                info = PROGRAM_MAP.get(program)
                if info:
                    cid = info.get('certificate_id')
                    vref = info.get('verification_reference')
                    pdfname = info.get('pdf')
                else:
                    cid = generate_fallback_id(program or 'GEN')
                    vref = ''
                    pdfname = None

                row['certificate_id'] = cid
                row['verification_reference'] = vref

                # prepare email content
                body = template
                # allow simple placeholders
                for key, val in (('name', name), ('program', program), ('certificate_id', cid), ('verification_reference', vref)):
                    body = body.replace('{{' + key + '}}', val).replace('{' + key + '}', val)

                subject = f"Your {program} Certificate from JM Brandify"

                attachments = []
                if pdfname:
                    candidate = os.path.join(certificates_dir, pdfname)
                    if os.path.exists(candidate):
                        attachments.append(candidate)

                if dry_run:
                    print(f"[DRY] Would send certificate to {email}: cert={cid}, attach={attachments}")
                    row['email_sent'] = ''
                else:
                    try:
                        send_email(smtp_cfg, from_email, email, subject, body, attachments=attachments)
                        row['email_sent'] = now
                        print(f"Sent to {email}")
                    except Exception as e:
                        print(f"Failed to send to {email}: {e}")
                        row['email_sent'] = f"ERROR: {e}"

            # If not passed, send a follow-up email to guide next steps
            if not passed:
                follow_body = followup_template
                for key, val in (('name', name), ('program', program)):
                    follow_body = follow_body.replace('{{' + key + '}}', val).replace('{' + key + '}', val)

                follow_subj = f"Next steps to complete your {program} certification"

                if dry_run:
                    print(f"[DRY] Would send follow-up to {email}")
                    row['followup_sent'] = ''
                else:
                    try:
                        send_email(smtp_cfg, from_email, email, follow_subj, follow_body)
                        row['followup_sent'] = now
                        print(f"Follow-up sent to {email}")
                    except Exception as e:
                        print(f"Failed follow-up to {email}: {e}")
                        row['followup_sent'] = f"ERROR: {e}"

            updated_rows.append(row)

    # write back
    with open(temp_path, 'w', newline='', encoding='utf-8') as outcsv:
        writer = csv.DictWriter(outcsv, fieldnames=fieldnames)
        writer.writeheader()
        for r in updated_rows:
            writer.writerow(r)

    # replace original
    os.replace(temp_path, csv_path)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--csv', default='resources/roadmap_sheet.csv', help='Path to CSV file')
    p.add_argument('--template', default='resources/certificates/certification_email_template.md', help='Email template path')
    p.add_argument('--cert-dir', default='resources/certificates', help='Certificates directory')
    p.add_argument('--dry-run', action='store_true', help='Do not actually send emails; only update CSV (default)')
    args = p.parse_args()

    smtp_cfg = {
        'host': os.environ.get('SMTP_HOST'),
        'port': os.environ.get('SMTP_PORT', '587'),
        'user': os.environ.get('SMTP_USER'),
        'password': os.environ.get('SMTP_PASSWORD'),
    }
    from_email = os.environ.get('FROM_EMAIL', 'JM Brandify <no-reply@brandify.com>')

    if not args.dry_run and not smtp_cfg['host']:
        print('SMTP_HOST not set; refusing to send. Use --dry-run or set SMTP_HOST.')
        return

    process_csv(args.csv, args.template, args.cert_dir, smtp_cfg, from_email, dry_run=args.dry_run)


if __name__ == '__main__':
    main()
