/**
 * =======================================================================
 * THE MENTALIST: DIGITAL DECEPTION // PROJECT CHIMERA
 * Official Investigation Dossier & Event Blueprints
 * Host: Asterion Research Unit // GENE with SAT (Saturnalia'51 // 2026)
 * Thapar Institute of Engineering and Technology, Patiala
 * =======================================================================
 */

export interface SuspectDossier {
  id: string;
  caseNumber: string;
  name: string;
  alias: string;
  role: string;
  clearanceLevel: string;
  statement: string;
  contradiction: string;
  evidenceRef: string;
  threatLevel: "CRITICAL" | "HIGH" | "ELEVATED" | "ELIMINATED";
  rotationDeg: number;
}

export interface InvestigationRound {
  roundNumber: number;
  codeName: string;
  title: string;
  duration: string;
  points: number;
  teamOutput: string;
  objective: string;
  taskDetails: string[];
  deliverable: string;
}

export interface DigitalEvidenceItem {
  id: string;
  fileName: string;
  fileType: string;
  classification: string;
  summary: string;
  rawSnippet: string;
  reveals: string;
}

export const EVENT_DETAILS = {
  title: "The Mentalist: Digital Deception",
  codeName: "PROJECT CHIMERA",
  tagline: "Think like a detective. Investigate like a hacker. Solve like a Mentalist.",
  presenters: "GENE (Genesis & Engineering of Neo Environment) with SAT (Saturnalia'51 // 2026)",
  institute: "Thapar Institute of Engineering and Technology (TIET), Patiala",
  venue: "LP105, Asterion Bio-Computational Lab // TIET Patiala",
  date: "23 November 2026",
  runtime: "100 minutes (5 consecutive rounds)",
  totalScore: "100 points",
  teamSize: "3 to 5 participants per team",
  prizePool: "₹5,000 + Merit Certificates + Official Accreditations",
  stolenAsset: "PELAGOS_V4.weights",
  stolenAssetDesc: "Breakthrough AI-designed synthetic enzyme model capable of degrading industrial microplastics within 48 hours.",
  incidentOverview:
    "At 01:48 AM on 23 November 2026, the private computational server of the Asterion Bio-Computational Lab was breached. The stolen asset is PELAGOS_V4.weights — a breakthrough AI-designed synthetic enzyme model capable of degrading industrial microplastics within 48 hours, scheduled for unveiling at the national bio-innovation keynote. No external firewall was breached and no brute-force alarm was triggered. The theft used valid internal credentials from inside the Asterion Research Block. Teams must reconstruct the attack across five rounds and establish WHO stole the model, HOW the breach was executed, WHY it happened, and WHICH EVIDENCE proves the conclusion.",
};

