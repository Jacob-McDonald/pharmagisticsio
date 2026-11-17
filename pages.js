// The two customer pages of each tool, keyed by the tool's slug in data.js: `pitch`
// sells it, `how` explains it. project.js draws them. Public-safe by design: every
// figure here is made up, and nothing comes from real data. Tiles are
// [color, heading, text, ledger]; path steps are [heading, text]; figures are either
// { svg } or the rows and groups project.js's rowsFigure describes.
"use strict";

/** A single-dose vial, part given and part discarded, with the lines of text beside each part. */
const vial = (alt, discarded, given) => {
  const lines = (items, y) => items.map((line, i) =>
    `<text x="202" y="${y + 18 * i}" font-size="15"${i === items.length - 1 && items.length > 1 ? ' font-weight="700"' : ""}>${line}</text>`).join("");
  return `<svg viewBox="0 0 400 290" role="img" aria-label="${alt}">
    <rect x="92" y="18" width="46" height="34" rx="3" class="ln" stroke-width="2"/>
    <rect x="84" y="10" width="62" height="12" rx="3" fill="var(--ink)"/>
    <path d="M70 70 Q70 52 92 52 L138 52 Q160 52 160 70 L160 262 Q160 276 146 276 L84 276 Q70 276 70 262 Z" fill="var(--surface)" class="ln" stroke-width="2"/>
    <rect x="72" y="72" width="86" height="72" fill="var(--waste-wash)"/>
    <path d="M72 96 L96 72 M72 120 L120 72 M72 144 L144 72 M96 144 L158 82 M120 144 L158 106 M144 144 L158 130" stroke="var(--waste)" stroke-width="1.5"/>
    <path d="M72 144 H158 V262 Q158 274 146 274 H84 Q72 274 72 262 Z" fill="var(--given)"/>
    <line x1="62" y1="144" x2="168" y2="144" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>
    <path d="M160 108 H196 M160 208 H196" class="ln" stroke-width="1.5"/>
    <text x="202" y="92" class="lab" style="fill:var(--waste)">Discarded</text>${lines(discarded, 110)}
    <text x="202" y="192" class="lab" style="fill:var(--given)">Given</text>${lines(given, 210)}
  </svg>`;
};

const PAGES = {};

PAGES["drug-utilization"] = {
  pitch: {
    h1: "Check the week's drug charges before anyone reads them.",
    lede: "One run turns the weekly Epic extract into location workbooks, a manager's summary and data-quality reports.",
    gap: {
      h: "Every row passes. The total is still wrong.",
      fig: {
        alt: "Four rows of an extract share one transaction ID and one amount. They are one charge, counted four times.",
        rows: [["ID 48213", "$120.00", "waste"], ["ID 48213", "$120.00", "waste"], ["ID 48213", "$120.00", "waste"], ["ID 48213", "$120.00", "waste"]],
        groups: [[0, 3, "One charge", "counted four times", "waste"]],
        caption: "Made-up rows.",
      },
      points: [
        "Right columns. Right week. Valid amounts.",
        "No total would show four rows among a week of charges.",
        "The run stops and names them before a workbook is written.",
      ],
    },
    finds: {
      h: "Faults a spreadsheet lets through",
      tiles: [
        ["blue", "Wrong files", "A week skipped, doubled or misnamed stops the run."],
        ["indigo", "Changed exports", "A new column or a bad value, named by file, column and row."],
        ["coral", "Reversed charges", "A charge and its credit cancel. Only what was finally charged counts."],
        ["pink", "Repeated charges", "One charge on several rows is held out and listed."],
      ],
    },
    gets: {
      h: "One folder, complete or not at all",
      items: [
        "A workbook per location group, newest week on its own sheet",
        "A manager's summary, aggregates only",
        "A run summary of every check made",
        "NDC-quality reports",
        "If a run stops, last week's folder stays as it was",
      ],
    },
    cta: "Put your weekly extract through it",
  },
  how: {
    h1: "One weekly run, from the files to the folder.",
    lede: "What each step checks and what it does when something is off.",
    rule: {
      h: "Count what was finally charged",
      fig: {
        alt: "A charge of plus one and 120 dollars and a credit of minus one and minus 120 dollars cancel out. A second charge of 45 dollars is kept.",
        rows: [["Charge +1", "$120.00", "given"], ["Credit −1", "−$120.00", "waste"], ["Charge +1", "$45.00", "given"]],
        groups: [[0, 1, "Cancel out", "both rows leave", "waste", true], [2, 2, "Kept", "finally charged", "given"]],
      },
      points: [
        "Epic records a correction as a credit that mirrors the charge.",
        "Same encounter, order, charge code and service date. Quantity and dollars exact opposites.",
        "Both rows leave. A credit with no charge to cancel is listed.",
      ],
    },
    path: {
      h: "Six steps, every week",
      steps: [
        ["Check the files", "Folder names first, so a wrong or missing week stops the run in seconds."],
        ["Load the new week", "Exact columns, in order, every value fitting its type. Earlier weeks come from the cache."],
        ["Clean the lines", "Reversals cancel. One charge on several rows is held out. Lines from before the first week drop off."],
        ["Enrich each line", "Formulary details, the CMS billing code match and payment status. No line is added or lost."],
        ["Sort by location", "Departments roll up into location groups your staff maintain in a list."],
        ["Deliver the folder", "Everything is written to one side, then swapped in together."],
      ],
    },
    example: {
      h: "One charge on four rows",
      tiles: [
        ["coral", "What arrived", "Every charge line should have its own ID.", "ID 48213  qty 1  $120.00\nID 48213  qty 1  $120.00\nID 48213  qty 1  $120.00\nID 48213  qty 1  $120.00"],
        ["slate", "Why nothing else sees it", "Each row is valid on its own.", "columns   right\nweek      right\namounts   valid\ncredit    none to pair"],
        ["green", "What the run does", "<strong>$360.00 never reaches a total.</strong>", "stops\nnames the ID and its rows\nwrites nothing"],
      ],
    },
    outcomes: {
      h: "What the run does when something is off",
      tiles: [
        ["coral", "Stop", "Wrong files or a changed export. Nothing is written. Fix the cause."],
        ["pink", "Stop and name", "A repeated charge. Have the week re-exported, or leave the rows out on the record."],
        ["amber", "Check", "The run finishes. What could not be used is left out and flagged at the top of the run summary."],
        ["green", "Handled", "Reversals, re-exports and cached weeks. Dealt with and counted."],
        ["indigo", "Report", "Data faults worth fixing at the source, each in its own report."],
      ],
    },
    limits: [
      "Right shape, wrong value. A wrong price or quantity in a valid format passes the stops.",
      "Leaving out a repeated charge removes the whole charge until the source is corrected.",
      "The extract has no link from a credit to its charge. They are paired by key and amount.",
      "A day with nothing posted can read as a missing day.",
    ],
  },
};

