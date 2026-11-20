# Student Online Application System

A Next.js and TypeScript starter for student applications and administrator review.

## Run locally

1. Install Node.js if it is not already installed.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

The login screen has separate student and administrator entry buttons. This starter has no accounts, passwords, or access control.

## Data and deployment

The application starts with no sample students or applications. Profile information, profile photos, application documents, and review statuses are saved in the current browser's local storage.

This is suitable for a local demonstration only. Browser storage is not shared between devices, browsers, or users, so a student submitting from home will **not** send an application to an administrator elsewhere. Deploying this version to Vercel does not change that. To use it as a real online service, connect it to a hosted backend and database, configure file storage, and add secure student and administrator accounts. XAMPP/MySQL can be used for local development, but it does not provide an always-online backend by itself.

Application images are resized and compressed before saving. Browser storage has a total size limit, so many large files may require removing older files.

Students can choose BSIT, BSHM, BEED, or BSED. Administrators can filter applications by course and see how many are waiting for review.

## School logo

The supplied `cpc.jpg` logo is used on the login screen and in both dashboard sidebars. Replace `public/images/cpc.jpg` to use a different logo.