export const INVESTIGATION_ROUNDS: InvestigationRound[] = [
  {
    roundNumber: 1,
    codeName: "ROUND 1 // THE DIGITAL TRAIL",
    title: "The Breach & Device Origin",
    duration: "20 min",
    points: 15,
    teamOutput: "Transfer host and source device",
    objective: "Analyse simulated authentication logs, RFID access records and campus DHCP/MAC records to trace the origin of the 01:48 AM transfer.",
    taskDetails: [
      "Identify the lab workstation (B204-PC03 / 172.16.44.103) that sent PELAGOS_V4.weights.",
      "Identify the source device and IP (172.16.44.89 / MAC A4:83:E7:91:2C:04) that opened the remote SSH session.",
      "Distinguish physical presence from remote execution: explain why Diya Kapoor's card access does not by itself establish guilt.",
    ],
    deliverable: "Transfer workstation ID, source device/MAC, and chronological event timeline.",
  },
  {
    roundNumber: 2,
    codeName: "ROUND 2 // THE CODE",
    title: "The Hidden Sequence & Escrow Decryption",
    duration: "20 min",
    points: 15,
    teamOutput: "Decoded passphrase and escrow details",
    objective: "Recover the hidden passphrase from the sequencing fragment and use it to authenticate the escrow receipt record.",
    taskDetails: [
      "Examine EXIF metadata in gel_preview.png: translate from START codon (AUG) through immediately before STOP codon (UAA).",
      "Translate the mRNA sequence (AUG-GUA-GCC-UAU-UGU-AGG-UAC-CCG-ACU) using the single-letter codon chart to derive 'MVAYCRYPT'.",
      "Authenticate the escrow record to uncover the external buyer (NexaSynth BioLabs), payout (INR 12,00,000), and build environment path.",
    ],
    deliverable: "Passphrase with codon derivation, buyer identity, payout amount, and user build path.",
  },
  {
    roundNumber: 3,
    codeName: "ROUND 3 // THE PROFILE",
    title: "Suspect Elimination & Key Forensics",
    duration: "15 min",
    points: 20,
    teamOutput: "Culprit and suspect elimination",
    objective: "Cross-check suspect statements against steganographic metadata, recovered key material, repository history and network timelines.",
    taskDetails: [
      "Decode Base16/Hex UserComment in lab_badge_photo.jpg linking initials 'AS' to the corridor laptop MAC.",
      "Examine forensic image of Aarav's laptop: verify copied lab SSH key matching SHA256:CH1MERA-DK-409 and signed 22:15 script commit.",
      "Eliminate alternative suspects (Diya Kapoor, Vikramaditya Rao, Nandini Gill) based on lack of execution link.",
    ],
    deliverable: "Primary culprit identification, top three independent technical links, and reasoned elimination of alternatives.",
  },
  {
    roundNumber: 4,
    codeName: "ROUND 4 // THE BLACK BOX: INCIDENT ZERO",
    title: "Timeline Reconstruction & Evidence Integrity",
    duration: "15 min",
    points: 20,
    teamOutput: "Timeline, evidence integrity and response plan",
    objective: "Reconstruct the attack sequence, classify evidence integrity (verified vs unverified red herrings), and design a safe preservation response.",
    taskDetails: [
      "Order the six network events chronologically and determine whether logs support remote network transfer over a USB theory.",
      "Classify evidence items E-17 to E-20: distinguish verified bitstream images from unverified anonymous chat screenshots (E-19).",
      "Draft incident command response: preserve powered-on state, quarantine network access at control point, and avoid volatile data contamination.",
    ],
    deliverable: "Ordered incident chronology, evidence integrity classification table, and triage response plan.",
  },
  {
    roundNumber: 5,
    codeName: "ROUND 5 // THE MASTERMIND (HYBRID)",
    title: "Case Board, Incident Command & Live Panel Defence",
    duration: "30 min",
    points: 30,
    teamOutput: "Final evidence-based case briefing",
    objective: "Connect preparation, access, execution, and benefit; formulate an incident-command decision; then defend the case before the judging panel.",
    taskDetails: [
      "Phase 1 (8 min): Build PREPARATION → ACCESS → EXECUTION → BENEFIT on the case board with confidence labels.",
      "Phase 2 (8 min): Make the incident-command decision to safely preserve the compromised workstation without data destruction.",
      "Phase 3 (14 min): Deliver a structured 3-minute oral case briefing to the judge tribunal answering WHO, HOW, WHY, and PROOF.",
    ],
    deliverable: "Four-stage evidence chain, incident command protocol, and live oral defense against judge cross-examination.",
  },
];