PAGES["vial-waste"] = {
  pitch: {
    h1: "Medicare pays for the drug you discard. Only if the claim says so.",
    lede: "Every single-dose vial charge, checked for the waste line it should carry.",
    gap: {
      h: "One missing line, and the waste goes unpaid",
      fig: {
        svg: vial("A single-dose vial. The lower part was given and is billed on the dose line. The upper part was discarded and is billed on a JW line.",
          ["Billed on a JW line"], ["Billed on the dose line"]),
      },
      points: [
        "Part of a single-dose vial is given. The rest is discarded.",
        "<b>JW</b> on its own line bills the discarded part.",
        "<b>JZ</b> on the dose line says nothing was discarded.",
        "Staff enter both by hand, one charge at a time.",
      ],
    },
    finds: {
      h: "Four kinds of line to review",
      tiles: [
        ["coral", "Unbilled waste", "Part of a vial used. No JW line."],
        ["pink", "Wrong JZ", "JZ on a dose that left drug in the vial."],
        ["amber", "Missing JZ", "Whole vials given. No modifier at all."],
        ["indigo", "Units that don't add up", "Dose plus waste should equal the vials opened."],
      ],
    },
    gets: {
      h: "A worklist your billing team can act on",
      items: [
        "One row per charge line, with the reason",
        "Rules cited to CMS",
        "Lines it cannot judge are named, never guessed",
        "Runs inside your network",
      ],
    },
    cta: "See what your charges say",
  },
  how: {
    h1: "One charge line, from the extract to a verdict.",
    lede: "What each step asks and how it decides.",
    rule: {
      h: "Dose rounds up. Waste rounds down.",
      fig: {
        svg: vial("A 1.7 mL vial of 306 billing units. 1.08 mL is given and bills 195 units. 0.62 mL is discarded and bills 111 units on a JW line.",
          ["0.62 mL = 111.6 units", "JW line bills 111"], ["1.08 mL = 194.4 units", "Dose line bills 195"]),
        caption: "Teclistamab 153 mg/1.7 mL, billed at 0.5 mg a unit: 306 units a vial.",
      },
      points: [
        "A drug code is billed in units the code defines.",
        "The dose was given, so part of a unit bills whole.",
        "Waste under one unit is not billed.",
        "Together they never bill more than the vial holds: <b>195 + 111 = 306</b>.",
      ],
    },
    path: {
      h: "Nine questions for every charge line",
      steps: [
        ["Was it reversed?", "A charge and the credit that reverses it cancel out."],
        ["Does Medicare's rule apply?", "Traditional Medicare, outpatient, a drug Medicare pays for separately."],
        ["What does CMS say about the code?", "The code's dose, from the CMS file in force on the service date."],
        ["What package is on the line?", "Whole vials, or millilitres of one."],
        ["Is it a single-dose container?", "Several sources, asked in order. Unknown stays unknown. Nothing is assumed single-dose."],
        ["How many units does one vial hold?", "The vial's strength over the code's dose."],
        ["What should it have billed?", "Dose up, waste down, then compared with the units billed."],
        ["What is the verdict?", "One status per line, with the reason written on it."],
        ["Does the whole administration add up?", "A dose and its waste line are judged together."],
      ],
    },
    example: {
      h: "One vial, two lines",
      lede: "153 mg in 1.7 mL at 0.5 mg a unit is 306 units a vial, or 180 units per mL.",
      tiles: [
        ["teal", "Dose line", "<strong>Verifies.</strong>", "1.08 mL given\n× 180 units per mL\n= 194.4 units\nrounds up to 195\nbilled 195"],
        ["coral", "JW line", "<strong>Verifies.</strong>", "0.62 mL discarded\n× 180 units per mL\n= 111.6 units\nrounds down to 111\nbilled 111"],
        ["green", "Together", "<strong>Every unit accounted for. No flag.</strong>", "1.08 + 0.62 = 1.70 mL\none vial opened\n195 + 111 = 306 units"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["green", "As it should be", "One vial opened, every unit given or wasted.", "dose 1.08 mL  bills 195\nJW   0.62 mL  bills 111"],
        ["coral", "Partial vial, no JW", "60 units were left and nothing bills them.", "dose 4 mL of 10 mL  bills 40\nno JW line"],
        ["pink", "JZ on a partial vial", "The claim says nothing was discarded. Part of the vial was.", "dose 4 mL of 10 mL  bills 40  JZ"],
        ["amber", "Whole vial, no JZ", "Nothing was wasted, and the claim should say so.", "dose 2 vials  bills 250\nno JW, no JZ"],
      ],
    },
    limits: [
      "A vial opened and discarded whole leaves no trace in the charges.",
      "Multi-dose vials, prefilled syringes and pharmacy-prepared doses are left out.",
      "A line it cannot read is named with the reason, never scored.",
      "A finding is a line to review. Your billing team decides what to rebill.",
    ],
  },
};

PAGES["modifier-compliance"] = {
  pitch: {
    h1: "The right modifier on every drug line.",
    lede: "TB, JG, JW and JZ on Epic charge lines, checked against CMS's rules.",
    gap: {
      h: "Two letters decide how a claim is read",
      fig: {
        alt: "Three charge lines for one code. One has no modifier and one carries the retired JG: both to review. One carries TB as expected.",
        rows: [["J1111", "(none)", "waste"], ["J1111 JG", "retired", "waste"], ["J1111 TB", "as expected", "given"]],
        groups: [[0, 1, "To review", "missing or retired", "waste"], [2, 2, "Fine", "340B drug, TB", "given"]],
        caption: "Made-up lines.",
      },
      points: [
        "<b>TB</b> marks a drug bought at 340B on a Medicare outpatient claim.",
        "<b>JG</b> is retired. It should now be TB.",
        "<b>JW</b> and <b>JZ</b> say whether drug was discarded.",
        "Staff key them by hand.",
      ],
    },
    finds: {
      h: "Five kinds of line to review",
      tiles: [
        ["coral", "TB missing", "A 340B-eligible Medicare drug line without TB."],
        ["pink", "TB at the wrong site", "TB where 340B may not be used."],
        ["amber", "JG after retirement", "Any payer. Should be TB."],
        ["indigo", "Waste flags", "JW and JZ that don't fit the vials opened."],
        ["slate", "Unknown modifier", "A code not on your approved list."],
      ],
    },
    gets: {
      h: "Leads sorted by code and department",
      items: [
        "A summary of each check",
        "Lists by billing code and by department",
        "A line-by-line TB decision from your split-billing data",
        "Rules cited to CMS",
      ],
    },
    cta: "See which lines carry the wrong letters",
  },
  how: {
    h1: "Four checks on every drug charge line.",
    lede: "What each modifier means and how a line is judged.",
    rule: {
      h: "The modifier has to match the purchase and the vial",
      points: [
        "TB is expected on separately payable Medicare outpatient drugs bought at 340B.",
        "JG was retired. A line still carrying it should carry TB.",
        "JW bills discarded drug. JZ says none was discarded.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the outpatient lines", "With your 340B department rules."],
        ["Look up payment status", "The code's OPPS status on the service date."],
        ["Check TB", "Missing at eligible departments, present at ineligible ones."],
        ["Check JG", "Any line after its retirement."],
        ["Check waste", "JW and JZ against the vials opened."],
        ["Check the list", "Modifiers your facility has not approved."],
        ["Decide TB per transaction", "Optional, from split-billing data and that week's 340B price."],
      ],
    },
    example: {
      h: "Three lines",
      tiles: [
        ["coral", "Line A", "<strong>Lead: TB missing.</strong>", "J1111, Medicare outpatient\neligible clinic\nno modifier"],
        ["amber", "Line B", "<strong>Should be TB.</strong>", "J1111\nmodifier JG\nafter retirement"],
        ["pink", "Line C", "<strong>Partial vial needs JW.</strong>", "100 mg vial\n60 mg given\nmodifier JZ"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["coral", "TB missing", "A lead, to confirm against what was bought."],
        ["pink", "TB at ineligible site", "TB from a department 340B does not cover."],
        ["amber", "JG", "A retired modifier still in use."],
        ["indigo", "Waste flag", "Partial vial with no JW, JZ on a partial vial, or whole vials with neither."],
        ["slate", "Unknown", "Not on the approved list."],
      ],
    },
    limits: [
      "TB is a lead. Charge data cannot show which drug was bought at 340B.",
      "A department with no matching rule counts as eligible.",
      "Traditional Medicare rules only. Medicare Advantage and Medicaid are not checked.",
      "Waste flags reach only single-dose drugs it can read.",
    ],
  },
};

PAGES["billing-units"] = {
  pitch: {
    h1: "Billed units that match the vials used.",
    lede: "Outpatient drug lines checked against the vials given and CMS's daily limits.",
    gap: {
      h: "A unit off is money lost or a claim denied",
      fig: {
        alt: "A line should bill 10 units and billed 7. Three units were never billed.",
        rows: [["Should bill", "10 units", "given"], ["Billed", "7 units", "waste"]],
        groups: [[0, 1, "3 units short", "never billed", "waste"]],
        caption: "Made-up line.",
      },
      points: [
        "A billing code is paid per unit, and each code defines its own unit.",
        "Too few units is lost revenue.",
        "Too many, or past CMS's daily cap, risks a denial.",
      ],
    },
    finds: {
      h: "What it flags",
      tiles: [
        ["coral", "Units under", "Fewer billed than the vials support."],
        ["pink", "Units over", "More billed than the vials support."],
        ["amber", "Over the MUE", "A code past CMS's daily or per-line cap."],
        ["slate", "Never billable", "A code whose cap is zero."],
      ],
    },
    gets: {
      h: "Codes ranked by lines off and charge at stake",
      items: [
        "A list per code of unit mismatches",
        "A list per code of MUE overages",
        "The reason for every line it could not check",
        "Rules cited to CMS",
      ],
    },
    cta: "Check your units against your vials",
  },
  how: {
    h1: "Two checks on every outpatient drug line.",
    lede: "Units against the vials, then units against the cap.",
    rule: {
      h: "Units come from the vial, and CMS caps the day",
      points: [
        "CMS's crosswalk says how many units one package holds.",
        "The vials given set the units a line should bill.",
        "CMS's Medically Unlikely Edits cap units per patient per day.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the outpatient lines", "Inpatient stays are paid as a whole and left out."],
        ["Match CMS's files", "The crosswalk and Addendum B in force on the service date."],
        ["Work out expected units", "From the vials used."],
        ["Compare with billed units", "A line it cannot read keeps the reason."],
        ["Net the day", "Units per patient, day and code, credits included."],
        ["Compare with the cap", "The MUE and how it is applied."],
        ["Rank", "Codes by lines off and charge over."],
      ],
    },
    example: {
      h: "Two vials, one dose",
      lede: "A code billed per 10 mg. Two 50 mg vials opened.",
      tiles: [
        ["teal", "Expected", "<strong>10 units.</strong>", "70 mg given   = 7 units\n30 mg wasted  = 3 units, JW"],
        ["coral", "Billed", "<strong>3 units under.</strong>", "7 units\nno JW line"],
        ["amber", "Same day", "<strong>Over the MUE.</strong>", "12 units of a code\ncapped at 10"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["green", "Agrees", "Billed units equal expected units."],
        ["coral", "Under", "Likely lost revenue."],
        ["pink", "Over", "More than the vials support."],
        ["amber", "Over MUE", "Past CMS's cap."],
        ["slate", "Not checked", "No crosswalk pair, multi-dose, or unreadable. Named, not guessed."],
      ],
    },
    limits: [
      "Many lines stop early. Only single-dose drugs it can read reach the comparison.",
      "MUEs change every quarter. An old table gives old answers.",
      "The charge gap is an estimate.",
    ],
  },
};

PAGES["billing-code-agreement"] = {
  pitch: {
    h1: "One NDC, one billing code, everywhere.",
    lede: "Charges, Epic, the supplier catalog and CMS compared NDC by NDC.",
    gap: {
      h: "Four systems, and they don't all agree",
      fig: {
        alt: "CMS and the charge lines use code J3333 for an NDC. The med list uses J3344 and disagrees.",
        rows: [["CMS", "J3333", "given"], ["Charge lines", "J3333", "given"], ["Med list", "J3344", "waste"]],
        groups: [[2, 2, "Disagrees", "fix at the source", "waste"]],
        caption: "Made-up codes.",
      },
      points: [
        "Each system holds its own billing code and unit size for a drug.",
        "CMS's crosswalk is the reference.",
        "A wrong code in one system resurfaces on every charge.",
      ],
    },
    finds: {
      h: "Four kinds of disagreement",
      tiles: [
        ["coral", "Code not CMS's", "A source uses a code CMS does not list for that NDC."],
        ["amber", "Dose not CMS's", "One billing unit means a different amount of drug."],
        ["pink", "Units not CMS's", "Whole packages billed for fewer units than expected."],
        ["indigo", "Sources disagree", "CMS is silent and your systems name different codes."],
      ],
    },
    gets: {
      h: "A fix list ranked by charge",
      items: ["One row per NDC", "Every source's code and unit side by side", "Largest charges first"],
    },
    cta: "Find where your systems disagree",
  },
  how: {
    h1: "One row per NDC, every source beside CMS.",
    lede: "How the codes are gathered and compared.",
    rule: {
      h: "CMS's crosswalk is the yardstick",
      points: [
        "CMS pairs each NDC with a billing code and a dose per unit.",
        "Each of your sources is set beside it.",
        "Disagreements are ranked by the charge behind them.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the charge lines", "Zero charges dropped."],
        ["Pick the code in use", "The code most charged for each NDC."],
        ["Load the other sources", "Epic NDC lists, the billing med list, the supplier catalog."],
        ["Load CMS's crosswalk", "The newest quarter."],
        ["Compare", "Code, dose per unit, and units per package."],
        ["Rank by charge", "The biggest first."],
      ],
    },
    example: {
      h: "One NDC",
      lede: "CMS says code J3333, 10 units a box.",
      tiles: [
        ["green", "Charge lines", "Agrees.", "J3333"],
        ["coral", "Med list", "<strong>Code not CMS's.</strong>", "J3344"],
        ["pink", "Five boxes", "<strong>Units not CMS's.</strong>", "expected 50 units\nbilled 30"],
      ],
    },
    outcomes: {
      h: "What an NDC can come back as",
      tiles: [
        ["green", "Agrees", "Every source matches CMS."],
        ["coral", "Code differs", "A source names another code."],
        ["amber", "Dose differs", "The unit means a different amount."],
        ["pink", "Units differ", "Fewer units billed than a package holds."],
        ["indigo", "CMS silent", "Your sources disagree with each other."],
      ],
    },
    limits: [
      "An NDC can be rightly billed under a code CMS does not list. Rows need review.",
      "The unit check needs the package size in the charge description.",
      "Newest quarter means the newest file on hand.",
    ],
  },
};

PAGES["non-payable-codes"] = {
  pitch: {
    h1: "Find the drug codes Medicare won't pay.",
    lede: "Every outpatient drug charge scored against OPPS on its service date.",
    gap: {
      h: "Billed is not the same as payable",
      fig: {
        alt: "Three codes. Two are not paid as billed: one has no rebate agreement and one is not listed. A third is packaged, which is normal.",
        rows: [["J4444", "no rebate", "waste"], ["J5555", "not listed", "waste"], ["J6666", "packaged", "plain"]],
        groups: [[0, 1, "Not paid", "as billed", "waste"], [2, 2, "Normal", "paid in procedure", "plain"]],
        caption: "Made-up codes.",
      },
      points: [
        "OPPS gives every drug code a payment status, and it changes by quarter.",
        "Some codes are never paid under Part B.",
        "A deleted or mistyped code is paid nothing.",
      ],
    },
    finds: {
      h: "Four issues, one per line",
      tiles: [
        ["coral", "No rebate agreement", "The maker has no Medicaid rebate agreement."],
        ["pink", "Not paid under OPPS", "Another fee schedule, inpatient only, or not covered."],
        ["amber", "Not in Addendum B", "Deleted, not yet effective, or mistyped."],
        ["slate", "Packaged", "Paid inside a procedure. Normal unless the drug is costly."],
      ],
    },
    gets: {
      h: "Leads for billing review, by issue and code",
      items: ["One row per issue and code", "The Medicare share of each", "Credits netted against charges", "Rules cited to CMS"],
    },
    cta: "See which codes pay nothing",
  },
  how: {
    h1: "One issue per line, decided in order.",
    lede: "How a charge is scored against Medicare's outpatient rules.",
    rule: {
      h: "The service date picks the rulebook",
      points: [
        "CMS's not-payable list wins.",
        "Otherwise a code missing from Addendum B is flagged.",
        "Otherwise the status indicator decides.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the outpatient lines", "CMS-style codes with a charge."],
        ["Find the quarter", "The Addendum B issue in force on the service date."],
        ["Check the not-payable list", "For that date."],
        ["Assign one issue", "The first rule that applies."],
        ["Net the credits", "Against their charges."],
        ["Total", "Per issue and code, with the Medicare share."],
      ],
    },
    example: {
      h: "Three codes",
      tiles: [
        ["coral", "J4444", "<strong>No rebate agreement.</strong>", "on the not-payable list"],
        ["amber", "J5555", "<strong>Not in Addendum B.</strong>", "absent this quarter"],
        ["slate", "J6666", "Packaged. Nothing to do.", "status N\nlow cost"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["coral", "No rebate agreement", "Not payable under Part B."],
        ["pink", "Not paid under OPPS", "Paid some other way, or not at all."],
        ["amber", "Not in Addendum B", "The code is not on that quarter's list."],
        ["slate", "Packaged", "Paid inside the procedure."],
        ["indigo", "Conditionally packaged", "Depends on the rest of the claim."],
      ],
    },
    limits: [
      "Medicare OPPS only. Other payers may pay.",
      "Rows are leads for billing review, not denials.",
      "The not-payable list covers only the quarters on hand. Lines outside them are not checked.",
    ],
  },
};

