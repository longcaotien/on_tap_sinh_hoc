// Xuất 50 câu từ questions.js ra JSON để quản lý tải lên Firestore.
// KHÔNG commit file kết quả: đáp án gốc đã công khai trong questions.js.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'questions.js'), 'utf8') +
  '\nglobalThis.bankParts = [originalMCQData, originalTFData, originalSAData];', context);
function plain(html) {
  return String(html).replace(/<br\s*\/?\s*>/gi, ' — ')
    .replace(/<sub>([0-9]+)<\/sub>/gi, (_, n) => n.replace(/[0-9]/g, c => '₀₁₂₃₄₅₆₇₈₉'[Number(c)]))
    .replace(/<sup>([0-9]+)<\/sup>/gi, (_, n) => n.replace(/[0-9]/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]))
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}
const [mcqs, tfs, sas] = context.bankParts;
const bank = [
  ...mcqs.map(q => ({ id: q.uid, topic: q.topic, type: 'mcq', text: plain(q.question),
    options: q.options.map(plain), answer: q.correct, ...(q.hasSeedSVG ? { diagram: 'seedExperiment' } : {}) })),
  ...tfs.map(q => ({ id: q.uid, topic: q.topic, type: 'tf', text: plain(q.prompt),
    statements: q.statements.map(s => plain(s.text)), answer: q.statements.map(s => s.isTrue),
    ...(q.diagramType ? { diagram: q.diagramType } : {}) })),
  ...sas.map(q => ({ id: q.uid, topic: q.topic, type: 'sa', text: plain(q.question),
    items: q.items.map(i => plain(i.text)), maxChoices: q.maxChoices, answer: q.correctAnswer }))
];
const { validateBank } = require('../functions/exam-logic');
validateBank(bank);
if (bank.length !== 50) throw Error(`Chờ 50 câu, nhận ${bank.length}`);
const output = path.join(root, 'ngan-hang-de-50-cau.json');
fs.writeFileSync(output, JSON.stringify(bank, null, 2) + '\n');
console.log(`Đã tạo ${output}: ${mcqs.length} ABCD, ${tfs.length} Đúng/Sai, ${sas.length} trả lời ngắn`);
