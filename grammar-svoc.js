/* grammar-svoc 英文法・文型(SVOC)練習ウィジェット ロジック（CDN配置用・静的）
 * インライン側で window.GSVOC_P に問題データを入れてから、このスクリプトを読み込む。
 * GSVOC_P が無い場合は下部の DEFAULT_P で単体動作する。
 * 画面・CSS・採点・レポートはすべてここに固定。問題データだけが毎回変わる。 */
(function(){
  var CSS = `
*{box-sizing:border-box;margin:0;padding:0}
#app{max-width:680px;margin:0 auto;padding:1rem 0;font-family:var(--font-sans)}
.screen{display:none}.screen.on{display:block}
.center{text-align:center}
.title{font-size:22px;font-weight:500;color:var(--color-text-primary)}
.sub{font-size:13px;color:var(--color-text-secondary);margin-top:6px}
.seglabel{font-size:11px;font-weight:500;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.05em;text-align:center;margin:1rem 0 6px}
.seg{display:flex;gap:8px;justify-content:center;margin:0}
.seg button{flex:0 0 auto}
.seg button.sel{background:var(--color-text-info);border-color:var(--color-text-info);color:var(--color-background-primary);font-weight:600}
.level-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:1rem}
.lcard{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1.1rem 1rem;cursor:pointer;text-align:center;transition:border-color .15s,transform .15s}
.lcard:hover{border-color:var(--color-border-secondary);transform:translateY(-2px)}
.lcard .licon{font-size:24px;color:var(--color-text-secondary)}
.lcard .lname{font-size:16px;font-weight:500;color:var(--color-text-primary);margin-top:6px}
.lcard .ldesc{font-size:12px;color:var(--color-text-secondary);margin-top:4px;line-height:1.5}
.top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
.badge{font-size:12px;font-weight:500;padding:4px 10px;border-radius:20px;background:var(--color-background-secondary);color:var(--color-text-secondary)}
.prog{font-size:13px;color:var(--color-text-secondary)}
.hint{font-size:13px;color:var(--color-text-secondary);margin-bottom:12px;line-height:1.6}
.units{display:flex;flex-wrap:wrap;gap:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-lg);padding:1.1rem;min-height:70px}
.unit{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;border:1px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);padding:8px 12px;background:var(--color-background-primary);transition:all .12s}
.unit:hover{border-color:var(--color-border-secondary)}
.unit .ulbl{font-size:12px;font-weight:700;width:22px;height:22px;line-height:22px;border-radius:50%;background:var(--color-background-secondary);color:var(--color-text-tertiary)}
.unit .utext{font-size:17px;font-weight:500;color:var(--color-text-primary)}
.legend2{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;font-size:12px;color:var(--color-text-secondary);margin-top:10px}
.legend2 b{display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;border-radius:50%;font-size:11px;margin-right:3px;vertical-align:middle}
.pat-label{font-size:12px;color:var(--color-text-tertiary);margin:1.1rem 0 8px;text-transform:uppercase;letter-spacing:.05em}
.pat-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.pat-btn{padding:10px 4px;font-size:12px;font-weight:500;text-align:center;line-height:1.4}
.pat-btn .pn{font-size:14px;display:block}
.pat-btn.sel{background:var(--color-text-info);border-color:var(--color-text-info);color:var(--color-background-primary);font-weight:700}
.unit.set{border-color:var(--color-border-info)}
.q-sent{font-size:19px;line-height:2;color:var(--color-text-primary);background:var(--color-background-secondary);border-radius:var(--border-radius-lg);padding:1.25rem}
.blank{display:inline-block;min-width:90px;border-bottom:2px solid var(--color-border-info);text-align:center;color:var(--color-text-info);font-weight:600}
.choices{display:grid;gap:10px;margin-top:1rem}
.choice{text-align:left;padding:12px 16px;font-size:15px}
.btn-row{display:flex;gap:10px;margin-top:1.25rem}
button{cursor:pointer;border-radius:var(--border-radius-md);font-size:14px;font-weight:500;padding:9px 18px;transition:all .15s;border:0.5px solid var(--color-border-secondary);background:transparent;color:var(--color-text-primary)}
button:hover{background:var(--color-background-secondary)}
button.primary{background:var(--color-background-info);border-color:var(--color-border-info);color:var(--color-text-info)}
button.primary:hover{opacity:.85}
button:active{transform:scale(.98)}
.score-wrap{text-align:center;margin-bottom:1.25rem}
.score-num{font-size:34px;font-weight:600}
.score-msg{font-size:14px;color:var(--color-text-secondary);margin-top:4px}
.section-label{font-size:11px;font-weight:500;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.05em;margin:1.1rem 0 8px}
.res-disp{background:var(--color-background-secondary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem}
.res-unit{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:15px}
.res-unit:last-child{border-bottom:0}
.res-unit .rt{color:var(--color-text-primary);font-weight:500}
.res-tags{font-size:13px}
.ok{color:var(--color-text-success);font-weight:600}
.ng{color:var(--color-text-danger);font-weight:600}
.exp-box{background:var(--color-background-info);border-radius:var(--border-radius-md);padding:12px 14px;margin-top:1rem}
.exp-label{font-size:11px;font-weight:500;color:var(--color-text-info);margin-bottom:4px}
.exp-text{font-size:14px;color:var(--color-text-primary);line-height:1.7}
.ja-text{font-size:13px;color:var(--color-text-secondary);margin-top:8px}
.cat-row{margin-bottom:12px}
.cat-head{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}
.cat-name{color:var(--color-text-primary);font-weight:500}
.cat-pct{color:var(--color-text-secondary)}
.bar{height:8px;border-radius:6px;background:var(--color-background-secondary);overflow:hidden}
.bar i{display:block;height:100%;border-radius:6px}
.weak-box{background:var(--color-background-warning);border-left:3px solid var(--color-border-warning);border-radius:0 var(--border-radius-md) var(--border-radius-md) 0;padding:12px 14px;margin:1rem 0}
.weak-box .wt{font-size:12px;font-weight:500;color:var(--color-text-warning);margin-bottom:4px}
.weak-box .ww{font-size:14px;color:var(--color-text-primary)}
.sum-box{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:10px 12px;font-size:12px;color:var(--color-text-secondary);margin-top:8px;word-break:break-all;font-family:var(--font-mono,monospace)}
`;
  var HTML = `
<div id="app">
<div id="screen-start" class="screen on">
  <div class="center">
    <p class="title">英文法・文型(SVOC)練習</p>
    <p class="sub">文の要素を見抜いて文型をマスター</p>
  </div>
  <div class="seglabel">出題形式</div>
  <div class="seg" id="seg">
    <button data-m="tag" onclick="setMode('tag')">タグ付け＋文型</button>
    <button data-m="fill" onclick="setMode('fill')">空所補充</button>
    <button data-m="mix" class="sel" onclick="setMode('mix')">ミックス</button>
  </div>
  <div class="seglabel">問題数</div>
  <div class="seg" id="segq">
    <button data-q="3" onclick="setQ('3')">3問</button>
    <button data-q="6" onclick="setQ('6')">6問</button>
    <button data-q="all" onclick="setQ('all')">すべて</button>
  </div>
  <div class="seglabel">目標スコアを選んでスタート</div>
  <div class="level-grid">
    <div class="lcard" onclick="startSession('b500')">
      <div class="licon"><i class="ti ti-number-5" aria-hidden="true"></i></div>
      <div class="lname">TOEIC 500</div><div class="ldesc">基礎・短い文<br>銀フレ相当の語彙</div>
    </div>
    <div class="lcard" onclick="startSession('b600')">
      <div class="licon"><i class="ti ti-number-6" aria-hidden="true"></i></div>
      <div class="lname">TOEIC 600</div><div class="ldesc">修飾語つき<br>O/C識別の基本</div>
    </div>
    <div class="lcard" onclick="startSession('b730')">
      <div class="licon"><i class="ti ti-number-7" aria-hidden="true"></i></div>
      <div class="lname">TOEIC 730</div><div class="ldesc">複文・第5文型<br>紛らわしい選択肢</div>
    </div>
    <div class="lcard" onclick="startSession('b800')">
      <div class="licon"><i class="ti ti-target-arrow" aria-hidden="true"></i></div>
      <div class="lname">TOEIC 800+</div><div class="ldesc">本番級の長文<br>関係詞・分詞で修飾</div>
    </div>
  </div>
</div>
<div id="screen-practice" class="screen">
  <div class="top-bar"><span id="badge" class="badge"></span><span id="prog" class="prog"></span></div>
  <div id="practice-body"></div>
</div>
<div id="screen-result" class="screen">
  <div id="result-body"></div>
  <div class="btn-row">
    <button class="primary" id="next-btn" onclick="next()" style="flex:2">次の問題</button>
    <button onclick="goStart()" style="flex:1">最初へ</button>
  </div>
</div>
<div id="screen-report" class="screen">
  <div id="report-body"></div>
  <div class="btn-row">
    <button class="primary" onclick="copySummary()" style="flex:1"><i class="ti ti-copy" aria-hidden="true"></i> 結果をコピー</button>
    <button onclick="goStart()" style="flex:1"><i class="ti ti-arrow-back-up" aria-hidden="true"></i> 最初の画面へ</button>
  </div>
  <p class="sub" style="text-align:center;margin-top:10px">「最初の画面へ」＝設定を変えて／シャッフルで再挑戦。<br>全く新しい問題が欲しい時は、チャットで「新しい問題セット」と伝えてください。</p>
</div>
</div>
`;
  var s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s);
  var root=document.getElementById('gsvoc');
  if(!root){root=document.createElement('div');document.body.appendChild(root);}
  root.innerHTML=HTML;
})();

