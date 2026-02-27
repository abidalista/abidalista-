/**
 * Integration Test — proves the services layer returns valid data.
 * Run: npx tsx test-integration.ts
 */

import { parseCSVRobust, detectBank, analyzeTransactions, analyzeSpending } from "./src/lib/services";

// ── Test data: realistic Al Rajhi CSV ──

const AL_RAJHI_CSV = `Date,Description,Debit,Credit,Balance
01/01/2025,Netflix Monthly Subscription,54.99,,12345.01
15/01/2025,Spotify Premium,29.99,,12315.02
01/02/2025,Netflix Monthly Subscription,54.99,,12260.03
01/02/2025,STC Postpaid Bill,299.00,,11961.03
15/02/2025,Spotify Premium,29.99,,11931.04
20/02/2025,Starbucks Coffee,45.50,,11885.54
22/02/2025,Jarir Bookstore,189.00,,11696.54
01/03/2025,Netflix Monthly Subscription,54.99,,11641.55
10/03/2025,HungerStation Order,67.00,,11574.55
15/03/2025,Spotify Premium,29.99,,11544.56
20/03/2025,Uber Trip,35.00,,11509.56
25/03/2025,Panda Grocery,312.00,,11197.56
01/04/2025,Netflix Monthly Subscription,54.99,,11142.57
05/04/2025,ChatGPT Plus Subscription,74.99,,11067.58
15/04/2025,Spotify Premium,29.99,,11037.59
18/04/2025,Careem Ride,42.00,,10995.59`;

// ── Test data: Generic SNB-style with tab delimiter ──

const SNB_TAB_CSV = `التاريخ\tالوصف\tمدين\tدائن\tالرصيد
2025-01-10\tNetflix\t54.99\t\t9000.00
2025-02-10\tNetflix\t54.99\t\t8945.01
2025-03-10\tNetflix\t54.99\t\t8890.02
2025-01-15\tشاهد VIP\t32.99\t\t8857.03
2025-02-15\tشاهد VIP\t32.99\t\t8824.04`;

// ── Test data: Headerless CSV ──

const HEADERLESS_CSV = `01/06/2025,SPOTIFY AB,29.99
01/07/2025,SPOTIFY AB,29.99
01/08/2025,SPOTIFY AB,29.99
15/06/2025,APPLE.COM/BILL,4.99
15/07/2025,APPLE.COM/BILL,4.99
15/08/2025,APPLE.COM/BILL,4.99
20/06/2025,McDonald's Restaurant,55.00
22/07/2025,Starbucks Coffee,38.00`;

// ── Test data: Arabic-Indic numerals ──

const ARABIC_INDIC_CSV = `Date,Description,Amount
٠١/٠١/٢٠٢٥,Netflix,٥٤.٩٩
٠١/٠٢/٢٠٢٥,Netflix,٥٤.٩٩
٠١/٠٣/٢٠٢٥,Netflix,٥٤.٩٩`;

// ── Helpers ──

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

// ══════════════════════════════════════════════
//  TEST 1: CSV Parsing — Header-based (Al Rajhi)
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 1: CSV Parsing — Al Rajhi (header-based) ━━━");
const result1 = parseCSVRobust(AL_RAJHI_CSV, "alrajhi");

assert(result1.transactions.length === 16, `parsed 16 transactions (got ${result1.transactions.length})`);
assert(result1.parseMethod === "csv-headers", `method is csv-headers (got ${result1.parseMethod})`);
assert(result1.bankId === "alrajhi", `bank is alrajhi (got ${result1.bankId})`);
assert(result1.rawLineCount > 0, `raw line count > 0 (got ${result1.rawLineCount})`);

// Check first transaction structure
const tx1 = result1.transactions[0];
assert(typeof tx1.date === "string" && tx1.date.length > 0, `transaction has date (${tx1.date})`);
assert(typeof tx1.description === "string" && tx1.description.length > 0, `transaction has description (${tx1.description})`);
assert(typeof tx1.amount === "number" && tx1.amount > 0, `transaction has amount (${tx1.amount})`);

// Check Netflix transaction specifically
const netflix = result1.transactions.filter(t => t.description.toLowerCase().includes("netflix"));
assert(netflix.length === 4, `found 4 Netflix transactions (got ${netflix.length})`);
assert(netflix[0].amount === 54.99, `Netflix amount is 54.99 (got ${netflix[0].amount})`);

