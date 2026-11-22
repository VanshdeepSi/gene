# The Mentalist: Digital Deception // Project Chimera

Official investigation terminal and live incident platform for **The Mentalist: Digital Deception** — a 5-round, story-driven cyber investigation game organized by **GENE** (*Genesis and Engineering of Neo Environment*) in official collaboration with **SAT** (*Saturnalia'51, 2026*) at **Thapar Institute of Engineering and Technology (TIET), Patiala**.

> **"Think like a detective. Investigate like a hacker. Solve like a Mentalist."**

---

## 🔍 The Incident Premise: Project Chimera

At **01:48 AM on 23 November 2026**, the private computational server of the Asterion Bio-Computational Lab was breached. The stolen asset is **`PELAGOS_V4.weights`** — a breakthrough AI-designed synthetic enzyme model capable of degrading industrial microplastics within 48 hours.

No external firewall was breached and no brute-force alarm was triggered. The theft used valid internal credentials from inside the Asterion Research Block. Student investigator squads must reconstruct the attack across five consecutive rounds and establish **WHO** stole the model, **HOW** the breach was executed, **WHY** it happened, and **WHICH EVIDENCE** substantiates the conclusion before the judge tribunal.

---

## 🏆 The 5 Investigation Rounds & Scoring Rubric

Total Competition Runtime: **100 Minutes** | Total Score: **100 Points**

| Round | Stage Name | Time | Points | Target Output & Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **The Digital Trail** | 20 min | 15 pts | Trace transfer host (`B204-PC03` / `172.16.44.103`) and corridor source device (`172.16.44.89` / MAC `A4:83:E7:91:2C:04`). Distinguish card access from guilt. |
| **02** | **The Code** | 20 min | 15 pts | Recover hidden mRNA codons from EXIF metadata (`gel_preview.png`), derive passphrase **`MVAYCRYPT`**, and authenticate escrow contract (`NexaSynth BioLabs`, payout `INR 12,00,000`). |
| **03** | **The Profile** | 15 min | 20 pts | Cross-examine suspect alibis; identify culprit **Aarav Sethi** via recovered lab SSH key fingerprint (`SHA256:CH1MERA-DK-409`) and signed 22:15 script commit. Eliminate Diya Kapoor, Vikramaditya Rao, and Nandini Gill. |
| **04** | **The Black Box: Incident Zero** | 15 min | 20 pts | Reconstruct chronological order of 6 network events; distinguish verified bitstream disk images (`E-17`, `E-18`) from unauthenticated chat screenshots (`E-19`); formulate non-destructive incident response. |
| **05** | **The Mastermind (Hybrid)** | 30 min | 30 pts | **Phase 1 (8 min)**: Build 4-stage Case Board (`PREPARATION → ACCESS → EXECUTION → BENEFIT`).<br>**Phase 2 (8 min)**: Formulate Incident Command preservation decision.<br>**Phase 3 (14 min)**: Deliver structured oral case defense before judge panel answering WHO, HOW, WHY, and PROOF. |

### Event Parameters:
- **Date**: 23rd November 2026 (Saturnalia'51)
- **Venue**: LP105, Asterion Bio-Computational Lab // TIET Patiala
- **Team Size**: 3 to 5 Members per squad (cross-year and cross-branch permitted; bring your own laptop)
- **Admission**: Free for all confirmed participant squads (registration is pre-closed)
- **Prize Pool**: **₹5,000 Cash Pool + Merit Certificates + Official Accreditations**

---

## 🎨 Official Branding & Real Logos

The platform integrates the authentic visual identities of the organizing bodies:
- **Saturnalia 51 (2026)**: Official high-resolution transparent emblem featuring the 51st edition insignia, royal peacock, drone, robot, and lotus motifs, sourced directly from `saturnalia.in` (`/public/assets/saturnalia51-logo.png`).
- **GENE Society**: Official forensic biotechnology emblem forged with the iconic double-helix and cyber-forensics shield (`/public/assets/gene-logo.svg` / `/public/assets/logo.png`).
- **Thapar Institute of Engineering and Technology**: Official red 'ti' university emblem (`/public/assets/thapar-logo.png`).

---

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Design Philosophy**: Cyber-Noir Forensic Investigation Terminal
  - Noir base: `#07090c`
  - Forensic cyan/teal: `#19e3d0`
  - Redaction danger red: `#b3202a`
  - Aged evidence paper: `#d9cfb8`
- **Typography** via `next/font/google`:
  - `Cormorant Garamond` (editorial serif headlines)
  - `JetBrains Mono` (terminal logs, packet hex data, and ciphers)
  - `Inter` (body specifications)
- **Forensic Hero Centerpiece**: HTML5 Canvas double-helix with real-time cursor proximity evidence scanning (no external 3D libraries or heavy model files)
- **Custom Cursor**: Desktop SVG magnifying-glass cursor with LERP smoothing and hidden evidence reveal
- **Authentication**: `jose` JWT with signed 8-hour session stored in an `httpOnly`, `sameSite=strict` cookie
- **Data Persistence**: Asynchronous file storage via `fs/promises` in `/data/announcements.json`
- **Audio**: Offline synthesized mechanical typewriter clicks and access confirmation tones via Web Audio API (zero audio files needed, muted by default)

---

## ⚡ Setup & Local Development

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Verify or create `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `.env.local` contains:
```env
ORGANISER_PASSWORD=GeneBureau@2026
JWT_SECRET=k9X2mQp7vL4wY8zT1bN6cR3eF0uJ5hG9aD2sW4xZ8mK
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Game Master / Handler Administration

### Organiser Credentials
- **Login Portal**: `/organiser/login`
- **Password**: **`GeneBureau@2026`**
- **Session**: Signed JWT stored in an `httpOnly`, `sameSite=strict` cookie (8-hour expiration)

### How to Change the Organiser Password
1. Open `.env.local`.
2. Update the `ORGANISER_PASSWORD` variable to your new key:
   ```env
   ORGANISER_PASSWORD=YourNewSecureMasterKey2026!
   ```
3. Restart the dev or production server.
4. The password is never transmitted to or checked in client code; verification occurs strictly server-side using constant-time cryptographic buffer comparisons (`crypto.timingSafeEqual`) to prevent timing attacks.

### Rate Limiting
To prevent brute-force intrusion, `/api/auth/login` enforces an in-memory rate limiter: after **5 failed attempts** from an IP within 10 minutes, further attempts are blocked for **10 minutes**.

---

## 📂 Data Architecture

- **Event Blueprints, 5 Rounds, Scoring Rubric, & Suspects**: `/data/events.ts`
- **Live Clue Dispatches & Broadcasts**: `/data/announcements.json` (managed directly via the Organiser Dashboard at `/organiser` or by editing the JSON file)

---

## 🚀 Deployment Notes

> **Vercel / Serverless Filesystem Consideration**:
> The local JSON file storage (`/data/announcements.json`) works seamlessly in local development and on standard Node.js servers, Docker containers, or VPS instances (e.g. AWS EC2, DigitalOcean, Railway).
> 
> On Vercel or read-only serverless platforms, the filesystem is non-persistent across invocations. For deployment to Vercel, swap the implementation in `/lib/store.ts` to **Supabase**, **Vercel KV**, or **PostgreSQL / Upstash Redis** while preserving the existing exported function signatures (`readAnnouncements`, `createAnnouncement`, `deleteAnnouncement`, `togglePinAnnouncement`). No other components or routes need modification.