PAGES["charge-tables"] = {
  pitch: {
    h1: "Two drugs, nearly the same cost, very different charge.",
    lede: "Epic's tiered markup tables checked for gaps, overlaps and jumps.",
    gap: {
      h: "The charge steps at a tier boundary",
      fig: {
        alt: "A drug costing 10 dollars is charged 17 dollars. A drug costing 10 dollars and one cent is charged 12 dollars and one cent.",
        rows: [["Cost $10.00", "$17.00", "given"], ["Cost $10.01", "$12.01", "waste"]],
        groups: [[0, 1, "One cent apart", "charge drops $4.99", "waste"]],
        caption: "Made-up tiers.",
      },
      points: [
        "Each charge category prices by cost tier: a markup plus a fee.",
        "Where one tier hands to the next, the charge can jump.",
        "Nobody sees it in a table of hundreds of rows.",
      ],
    },
    finds: {
      h: "Faults at the boundaries",
      tiles: [
        ["coral", "Gap", "The next tier starts too late."],
        ["pink", "Overlap", "The next tier starts too early."],
        ["amber", "Charge jump", "The charge steps at a boundary."],
        ["indigo", "Raised tier", "A tier out of line with both neighbours."],
        ["green", "Dollars at stake", "Real charge lines near each jump, ranked."],
      ],
    },
    gets: {
      h: "Every category, checked and drawn",
      items: [
        "A workbook with one sheet per category",
        "Charge curves you can read at a glance",
        "A report of every boundary fault",
        "Charge moved if the jumps were smoothed",
      ],
    },
    cta: "See where your tables jump",
  },
  how: {
    h1: "Every tier boundary, checked.",
    lede: "How a charge table is read and tested.",
    rule: {
      h: "Charge is cost, marked up, plus a fee",
      points: [
        "<b>charge = cost × (1 + markup) + fee</b>, by cost tier.",
        "Each tier should hand over cleanly to the next.",
        "Real charge lines near a jump show what it moves.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read Epic's export", "The charge-table workbook."],
        ["Name the tiers", "Each category's name carried down to its tiers."],
        ["Check each boundary", "Gaps, overlaps and jumps."],
        ["Draw the curves", "Charge and effective markup by cost."],
        ["Smooth each tier", "Straight pieces with no step."],
        ["Count real lines", "Charges near each jump, and dollars moved if smoothed."],
      ],
    },
    example: {
      h: "One boundary",
      tiles: [
        ["teal", "Tier 1", "<strong>Charge $17.00.</strong>", "cost $10.00\n50% markup\n$2.00 fee"],
        ["coral", "Tier 2", "<strong>Charge $12.01.</strong>", "cost $10.01\n20% markup\nno fee"],
        ["amber", "Result", "<strong>A jump of $4.99 down.</strong>", "one cent more cost\n$4.99 less charge"],
      ],
    },
    outcomes: {
      h: "What a boundary can come back as",
      tiles: [
        ["green", "Clean", "The tier hands over with no step."],
        ["coral", "Gap", "Costs between two tiers belong to neither."],
        ["pink", "Overlap", "Costs belong to two tiers at once."],
        ["amber", "Jump", "The charge steps up or down."],
      ],
    },
    limits: [
      "It measures gross charge, not payment.",
      "It cannot say which side of a jump is right.",
      "Jumps are counted only where the export reproduces real charges.",
    ],
  },
};

PAGES["medicare-margin"] = {
  pitch: {
    h1: "Know which drugs Medicare pays less for than they cost.",
    lede: "Medicare's payment per unit set against your 340B and GPO cost.",
    gap: {
      h: "Payment is fixed. Cost is not.",
      fig: {
        alt: "Medicare pays 100 dollars. At the 340B price the drug costs 60, a margin of 40. At the GPO price it costs 110, a loss of 10.",
        rows: [["Medicare pays", "$100", "plain"], ["Cost at 340B", "$60", "given"], ["Cost at GPO", "$110", "waste"]],
        groups: [[1, 1, "+$40", "margin at 340B", "given"], [2, 2, "−$10", "loss at GPO", "waste"]],
        caption: "Made-up prices.",
      },
      points: [
        "Medicare pays a set rate per billing unit, updated each quarter.",
        "Your cost depends on which account bought the drug.",
        "The same drug can gain at one price and lose at another.",
      ],
    },
    finds: {
      h: "Margin, three ways",
      tiles: [
        ["green", "Margin as bought", "Payment minus cost at each line's own price tier."],
        ["teal", "Margin at 340B", "Every line priced at 340B."],
        ["amber", "Margin at GPO", "Every line priced at GPO."],
        ["coral", "Losing drugs", "Codes with negative margin, largest first."],
      ],
    },
    gets: {
      h: "Margin per code and NDC",
      items: ["One row per billing code and NDC", "As bought, all 340B, all GPO", "Lines it could not price, with the reason"],
    },
    cta: "See your margin drug by drug",
  },
  how: {
    h1: "Payment minus cost, line by line.",
    lede: "How Medicare's rate and your price meet.",
    rule: {
      h: "Same units on both sides",
      points: [
        "Payment is billed units times CMS's rate for the quarter.",
        "Cost is billed units times your price per billing unit that week.",
        "A line carrying TB is costed at 340B. Any other at GPO.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read Medicare outpatient lines", "Separately payable drugs only."],
        ["Find the rate", "Addendum B on the service date."],
        ["Convert the price", "Container price to price per billing unit, by CMS's crosswalk."],
        ["Price each line", "At its own tier."],
        ["Subtract", "Payment minus cost."],
        ["Recompute", "All lines at 340B, then all at GPO."],
        ["Total", "Per code and NDC."],
      ],
    },
    example: {
      h: "Ten units of one drug",
      lede: "CMS's rate is $10 a unit, so payment is $100.",
      tiles: [
        ["teal", "At 340B", "<strong>Margin +$40.</strong>", "$6 a unit\ncost $60"],
        ["coral", "At GPO", "<strong>Margin −$10.</strong>", "$11 a unit\ncost $110"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["green", "Priced", "Payment, cost and margin."],
        ["slate", "No rate", "The code has no payment rate that quarter."],
        ["indigo", "Not in crosswalk", "CMS does not pair the NDC with the code."],
        ["amber", "No price", "The catalog has no price for it that week."],
      ],
    },
    limits: [
      "Few lines carry TB, so “as bought” leans toward GPO.",
      "CMS's rate trails prices by two quarters. A price rise shows as a loss first.",
      "The price is a weekly catalog snapshot, not an invoice.",
      "Medicare Advantage is left out.",
    ],
  },
};

PAGES["mckesson-catalog"] = {
  pitch: {
    h1: "Every account's catalog, in one table you can trust.",
    lede: "Each week's McKesson price and item files, checked, joined and stacked into one master.",
    gap: {
      h: "One drug, many accounts, no single view",
      fig: {
        alt: "One item on three accounts, each on a different price list: GPO at 12 dollars, 340B at 9 dollars and WAC at 15 dollars.",
        rows: [["Acct A GPO", "$12.00", "plain"], ["Acct B 340B", "$9.00", "given"], ["Acct C WAC", "$15.00", "waste"]],
        groups: [[0, 2, "One item", "three price lists", "plain"]],
        caption: "Made-up prices.",
      },
      points: [
        "Each account gets its own cost report and item file, every week.",
        "Nobody can compare what was quoted until they are joined.",
        "A file that changed shape goes unnoticed.",
      ],
    },
    finds: {
      h: "What the weekly merge shows",
      tiles: [
        ["blue", "Coverage", "Recently bought items that found no item-master match."],
        ["indigo", "Billing codes", "Drug lines CMS bills under a HCPCS code, with payment status."],
        ["amber", "Code differences", "Where the supplier's billing code differs from CMS's."],
        ["violet", "340B exposure", "Lines to review for the 340B program, on request."],
      ],
    },
    gets: {
      h: "One master a week, ready for every other check",
      items: [
        "A weekly master table across all accounts",
        "A coverage workbook of matched and missed items",
        "HCPCS workbooks",
        "Files checked for layout and date before anything is joined",
      ],
    },
    cta: "Put your catalogs side by side",
  },
  how: {
    h1: "Many accounts, one weekly master.",
    lede: "How the files are checked, joined and stacked.",
    rule: {
      h: "Join by item, stack by account",
      points: [
        "Each account's cost report joins its item master by item number.",
        "A roster names each account's price list: GPO, 340B or WAC.",
        "A file with a changed layout or the wrong week stops the merge.",
      ],
    },
    path: {
      h: "Six steps, every week",
      steps: [
        ["File the downloads", "Newest weekly files go into one folder per account."],
        ["Check each file", "Layout unchanged, export date inside the week."],
        ["Join cost to item", "Each cost report meets its item master by item number."],
        ["Stack the accounts", "All accounts become one weekly master."],
        ["Report coverage", "Matched and missed items are counted and listed."],
        ["Add billing codes", "CMS HCPCS codes and payment status for drugs that have them."],
      ],
    },
    example: {
      h: "Three items, one week",
      tiles: [
        ["green", "Item 1001", "<strong>Matched.</strong>", "in the cost report\nin the item master"],
        ["coral", "Item 1002", "<strong>Listed as a miss.</strong>", "in the cost report\nno item-master row"],
        ["indigo", "Item 1003", "<strong>Goes in the HCPCS report.</strong>", "CMS code J0001\nstatus K"],
      ],
    },
    outcomes: {
      h: "What comes out",
      tiles: [
        ["green", "Matched", "Price and item detail on one row."],
        ["coral", "Missed", "Bought, but no item-master row. Listed."],
        ["amber", "Code differs", "The supplier's billing code is not CMS's."],
        ["slate", "No item file", "An account delivered without one carries no merged rows, and says so."],
      ],
    },
    limits: [
      "340B lists are exposure to review, not confirmed violations.",
      "An account delivered without an item master shows as missing.",
      "A catalog is a price list, not a purchase ledger.",
    ],
  },
};

