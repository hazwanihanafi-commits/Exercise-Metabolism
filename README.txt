# TCE504 Exercise Metabolism — Complete 27-Section Master

This package combines the actual section files developed for TCE504 Sections 1–27 without replacing them with simplified content.

## Structure
- `index.html` — master navigation shell
- `sections/01.html` … `sections/27.html` — the actual completed section websites
- `sections.json` — section map
- `TCE504_COMPLETE_GOOGLE_APPS_SCRIPT_V3.gs` — Google Sheets backend

## Google Sheet
The master uses the Apps Script Web App URL already supplied for TCE504:
https://script.google.com/macros/s/AKfycbzawMrdcdA55TrrjW7PlIApkDrgxirOVUJM4mZ4EpKnOw0F7r3yEN4ml5ht3viDm9N/exec

Deploy the supplied Apps Script as a Web App with **Execute as: Me** and **Who has access: Anyone**. The script creates/uses the required sheets automatically.

## Student workflow
Identity → Section 1 → … → Section 27. Use **Save Section Progress** after meaningful answers/activities. Section activity and saved responses are recorded in the Sheet.

## Lecturer workflow
Choose Lecturer Mode to bypass student identity and open any section directly.