// 問題データ：インラインの window.GSVOC_P が最優先。無ければ下のフォールバック。
const DEFAULT_P = {
  b500: [
    { type:'tag', units:[{t:'The shipment',lbl:'S'},{t:'arrived',lbl:'V'},{t:'on time',lbl:'M'}], pattern:1, cat:'第1文型SV', subcats:['自他動詞'], ja:'その荷物は時間通りに到着した。', exp:'arrive は目的語をとらない自動詞。on time は副詞句(M)なので骨格は S＋V の第1文型。' },
    { type:'fill', pre:'The candidate ', post:' highly qualified for the position.', choices:['seems','sees','makes','gives'], ans:0, cat:'第2文型SVC', subcats:['補語の種類'], ja:'その候補者はその職に非常に適しているように見える。', exp:'qualified(形容詞)が補語Cになるのは S＝C を表す第2文型動詞 seem。他動詞 make/give は文型が合わない。' }
  ],
  b600: [
    { type:'tag', units:[{t:'The news',lbl:'S'},{t:'made',lbl:'V'},{t:'the staff',lbl:'O'},{t:'happy',lbl:'C'}], pattern:5, cat:'第5文型SVOC', subcats:['O・C識別'], ja:'その知らせはスタッフを喜ばせた。', exp:'make O C「OをCにする」の第5文型。the staff ＝ happy（O＝C）なので happy は補語C。' }
  ],
  b730: [
    { type:'fill', pre:'The committee found the proposal ', post:' after a careful review.', choices:['accept','acceptable','acceptably','acceptance'], ans:1, cat:'第5文型SVOC', subcats:['補語の種類'], ja:'委員会は慎重な検討の後、その提案は受け入れられると判断した。', exp:'find O C「OがCだと分かる」の第5文型。C には形容詞 acceptable。副詞 acceptably は補語になれない。' }
  ],
  b800: [
    { type:'tag', units:[{t:'The committee',lbl:'S'},{t:'found',lbl:'V'},{t:'the proposal submitted by the vendor',lbl:'O'},{t:'acceptable',lbl:'C'}], pattern:5, cat:'第5文型SVOC', subcats:['O・C識別','分詞'], ja:'委員会は業者から提出された提案を受け入れ可能と判断した。', exp:'find O C の第5文型。submitted by the vendor は分詞句で the proposal を修飾し O の一部。acceptable が補語C。' }
  ]
};
const P = (typeof window!=='undefined' && window.GSVOC_P) ? window.GSVOC_P : DEFAULT_P;