// ══════════════════════════════════════════════
//  TEST 2: CSV Parsing — Arabic Tab-delimited
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 2: CSV Parsing — Arabic tab-delimited ━━━");
const result2 = parseCSVRobust(SNB_TAB_CSV, "snb");

assert(result2.transactions.length === 5, `parsed 5 transactions (got ${result2.transactions.length})`);
assert(result2.transactions.some(t => t.description.includes("Netflix")), "found Netflix in Arabic CSV");
assert(result2.transactions.some(t => t.description.includes("شاهد")), "found شاهد VIP in Arabic CSV");

// ══════════════════════════════════════════════
//  TEST 3: CSV Parsing — Headerless mode
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 3: CSV Parsing — Headerless ━━━");
const result3 = parseCSVRobust(HEADERLESS_CSV, "other");

assert(result3.transactions.length >= 6, `parsed ≥6 transactions (got ${result3.transactions.length})`);
assert(
  result3.parseMethod === "csv-headerless" || result3.parseMethod === "csv-fallback",
  `method is headerless or fallback (got ${result3.parseMethod})`
);

// ══════════════════════════════════════════════
//  TEST 4: CSV Parsing — Arabic-Indic numerals
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 4: CSV Parsing — Arabic-Indic numerals ━━━");
const result4 = parseCSVRobust(ARABIC_INDIC_CSV, "other");

assert(result4.transactions.length === 3, `parsed 3 transactions (got ${result4.transactions.length})`);
if (result4.transactions.length > 0) {
  assert(result4.transactions[0].amount === 54.99, `Arabic digit amount correct: 54.99 (got ${result4.transactions[0].amount})`);
}

// ══════════════════════════════════════════════
//  TEST 5: Bank Detection
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 5: Bank Detection ━━━");

assert(detectBank("الراجحي\nDate,Description,Amount\n01/01/2025,Test,100") === "alrajhi", "detects Al Rajhi");
assert(detectBank("SNB\nDate,Description,Amount\n01/01/2025,Test,100") === "snb", "detects SNB");
assert(detectBank("بنك الرياض\nDate,Description,Amount") === "riyadbank", "detects Riyad Bank");
assert(detectBank("البلاد\nDate,Description,Amount") === "albilad", "detects Al Bilad");
assert(detectBank("الإنماء\nDate,Description,Amount") === "alinma", "detects Alinma");
assert(detectBank("ساب\nDate,Description,Amount") === "sabb", "detects SABB");
assert(detectBank("الفرنسي\nDate,Description,Amount") === "bsf", "detects BSF");
assert(detectBank("العربي\nDate,Description,Amount") === "anb", "detects ANB");

// ══════════════════════════════════════════════
//  TEST 6: Subscription Analyzer
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 6: Subscription Analyzer ━━━");
const report = analyzeTransactions(result1.transactions);

assert(report.subscriptions.length > 0, `found subscriptions (${report.subscriptions.length})`);
assert(report.totalMonthly > 0, `totalMonthly > 0 (${report.totalMonthly})`);
assert(report.totalYearly > 0, `totalYearly > 0 (${report.totalYearly})`);
assert(report.analyzedTransactions === 16, `analyzed 16 transactions (got ${report.analyzedTransactions})`);
assert(report.dateRange.from.length > 0, `dateRange.from exists (${report.dateRange.from})`);
assert(report.dateRange.to.length > 0, `dateRange.to exists (${report.dateRange.to})`);

// Netflix should be detected (4 monthly occurrences)
const netflixSub = report.subscriptions.find(s => s.name === "Netflix");
assert(netflixSub !== undefined, "Netflix detected as subscription");
if (netflixSub) {
  assert(netflixSub.occurrences === 4, `Netflix has 4 occurrences (got ${netflixSub.occurrences})`);
  assert(netflixSub.amount === 54.99, `Netflix amount is 54.99 (got ${netflixSub.amount})`);
  assert(netflixSub.frequency === "monthly", `Netflix frequency is monthly (got ${netflixSub.frequency})`);
  assert(netflixSub.confidence === "confirmed", `Netflix confidence is confirmed (got ${netflixSub.confidence})`);
}

// Spotify should be detected (4 monthly occurrences)
const spotifySub = report.subscriptions.find(s => s.name === "Spotify");
assert(spotifySub !== undefined, "Spotify detected as subscription");
if (spotifySub) {
  assert(spotifySub.occurrences === 4, `Spotify has 4 occurrences (got ${spotifySub.occurrences})`);
}

// ChatGPT Plus (single known subscription occurrence)
const chatgptSub = report.subscriptions.find(s => s.name.includes("ChatGPT"));
assert(chatgptSub !== undefined, "ChatGPT Plus detected as subscription");