PAGES["price-parity"] = {
  pitch: {
    h1: "Same contract, same drug, same price. Check it.",
    lede: "Every account's price compared each week, within and across price tiers.",
    gap: {
      h: "One account quietly pays a different price",
      fig: {
        alt: "Three accounts on one contract. Account 1 pays 10 dollars; accounts 2 and 3 pay 12 dollars.",
        rows: [["Account 1", "$10.00", "given"], ["Account 2", "$12.00", "waste"], ["Account 3", "$12.00", "waste"]],
        groups: [[0, 2, "Same contract", "two prices", "waste"]],
        caption: "Made-up prices.",
      },
      points: [
        "Accounts on one contract should pay one price.",
        "340B should not cost more than GPO, nor GPO more than WAC.",
        "A gap can sit for months before anyone looks.",
      ],
    },
    finds: {
      h: "What each week's report shows",
      tiles: [
        ["coral", "Same contract, different price", "The real price dispute."],
        ["amber", "Price order breach", "A drug priced above its tier's limit, with yearly dollars over."],
        ["indigo", "Account offsets", "Each account's share of drugs off the majority price."],
        ["green", "Resolved", "Mismatched last week, matched now."],
      ],
    },
    gets: {
      h: "One workbook per contract, every week",
      items: ["An overview and a detail sheet", "Estimated yearly dollars behind each breach", "History: weeks mismatched, and what resolved"],
    },
    cta: "See which account pays more",
  },
  how: {
    h1: "Each drug, each contract, each week.",
    lede: "How prices are compared and what counts as a mismatch.",
    rule: {
      h: "A real gap, not a rounding one",
      points: [
        "A mismatch is more than a cent and more than 0.1% of the lowest price.",
        "Price order: 340B at or below GPO, GPO at or below WAC.",
        "Yearly volume is estimated from weekly last-purchase snapshots.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the weekly masters", "With the account roster."],
        ["Check the inputs", "Columns, types and purchase quantities."],
        ["Compare within a contract", "Drug by drug, ignoring tiny gaps."],
        ["Check price order", "Each account against its tier and WAC."],
        ["Estimate volume", "A year's purchases from weekly snapshots."],
        ["Add history", "Weeks mismatched, and drugs resolved."],
        ["Write the workbooks", "One per contract."],
      ],
    },
    example: {
      h: "Two drugs",
      tiles: [
        ["coral", "Drug A on GPO", "<strong>Account 1 is off the majority price.</strong>", "account 1   $10.00\naccount 2   $12.00\naccount 3   $12.00"],
        ["amber", "Drug B", "<strong>340B above GPO: price order breach.</strong>", "340B price  $9.00\nGPO price   $8.00"],
      ],
    },
    outcomes: {
      h: "What a drug can come back as",
      tiles: [
        ["coral", "Same contract, different price", "One to take to the supplier."],
        ["slate", "Different contracts", "A list-price, load or tier question."],
        ["amber", "Price order breach", "Bought above the tier's limit."],
        ["green", "Resolved", "Was mismatched, is not now."],
      ],
    },
    limits: [
      "Volume is an annual estimate. Two purchases between snapshots show as one.",
      "The lower tier is not always open to you: 340B is for eligible outpatient use.",
      "Price order is a report. It does not stop the run.",
    ],
  },
};

PAGES["vial-size"] = {
  pitch: {
    h1: "The vial that wastes least is not always the cheapest.",
    lede: "Each dose priced against the cheapest package that would have covered it.",
    gap: {
      h: "Vial prices are not linear",
      fig: {
        alt: "A 500 mg dose. One 500 mg vial costs 560 dollars. Five 100 mg vials cost 500 dollars.",
        rows: [["1 × 500 mg", "$560", "waste"], ["5 × 100 mg", "$500", "given"]],
        groups: [[0, 1, "Same dose", "$60 apart", "waste"]],
        caption: "Made-up prices.",
      },
      points: [
        "A bigger vial is not priced in proportion to a smaller one.",
        "Discarded drug is one number. Avoidable spend is another.",
        "Only the second is a saving.",
      ],
    },
    finds: {
      h: "Two findings, two owners",
      tiles: [
        ["coral", "Vial too large", "Drug was discarded, and a smaller vial held the dose."],
        ["amber", "Cheaper package", "Nothing wasted, but another package costs less."],
        ["indigo", "By product", "The size to switch to, with avoidable spend."],
        ["slate", "Stated or inferred", "Whether single-dose came from a maintained source or from text."],
      ],
    },
    gets: {
      h: "A worklist for stocking and purchasing",
      items: [
        "One workbook, replaced each run",
        "Each finding with its owner: stocking or purchasing",
        "Avoidable spend kept apart from discarded value",
      ],
    },
    cta: "Price your doses against the catalog",
  },
  how: {
    h1: "Every dose, against its cheapest cover.",
    lede: "How avoidable spend is worked out.",
    rule: {
      h: "Actual spend minus the cheapest cover",
      points: [
        "Each single-dose administration is priced as it was dispensed.",
        "Then against the cheapest mix of the maker's packages covering the same dose.",
        "The difference is avoidable spend.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Load the sources", "Charge lines, formulary, med list, supplier catalog, FDA packages."],
        ["Keep single-dose containers", "A multi-dose leftover was never waste."],
        ["Price each administration", "At the 340B tier."],
        ["Find the cheapest cover", "From everything the maker sells."],
        ["Keep the positive ones", "Where another package would have cost less."],
        ["Split and total", "Vial too large, or cheaper package."],
      ],
    },
    example: {
      h: "Two doses",
      tiles: [
        ["amber", "500 mg dose", "<strong>Cheaper package: $60 avoidable.</strong>", "one 500 mg vial    $560\nfive 100 mg vials  $500"],
        ["coral", "90 mg dose", "<strong>Vial too large: $20 avoidable.</strong>", "one 100 mg vial    $100\ntwo 50 mg vials    $80"],
      ],
    },
    outcomes: {
      h: "What a dose can come back as",
      tiles: [
        ["coral", "Vial too large", "Owner: pharmacy stocking or clinical."],
        ["amber", "Cheaper package", "Owner: purchasing."],
        ["green", "Already cheapest", "Nothing to change."],
      ],
    },
    limits: [
      "Single-dose containers only.",
      "Compared with what the maker sells, not what is on your shelf.",
      "Everything is priced at the 340B tier.",
      "A switch is a stocking decision. The worklist does not make it.",
    ],
  },
};

PAGES["biosimilar-switch"] = {
  pitch: {
    h1: "What would the cheapest biosimilar save?",
    lede: "Reference biologics re-priced at their cheapest marketed biosimilar, with the Medicare effect.",
    gap: {
      h: "Same molecule, three prices",
      fig: {
        alt: "One molecule. The reference costs 500 dollars, biosimilar B 350 and biosimilar C 300.",
        rows: [["Reference", "$500", "waste"], ["Biosimilar B", "$350", "plain"], ["Biosimilar C", "$300", "given"]],
        groups: [[0, 2, "Per unit", "$200 apart", "waste"]],
        caption: "Made-up prices.",
      },
      points: [
        "Many biologics now have marketed biosimilars.",
        "Savings depend on your price, at GPO and at 340B.",
        "Medicare pays a biosimilar differently, so revenue moves too.",
      ],
    },
    finds: {
      h: "The size of the switch",
      tiles: [
        ["green", "Savings, reference moved", "Cost avoided at GPO and at 340B."],
        ["teal", "Savings, biosimilars moved", "Biosimilars in use shifted to the cheapest."],
        ["indigo", "Biosimilar share", "How much of your use is already biosimilar."],
        ["amber", "Medicare change", "What traditional Medicare would pay instead."],
      ],
    },
    gets: {
      h: "A number per molecule to start the conversation",
      items: [
        "A table per molecule and container size",
        "A table of every priced product",
        "Savings at GPO and at 340B, side by side",
        "The Medicare payment change beside each",
      ],
    },
    cta: "Size the switch before you propose it",
  },
  how: {
    h1: "Units given, re-priced.",
    lede: "How the savings estimate is built.",
    rule: {
      h: "Same units, cheapest product",
      points: [
        "FDA's Purple Book says which products are biosimilars of which.",
        "Units given are re-priced at the cheapest biosimilar's cost per unit.",
        "Medicare's change uses CMS's payment rates.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Load the sources", "Charges, Purple Book, supplier prices, CMS files."],
        ["Mark each product", "Reference or biosimilar."],
        ["Count units given", "Medicare units kept apart."],
        ["Cost per billing unit", "Every product, at GPO and 340B."],
        ["Group", "By molecule and container size."],
        ["Re-price", "All units at the cheapest biosimilar."],
        ["Medicare", "The payment change."],
      ],
    },
    example: {
      h: "One molecule",
      lede: "1,000 units of the reference given.",
      tiles: [
        ["coral", "Reference", "Today.", "$500 a unit"],
        ["slate", "Biosimilar B", "Would save $150,000.", "$350 a unit"],
        ["green", "Biosimilar C", "<strong>Saves $200,000.</strong>", "$300 a unit\n1,000 × ($500 − $300)"],
      ],
    },
    outcomes: {
      h: "What the tables show",
      tiles: [
        ["green", "Savings", "Per molecule, at each price tier."],
        ["indigo", "Share", "Biosimilar use today."],
        ["amber", "Medicare", "Often a lower payment. Traditional Medicare only."],
        ["slate", "Not priced", "A product the supplier does not list cannot be the cheapest."],
      ],
    },
    limits: [
      "A switch is a clinical decision first. Indication, payer formularies and patients mid-course are not modelled.",
      "Prices are one week. Volume is the year.",
      "340B savings hold only where the drug is bought at 340B.",
      "Other payers are not modelled.",
    ],
  },
};

PAGES["epic-cost-gap"] = {
  pitch: {
    h1: "When the price moves and Epic's cost does not.",
    lede: "Epic's loaded cost against today's supplier price, and what it does to every charge.",
    gap: {
      h: "Every charge is built on the cost in Epic",
      fig: {
        alt: "Epic holds a cost of 10 dollars and charges 30. The supplier's price is 12 dollars, which would charge 36.",
        rows: [["Epic cost $10", "charge $30", "plain"], ["Supplier $12", "charge $36", "given"]],
        groups: [[0, 1, "Per dose", "$6 undercharged", "waste"]],
        caption: "Made-up prices.",
      },
      points: [
        "Epic marks up a drug's cost to make its charge.",
        "The supplier's price changes weekly. Epic's cost changes when someone updates it.",
        "The gap rides on every charge until then.",
      ],
    },
    finds: {
      h: "What the comparison shows",
      tiles: [
        ["green", "Priced", "Lines with a dollar impact, over or under."],
        ["coral", "Largest gaps", "NDCs with the biggest impact, both directions."],
        ["slate", "Not reproduced", "Charges the tables could not rebuild. Left out, and counted."],
        ["amber", "Not comparable", "No Epic price, no supplier price, or units that don't convert."],
      ],
    },
    gets: {
      h: "The gap, drug by drug",
      items: ["A summary", "A table per NDC", "The pricing tiers used", "Every excluded line counted with its reason"],
    },
    cta: "Measure the gap in your charges",
  },
  how: {
    h1: "Charge each line twice.",
    lede: "Once on Epic's cost, once on the supplier's price.",
    rule: {
      h: "First prove the charge, then swap the cost",
      points: [
        "A charge is the cost run through its category's pricing tier.",
        "Rebuilding it from Epic's own cost must give the real charge, or the line is left out.",
        "Then the supplier's price goes in. The difference is the impact.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Load one week", "Charges, Epic costs, med list, supplier prices."],
        ["Check the roster", "One account is the source of Epic's cost."],
        ["Rebuild each charge", "On Epic's own cost."],
        ["Convert the supplier price", "To Epic's unit."],
        ["Rebuild again", "On the supplier price."],
        ["Subtract", "Impact per drug and category."],
      ],
    },
    example: {
      h: "Two lines",
      lede: "A tier that charges three times cost.",
      tiles: [
        ["green", "Line 1", "<strong>Undercharged by $6.</strong>", "Epic cost $10   charge $30\nsupplier $12    charge $36"],
        ["slate", "Line 2", "Not reproduced. Left out.", "Epic cost $10 gives $30\nreal charge was $45"],
      ],
    },
    outcomes: {
      h: "What a line can come back as",
      tiles: [
        ["green", "Priced", "Impact in dollars, over or under."],
        ["slate", "Charge not reproduced", "Left out."],
        ["indigo", "Costed another way", "Left out."],
        ["amber", "Cannot compare", "A price or a unit is missing."],
      ],
    },
    limits: [
      "The figure is gross charge. Medicare outpatient pays by code rate, so money moves only where payers pay by charges.",
      "The supplier price is GPO, not 340B.",
      "It needs a current charge-table export.",
      "Some categories and units are not read.",
    ],
  },
};