const LBL={S:{bg:'var(--color-background-info)',c:'var(--color-text-info)'},V:{bg:'var(--color-background-success)',c:'var(--color-text-success)'},O:{bg:'var(--color-background-warning)',c:'var(--color-text-warning)'},C:{bg:'var(--color-background-danger)',c:'var(--color-text-danger)'},M:{bg:'var(--color-background-secondary)',c:'var(--color-text-tertiary)'}};
const CYCLE=['','S','V','O','C','M'];
const PAT={1:['第1','SV'],2:['第2','SVC'],3:['第3','SVO'],4:['第4','SVOO'],5:['第5','SVOC']};
const LVNAME={b500:'TOEIC 500',b600:'TOEIC 600',b730:'TOEIC 730',b800:'TOEIC 800+'};
const MODENAME={tag:'タグ付け＋文型判定',fill:'空所補充',mix:'ミックス'};

let mode='mix',qcount='6',level=null,queue=[],idx=0,results=[];
let curLabels=[],curPattern=null,answered=false;

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));document.getElementById('screen-'+id).classList.add('on');}
function goStart(){show('start');}
function styleSeg(b,on){if(on){b.style.background='var(--color-text-info)';b.style.borderColor='var(--color-text-info)';b.style.color='var(--color-background-primary)';b.style.fontWeight='600';}else{b.style.background='';b.style.borderColor='';b.style.color='';b.style.fontWeight='';}}
function setMode(m){mode=m;document.querySelectorAll('#seg button').forEach(b=>styleSeg(b,b.dataset.m===m));}
function setQ(q){qcount=q;document.querySelectorAll('#segq button').forEach(b=>styleSeg(b,b.dataset.q===q));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function startSession(lv){
  level=lv;
  let pool=[];
  if(lv==='mix'){['b500','b600','b730','b800'].forEach(k=>{if(P[k])pool=pool.concat(P[k]);});}
  else pool=(P[lv]||[]).slice();
  if(mode!=='mix')pool=pool.filter(p=>p.type===mode);
  pool=shuffle(pool);
  if(qcount!=='all')pool=pool.slice(0,parseInt(qcount,10));
  queue=pool;idx=0;results=[];
  if(!queue.length){alert('この条件の問題がありません。出題形式を変えてください。');return;}
  show('practice');loadProblem();
}

function loadProblem(){
  answered=false;
  const p=queue[idx];
  document.getElementById('prog').textContent=(idx+1)+' / '+queue.length;
  document.getElementById('badge').textContent=p.type==='tag'?'タグ付け＋文型':'空所補充';
  if(p.type==='tag'){curLabels=p.units.map(()=>'');curPattern=null;renderTag();}
  else renderFill();
}

function renderTag(){
  const p=queue[idx];
  let u='<p class="hint">各まとまりを<b>タップするたびにラベルが ·→S→V→O→C→M と切り替わります</b>。全部に付けて文型を選ぶと答え合わせできます。</p>';
  u+='<div class="units">';
  p.units.forEach((un,i)=>{
    const lb=curLabels[i];const st=lb?`style="background:${LBL[lb].bg};color:${LBL[lb].c}"`:'';
    u+=`<div class="unit${lb?' set':''}" onclick="cycleLabel(${i})"><span class="ulbl" ${st}>${lb||'·'}</span><span class="utext">${un.t}</span></div>`;
  });
  u+='</div>';
  u+='<div class="legend2">'+['S','V','O','C','M'].map(l=>`<span><b style="background:${LBL[l].bg};color:${LBL[l].c}">${l}</b>${({S:'主語',V:'動詞',O:'目的語',C:'補語',M:'修飾語'})[l]}</span>`).join('')+'</div>';
  u+='<div class="pat-label">この文の文型は？</div><div class="pat-grid">';
  for(let n=1;n<=5;n++){const on=curPattern===n;const st=on?' style="background:var(--color-text-info);border-color:var(--color-text-info);color:var(--color-background-primary);font-weight:700"':'';u+=`<button class="pat-btn"${st} onclick="selectPattern(${n})"><span class="pn">${PAT[n][0]}</span>${PAT[n][1]}</button>`;}
  u+='</div>';
  const allLabeled=curLabels.every(x=>x),done=allLabeled&&curPattern;
  u+='<div class="btn-row"><button class="primary" style="flex:1'+(done?'':';opacity:.45;cursor:not-allowed')+'" '+(done?'':'disabled')+' onclick="submitTag()">答え合わせ</button></div>';
  if(!done)u+='<p class="sub" style="text-align:center;margin-top:8px">'+(!allLabeled?'すべてのまとまりをタップして S/V/O/C/M を付けてください':'文型を選んでください')+'</p>';
  document.getElementById('practice-body').innerHTML=u;
}
function cycleLabel(i){const c=curLabels[i];curLabels[i]=CYCLE[(CYCLE.indexOf(c)+1)%CYCLE.length];renderTag();}
function selectPattern(n){curPattern=n;renderTag();}

function renderFill(){
  const p=queue[idx];
  let u='<p class="hint">空所に入る最も適切な語を選んでください。</p>';
  u+=`<div class="q-sent">${p.pre}<span class="blank">____</span>${p.post}</div>`;
  u+='<div class="choices">';
  p.choices.forEach((ch,i)=>{u+=`<button class="choice" onclick="answerFill(${i})">${String.fromCharCode(65+i)}. ${ch}</button>`;});
  u+='</div>';
  document.getElementById('practice-body').innerHTML=u;
}

function record(p,correct){results.push({cat:p.cat,subcats:p.subcats||[],correct});}

function submitTag(){
  const p=queue[idx];
  let unitHits=0;p.units.forEach((un,i)=>{if(curLabels[i]===un.lbl)unitHits++;});
  const unitsOK=unitHits===p.units.length;
  const patOK=curPattern===p.pattern;
  const correct=unitsOK&&patOK;
  record(p,correct);
  const tot=p.units.length+1,hits=unitHits+(patOK?1:0);
  let h;
  if(correct)h=scoreHead3('正解','よくできました！','var(--color-text-success)');
  else if(hits>0)h=scoreHead3('おしい！',hits+' / '+tot+' 箇所が正解。間違えた所を解説で確認しましょう','var(--color-text-warning)');
  else h=scoreHead3('不正解','解説で確認しましょう','var(--color-text-danger)');
  h+='<div class="section-label">正解の要素分解</div><div class="res-disp">';
  p.units.forEach((un,i)=>{
    const my=curLabels[i]||'—';const ok=curLabels[i]===un.lbl;
    h+=`<div class="res-unit"><span class="rt">${un.t}</span><span class="res-tags">あなた:<span class="${ok?'ok':'ng'}">${my}</span>　正解:<b>${un.lbl}</b></span></div>`;
  });
  h+='</div>';
  h+=`<div class="section-label">文型</div><div class="res-disp"><div class="res-unit"><span class="rt">${PAT[p.pattern][0]}文型 (${PAT[p.pattern][1]})</span><span class="res-tags ${patOK?'ok':'ng'}">${patOK?'正解':'あなたの解答: '+(curPattern?PAT[curPattern][0]+'文型':'未選択')}</span></div></div>`;
  h+=expBlock(p);
  document.getElementById('result-body').innerHTML=h;
  finishQ();
}

function answerFill(i){
  if(answered)return;answered=true;
  const p=queue[idx];const correct=i===p.ans;
  record(p,correct);
  let h=scoreHead(correct);
  h+='<div class="section-label">正解</div><div class="res-disp">';
  p.choices.forEach((ch,j)=>{
    const mark=j===p.ans?'<span class="ok">✓ 正解</span>':(j===i?'<span class="ng">✗ あなたの解答</span>':'');
    h+=`<div class="res-unit"><span class="rt">${String.fromCharCode(65+j)}. ${ch}</span><span class="res-tags">${mark}</span></div>`;
  });
  h+='</div>';
  h+=`<div class="section-label">完成文</div><div class="res-disp"><div class="rt" style="line-height:1.8">${p.pre}<b style="color:var(--color-text-info)">${p.choices[p.ans]}</b>${p.post}</div></div>`;
  h+=expBlock(p);
  document.getElementById('result-body').innerHTML=h;
  finishQ();
}

function scoreHead(correct){
  return scoreHead3(correct?'正解':'不正解',correct?'よくできました！':'解説で確認しましょう',correct?'var(--color-text-success)':'var(--color-text-danger)');
}
function scoreHead3(title,msg,color){
  return `<div class="score-wrap"><div class="score-num" style="color:${color}">${title}</div><div class="score-msg">${msg}</div></div>`;
}
function expBlock(p){
  let h=`<div class="exp-box"><div class="exp-label"><i class="ti ti-bulb" aria-hidden="true"></i> 解説（${p.cat}${p.subcats&&p.subcats.length?' / '+p.subcats.join(' / '):''}）</div><div class="exp-text">${p.exp}</div>`;
  if(p.ja)h+=`<div class="ja-text">訳: ${p.ja}</div>`;
  h+='</div>';return h;
}
function finishQ(){
  document.getElementById('next-btn').textContent=idx<queue.length-1?'次の問題 →':'結果レポートへ';
  show('result');
}
function next(){idx++;if(idx>=queue.length)showReport();else{show('practice');loadProblem();}}

function showReport(){
  const stats={};
  results.forEach(r=>{[r.cat].concat(r.subcats||[]).forEach(cat=>{if(!stats[cat])stats[cat]={c:0,t:0};stats[cat].t++;if(r.correct)stats[cat].c++;});});
  const total=results.length,corr=results.filter(r=>r.correct).length;
  const pct=total?Math.round(corr/total*100):0;
  let h=`<div class="score-wrap"><div class="score-num" style="color:${pct>=80?'var(--color-text-success)':pct>=60?'var(--color-text-warning)':'var(--color-text-danger)'}">${pct}%</div><div class="score-msg">${total}問中 ${corr}問 正解</div></div>`;
  const entries=Object.entries(stats).sort((a,b)=>(a[1].c/a[1].t)-(b[1].c/b[1].t));
  h+='<div class="section-label">カテゴリ別 正答率</div>';
  entries.forEach(([cat,s])=>{
    const p=Math.round(s.c/s.t*100);
    const col=p>=80?'var(--color-text-success)':p>=60?'var(--color-text-warning)':'var(--color-text-danger)';
    h+=`<div class="cat-row"><div class="cat-head"><span class="cat-name">${cat}</span><span class="cat-pct">${s.c}/${s.t}・${p}%</span></div><div class="bar"><i style="width:${p}%;background:${col}"></i></div></div>`;
  });
  const weak=entries.filter(([c,s])=>s.c/s.t<0.6).map(([c])=>c);
  if(weak.length)h+=`<div class="weak-box"><div class="wt"><i class="ti ti-target" aria-hidden="true"></i> 重点復習したい分野</div><div class="ww">${weak.join(' / ')}</div></div>`;
  const date=new Date().toISOString().slice(0,10);
  window._summary=`【文法ログ】${date}|${LVNAME[level]}|${MODENAME[mode]}|${total}問中${corr}問(${pct}%)|苦手:${weak.length?weak.join(','):'なし'}`;
  h+=`<div class="section-label">学習ログ（Notion記録用）</div><div class="sum-box" id="sum">${window._summary}</div><p class="sub" style="text-align:left;margin-top:6px">「結果をコピー」してClaudeに貼り付けると履歴に記録されます。</p>`;
  document.getElementById('report-body').innerHTML=h;
  show('report');
}
function copySummary(){
  const t=window._summary||'';
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(()=>flashCopied()).catch(()=>selectSum());}
  else selectSum();
}
function flashCopied(){const b=event.target.closest('button');const o=b.innerHTML;b.innerHTML='<i class="ti ti-check"></i> コピーしました';setTimeout(()=>b.innerHTML=o,1500);}
function selectSum(){const el=document.getElementById('sum');const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);}

// 初期選択（出題形式=ミックス, 問題数=6）を視覚的に反映
setMode(mode);setQ(qcount);