export const SUSPECT_PROFILES: SuspectDossier[] = [
  {
    id: "suspect-aarav",
    caseNumber: "SUSPECT-01 // LEAD COMPUTATIONAL BIOLOGIST",
    name: "Aarav Sethi",
    alias: "asethi_bio",
    role: "Lead Computational Biologist // Primary Suspect",
    clearanceLevel: "LEVEL-4 COMPUTATIONAL ACCESS",
    statement:
      "I left the Biotech Block at 11:30 PM, went straight to Hostel J, and slept all night. My MacBook stayed in my bag.",
    contradiction:
      "CONTRADICTED: His laptop MAC appears on AP-BIO-02 at 01:45 AM. Its forensic image contains the matching copied lab SSH key. His phone disconnects from Hostel J Wi-Fi from 01:32–02:05. His verified signed commit modified the sync script at 22:15.",
    evidenceRef: "EXHIBIT 3B / RECOVERED SSH KEY & SIGNED COMMIT",
    threatLevel: "CRITICAL",
    rotationDeg: -1.5,
  },
  {
    id: "suspect-diya",
    caseNumber: "SUSPECT-02 // WET-LAB VALIDATION",
    name: "Diya Kapoor",
    alias: "dkapoor",
    role: "Wet-Lab Validation Specialist",
    clearanceLevel: "LEVEL-3 WET-LAB ACCESS",
    statement:
      "I entered Lab B-204 at 01:40 AM briefly to collect my phone charger. I did not run the transfer.",
    contradiction:
      "SUPPORTED / ELIMINATED: RFID and workstation records confirm entry/activity. However, the SSH source was an external unregistered laptop; her workstation B204-PC03 was used as an unwitting transfer host.",
    evidenceRef: "EXHIBIT 1A / RFID GATE LOG #BIO-409",
    threatLevel: "ELIMINATED",
    rotationDeg: 1.8,
  },
  {
    id: "suspect-vikramaditya",
    caseNumber: "SUSPECT-03 // NEXASYNTH LIAISON",
    name: "Vikramaditya Rao",
    alias: "NexaSynth Liaison",
    role: "Corporate Liaison & External Representative",
    clearanceLevel: "COMMERCIAL VISITOR CLEARANCE",
    statement:
      "I was at the off-campus partner hotel throughout the night. I had no access to the lab network.",
    contradiction:
      "NOT LINKED TO EXECUTION: The escrow receipt identifies NexaSynth as the buyer, but supplied evidence does not place Vikramaditya at the lab or link his device to the 01:48 AM SSH session.",
    evidenceRef: "EXHIBIT 2C / ESCROW RECEIPT RECORD",
    threatLevel: "ELIMINATED",
    rotationDeg: -2.1,
  },
  {
    id: "suspect-nandini",
    caseNumber: "SUSPECT-04 // SYSTEMS ADMINISTRATOR",
    name: "Nandini Gill",
    alias: "SysAdmin",
    role: "Asterion Systems & Cluster Administrator",
    clearanceLevel: "ROOT INFRASTRUCTURE ADMIN",
    statement:
      "The nightly sequencing sync was routine. I did not change its destination.",
    contradiction:
      "NOT LINKED TO MODIFICATION: The verified 22:15 commit modifying the script destination is cryptographically signed by Aarav Sethi. No evidence links Nandini to the modification or theft.",
    evidenceRef: "EXHIBIT 3B / COMMIT SIGNATURE VERIFICATION",
    threatLevel: "ELIMINATED",
    rotationDeg: 2.0,
  },
];