PAGES["inventory-turn"] = {
  pitch: {
    h1: "How long does a drug sit before it is used?",
    lede: "Each dispense matched to the purchase before it, by pharmacy.",
    gap: {
      h: "The shelf is money waiting",
      fig: {
        alt: "A drug bought on day 60 and day 90 and dispensed on day 100. The nearest earlier purchase is day 90: 10 days on hand.",
        rows: [["Bought", "day 60", "plain"], ["Bought", "day 90", "given"], ["Dispensed", "day 100", "given"]],
        groups: [[1, 2, "10 days", "on hand", "given"]],
        caption: "Made-up days.",
      },
      points: [
        "Every dispense has a purchase somewhere before it.",
        "The days between are stock on the shelf.",
        "A dispense with no purchase behind it is a question.",
      ],
    },
    finds: {
      h: "What it finds",
      tiles: [
        ["amber", "Slow turn", "Dispensed more than 45 days after the purchase."],
        ["coral", "No purchase on record", "Never bought, or bought only after the dispense."],
        ["indigo", "Not in the catalog", "Sourced some other way."],
        ["pink", "NDC mis-mapped", "The charge names a package never bought, while a sibling is stocked."],
        ["slate", "Bagged doses", "Doses the hospital did not supply."],
      ],
    },
    gets: {
      h: "Days on hand, by pharmacy and by drug",
      items: ["Median, 90th percentile and longest wait per pharmacy group", "Findings by drug", "A weekly review workbook"],
    },
    cta: "See how long your stock waits",
  },
  how: {
    h1: "Each dispense, and the purchase before it.",
    lede: "How days on hand are measured.",
    rule: {
      h: "Measured on the day of the dispense",
      points: [
        "Days on hand is the dispense date minus the nearest earlier purchase.",
        "Purchases are rebuilt from weekly catalog snapshots.",
        "A one-cent token charge means the hospital did not supply the dose.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read both sources", "Weekly dispenses and weekly catalogs."],
        ["Keep matched weeks", "Only weeks with both."],
        ["Cancel reversals", "A charge and its credit."],
        ["Choose the drugs", "A med list, the catalog, or everything."],
        ["Match", "Each dispense to the latest purchase on or before it."],
        ["Assign a status", "Worst first."],
        ["Roll up", "By pharmacy group."],
      ],
    },
    example: {
      h: "Three drugs",
      tiles: [
        ["green", "Drug A", "<strong>10 days on hand.</strong>", "bought day 60 and day 90\ndispensed day 100"],
        ["coral", "Drug B", "<strong>No purchase before the dispense.</strong>", "dispensed day 100\nbought day 120"],
        ["slate", "Drug C", "Bagged. The hospital did not supply it.", "charged $0.01"],
      ],
    },
    outcomes: {
      h: "What a dispense can come back as",
      tiles: [
        ["green", "Within 45 days", "Normal turn."],
        ["amber", "Slow turn", "Over 45 days."],
        ["coral", "No purchase", "Nothing bought before the dispense."],
        ["pink", "Mis-mapped", "A sibling NDC was the one bought."],
        ["slate", "Bagged", "Supplied from outside."],
      ],
    },
    limits: [
      "Only wholesaler purchases are visible.",
      "A catalog snapshot is not a ledger. Early dispenses may be matched to an older purchase.",
      "The mis-mapped count is a floor.",
    ],
  },
};

PAGES["peak-usage"] = {
  pitch: {
    h1: "Size your stock to the busiest weeks, not the average.",
    lede: "Each drug's peak weeks, with the bad charge lines that would inflate them.",
    gap: {
      h: "One mis-keyed quantity makes a false peak",
      fig: {
        alt: "Two real peak weeks of 9,000 and 8,000 dollars, and one line with a quantity of 99,999 that is a keying error.",
        rows: [["Week 2", "$9,000", "given"], ["Week 4", "$8,000", "given"], ["Qty 99,999", "review", "waste"]],
        groups: [[0, 1, "Real peaks", "size stock here", "given"], [2, 2, "Bad line", "not a peak", "waste"]],
        caption: "Made-up weeks.",
      },
      points: [
        "Averages hide the weeks that empty the shelf.",
        "A typed quantity of 99,999 looks like the busiest week ever.",
        "Buy against it and you overstock.",
      ],
    },
    finds: {
      h: "What it gives a buyer",
      tiles: [
        ["blue", "Peak windows", "A drug's busiest separate weeks, ranked by cost."],
        ["green", "Buyer worklist", "One line per drug, summarising its peaks."],
        ["coral", "Bad lines", "Charge lines whose own numbers disagree."],
        ["amber", "Data checks", "Period-level issues that could make a figure wrong."],
      ],
    },
    gets: {
      h: "Peaks you can buy against",
      items: ["A worklist with one line per drug", "Every peak window behind it", "Bad lines listed for review first"],
    },
    cta: "Find your real busiest weeks",
  },
  how: {
    h1: "Busiest weeks, after the bad lines are out.",
    lede: "How peaks are found and what is set aside first.",
    rule: {
      h: "Peaks by cost, in separate weeks",
      points: [
        "A drug's busiest weeks are ranked by acquisition cost.",
        "The windows do not overlap, so one surge is not counted twice.",
        "Supply and diluent codes are left out.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the charge extracts", "The weekly files, already checked."],
        ["Cancel reversals", "A credit against the charge it exactly reverses."],
        ["Drop supplies", "Supply and diluent codes."],
        ["Find the peaks", "Each drug's busiest separate weeks."],
        ["Flag bad lines", "Lines whose numbers disagree."],
        ["Check the period", "Issues that could skew a figure."],
      ],
    },
    example: {
      h: "One drug, four weeks",
      tiles: [
        ["blue", "Weekly cost", "<strong>Peaks: week 2, then week 4.</strong>", "week 1   $1,000\nweek 2   $9,000\nweek 3   $2,000\nweek 4   $8,000"],
        ["coral", "A bad line", "<strong>Reviewed before anyone buys against it.</strong>", "quantity 99,999\nwhere 1,000 was meant"],
      ],
    },
    outcomes: {
      h: "What comes out",
      tiles: [
        ["blue", "Peak window", "A week to size stock by."],
        ["coral", "Bad line", "Set aside for review."],
        ["amber", "Check", "A period-level warning."],
      ],
    },
    limits: [
      "A credit with no matching charge stays in and nets against its drug.",
      "It sizes peaks. It does not forecast.",
      "The bad-lines list carries encounter identifiers and must be kept private.",
    ],
  },
};

PAGES["orphan-drugs"] = {
  pitch: {
    h1: "Know which drugs the orphan exclusion covers.",
    lede: "The exclusion list built from FDA data, matched to what you buy.",
    gap: {
      h: "On a 340B account, at no 340B discount",
      fig: {
        alt: "An orphan drug costs 100 dollars on the 340B account and 100 on the other contract: no benefit. A biosimilar costs 60.",
        rows: [["340B account", "$100", "waste"], ["Other contract", "$100", "plain"], ["Biosimilar", "$60", "given"]],
        groups: [[0, 1, "No benefit", "buy off 340B", "waste"], [2, 2, "Switch", "$40 less", "given"]],
        caption: "Made-up prices.",
      },
      points: [
        "For rural referral centers and critical access hospitals, a maker may withhold the 340B price on an orphan drug.",
        "The list is yours to build, from FDA's designations.",
        "FDA's data carries no NDC, so matching takes work.",
      ],
    },
    finds: {
      h: "What the screen shows",
      tiles: [
        ["violet", "Orphan sponsor products", "Items the exclusion covers, flagged where bought on 340B accounts."],
        ["amber", "Discount to confirm", "A 340B-type discount on an excluded drug. Allowed only if the maker chose to give it."],
        ["coral", "No-discount purchases", "Bought on 340B at list or group price."],
        ["green", "Switch candidates", "A cheaper generic or biosimilar of the same molecule."],
      ],
    },
    gets: {
      h: "The list, and what it costs you",
      items: [
        "The orphan exclusion list as a workbook",
        "Spend on excluded drugs, by account",
        "Cheaper alternatives beside each",
        "A log of FDA list changes that touch your items",
      ],
    },
    cta: "Build your exclusion list",
  },
  how: {
    h1: "From FDA's designations to your purchases.",
    lede: "How the list is built and matched.",
    rule: {
      h: "Designated means excludable, for every use",
      points: [
        "HRSA tells covered entities to build the list from FDA's orphan designation database.",
        "Designated, and designated and approved, both count.",
        "Whether it covers only the sponsor's product is a point to confirm with your 340B advisor.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Download FDA's data", "Orphan designations, Orange Book, Purple Book."],
        ["Keep active designations", "And count generics and biosimilars."],
        ["Match catalog items", "By name, and assign each a role."],
        ["Rebuild purchases", "From weekly catalog snapshots."],
        ["Compare prices", "Across accounts and against alternatives."],
        ["Add use", "What was given, and alternatives already in use."],
        ["Watch for changes", "FDA list changes that touch your items."],
      ],
    },
    example: {
      h: "One designated drug",
      tiles: [
        ["coral", "Drug Q", "<strong>No 340B benefit. Buy on the other contract.</strong>", "340B account      $100\nregular contract  $100"],
        ["green", "Biosimilar of Q", "<strong>A switch candidate.</strong>", "340B account      $60"],
      ],
    },
    outcomes: {
      h: "What an item can come back as",
      tiles: [
        ["violet", "Orphan sponsor product", "The exclusion covers it."],
        ["amber", "Discount to confirm", "A discount the maker may have chosen to give."],
        ["coral", "No discount", "Bought on 340B at no benefit."],
        ["green", "Switch candidate", "A cheaper alternative exists."],
        ["slate", "Not orphan", "No designation matched."],
      ],
    },
    limits: [
      "Matching is by name. FDA's data has no NDC, so some links are missed or wrong.",
      "Spend and savings are floors. A catalog is not a purchase ledger.",
      "An alternative is not a clinical equivalent.",
      "An item missing from the catalog counts as not orphan.",
    ],
  },
};

PAGES["mtf-claim-chains"] = {
  pitch: {
    h1: "Two discounts on one prescription is a problem. So is none.",
    lede: "Medicare MTF claims checked against your 340B TPA's eligibility verdict.",
    gap: {
      h: "The claim and the TPA should agree",
      fig: {
        alt: "Three claims. Two disagree with the TPA and are at risk. One is priced at 340B and the TPA says yes.",
        rows: [["Priced 340B", "TPA: no", "waste"], ["Not 340B", "TPA: yes", "waste"], ["Priced 340B", "TPA: yes", "given"]],
        groups: [[0, 1, "At risk", "they disagree", "waste"], [2, 2, "Fine", "they agree", "given"]],
        caption: "Made-up claims.",
      },
      points: [
        "Under Medicare's Maximum Fair Price program, each claim states whether it was priced at 340B.",
        "Your TPA separately decides whether the fill was 340B-eligible.",
        "Claims are resubmitted in chains. Only the last one counts.",
      ],
    },
    finds: {
      h: "Where the two disagree",
      tiles: [
        ["coral", "Missing MFP risk", "Priced at 340B, but the TPA says not eligible."],
        ["pink", "Duplicate discount risk", "The TPA says eligible, but the claim was not priced at 340B."],
        ["amber", "Not found", "No TPA verdict. Unassessed, not cleared."],
        ["indigo", "Duplicate fills", "Two claims or two TPA rows on one fill."],
      ],
    },
    gets: {
      h: "Every claim with its verdict and its risk",
      items: [
        "A filtered claims workbook with verdict and risk columns",
        "The chain behind each claim",
        "Reports of duplicates and unmatched claims",
      ],
    },
    cta: "Check your MTF claims against your TPA",
  },
  how: {
    h1: "Resolve the chain, then compare.",
    lede: "How a claim is reduced to one row and judged.",
    rule: {
      h: "The last claim in the chain is the claim",
      points: [
        "A resubmission points back at the claim it replaces.",
        "Following the chain leaves one live claim. Reversals drop out.",
        "Its 340B basis is compared with the TPA's verdict for the same pharmacy, prescription and fill.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the MTF extract", "All of its sheets."],
        ["Follow each chain", "Keep only the newest claim."],
        ["Join the numbers", "Prescription and fill."],
        ["Drop reversals", "Transactions that undo a claim."],
        ["Match the TPA", "Eligibility for the same fill."],
        ["Set the verdict", "And two risk flags."],
        ["Write the reports", "Audit and exceptions."],
      ],
    },
    example: {
      h: "Four claims",
      tiles: [
        ["coral", "Claim 1", "<strong>Missing MFP risk.</strong>", "priced at 340B\nTPA says no"],
        ["pink", "Claim 2", "<strong>Duplicate discount risk.</strong>", "not priced at 340B\nTPA says yes"],
        ["green", "Claim 3", "No flag.", "priced at 340B\nTPA says yes"],
        ["amber", "Claim 4", "Not found. Unassessed.", "no TPA row"],
      ],
    },
    outcomes: {
      h: "What a claim can come back as",
      tiles: [
        ["green", "Agrees", "Claim and TPA say the same."],
        ["coral", "Missing MFP risk", "340B price on an ineligible fill."],
        ["pink", "Duplicate discount risk", "Eligible fill not priced at 340B."],
        ["amber", "Not found", "Listed for follow-up."],
        ["indigo", "Duplicate", "Two rows on one fill."],
      ],
    },
    limits: [
      "A not-found claim is unassessed, not cleared.",
      "If the TPA export holds only eligible rows, one flag reads zero. Check the export.",
      "The two files can cover different dates.",
      "A chain that began before the period has no visible history.",
    ],
  },
};

