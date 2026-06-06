#!/usr/bin/env python3
"""Webhook stub for payment, enrollment, and certification workflow automation.

This script can run as a local webhook server or process a sample payload from disk.

Usage examples:
  python3 scripts/webhook_stub.py --csv resources/roadmap_sheet.csv --dry-run --payload-file sample_payment.json
  python3 scripts/webhook_stub.py --serve --csv resources/roadmap_sheet.csv

The script updates the CSV with standard certification workflow fields and prints what it would do.
"""

import argparse
import csv
import json
import os
from datetime import datetime

try:
    from flask import Flask, jsonify, request
except ImportError:
    Flask = None

DEFAULT_FIELDS = [
    'user_id', 'name', 'email',
    'payment_id', 'payment_status', 'payment_date', 'amount',
    'enrollment_date', 'access_granted',
    'progress_pct', 'quiz_score', 'submission_date', 'submission_url',
    'review_status', 'reviewer', 'review_notes', 'review_date',
    'certificate_id', 'verification_reference', 'certificate_pdf',
    'email_sent', 'followup_sent', 'graduate_status',
    'webhook_event_id', 'audit_log',
]

PAYMENT_STATUS_SUCCESS = {'paid', 'success', 'completed', 'completed_success', 'succeeded'}


def load_csv(csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = list(reader.fieldnames or [])
    return rows, fieldnames


def save_csv(csv_path, rows, fieldnames):
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def find_header(fieldnames, candidates):
    lower_map = {h.lower(): h for h in fieldnames}
    for candidate in candidates:
        if candidate.lower() in lower_map:
            return lower_map[candidate.lower()]
    return None


def ensure_fields(fieldnames, extras):
    for extra in extras:
        if extra not in fieldnames:
            fieldnames.append(extra)
    return fieldnames


def normalize_bool(value):
    if value is None:
        return ''
    v = str(value).strip().lower()
    if v in ('true', 'yes', '1', 'y', 't'):
        return 'true'
    if v in ('false', 'no', '0', 'n', 'f'):
        return 'false'
    return value


def normalize_payment_status(value):
    if value is None:
        return ''
    return str(value).strip().lower()


def coerce_date(value):
    if not value:
        return ''
    return str(value).strip()


def find_user_row(rows, payload):
    user_id = payload.get('user_id')
    email = payload.get('email')
    for row in rows:
        if user_id and row.get('user_id') and row.get('user_id') == user_id:
            return row
        if email and row.get('email') and row.get('email').lower() == email.lower():
            return row
    return None


def append_audit(row, entry):
    audit = row.get('audit_log', '') or ''
    timestamp = datetime.utcnow().isoformat()
    line = f"[{timestamp}] {entry}"
    if audit:
        audit = audit + '\n' + line
    else:
        audit = line
    row['audit_log'] = audit


def process_payment_event(rows, fieldnames, payload, dry_run=True):
    payment_id = payload.get('payment_id')
    status = normalize_payment_status(payload.get('payment_status') or payload.get('status'))
    amount = payload.get('amount')
    payment_date = coerce_date(payload.get('payment_date') or payload.get('paid_at') or datetime.utcnow().isoformat())
    event_id = payload.get('event_id') or payload.get('webhook_id')
    user_id = payload.get('user_id')
    email = payload.get('email')
    name = payload.get('name')

    fieldnames = ensure_fields(fieldnames, DEFAULT_FIELDS)

    row = find_user_row(rows, payload)
    if not row:
        row = {key: '' for key in fieldnames}
        if user_id:
            row['user_id'] = user_id
        if name:
            row['name'] = name
        if email:
            row['email'] = email
        rows.append(row)

    if event_id:
        existing_event = row.get('webhook_event_id', '')
        if event_id == existing_event:
            print(f"Duplicate event ignored: {event_id}")
            return fieldnames

    if payment_id:
        row['payment_id'] = payment_id
    row['payment_status'] = status
    row['amount'] = amount
    row['payment_date'] = payment_date

    if status in PAYMENT_STATUS_SUCCESS:
        if not row.get('enrollment_date'):
            row['enrollment_date'] = datetime.utcnow().isoformat()
        row['access_granted'] = 'true'
        append_audit(row, f"Payment succeeded: {payment_id} amount={amount}")
        action = "onboarding email + provisioning" if dry_run else "onboarding email + provisioning triggered"
        print(f"[PAYMENT] Success for {email or user_id}: {action}")
    else:
        row['access_granted'] = 'false'
        append_audit(row, f"Payment failed or pending: {payment_id} status={status}")
        print(f"[PAYMENT] Non-success status for {email or user_id}: {status}")

    if event_id:
        row['webhook_event_id'] = event_id

    if not row.get('graduate_status'):
        row['graduate_status'] = 'Pending'

    return fieldnames


def process_payload(csv_path, payload, dry_run=True):
    rows, fieldnames = load_csv(csv_path)
    event_type = payload.get('type', 'payment')

    if event_type == 'payment':
        fieldnames = process_payment_event(rows, fieldnames, payload, dry_run=dry_run)
    else:
        print(f"Unsupported event type: {event_type}")

    if not dry_run:
        save_csv(csv_path, rows, fieldnames)
        print(f"CSV updated: {csv_path}")
    else:
        print("Dry run mode: no CSV write")


def create_app(csv_path, dry_run=False):
    if Flask is None:
        raise RuntimeError('Flask is required to run the webhook server. Install dependencies with pip install -r requirements.txt')

    app = Flask(__name__)

    @app.route('/webhook', methods=['POST'])
    def webhook():
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        try:
            process_payload(csv_path, payload, dry_run=dry_run)
            return jsonify({'status': 'processed', 'dry_run': dry_run})
        except Exception as exc:
            return jsonify({'error': str(exc)}), 500

    return app


def main():
    parser = argparse.ArgumentParser(description='Webhook stub for payment and certification workflow automation')
    parser.add_argument('--csv', default='resources/roadmap_sheet.csv', help='Path to the enrollment CSV file')
    parser.add_argument('--payload-file', help='JSON file containing a sample webhook payload')
    parser.add_argument('--dry-run', action='store_true', help='Do not write CSV changes; only simulate actions')
    parser.add_argument('--serve', action='store_true', help='Run a local webhook server')
    parser.add_argument('--port', type=int, default=5000, help='Local webhook server port')
    args = parser.parse_args()

    if args.serve:
        app = create_app(args.csv, dry_run=args.dry_run)
        print(f"Starting webhook server on http://127.0.0.1:{args.port}/webhook")
        app.run(port=args.port)
        return

    if not args.payload_file:
        print('Provide --payload-file with a sample JSON webhook payload to process or use --serve.')
        return

    with open(args.payload_file, 'r', encoding='utf-8') as f:
        payload = json.load(f)

    process_payload(args.csv, payload, dry_run=args.dry_run)


if __name__ == '__main__':
    main()
