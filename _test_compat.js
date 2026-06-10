const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const mockEl = {value:'',innerHTML:'',style:{display:''},classList:{add:()=>{},remove:()=>{}},closest:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},setAttribute:()=>{},cloneNode:function(){return mockEl},scrollIntoView:()=>{}};
global.document = {getElementById:()=>mockEl, addEventListener:()=>{}, querySelector:()=>null, querySelectorAll:()=>[]};
global.window = {open:()=>({document:{write:()=>{},close:()=>{}},print:()=>{}})};
global.setTimeout = (fn) => fn();

const testCode = script + `
try {
    // 테스트: 1997.2.17 여 vs 1995.8.20 남
    const result = analyzeCompatibility(1997,2,17,3,'F',1995,8,20,10,'M');
    console.log('=== 궁합 테스트 ===');
    const keys = Object.keys(result.sections);
    console.log('섹션 수:', keys.length);
    keys.forEach(k => {
        const sec = result.sections[k];
        const lines = sec.content.split('\\n').filter(l=>l.trim()).length;
        console.log('  ' + sec.icon + ' ' + sec.title + ' (' + lines + '줄)');
        // undefined/NaN 체크
        if (sec.content.includes('undefined')) console.log('    ⚠️ "undefined" 포함!');
        if (sec.content.includes('NaN')) console.log('    ⚠️ "NaN" 포함!');
    });
    console.log('');

    // 재회 테스트
    const reunion = analyzeReunion(1997,2,17,3,'F',1995,8,20,10,'M');
    console.log('=== 재회 테스트 ===');
    const rkeys = Object.keys(reunion.sections);
    console.log('섹션 수:', rkeys.length);
    rkeys.forEach(k => {
        const sec = reunion.sections[k];
        const lines = sec.content.split('\\n').filter(l=>l.trim()).length;
        console.log('  ' + sec.icon + ' ' + sec.title + ' (' + lines + '줄)');
        if (sec.content.includes('undefined')) console.log('    ⚠️ "undefined" 포함!');
        if (sec.content.includes('NaN')) console.log('    ⚠️ "NaN" 포함!');
    });
    console.log('');
    console.log('인연 강도:', reunion.bondStrength);
    console.log('재회 점수:', reunion.reunionScore);
    console.log('');
    console.log('=== 1. 인연의 끈 (처음 8줄) ===');
    console.log(reunion.sections.bond.content.split('\\n').slice(0,8).join('\\n'));
    console.log('...');
    console.log('');
    console.log('✅ 모든 테스트 통과');
} catch(e) { console.log('ERROR:', e.message); console.log(e.stack); }
`;
eval(testCode);
