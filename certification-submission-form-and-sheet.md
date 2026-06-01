# JM Brandify Certification Submission Form & Google Sheet Tracking

## Certification Submission Form HTML

```html
<div id="certSubmissionModal" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:9999; align-items:center; justify-content:center; padding:20px; overflow:auto;">
  <div class="modal-content" style="background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:16px; max-width:760px; width:100%; padding:28px; position:relative; box-shadow:0 24px 48px rgba(0,0,0,.45);">
    <button id="certModalClose" style="position:absolute; top:16px; right:16px; width:34px; height:34px; border:none; border-radius:50%; background:rgba(255,255,255,.05); color:var(--text); font-size:18px; cursor:pointer;">×</button>
    <div style="font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:1px; margin-bottom:12px; color:var(--white); text-align:center;">JM Brandify Certification Submission</div>
    <p style="margin:0 0 20px; color:var(--muted); font-size:14px; line-height:1.7; text-align:center;">Complete the form below and upload your evidence for review.</p>
    <form id="certSubmissionForm" style="display:grid; gap:14px;">
      <div style="display:grid; gap:10px;">
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Full Name *
          <input id="certName" type="text" placeholder="Your full name" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Email Address *
          <input id="certEmail" type="email" placeholder="you@example.com" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">LinkedIn Profile
          <input id="certLinkedIn" type="url" placeholder="https://linkedin.com/in/yourname" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;">
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Certification Applying For *
          <select id="certType" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select Certification</option>
            <option value="GHL Mastery Practitioner">GHL Mastery Practitioner</option>
            <option value="Operations Architect Certification">Operations Architect Certification</option>
          </select>
        </label>
      </div>
      <div style="display:grid; gap:10px; margin-top:10px;">
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Google Drive Folder Link *
          <input id="certDriveLink" type="url" placeholder="https://drive.google.com/drive/folders/..." style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
        </label>
        <p style="margin:0; color:var(--muted); font-size:13px;">Instructions: Upload all screenshots, PDFs, SOPs, and supporting documents into a Google Drive folder and paste the share link here.</p>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Funnel URL (if applicable)
          <input id="certFunnelUrl" type="url" placeholder="https://" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;">
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Workflow Screenshot Folder
          <input id="certWorkflowFolder" type="url" placeholder="https://drive.google.com/drive/folders/..." style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;">
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Snapshot Documentation
          <textarea id="certSnapshotDoc" rows="3" placeholder="Describe your snapshot documentation" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px; resize:vertical;"></textarea>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Loom Walkthrough Link (Optional)
          <input id="certLoomLink" type="url" placeholder="https://www.loom.com/share/..." style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;">
        </label>
      </div>
      <div style="display:grid; gap:10px; margin-top:10px;">
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Phase 1 CRM Foundation Completed? *
          <select id="certPhase1" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Phase 2 Lead Capture Funnel Completed? *
          <select id="certPhase2" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Phase 3 Lead Nurture System Completed? *
          <select id="certPhase3" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Phase 4 SaaS Snapshot Completed? *
          <select id="certPhase4" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Phase 5 Client Provisioning System Completed? *
          <select id="certPhase5" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Bonus Specialist Phase Completed?
          <select id="certBonusPhase" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px;">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </div>
      <div style="display:grid; gap:10px; margin-top:10px;">
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">Describe the business problem your implementation solves. *
          <textarea id="certProblem" rows="3" placeholder="Describe the business problem" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px; resize:vertical;" required></textarea>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">What was the most challenging part of the project? *
          <textarea id="certChallenge" rows="3" placeholder="Describe the challenge" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px; resize:vertical;" required></textarea>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px; color:var(--white); font-size:13px;">What are you most proud of building? *
          <textarea id="certProud" rows="3" placeholder="What are you most proud of?" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); color:var(--text); font-size:14px; resize:vertical;" required></textarea>
        </label>
      </div>
      <label style="display:flex; align-items:center; gap:10px; color:var(--white); font-size:13px; margin-top:10px;">
        <input id="certAgreement" type="checkbox" style="width:16px; height:16px; accent-color:var(--cyan);" required>
        <span>I confirm that all submitted work is my own implementation and may be reviewed for certification purposes.</span>
      </label>
      <button type="submit" style="width:100%; padding:14px 16px; border:none; border-radius:12px; background:linear-gradient(135deg, var(--cyan), var(--cyan2)); color:#000; font-weight:700; cursor:pointer;">Submit Portfolio</button>
      <div id="certSubmissionConfirmation" style="display:none; margin-top:14px; padding:14px 16px; border-radius:10px; background:rgba(41,182,246,.1); color:var(--cyan); font-size:14px; text-align:center; border:1px solid rgba(41,182,246,.25);">Thank you for submitting your output. Our team will review it and send you feedback once completed.</div>
    </form>
  </div>
</div>
```

## Google Sheet Tracking Columns

- Timestamp
- Student Name
- Email
- LinkedIn
- Certification Type
- Drive Folder Link
- Funnel URL
- Loom Link
- Phase 1 Status
- Phase 2 Status
- Phase 3 Status
- Phase 4 Status
- Phase 5 Status
- Bonus Phase Status
- AI Score
- AI Recommendation
- Reviewer Status
- Final Score
- Certification Status
- Reviewer Notes
- Certificate Sent
- Badge Sent
- Review Date

## Notes
- The modal is triggered by any element with class `cert-submission-trigger`.
- The form is in `ghl-roadmap.html` inside the `#certSubmissionModal` block.
- The submission confirmation is shown in `#certSubmissionConfirmation` after form submit.