export const DIGITAL_EVIDENCE_FILES: DigitalEvidenceItem[] = [
  {
    id: "exhibit-1a",
    fileName: "EXHIBIT_1A_AUTH_SERVER_TRANSFER.LOG",
    fileType: "AUTHENTICATION & ACCESS LOG",
    classification: "VERIFIED SYSTEM RECORD",
    summary: "Auth log from 01:40 to 01:48 AM detailing RFID gate, SSH accepted publickey, and SFTP transfer of PELAGOS_V4.weights.",
    rawSnippet:
      "[2026-11-23 01:40:12] RFID_GATE : CardID #BIO-409 (D. Kapoor) unlocked LAB_B204_DOOR\n[2026-11-23 01:46:44] SSHD_B204 : Accepted publickey for user 'dkapoor' on B204-PC03 from 172.16.44.89; key fingerprint SHA256:CH1MERA-DK-409\n[2026-11-23 01:48:03] SFTP_OUT : Transfer of PELAGOS_V4.weights initiated from B204-PC03 (172.16.44.103) to relay-ext-99.net (198.51.100.99)",
    reveals: "Proves B204-PC03 executed the transfer, but the session was remotely operated from unregistered laptop 172.16.44.89 in the corridor.",
  },
  {
    id: "exhibit-2a",
    fileName: "EXHIBIT_2A_CHIMERA_CONTROL_FRAGMENT.FASTA",
    fileType: "GENOMIC EXIF METADATA",
    classification: "CRITICAL CIPHER EXHIBIT",
    summary: "EXIF comment in gel_preview.png instructing translation from START (AUG) through immediately before STOP (UAA).",
    rawSnippet:
      "# EXIF Comment (gel_preview.png):\nTranslate from START codon (AUG) through the codon immediately before STOP (UAA).\n>SEQ_ID_0992 | CHIMERA_CONTROL_FRAGMENT\n5'- GCU UCG AUG GUA GCC UAU UGU AGG UAC CCG ACU UAA GGC AUA -3'",
    reveals: "AUG-GUA-GCC-UAU-UGU-AGG-UAC-CCG-ACU translates to amino acid sequence M-V-A-Y-C-R-Y-P-T -> Passphrase: MVAYCRYPT.",
  },
  {
    id: "exhibit-2c",
    fileName: "EXHIBIT_2C_ESCROW_RECEIPT_NX8841.JSON",
    fileType: "AUTHENTICATED ESCROW RECORD",
    classification: "FINANCIAL TRANSACTION ARTIFACT",
    summary: "Authenticated escrow contract confirming buyer, payout, and researcher build path.",
    rawSnippet:
      "ESCROW_ID: NX-2026-8841\nBUYER: NexaSynth BioLabs\nPAYOUT: INR 12,00,000\nASSET_HASH: PELAGOS_V4.weights (SHA256 Verified)\nBUILD_PATH: /Users/asethi_bio/chimera_export/",
    reveals: "Establishes commercial motive of INR 12,00,000 to NexaSynth BioLabs, tied to username directory /Users/asethi_bio/.",
  },
  {
    id: "exhibit-3a",
    fileName: "EXHIBIT_3A_STEGO_TRAIL_BADGE.DUMP",
    fileType: "EXIF BASE16 STEGANOGRAPHY",
    classification: "CORROBORATIVE METADATA",
    summary: "Decoded Hex UserComment from lab_badge_photo.jpg confirming the corridor laptop MAC address.",
    rawSnippet:
      "UserComment (BASE16 / HEX):\n535445474F5F545241494C3A2041535F4D41435F41345F38335F4537\n5F39315F32435F30345F434F4E4649524D45445F30313438414D\nDecoded ASCII: STEGO_TRAIL: AS_MAC_A4_83_E7_91_2C_04_CONFIRMED_0148AM",
    reveals: "Connects initials 'AS' (Aarav Sethi) with the corridor laptop MAC address A4:83:E7:91:2C:04 at 01:48 AM.",
  },
  {
    id: "exhibit-4c",
    fileName: "EXHIBIT_4C_CHAIN_OF_CUSTODY_REGISTER.CSV",
    fileType: "FORENSIC INTEGRITY REGISTER",
    classification: "EVIDENCE EVALUATION",
    summary: "Verification ledger assessing E-17 (forensic image), E-18 (controller export), E-19 (unverified chat screenshot), and E-20 (derivative).",
    rawSnippet:
      "E-17: Forensic bitstream image B204-PC03 -> VERIFIED (SHA-256 matched at 02:30 & 02:42)\nE-18: AP-BIO-02 controller export -> VERIFIED (Signed network admin hash)\nE-19: Screenshot of alleged private chat -> UNVERIFIED (No source, no hash, red herring)\nE-20: staging_dump.tar.gz -> VERIFIED DERIVATIVE (Traceable to E-17)",
    reveals: "Teaches investigators to reject unauthenticated screenshots (E-19) and rely strictly on verified forensic hashes.",
  },
];

export const SCORING_RUBRIC = [
  { round: "Round 1: Digital Trail", points: 15, breakdown: "Transfer host (4); source device/IP (7); distinguish access/proximity from guilt (4)" },
  { round: "Round 2: The Code", points: 15, breakdown: "START/STOP interpretation (3); codon translation (6); passphrase (3); escrow buyer/payout (3)" },
  { round: "Round 3: The Profile", points: 20, breakdown: "Correct culprit (4); matching SSH key (7); signed commit (4); reasoned elimination of alternatives (5)" },
  { round: "Round 4: The Black Box", points: 20, breakdown: "Correct event order (6); remote vs USB inference (3); evidence classification (5); safe response plan (6)" },
  { round: "Round 5: The Mastermind", points: 30, breakdown: "WHO (4); HOW/timeline (8); WHY (5); evidence chain & integrity (8); clarity & judge Q&A (5)" },
];