// Subscription object shape check
const anySub = report.subscriptions[0];
assert(typeof anySub.id === "string", "subscription has id");
assert(typeof anySub.name === "string", "subscription has name");
assert(typeof anySub.normalizedName === "string", "subscription has normalizedName");
assert(typeof anySub.amount === "number", "subscription has amount");
assert(typeof anySub.frequency === "string", "subscription has frequency");
assert(typeof anySub.monthlyEquivalent === "number", "subscription has monthlyEquivalent");
assert(typeof anySub.yearlyEquivalent === "number", "subscription has yearlyEquivalent");
assert(typeof anySub.occurrences === "number", "subscription has occurrences");
assert(typeof anySub.lastCharge === "string", "subscription has lastCharge");
assert(typeof anySub.firstCharge === "string", "subscription has firstCharge");
assert(typeof anySub.status === "string", "subscription has status");
assert(typeof anySub.confidence === "string", "subscription has confidence");
assert(Array.isArray(anySub.transactions), "subscription has transactions array");

// ══════════════════════════════════════════════
//  TEST 7: Spending Analyzer
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 7: Spending Analyzer ━━━");
const spending = analyzeSpending(result1.transactions);

assert(spending.totalSpend > 0, `totalSpend > 0 (${spending.totalSpend})`);
assert(spending.monthlyAvg > 0, `monthlyAvg > 0 (${spending.monthlyAvg})`);
assert(spending.transactionCount === 16, `transactionCount is 16 (got ${spending.transactionCount})`);
assert(spending.categories.length > 0, `has categories (${spending.categories.length})`);
assert(spending.dateRange.from.length > 0, `dateRange.from exists`);
assert(spending.dateRange.to.length > 0, `dateRange.to exists`);
assert(spending.months >= 1, `months >= 1 (got ${spending.months})`);

// Verify category shape
const anyCat = spending.categories[0];
assert(typeof anyCat.name === "string", "category has name");
assert(typeof anyCat.nameEn === "string", "category has nameEn");
assert(typeof anyCat.total === "number", "category has total");
assert(typeof anyCat.percent === "number", "category has percent");
assert(typeof anyCat.monthlyAvg === "number", "category has monthlyAvg");
assert(typeof anyCat.count === "number", "category has count");
assert(Array.isArray(anyCat.topMerchants), "category has topMerchants");

// Subscriptions category should be detected
const subsCat = spending.categories.find(c => c.nameEn === "Subscriptions");
assert(subsCat !== undefined, "Subscriptions category found in spending");

// Transport should be detected (Uber, Careem)
const transportCat = spending.categories.find(c => c.nameEn === "Transport");
assert(transportCat !== undefined, "Transport category found in spending");

// Takeaways should be generated
assert(spending.takeaways.length > 0, `takeaways generated (${spending.takeaways.length})`);
if (spending.takeaways.length > 0) {
  assert(typeof spending.takeaways[0].ar === "string", "takeaway has Arabic text");
  assert(typeof spending.takeaways[0].en === "string", "takeaway has English text");
}

// Percent totals should be reasonable (± rounding)
const totalPercent = spending.categories.reduce((sum, c) => sum + c.percent, 0);
assert(totalPercent >= 90 && totalPercent <= 110, `total percent ≈ 100 (got ${totalPercent})`);

// ══════════════════════════════════════════════
//  TEST 8: Edge cases
// ══════════════════════════════════════════════
console.log("\n━━━ TEST 8: Edge cases ━━━");

// Empty CSV
const emptyResult = parseCSVRobust("", "other");
assert(emptyResult.transactions.length === 0, "empty CSV returns 0 transactions");

// Single line CSV
const singleResult = parseCSVRobust("just one line", "other");
assert(singleResult.transactions.length === 0, "single-line CSV returns 0 transactions");

// Empty transactions → analyzer
const emptyReport = analyzeTransactions([]);
assert(emptyReport.subscriptions.length === 0, "no transactions → no subscriptions");
assert(emptyReport.totalMonthly === 0, "no transactions → totalMonthly = 0");

// Empty transactions → spending
const emptySpending = analyzeSpending([]);
assert(emptySpending.totalSpend === 0, "no transactions → totalSpend = 0");
assert(emptySpending.categories.length === 0, "no transactions → no categories");

// ══════════════════════════════════════════════
//  Summary
// ══════════════════════════════════════════════
console.log(`\n${"═".repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`${"═".repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