PAGES["claims-payers"] = {
  pitch: {
    h1: "See who paid each eligible 340B claim.",
    lede: "Payer details pulled out of the claim text for every matched, eligible claim.",
    gap: {
      h: "The payer is in there, as one long string",
      fig: {
        alt: "One string of payer text becomes three columns: BIN, PCN and group.",
        rows: [["Payer text", "one string", "waste"], ["BIN", "999999", "given"], ["PCN", "ABC", "given"], ["GRP", "RX1234", "given"]],
        groups: [[1, 3, "Parsed", "one column each", "given"]],
        caption: "Made-up values.",
      },
      points: [
        "Your 340B platform exports each claim's payers as free text.",
        "Up to three payers hide in it.",
        "Nobody can filter or count them as it stands.",
      ],
    },
    finds: {
      h: "What each claim gains",
      tiles: [
        ["blue", "Payer count", "How many payers the claim carries."],
        ["indigo", "Payer detail", "BIN, PCN and group for the first three."],
        ["amber", "Employee plan", "Where your own plan sits among the payers."],
        ["teal", "Care-card plan", "The same, for care-card plans."],
      ],
    },
    gets: {
      h: "One workbook, payers in columns",
      items: ["All claims", "Claims with payers", "Claims without", "Named for the fill dates it covers"],
    },
    cta: "Put your payers in columns",
  },
  how: {
    h1: "Matched, eligible, then parsed.",
    lede: "Which claims get payer columns and how.",
    rule: {
      h: "Only eligible matched claims get payers",
      points: [
        "A claim must be in the matched state.",
        "Its prescription and fill must have a match marked eligible.",
        "Then BIN, PCN and group are read from the payer text.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read both exports", "Claims and matches."],
        ["Build the key", "Prescription and fill."],
        ["Find eligible fills", "From the match export."],
        ["Keep matched claims", "State: matched."],
        ["Parse the payers", "Up to three, and count them all."],
        ["Flag plans", "Employee and care-card."],
        ["Write the workbook", "With and without payers."],
      ],
    },
    example: {
      h: "Three claims",
      tiles: [
        ["green", "Claim 1", "<strong>Payer count 2. Both filled in.</strong>", "matched\neligible match\ntwo payers in the text"],
        ["slate", "Claim 2", "Left blank.", "matched\nno eligible match"],
        ["indigo", "Claim 3", "Left blank.", "not matched"],
      ],
    },
    outcomes: {
      h: "What a claim can come back as",
      tiles: [
        ["green", "With payers", "Columns filled."],
        ["slate", "Without payers", "Blank by rule."],
        ["coral", "Stopped", "A missing column, or text where a number belongs, stops the run."],
      ],
    },
    limits: [
      "Only the first three payers get columns. More are counted.",
      "Eligibility is your platform's verdict, taken as given.",
      "A bad date is blanked with a warning.",
    ],
  },
};

PAGES["ndc-lifecycle"] = {
  pitch: {
    h1: "Don't bill an NDC that FDA says is gone.",
    lede: "Every charged NDC checked against FDA's directory.",
    gap: {
      h: "The package was discontinued. The charge was not.",
      fig: {
        alt: "A package's marketing ends June 30. A charge on June 15 is fine. A charge on July 10 is after the end.",
        rows: [["Marketing ends", "Jun 30", "plain"], ["Charged", "Jun 15", "given"], ["Charged", "Jul 10", "waste"]],
        groups: [[2, 2, "After the end", "can be rejected", "waste"]],
        caption: "Made-up dates.",
      },
      points: [
        "FDA lists when each package's marketing starts and ends.",
        "Epic keeps charging the NDC it was built with.",
        "A payer can reject the claim.",
      ],
    },
    finds: {
      h: "A label for every charged NDC",
      tiles: [
        ["coral", "Billed after end of marketing", "Charged once FDA says marketing ended."],
        ["pink", "Excluded by FDA", "A charged NDC on FDA's excluded list."],
        ["amber", "Not in the directory", "An NDC FDA does not carry."],
        ["slate", "In-house codes", "Your own codes, set aside."],
        ["teal", "Launch lag", "Days from first marketing to first charge."],
      ],
    },
    gets: {
      h: "One row per NDC",
      items: ["Lines and charges after end of marketing", "Each NDC's FDA status", "A summary to act on"],
    },
    cta: "Check your NDCs against FDA",
  },
  how: {
    h1: "Every charged NDC, against FDA's directory.",
    lede: "How each code gets its label.",
    rule: {
      h: "The service date against the end date",
      points: [
        "FDA's directory gives each package a marketing start and end.",
        "A line served after the end date is after end of marketing.",
        "Codes are put in the 11-digit form first, so they match.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the charge lines", "Oldest week first."],
        ["Pull the NDC", "From each charge code."],
        ["Read FDA's files", "Listed and excluded packages."],
        ["Label each code", "In-house, not an NDC, listed, excluded or not in the directory."],
        ["Total", "Lines and charges per NDC, and the part after the end."],
        ["Launch lag", "For packages first marketed inside the period."],
      ],
    },
    example: {
      h: "Two NDCs",
      tiles: [
        ["coral", "00000-1234-01", "<strong>One line after end of marketing.</strong>", "marketing ends Jun 30\ncharged Jun 15\ncharged Jul 10"],
        ["amber", "00000-9999-01", "<strong>Not in the directory.</strong>", "in neither FDA file"],
      ],
    },
    outcomes: {
      h: "What an NDC can come back as",
      tiles: [
        ["green", "Listed", "In FDA's directory and current."],
        ["coral", "After end of marketing", "Charged past the end date."],
        ["pink", "Excluded", "On FDA's excluded list."],
        ["amber", "Not in the directory", "FDA does not carry it."],
        ["slate", "In-house", "Your own code."],
      ],
    },
    limits: [
      "FDA's directory is a snapshot. A package changed since is misread.",
      "Not in the directory is not always an error: outsourced compounds and some radiopharmaceuticals are not listed.",
      "Where an NDC is both listed and excluded, listed wins.",
    ],
  },
};

PAGES["unit-dose-barcodes"] = {
  pitch: {
    h1: "Fix the scan before it fails at the bedside.",
    lede: "Unit-dose barcodes whose NDC your Epic lists don't hold.",
    gap: {
      h: "The vial carries a different NDC than its carton",
      fig: {
        alt: "A carton's NDC ends 1234-01. The vial inside is barcoded 1234-02, which Epic does not hold.",
        rows: [["Carton", "…1234-01", "given"], ["Vial inside", "…1234-02", "waste"]],
        groups: [[1, 1, "Scanned", "not in Epic", "waste"]],
        caption: "Made-up NDCs.",
      },
      points: [
        "The nurse scans the vial, not the carton.",
        "If Epic only knows the carton's NDC, the scan fails.",
        "The override becomes habit.",
      ],
    },
    finds: {
      h: "A status for every charged NDC",
      tiles: [
        ["coral", "Inner NDC not in Epic", "The strongest leads: FDA prints the code and Epic lacks it."],
        ["amber", "Not in Epic or FDA", "Weaker. The barcode or the listing may be wrong."],
        ["green", "Already covered", "Epic holds the inner NDC."],
        ["slate", "Cannot check", "No readable barcode, or no catalog item."],
      ],
    },
    gets: {
      h: "The drugs to fix first",
      items: ["One row per charged NDC", "Ranked by times given", "The most-given gaps named up front"],
    },
    cta: "Find the scans that will fail",
  },
  how: {
    h1: "Decode the barcode, then look for it.",
    lede: "How a gap is found.",
    rule: {
      h: "The inner NDC differs, and Epic lacks it",
      points: [
        "The catalog's unit-dose barcode decodes to an NDC.",
        "If it differs from the item's own, it is the inner scan code.",
        "Epic's lists and FDA's files are searched for it.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the charge lines", "Positive charges only."],
        ["Read Epic's lists", "NDC lists and billing med lists."],
        ["Look up the catalog", "Each charged NDC."],
        ["Decode the barcode", "To an inner NDC."],
        ["Search", "Epic's lists, then FDA."],
        ["Assign a status", "One per charged NDC."],
        ["Rank", "By times given."],
      ],
    },
    example: {
      h: "Two drugs",
      tiles: [
        ["coral", "Drug A", "<strong>A strong lead.</strong>", "carton   00000-1234-01\nbarcode  00000-1234-02\nEpic has the carton only\nFDA prints the inner code"],
        ["green", "Drug B", "Nothing to fix.", "barcode decodes to\nits own NDC"],
      ],
    },
    outcomes: {
      h: "What an NDC can come back as",
      tiles: [
        ["coral", "Not in Epic", "FDA prints it. Epic lacks it."],
        ["amber", "Not in Epic or FDA", "A weaker lead."],
        ["green", "Covered", "Epic holds it."],
        ["blue", "Carton's NDC", "The unit carries the carton's NDC."],
        ["slate", "Cannot check", "No barcode to read."],
      ],
    },
    limits: [
      "A lead is not a failed scan. Epic may hold the barcode in records the exports omit.",
      "Most catalog items have no unit-dose barcode.",
      "Credits are left out.",
    ],
  },
};

