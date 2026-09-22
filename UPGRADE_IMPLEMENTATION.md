# NavVedh Four-Role Management Upgrade

This upgrade implements the requested expansion of the NavVedh club portal around four roles:

- `SUPER_ADMIN` – system owner, controls roles, Admin permissions and dynamic system options.
- `ADMIN` – receives only the permissions granted by a Super Admin.
- `FACULTY` – read-oriented club supervision plus guest invitation management.
- `STUDENT` – event participation, history, announcements, badges/titles and certificates.

## What changed

### Access control

Admins no longer automatically get full authority. `User.adminPermissions` supports:

- `VIEW_ADMIN_DASHBOARD`
- `MANAGE_EVENTS`
- `MANAGE_RESULTS`
- `MANAGE_CERTIFICATES`
- `MANAGE_ANNOUNCEMENTS`
- `MANAGE_MEMBERS`
- `MANAGE_CONTACTS`
- `MANAGE_CONTENT`

Super Admin bypasses Admin permission checks and can configure users from `/admin/access`.

### Dynamic form options

`SystemOption` stores configurable values. Super Admin manages them from `/admin/system-options`.

Implemented groups:

- `EVENT_CATEGORY`
- `CERTIFICATE_TYPE`
- `BADGE_TYPE`

Event categories are no longer limited to hard-coded frontend values. Defaults include Webinar, Guest Lecture and Seminar.

### Events and history

Normal event deletion is replaced with archive behavior:

- archived events disappear from the public Events page;
- registrations remain in MongoDB;
- student activity history remains visible;
- certificates, winner/runner-up records and badges remain linked;
- Admin can restore archived events.

Events also support speaker/guest data for webinars and guest lectures.

### Results, certificates and recognitions

Winner/Runner-up can be selected from event registrations. Publishing results automatically creates winner/runner-up certificates. Admin may also grant a special badge/title at result time.

Certificates can independently include an optional special badge/title. Separate recognition management is available under `/admin/recognitions`.

Students see badges/titles and certificates in `/profile`. Certificate display pages are at `/certificates/[number]`.

### Faculty

`/faculty` provides club supervision statistics and recent activity. Faculty can inspect members/events and create formal guest invitation letters under `/faculty/invitations`, then print/save the letter as PDF from the browser.

### Contact to broadcast

Super Admin can convert a contact message into an in-app broadcast, edit the text first, and send it to everyone/a role/specific students. Sender private contact details are not automatically copied into the broadcast.

### Sharing

Public event detail pages include native sharing plus WhatsApp, LinkedIn, Facebook and Copy Link actions.

## Upgrade existing database

Use Node 22.22.0 for the backend.

From `backend`:

```bat
npm install
npm run migrate:roles
npm run make-super-admin -- YOUR_EMAIL@gmail.com
npm run dev
```

`migrate:roles` maps old roles to the new four-role structure. Run it once after applying this upgrade.

`make-super-admin` is the bootstrap command. The email must already belong to a registered user.

To create another Admin later:

1. Open `/admin/access` while signed in as Super Admin.
2. Change that user's role to `ADMIN`.
3. Select exactly the permissions they should have.

You can still use:

```bat
npm run make-admin -- ADMIN_EMAIL@gmail.com
```

but this intentionally grants only `VIEW_ADMIN_DASHBOARD`. Use Access Control to grant additional authority.

## Frontend restart

From `frontend`:

```bat
npm install
rmdir /s /q .next
npm run dev
```

For PowerShell use:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## Important pages to test

### Super Admin

- `/admin`
- `/admin/access`
- `/admin/system-options`
- `/admin/events`
- `/admin/certificates`
- `/admin/recognitions`
- `/admin/communications`
- `/admin/contact-messages`

### Faculty

- `/faculty`
- `/faculty/members`
- `/faculty/events`
- `/faculty/invitations`

### Student

- `/events`
- `/announcements`
- `/profile`
- `/certificates/<certificate-number>`

## Suggested acceptance test

1. Bootstrap one user as Super Admin.
2. In Access Control, promote another registered user to Admin and grant only `MANAGE_EVENTS` plus dashboard access.
3. Confirm that Admin only sees/opens the allowed Admin modules.
4. Add a new event category such as `Industry Webinar` from System Options.
5. Create an event using that category.
6. Register two student accounts.
7. Complete the event and publish Winner/Runner-up.
8. Confirm both certificates appear in the corresponding student profiles.
9. Add a special badge/title and confirm it appears in the student profile.
10. Archive the event and confirm it disappears from `/events` but remains in student Activity History.
11. Sign in as Faculty and generate a guest invitation.
12. Submit a Contact form message, then as Super Admin convert it to a selected broadcast.
13. Open a public event and test Share Event.

## Patch vs full project

If your local folder contains manual fixes made after the last project ZIP, use the **patch ZIP** and merge its files over your current project. The full project ZIP is a standalone upgraded copy based on the last project archive supplied to ChatGPT.
