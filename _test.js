const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const mockEl = {value:'',innerHTML:'',style:{display:''},classList:{add:()=>{},remove:()=>{}},closest:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},setAttribute:()=>{},cloneNode:function(){return mockEl},scrollIntoView:()=>{}};
global.document = {getElementById:()=>mockEl, addEventListener:()=>{}, querySelector:()=>null, querySelectorAll:()=>[]};
global.window = {open:()=>({document:{write:()=>{},close:()=>{}},print:()=>{}})};
global.setTimeout = (fn) => fn();

const testCode = script + `
try {
    const data = fullAnalysis(1997, 2, 17, 3, 15, 'F', 'solar', false, true);
    const p = data.pillars;
    console.log('=== 사주 구조 ===');
    console.log('년:', CHEONGAN_HANJA[p.year.gan_idx]+JIJI_HANJA[p.year.ji_idx], '('+CHEONGAN[p.year.gan_idx]+JIJI[p.year.ji_idx]+')');
    console.log('월:', CHEONGAN_HANJA[p.month.gan_idx]+JIJI_HANJA[p.month.ji_idx], '('+CHEONGAN[p.month.gan_idx]+JIJI[p.month.ji_idx]+')');
    console.log('일:', CHEONGAN_HANJA[p.day.gan_idx]+JIJI_HANJA[p.day.ji_idx], '('+CHEONGAN[p.day.gan_idx]+JIJI[p.day.ji_idx]+')');
    console.log('시:', CHEONGAN_HANJA[p.hour.gan_idx]+JIJI_HANJA[p.hour.ji_idx], '('+CHEONGAN[p.hour.gan_idx]+JIJI[p.hour.ji_idx]+')');
    console.log('');
    console.log('=== 오행 분석 ===');
    console.log('격국:', data.ohaeng.strength);
    console.log('근거:', JSON.stringify(data.ohaeng.strengthReason));
    console.log('득령:', data.ohaeng.deukryeong, '| 통근:', data.ohaeng.tonggeun);
    console.log('인비:', data.ohaeng.totalSupport, '| 설관재:', data.ohaeng.totalDrain);
    console.log('용신:', OHAENG[data.ohaeng.yongsin], '| 희신:', OHAENG[data.ohaeng.heesin], '| 기신:', OHAENG[data.ohaeng.gisin]);
    console.log('오행분포 - 목:'+data.ohaeng.count[0]+' 화:'+data.ohaeng.count[1]+' 토:'+data.ohaeng.count[2]+' 금:'+data.ohaeng.count[3]+' 수:'+data.ohaeng.count[4]);
    console.log('');
    console.log('=== 십성 ===');
    data.sipsungs.forEach(s => console.log('  '+s.position+': '+s.star));
    console.log('');
    console.log('=== 대운 ===');
    if(data.daeun) {
        console.log('방향:', data.daeun.direction, '| 시작:', data.daeun.start_age+'세');
        data.daeun.periods.forEach(d => {
            const isYong = (d.ohaeng_gan===OHAENG[data.ohaeng.yongsin] || d.ohaeng_ji===OHAENG[data.ohaeng.yongsin]) ? ' ★용신' : '';
            const isGi = (d.ohaeng_gan===OHAENG[data.ohaeng.gisin] || d.ohaeng_ji===OHAENG[data.ohaeng.gisin]) ? ' ⚠기신' : '';
            console.log('  '+d.age_start+'~'+d.age_end+'세 '+d.gan_hanja+d.ji_hanja+' ('+d.ohaeng_gan+'/'+d.ohaeng_ji+')'+isYong+isGi);
        });
    }
    console.log('');
    console.log('=== 세운 (2026) ===');
    if(data.seun) console.log('  '+data.seun.year+'년 '+data.seun.gan_hanja+data.seun.ji_hanja+' | 천간:'+data.seun.sipsung_gan+' 지지:'+data.seun.sipsung_ji+' | score:'+data.seun.score);
    console.log('');
    console.log('=== 해석 섹션 키 ===');
    console.log(Object.keys(data.detailedInterp).join(', '));
    console.log('');
    // Check for any undefined/null issues
    const interp = data.detailedInterp;
    let issues = [];
    Object.entries(interp).forEach(([key, val]) => {
        if (!val) issues.push(key + ': null/undefined');
        else if (!val.content || val.content.length < 10) issues.push(key + ': content too short ('+((val&&val.content)?val.content.length:0)+')');
        if (val && val.content && val.content.includes('undefined')) issues.push(key + ': contains "undefined"');
        if (val && val.content && val.content.includes('NaN')) issues.push(key + ': contains "NaN"');
    });
    if (issues.length > 0) { console.log('=== ⚠️ 이슈 발견 ==='); issues.forEach(i => console.log('  '+i)); }
    else console.log('=== ✅ 모든 섹션 정상 ===');
} catch(e) { console.log('ERROR:', e.message); console.log(e.stack); }
`;
eval(testCode);