PAGES["cdm-maintenance"] = {
  pitch: {
    h1: "The charge master workbook, built not typed.",
    lede: "Epic's billing med list cleaned, keyed and joined to Medi-Span.",
    gap: {
      h: "Several ways to write one NDC",
      fig: {
        alt: "NDCs typed in 5-3-2 and 4-4-2 layouts are mixed. The billing form is 11 digits, 5-4-2.",
        rows: [["00000-123-01", "5-3-2", "waste"], ["0000-1234-01", "4-4-2", "waste"], ["00000-0123-01", "5-4-2", "given"]],
        groups: [[0, 1, "As typed", "mixed layouts", "waste"], [2, 2, "As billed", "11 digits", "given"]],
        caption: "Made-up NDCs.",
      },
      points: [
        "The med list holds NDCs in mixed layouts.",
        "Duplicates and typos hide among thousands of rows.",
        "Maintaining it by hand is slow and error-prone.",
      ],
    },
    finds: {
      h: "What the workbook sets apart",
      tiles: [
        ["green", "Normalized rows", "Every row with its NDC in clean 11-digit form."],
        ["amber", "Duplicate NDCs", "An NDC on more than one row."],
        ["pink", "Irregular rows", "A cost unit that is not each, mL or gram."],
        ["coral", "NDC exceptions", "Looks like an NDC but fits no layout. Usually a typo."],
      ],
    },
    gets: {
      h: "One workbook, ready for maintenance",
      items: ["A main sheet, a summary and an exceptions sheet", "Medi-Span data beside each NDC", "A log of the run"],
    },
    cta: "Build your maintenance workbook",
  },
  how: {
    h1: "Normalize, key, join.",
    lede: "How the med list becomes a workbook.",
    rule: {
      h: "Every NDC to one layout",
      points: [
        "Four layouts are padded to 11 digits, 5-4-2.",
        "The charge-master key is the drug's Epic number plus the NDC.",
        "Medi-Span joins on the NDC and never adds a row.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the med list", "Epic's billing export."],
        ["Read Medi-Span", "Your licensed extract."],
        ["Normalize each NDC", "And flag duplicates."],
        ["Build the keys", "Irregular rows held aside."],
        ["Clean cost fields", "Cost and increment."],
        ["Join Medi-Span", "By NDC."],
        ["Write and log", "The workbook and the run."],
      ],
    },
    example: {
      h: "One row",
      tiles: [
        ["green", "The NDC", "Padded to 5-4-2.", "00000-123-01\nbecomes 00000-0123-01"],
        ["blue", "The key", "Epic number plus NDC.", "99999_00000012301"],
        ["pink", "The unit", "<strong>Irregular. Key held aside.</strong>", "cost per: Box"],
      ],
    },
    outcomes: {
      h: "What a row can come back as",
      tiles: [
        ["green", "Normalized", "Clean NDC and a key."],
        ["amber", "Duplicate", "Its NDC is on another row too."],
        ["pink", "Irregular", "Key held in its own column."],
        ["coral", "Exception", "Fits no NDC layout."],
        ["slate", "Stopped", "A bad cost or NDC value stops the run. Nothing is guessed."],
      ],
    },
    limits: [
      "It needs a current licensed Medi-Span extract.",
      "It stops on a bad value. It does not guess.",
      "The 10-digit form can be blank where the padding zero cannot be told.",
    ],
  },
};

PAGES["meditech-drug-list"] = {
  pitch: {
    h1: "Meditech's drug list, as tables you can use.",
    lede: "The PHA Drug List print report parsed, then checked against CMS and your barcodes.",
    gap: {
      h: "A report made for paper",
      fig: {
        alt: "A print report: page headers are removed, each drug record becomes one row and each barcode pair is checked.",
        rows: [["Page header", "removed", "plain"], ["Drug record", "one row", "given"], ["Barcode pair", "checked", "given"]],
        groups: [[0, 2, "Print report", "becomes tables", "given"]],
      },
      points: [
        "The drug list exists only as a print-style text report.",
        "Nobody can sort, filter or check it as it comes.",
        "Barcodes and billing codes go unchecked.",
      ],
    },
    finds: {
      h: "What the checks show",
      tiles: [
        ["coral", "Malformed barcode pairs", "A scan code or billing NDC of the wrong length."],
        ["indigo", "CMS payment lines", "Each drug's billing code, status and rate."],
        ["green", "Barcode type", "The billing NDC, or a confirmed inner scan code."],
        ["amber", "Missing inner codes", "Unit doses that may not scan at the bedside."],
      ],
    },
    gets: {
      h: "Tables and two spreadsheets",
      items: [
        "Drugs, inventories and purchasing as tables",
        "Barcode pairs with a variance sheet",
        "An extract-style view of the whole list",
      ],
    },
    cta: "Turn your drug list into data",
  },
  how: {
    h1: "From print columns to tables.",
    lede: "How the report is read and checked.",
    rule: {
      h: "Read every field from its column, or stop",
      points: [
        "Fields sit at fixed positions on the printed page.",
        "Repeated page headers come out first.",
        "If the layout changes, the parser stops. It does not guess.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the report", "Remove page headers."],
        ["Split into drugs", "One record each."],
        ["Read the fields", "Lists and per-site settings into tables."],
        ["Pair the barcodes", "Each scan code with its billing NDC."],
        ["Follow CMS", "NDC to billing code to payment rate."],
        ["Compare scan codes", "Catalog inner codes against the drug's barcodes."],
        ["Write", "Spreadsheets and summaries."],
      ],
    },
    example: {
      h: "Two barcode pairs",
      tiles: [
        ["green", "Pair 1", "Well formed.", "scan code   0000012340\nbilling NDC 00000123401"],
        ["coral", "Pair 2", "<strong>Listed as a variance.</strong>", "scan code   000012340\nnine digits"],
      ],
    },
    outcomes: {
      h: "What a drug can come back as",
      tiles: [
        ["green", "Well formed", "Scan code and billing NDC both the right length."],
        ["coral", "Variance", "A malformed pair, shaded and listed."],
        ["amber", "Missing inner code", "May not scan at the bedside."],
        ["indigo", "Payable", "A CMS code, status and rate found."],
      ],
    },
    limits: [
      "It is a print layout, not an export. Fields the report does not print stay empty.",
      "Some unit sizes are inferred from strength.",
      "It stops if the report's layout changes.",
    ],
  },
};

PAGES["site-of-care"] = {
  pitch: {
    h1: "Same drug, different site, different charge per unit.",
    lede: "Each drug compared across your sites of care.",
    gap: {
      h: "One charge master, yet the sites differ",
      fig: {
        alt: "One drug is charged 100 dollars a unit at the infusion site and 130 at the clinic: a 30 percent spread.",
        rows: [["Infusion", "$100 / unit", "given"], ["Clinic", "$130 / unit", "waste"]],
        groups: [[0, 1, "Same drug", "30% spread", "waste"]],
        caption: "Made-up charges.",
      },
      points: [
        "One charge master prices every site.",
        "So a spread means something was billed differently.",
        "NDC, vial size, unit count or charge table: each is worth a look.",
      ],
    },
    finds: {
      h: "What each drug shows by site",
      tiles: [
        ["blue", "Site profile", "Volume, patients and charge per unit."],
        ["indigo", "Payer mix", "Medicare, Medicare Advantage, Medicaid, self-pay and commercial."],
        ["violet", "340B modifier share", "Lines billed with TB or JG."],
        ["coral", "Site spread", "Drugs ranked by how far charge per unit differs."],
      ],
    },
    gets: {
      h: "A ranked list of spreads to check",
      items: ["Every drug by site", "Drugs ranked by spread", "No patient identifier in any output"],
    },
    cta: "Compare your sites",
  },
  how: {
    h1: "One drug at every site.",
    lede: "How sites are compared.",
    rule: {
      h: "Highest charge per unit over lowest",
      points: [
        "Each line gets a site from its department.",
        "Each drug is summarized at each site.",
        "Spread is the highest charge per unit over the lowest, less one.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the charge files", "Oldest first."],
        ["Keep drug codes", "CMS codes with a charge."],
        ["Assign site and payer", "From department and payer."],
        ["Net the credits", "Charges and units."],
        ["Summarize", "Each drug at each site."],
        ["Rank", "By spread across outpatient sites."],
      ],
    },
    example: {
      h: "One drug, two sites",
      tiles: [
        ["teal", "Infusion site", "<strong>$100 a unit.</strong>", "100 units\n$10,000 charged"],
        ["coral", "Clinic", "<strong>$130 a unit.</strong>", "50 units\n$6,500 charged"],
        ["amber", "Spread", "<strong>30%. Near the top of the list.</strong>", "130 ÷ 100 − 1"],
      ],
    },
    outcomes: {
      h: "What a drug can come back as",
      tiles: [
        ["coral", "Wide spread", "A line to check, not a finding."],
        ["green", "Narrow spread", "The sites agree."],
        ["slate", "Too few patients", "Left out of the ranking."],
      ],
    },
    limits: [
      "Charges are gross charges, not cost.",
      "A wide spread is a line to check, not a finding.",
      "The modifier share shows how lines were billed, not whether a site is 340B-eligible.",
    ],
  },
};

PAGES["prescriber-variation"] = {
  pitch: {
    h1: "See which prescribers differ, and by how much.",
    lede: "Charge per patient, dose and biosimilar use, compared with the median prescriber.",
    gap: {
      h: "Same drug, very different patterns",
      fig: {
        alt: "Charge per patient for one drug: prescriber A 900 dollars, the median 1,000 and prescriber E 1,500, which is 1.5 times the median.",
        rows: [["Prescriber A", "$900", "plain"], ["Median", "$1,000", "given"], ["Prescriber E", "$1,500", "waste"]],
        groups: [[2, 2, "1.5× median", "flagged", "waste"]],
        caption: "Made-up charges.",
      },
      points: [
        "Prescribers of one drug vary in dose and in charge per patient.",
        "Some are slow to adopt biosimilars.",
        "Without a median, there is no outlier.",
      ],
    },
    finds: {
      h: "What it measures",
      tiles: [
        ["coral", "Charge ratio", "Charge per patient over the drug's median."],
        ["amber", "Dose ratio", "Units per administration over the median."],
        ["indigo", "Biosimilar share", "Each prescriber's share, per molecule."],
        ["pink", "Flagged pairs", "A prescriber and drug at 1.5 times the median or more."],
      ],
    },
    gets: {
      h: "A place to start the conversation",
      items: ["A table by drug and prescriber", "Biosimilar share by molecule and prescriber", "Ranked by charge above the median"],
    },
    cta: "See your variation",
  },
  how: {
    h1: "Each prescriber against the median.",
    lede: "How the comparison is built.",
    rule: {
      h: "The median prescriber is the yardstick",
      points: [
        "Lines collapse into administrations: one patient, day, drug and prescriber.",
        "Each prescriber's figures are divided by the drug's median.",
        "FDA's Purple Book says which products are biosimilars.",
      ],
    },
    path: {
      h: "Seven steps",
      steps: [
        ["Read the charge files", "Oldest first."],
        ["Keep drug lines", "With a prescriber."],
        ["Build administrations", "Credits netted."],
        ["Apply the minimums", "Enough patients, enough prescribers."],
        ["Compare with the median", "Charge per patient, units per administration."],
        ["Classify products", "Biosimilar, reference or neither."],
        ["Biosimilar share", "Per prescriber and molecule."],
      ],
    },
    example: {
      h: "One drug, five prescribers",
      tiles: [
        ["slate", "Charge per patient", "<strong>Median: $1,000.</strong>", "$800\n$900\n$1,000\n$1,100\n$1,500"],
        ["coral", "The fifth", "<strong>Ratio 1.5. Flagged.</strong>", "$1,500 ÷ $1,000\n10 patients\n$5,000 above median"],
      ],
    },
    outcomes: {
      h: "What a prescriber and drug can come back as",
      tiles: [
        ["green", "Near the median", "Nothing to discuss."],
        ["coral", "Flagged", "1.5 times the median or more."],
        ["slate", "Too few", "Not enough patients or prescribers to compare."],
      ],
    },
    limits: [
      "Charges are gross charges, not cost.",
      "Nothing is adjusted for case mix. A dose gap can be weight, indication or line of therapy.",
      "Output names prescribers and must be kept private.",
    ],
  },
};

PAGES["spend-concentration"] = {
  pitch: {
    h1: "How much of your drug charge sits in a few drugs?",
    lede: "The share held by your top drugs and top patients, and whether it is growing.",
    gap: {
      h: "A few drugs carry most of the charge",
      fig: {
        alt: "Four drugs with net charge of 700, 200, 60 and 40 dollars. The first holds 70 percent of the total.",
        rows: [["Drug 1", "$700", "waste"], ["Drug 2", "$200", "plain"], ["Drug 3", "$60", "plain"], ["Drug 4", "$40", "plain"]],
        groups: [[0, 0, "70%", "of the total", "waste"]],
        caption: "Made-up charges.",
      },
      points: [
        "Drug charge is never spread evenly.",
        "A handful of drugs and patients hold most of it.",
        "Knowing which tells you where to look first.",
      ],
    },
    finds: {
      h: "What it measures",
      tiles: [
        ["blue", "Top-drug shares", "What the top 1, 5, 10, 20, 50 and 100 drugs hold."],
        ["indigo", "Top-patient shares", "What the top slices of patients hold."],
        ["violet", "Gini", "One inequality number for drugs, one for patients."],
        ["teal", "Weekly trend", "Whether concentration is rising or falling."],
      ],
    },
    gets: {
      h: "Where the charge is, in three tables",
      items: ["A summary", "Every drug ranked with its share", "Weekly shares", "Patients only as counts and shares"],
    },
    cta: "See where your charge sits",
  },
  how: {
    h1: "Rank, then measure the top.",
    lede: "How concentration is worked out.",
    rule: {
      h: "Share of the total held by the top few",
      points: [
        "Drugs and patients are ranked by net charge.",
        "The top groups' shares are measured.",
        "The same shares, week by week, give the trend.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Read the charge files", "Oldest first."],
        ["Identify the drug", "Epic's medication ID."],
        ["Net the credits", "Per drug and per patient."],
        ["Rank", "By net charge."],
        ["Measure", "Top-group shares and Gini."],
        ["Trend", "Weekly shares, first weeks against last."],
      ],
    },
    example: {
      h: "Four drugs",
      tiles: [
        ["blue", "Net charge", "<strong>Total $1,000.</strong>", "$700\n$200\n$60\n$40"],
        ["coral", "Shares", "<strong>Top one holds 70%. Top two hold 90%.</strong>", "$700 ÷ $1,000\n$900 ÷ $1,000"],
      ],
    },
    outcomes: {
      h: "What the tables show",
      tiles: [
        ["blue", "Drug shares", "The top groups' share of all charge."],
        ["indigo", "Patient shares", "The same, for patients."],
        ["violet", "Gini", "Closer to one means more concentrated."],
        ["teal", "Trend", "Rising or falling over the weeks."],
      ],
    },
    limits: [
      "Charges are gross, not cost.",
      "Weeks are posting weeks. A late charge lands in the week it posted.",
      "Saline and diluents are included.",
    ],
  },
};

PAGES["inner-scan-codes"] = {
  pitch: {
    h1: "Read the NDC inside a unit-dose barcode.",
    lede: "A small library that decodes the barcode and says whether it differs from the item's NDC.",
    gap: {
      h: "The barcode can name a different NDC",
      fig: {
        alt: "An item's NDC is 0000012345. Its barcode decodes to 0000012399. They differ, so the second is the inner scan code.",
        rows: [["Item", "0000012345", "given"], ["Barcode", "0000012399", "waste"]],
        groups: [[0, 1, "They differ", "inner scan code", "waste"]],
        caption: "Made-up NDCs.",
      },
      points: [
        "A unit dose can be barcoded with its own NDC.",
        "Compare it with the item's, and the gap shows.",
        "One tested rule, used by every tool that needs it.",
      ],
    },
    finds: {
      h: "A flag for every row",
      tiles: [
        ["coral", "Y", "The barcode encodes a different NDC. It is returned."],
        ["green", "N", "Same NDC, or a barcode with no inner code."],
        ["slate", "x", "Not checked: no barcode, or unreadable."],
        ["amber", "Exceptions", "Unknown layouts and malformed NDCs, each with a reason."],
      ],
    },
    gets: {
      h: "A rule you can build on",
      items: [
        "The same table back, with a flag and the inner code",
        "A list of rows needing a fix",
        "Reads no files and holds no patient data",
        "Tests on every barcode layout",
      ],
    },
    cta: "Use it in your own checks",
  },
  how: {
    h1: "Decode, compare, flag.",
    lede: "What the library does to each row.",
    rule: {
      h: "A different NDC means an inner scan code",
      points: [
        "Recognized barcode layouts decode to a 10-digit NDC.",
        "That is compared with the item's own.",
        "A layout it does not know is reported, never guessed.",
      ],
    },
    path: {
      h: "Six steps",
      steps: [
        ["Take a table", "Barcode and NDC, both as text."],
        ["Set aside", "Blank and unreadable values."],
        ["Decode", "Known layouts to an NDC."],
        ["Compare", "With the item's NDC."],
        ["Flag", "Y, N or x, with the inner code on Y."],
        ["List exceptions", "Rows needing a fix, with the reason."],
      ],
    },
    example: {
      h: "Three items",
      tiles: [
        ["coral", "Item 1", "<strong>Y. Inner code 0000012399.</strong>", "NDC      0000012345\nbarcode  0000012399"],
        ["green", "Item 2", "<strong>N.</strong>", "barcode decodes to\nits own NDC"],
        ["slate", "Item 3", "<strong>x. Unrecognized layout.</strong>", "a layout the rule\ndoes not know"],
      ],
    },
    outcomes: {
      h: "What a row can come back as",
      tiles: [
        ["coral", "Y", "An inner scan code, returned."],
        ["green", "N", "Nothing to add."],
        ["slate", "x", "Could not be checked."],
        ["amber", "Exception", "Listed with what is wrong."],
      ],
    },
    limits: [
      "Only known barcode layouts are read. A new one needs a new rule and a test.",
      "A number that lost its leading zeros comes back unchecked.",
      "An item with no NDC must be blank, not zeros.",
    ],
  },
};

PAGES["ndc-rules"] = {
  pitch: {
    h1: "One set of NDC rules, used everywhere.",
    lede: "A small library every tool imports instead of copying.",
    gap: {
      h: "Copies of a rule drift apart",
      fig: {
        alt: "An NDC in 4-4-2 layout converts to the 5-4-2 billing form. A value matching no layout is refused.",
        rows: [["0000-1234-01", "4-4-2", "plain"], ["00000-1234-01", "5-4-2", "given"], ["12-345-6", "no layout", "waste"]],
        groups: [[0, 1, "Converted", "to billing form", "given"], [2, 2, "Refused", "nothing returned", "waste"]],
        caption: "Made-up NDCs.",
      },
      points: [
        "Every report needs to know what counts as an NDC.",
        "When each keeps its own rule, the same code is treated two ways.",
        "One library ends that.",
      ],
    },
    finds: {
      h: "What it answers",
      tiles: [
        ["green", "Well formed", "Is this value an NDC, exactly as written?"],
        ["blue", "Converted", "10 digits or dashed to the 11-digit billing form, and back."],
        ["slate", "In-house", "Your own codes and labelers, from a setup file."],
        ["amber", "Placeholder", "Supplier codes for items with no real NDC."],
        ["coral", "Defect", "What is wrong with a malformed value, in words."],
      ],
    },
    gets: {
      h: "The same answer in every report",
      items: [
        "Every rule for a single value and for a column",
        "No files, no network",
        "Returns nothing where a guess would be needed",
      ],
    },
    cta: "Put one rule under every report",
  },
  how: {
    h1: "What the library decides.",
    lede: "The rules, in the order they are asked.",
    rule: {
      h: "Standard layouts only, and no guessing",
      points: [
        "FDA's 5-4-2 layout is the standard.",
        "A dashed or 10-digit NDC converts only if it fits a known layout.",
        "Bad input returns nothing, not an invented code.",
      ],
    },
    path: {
      h: "Seven things it does",
      steps: [
        ["Check", "Is the value a well-formed NDC?"],
        ["Convert up", "Dashed or 10-digit to 11-digit."],
        ["Convert back", "11-digit to 10, with every possible source for barcode matching."],
        ["Split", "An Epic charge code into medication ID and NDC."],
        ["Recognize in-house codes", "From your facility's setup file."],
        ["Recognize placeholders", "From the supplier's."],
        ["Name the defect", "Why a value is not an NDC."],
      ],
    },
    example: {
      h: "Two values",
      tiles: [
        ["green", "0000-1234-01", "<strong>Becomes 00000-1234-01.</strong>", "layout 4-4-2\npadded to 5-4-2"],
        ["coral", "12-345-6", "<strong>Nothing returned.</strong>", "matches no layout"],
      ],
    },
    outcomes: {
      h: "What a value can come back as",
      tiles: [
        ["green", "An NDC", "Well formed, in the form asked for."],
        ["slate", "In-house", "One of your own codes."],
        ["amber", "Placeholder", "A supplier stand-in, to drop before joining."],
        ["coral", "Nothing", "Malformed, with the defect named."],
      ],
    },
    limits: [
      "A value that fails a layout returns nothing, on purpose.",
      "Lost leading zeros are padded only when the caller asks.",
      "A change to a rule changes every report on its next run.",
    ],
  },
};

PAGES["pharmacy-sources"] = {
  pitch: {
    h1: "Every file read one way, and checked first.",
    lede: "Shared readers for Epic, McKesson, FDA and CMS files that stop on anything unexpected.",
    gap: {
      h: "A file that changed shape, read anyway",
      fig: {
        alt: "Week 52 is sorted before week 01 of the next year, the right order. A file with a new column stops the read.",
        rows: [["Week 52", "sorted first", "given"], ["Week 01", "sorted second", "given"], ["New column", "stop", "waste"]],
        groups: [[0, 1, "Year, then week", "right order", "given"], [2, 2, "Drift", "nothing returned", "waste"]],
      },
      points: [
        "Exports change without notice: a column added, a type changed.",
        "Week 01 of next year sorts before week 52 of this one.",
        "Tools that each read files their own way disagree with each other.",
      ],
    },
    finds: {
      h: "What it returns",
      tiles: [
        ["blue", "Charge lines", "Every week stacked, oldest first."],
        ["green", "Container prices", "One price per NDC, for the contract and accounts you choose."],
        ["indigo", "Reference tables", "FDA and CMS files, as published."],
        ["coral", "Problems", "Every drift, bad value or overdue file, reported at once."],
      ],
    },
    gets: {
      h: "A contract for every source",
      items: [
        "Columns, types, dates and how often a file is due",
        "A stop on any drift, never a silent repair",
        "Choices between rows made in the open, with no hidden default",
      ],
    },
    cta: "Put a contract on every file",
  },
  how: {
    h1: "Check against the contract, then return rows.",
    lede: "What happens before any tool sees the data.",
    rule: {
      h: "No rows until the file passes",
      points: [
        "Each source has a written contract.",
        "Any drift, bad value or overdue period stops the read.",
        "Where a choice between rows is needed, the caller must make it.",
      ],
    },
    path: {
      h: "Six things it does",
      steps: [
        ["Find the files", "In order by year, then week. Duplicates refused."],
        ["Check the contract", "Every problem reported at once."],
        ["Repair what is known", "Such as leading zeros a supplier file drops."],
        ["Price a container", "For a chosen contract and accounts."],
        ["Read Epic", "Charge lines, NDC lists, the billing med list."],
        ["Read FDA and CMS", "Reference files, straight from the quarter's download."],
      ],
    },
    example: {
      h: "Two files and a price",
      tiles: [
        ["blue", "Order", "<strong>Week 52 comes first.</strong>", "week 52 of one year\nweek 01 of the next\nby name, 01 sorts first"],
        ["green", "Price", "<strong>$10 a unit.</strong>", "contract price $100\nfor a 10-unit package"],
      ],
    },
    outcomes: {
      h: "What a read can come back as",
      tiles: [
        ["green", "Passed", "Rows returned."],
        ["coral", "Drift", "A column added, missing or moved."],
        ["pink", "Bad value", "A value that does not fit its type."],
        ["amber", "Overdue", "A period's file is missing or late."],
      ],
    },
    limits: [
      "It returns data, never files. What reaches an output is the caller's choice.",
      "No default for a choice between rows, because each is wrong somewhere.",
      "A change to a reader changes every report on its next run.",
    ],
  },
};

// Add each new tool's pages above this line.
