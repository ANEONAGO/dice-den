#!/usr/bin/env node
// Dice Den balance bot: plays many seeded runs headlessly with the game's own code and prints a Markdown balance report.
//
//   node tools/balance-bot.js [--runs 300] [--seed BOT] [--set wood] [--alley 0.5] [--bets] [--min 8] [--out private/balance-report.md] [--verbose]
//   node tools/balance-bot.js --policy '{"rerollBelow":1.5,"shopOrder":["chart","relic"]}'   (override any POLICY field)
//   node tools/balance-bot.js --one BOT0007                                                    (play one seed and trace it round by round)
//   node tools/balance-bot.js --chase highcourt,mirror --endless                               (hunt those relics; keep playing past the win)
//   node tools/balance-bot.js --give highcourt:2 --endless                                     (start every run holding them, :2 = upgraded)
//
// game.html's script runs in a Node vm sandbox (as tools/codex-data.js does) with no-op DOM stubs. The animation, sound and
// online functions (toss, render, playScore, animBets, fbPut/fbTop/postRun, ...) are replaced with synchronous stubs, so a
// throw lands the moment roll() is called and nothing ever reaches Firebase. A run is then driven with the game's own
// functions: init, pickSet, roll, doScore, buy, nextRound, takeDeal/leaveAlley, swapBoss. How the bot plays is in POLICY.
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..');

// ---------- CLI ----------
const A=process.argv.slice(2),flag=(k,d)=>{const i=A.indexOf('--'+k);return i<0||i+1>=A.length?d:A[i+1]},has=k=>A.includes('--'+k);
if(has('help')||has('h')){console.log(fs.readFileSync(__filename,'utf8').split('\n').slice(1,13).join('\n').replace(/^\/\/ ?/gm,''));process.exit(0)}
const OPT={runs:Math.max(1,+flag('runs',300)||300),seed:String(flag('seed','BOT')).toUpperCase(),out:flag('out',path.join('private','balance-report.md')),verbose:has('verbose'),min:+flag('min',8)||8,one:flag('one',null)};

// --pricex '{"f":0.6,"e":0.6,"z":0.6,"ld":0.6}': shop price multipliers by offer kind (f faces, e charms, z seals, ld, c charts, v rules, pk packs, rr, slot, gam, r relics)
const PRICEX=JSON.parse(flag('pricex','{}'));
// ---------- Bot policy: the one place that decides how the bot plays ----------
// It is copied into the sandbox as JSON, so keep it to numbers, strings, booleans and arrays.
const POLICY={
 set:flag('set','wood'),          // dice set id (DSETS): wood, bone, gold, glass, obsidian, brass
 rerollBelow:1,                   // reroll when the best pick scores under this fraction of (target-score)/throws left
 rerollKeepCombo:true,            // keep the dice of the best combo and reroll the rest (false: keep the most common value)
 shopOrder:['relic','chart','rr','rule','face','charm','seal','ld','pack','slot','gamble','upgrade'],// greedy buy order; Arcana is never bought
 reserve:0,                       // dollars kept back in the shop
 alleyReserve:5,                  // kept back in a shop that a Back Alley follows, so the deals that cost money (blind buy, tithe, coin flip) can be offered
 facePref:'mhsgx',                // Face Pack paint preference, best first (m mult, h heart, s star, g gold, x glass)
 alleyP:Math.min(1,Math.max(0,+flag('alley',.5))),// chance to take a Back Alley deal (a random one of the three offered)
 bets:has('bets'),betStake:1,     // --bets: one $1 bet a round on the most likely option (off: no bets, makeBets is skipped)
 swapBoss:'always',               // Pit Boss's Favour: 'always', 'never' or a list of boss ids to swap away
 stake:Math.max(1,+flag('stake',1)||1),// --stake 1..6: the stake every run is played at
 maxRound:has('endless')?(+flag('max',100)||100):40,stopAtWin:!has('endless'),// stop once the win round is cleared, or at maxRound; --endless keeps playing (to --max, default 100)
 // --chase id,id (ids or names): hunt these relics. Saves up for them, rerolls the shop for them (up to chaseRR a shop), sells its cheapest
 // other relic to make room, prefers them in Relic Packs, buys Mystery Relics (up to chaseGam a shop) and rigs the case for them, and upgrades them first
 chase:String(flag('chase','')).split(',').map(s=>s.trim()).filter(Boolean),give:String(flag('give','')).split(',').map(s=>s.trim()).filter(Boolean),chaseRR:+flag('chaserr',2),chaseGam:+flag('chasegam',2),
 // gambling helpers (The Fence: no duds; Loaded Odds upgraded: half the duds). While chasing, the bot buys and upgrades them when they show up,
 // and once it holds one it gambles up to chasePush Mystery Relics a shop (no saving up) to reach the rigged case
 gambleHelp:['fence','loadedodds'],chasePush:+flag('chasepush',8),
 trace:!!flag('one',null)         // keep a round-by-round log in the run record (printed by --one)
};
try{Object.assign(POLICY,JSON.parse(flag('policy','{}')))}catch(e){console.error('--policy must be JSON: '+e.message);process.exit(1)}

// ---------- The bot. This function is stringified and evaluated inside the sandbox, so it sees the game's globals
// (G, busy, offers, roll, calc, ...) directly. Only plain JS in here: no require, no outer variables. ----------
function BOT(P){
 const bsr={v:0},brand=()=>mb(bsr);// the bot's own seeded RNG (alley and pack choices), separate from the game's streams
 const isRelic=o=>o.id[0]=='r'&&o.id!='rr';
 const kindOf=o=>isRelic(o)?'relic':o.id[0]=='c'?'chart':o.id=='rr'?'rr':o.id[0]=='v'?'rule':o.id[0]=='f'?'face':o.id[0]=='e'?'charm':o.id[0]=='z'?'seal':o.id=='ld'?'ld':o.id=='slot'?'slot':(o.id=='die'||o.id.startsWith('pk'))?'pack':o.id=='gam'?'gamble':o.id[0]=='o'?'arcana':'other';
 const RANK={c:0,u:1,r:2,e:3,l:4},val=d=>d.en=='stone'?0:dv(d);
 let R=null;const log=P.trace?f=>R.log.push(f()):()=>{};// trace lines are built lazily, only with --one
 const names=L=>L.map(d=>d.en=='stone'?'S':dv(d)+(d.faces[d.f]!='n'?d.faces[d.f]:'')+(d.stuck?'*':'')).join(' ');
 // chased relics: ids or names, resolved against the game's RELIC list
 const CH=P.chase.map(x=>RL[x]?x:(RELIC.find(r=>r.n.toLowerCase()==x.toLowerCase())||{}).id).filter(Boolean);
 const missing=()=>CH.filter(id=>!G.relics.includes(id)&&(id!='swarm'||swarmDue()));
 // it only saves up for them once it holds 3 relics (a base to score with); before that, saving starves the run
 const chaseCost=()=>{const L=missing();return L.length&&G.relics.length>=3?Math.min(...L.map(id=>RP[RAR[id]])):0};
 const giveL=()=>P.give.map(x=>{const [a,l]=x.split(':'),id=RL[a]?a:(RELIC.find(r=>r.n.toLowerCase()==a.toLowerCase())||{}).id;return id&&{id,l:+l||1}}).filter(Boolean);

 // ----- throws -----
 // bag bigger than the throw: throw the fanciest dice (special faces, charms, seals, loaded)
 function prePick(){if(!needPick())return;const L=G.dice.filter(d=>!d.stuck&&!swarmFree(d));L.forEach(d=>d.pre=false);L.map((d,i)=>[d,i]).sort((a,b)=>fancy(b[0])-fancy(a[0])||a[1]-b[1]).slice(0,room()).forEach(x=>x[0].pre=true)}
 // best legal pick of the dice on the table: every subset up to the pick limit (like bestPick), Clone Army swarms past it, and the reverse scoring order
 function evalPick(){
  const tb0=G.dice.filter(d=>d.thr&&!(d.stuck&&bossIs('pit'))),tb=tb0.length>12?tb0.slice().sort((a,b)=>val(b)-val(a)).slice(0,12):tb0,k=tb.length,maxN=Math.min(G.maxT,k);
  let best={total:-1,dice:null,id:'none',name:''};
  const tryL=L=>{G.dice.forEach(d=>{d.sel=false;d.so=0});L.forEach((d,j)=>{d.sel=true;d.so=j+1});if(!pickCheck().ok)return;const c=calc();if(c.total>best.total)best={total:c.total,dice:L.slice(),id:c.id,name:c.name}};
  for(let m=1;m<1<<k;m++){let c=0;for(let j=0;j<k;j++)c+=m>>j&1;if(c>maxN)continue;const L=[];for(let j=0;j<k;j++)if(m>>j&1)L.push(tb[j]);tryL(L)}
  if(legion()){const fam={};tb0.forEach(d=>{if(d.fam&&d.en!='stone'){const key=d.fam+':'+dv(d);(fam[key]=fam[key]||[]).push(d)}});Object.values(fam).forEach(L=>{if(L.length>maxN)tryL(L)})}
  if(best.dice&&best.dice.length>1)tryL(best.dice.slice().reverse());
  G.dice.forEach(d=>{d.sel=false;d.so=0});
  return best;
 }
 const applyPick=L=>{G.dice.forEach(d=>{d.sel=false;d.so=0;d.rs=false});L.forEach((d,j)=>{d.sel=true;d.so=j+1});G.soN=L.length};
 const shouldReroll=best=>{const need=G.target-G.score;if(best.total>=need||G.rerolls<=0)return false;return best.total<need/Math.max(1,G.hands)*P.rerollBelow};
 // mark the dice to throw again: keep the best combo (or the most common value when there is none), reroll the rest, lowest first, up to RRMAX
 function markReroll(best){
  G.dice.forEach(d=>d.rs=false);const keep=new Set();
  if(best.id!='none'&&P.rerollKeepCombo)best.dice.forEach(d=>keep.add(d));
  else{const tb=G.dice.filter(d=>d.thr&&d.en!='stone'),cnt={};tb.forEach(d=>cnt[dv(d)]=(cnt[dv(d)]||0)+1);const v=Object.keys(cnt).map(Number).sort((a,b)=>cnt[b]-cnt[a]||b-a)[0];tb.forEach(d=>{if(dv(d)==v)keep.add(d)})}
  const can=G.dice.filter(d=>d.thr&&!keep.has(d)&&!(d.stuck&&(d.keep||!cp('dealer'))));let n=0;
  can.sort((a,b)=>val(a)-val(b)).forEach(d=>{if(swarmFree(d))d.rs=true;else if(n<RRMAX){d.rs=true;n++}});
  return G.dice.some(d=>d.rs);
 }
 function playRound(){
  let g=0;
  while(G.phase=='idle'&&g++<80){
   busy=false;
   if(!G.thrown){prePick();roll();if(!G.thrown)throw new Error('throw refused in round '+G.round+' ('+G.dice.length+' dice, room '+room()+')');log(()=>`  throw ${G.tn+1}: ${names(G.dice.filter(d=>d.thr))}`)}
   const best=evalPick();if(!best.dice)throw new Error('no legal pick in round '+G.round);
   if(shouldReroll(best)&&markReroll(best)){const rr=G.rr;log(()=>`    reroll ${names(G.dice.filter(d=>d.rs))} (best ${best.total}, need ${G.target-G.score} in ${G.hands})`);roll();if(G.rr!=rr){R.rerolls++;log(()=>`    -> ${names(G.dice.filter(d=>d.thr))}`);continue}}
   applyPick(best.dice);busy=false;const sc=G.score;doScore();R.throws++;log(()=>`    score ${best.name} [${names(best.dice)}] = ${best.total}, round ${G.score||sc+best.total}/${G.target}`);
   if(G.thrown)throw new Error('score refused in round '+G.round+': '+pickCheck().why);
  }
  if(G.phase=='idle')throw new Error('round '+G.round+' did not end');
 }

 // ----- shop -----
 function chooseOffer(skip){
  const res=P.reserve+(alleyDue()&&!G.alleyDone?P.alleyReserve:0)+chaseCost(),aff=o=>G.money-o.c>=res&&!full(o)&&!own(o)&&!skip.has(o.id);
  for(const k of P.shopOrder){
   if(k=='upgrade'){const L=G.relics.filter(r=>lv(r)<2&&G.money-upCost(r)>=res&&!skip.has('up:'+r)).sort((a,b)=>upCost(a)-upCost(b));if(L.length)return{id:'up:'+L[0],c:upCost(L[0])};continue}
   let L=offers.filter(o=>kindOf(o)==k&&aff(o));
   if(k=='slot')L=L.filter(()=>used()>=G.slots-1);
   if(k=='charm')L=L.filter(()=>G.dice.some(d=>!d.en));
   if(k=='seal')L=L.filter(()=>G.dice.some(d=>!d.seal));
   if(k=='relic')L.sort((a,b)=>(completes(b)?1:0)-(completes(a)?1:0)||RANK[RAR[b.id.slice(1)]]-RANK[RAR[a.id.slice(1)]]||a.c-b.c);
   else L.sort((a,b)=>b.c-a.c);
   if(L.length)return L[0];
  }
  return null;
 }
 function buyOffer(o){
  if(o.id.startsWith('up:')){upRel(o.id.slice(3));log(()=>`  shop: upgrade ${o.id.slice(3)} $${o.c}`);return}
  const i=offers.indexOf(o);if(i<0)return;const k=kindOf(o);
  buy(i);log(()=>`  shop: ${o.n} $${o.c}`);
  if(G.dp!=null){const di=G.dice.findIndex(d=>k=='charm'?!d.en:!d.seal);if(di>=0)dpPick(di);else G.dp=null}// charm or seal: the die it goes on
  if(G.phase=='pack')packPolicy();
 }
 // make room for a chased relic: sell the cheapest relic that is not chased, not on a set card and not House Credit
 function makeRoom(){if(used()<G.slots)return true;const L=G.relics.filter(r=>!CH.includes(r)&&!inMerge(r)&&G.red[r]!='neg').sort((a,b)=>RANK[RAR[a]]-RANK[RAR[b]]||sellFor(a)-sellFor(b));if(!L.length)return false;G.sc=true;sellRel(L[0]);R.sold++;log(()=>`  shop: sold ${L[0]} to make room`);return used()<G.slots}
 function chasePolicy(){if(!CH.length)return;let rr=0,gam=0,g=0;
  while(G.phase=='shop'&&g++<60){
   const help=P.gambleHelp.filter(r=>RL[r]),hO=offers.find(o=>isRelic(o)&&help.includes(o.id.slice(1))&&G.money>=o.c);if(hO&&makeRoom()){buyOffer(hO);R.helpers++;log(()=>`  chase: bought helper ${hO.id.slice(1)}`);continue}
   const up=CH.concat(help).find(r=>G.relics.includes(r)&&lv(r)<2&&G.money>=upCost(r));if(up){upRel(up);R.chaseUp++;log(()=>`  chase: upgraded ${up}`);continue}
   const miss=missing();if(!miss.length)return;
   const o=offers.find(o=>isRelic(o)&&miss.includes(o.id.slice(1)));
   if(o){if(G.money<o.c||!makeRoom())return;buyOffer(o);log(()=>`  chase: bought ${o.id.slice(1)}`);continue}
   const pk=offers.find(o=>o.id=='pkrelic'&&G.money-o.c>=0);if(pk&&miss.some(id=>RAR[id]!='c')&&makeRoom()){buyOffer(pk);continue}
   const gm=offers.find(o=>o.id=='gam'),push=help.some(r=>G.relics.includes(r)&&(r!='loadedodds'||lv(r)>1));if(gm&&gam<(push?P.chasePush:P.chaseGam)&&G.money-gm.c>=(push?0:chaseCost())&&makeRoom()){if((G.gamT||0)>=RIGN&&!miss.includes(G.rig))G.rig=miss[0];buyOffer(gm);gam++;R.gambles++;continue}
   // pushing with full slots: the shop stocks no Mystery Relic, so make room and reroll the shop to bring one
   if(push&&!gm&&gam<P.chasePush&&rr<P.chasePush&&G.money>=srrCost()+GAMBLE.c+2*(G.gamN||0)&&makeRoom()){shopRR();rr++;R.shopRR++;continue}
   if(!push&&rr<P.chaseRR&&G.money-srrCost()>=chaseCost()){shopRR();rr++;R.shopRR++;continue}
   return}}
 function shopPolicy(){chasePolicy();const skip=new Set();let g=0;while(G.phase=='shop'&&g++<30){const o=chooseOffer(skip);if(!o)break;const m=G.money,n=offers.length;buyOffer(o);if(G.money==m&&offers.length==n)skip.add(o.id)}}
 function packPolicy(){
  let g=0;
  while(G.phase=='pack'&&g++<12){
   const K=G.pk,it=K.items,k=K.kind;
   if(!it.length){closePack(1);break}
   if(k=='dice'||k=='mega'){if(G.dice.length>=MAXDICE){closePack(1);break}let bi=0;it.forEach((d,i)=>{if(fancy(d)>fancy(it[bi])||fancy(d)==fancy(it[bi])&&d.f>it[bi].f)bi=i});pickPack(bi)}
   else if(k=='face'){if(K.paint){const s=plainSpots();if(!s.length){K.paint=null;closePack(1);break}const star=K.paint=='s';s.sort((a,b)=>(star?a[1]-b[1]:b[1]-a[1])||a[0]-b[0]);paintFace(s[0][0],s[0][1])}else{const want=[...P.facePref].find(t=>it.includes(t))||it[0];pickPack(it.indexOf(want))}}
   else if(k=='relic'){const ok=it.filter(id=>used()<G.slots||K.ed&&K.ed[id]=='neg');if(!ok.length){closePack(1);break}const b=ok.find(id=>CH.includes(id))||ok.sort((a,b)=>RANK[RAR[b]]-RANK[RAR[a]])[0];pickPack(it.indexOf(b))}
   else if(k=='fort'){closePack(1);break}
   else pickPack(0);
  }
  if(G.phase=='pack')closePack(1);
 }

 // ----- between rounds -----
 function alleyPolicy(){
  const L=(G.alley||[]).slice(),rec={round:G.round,offered:L,taken:null};R.deals.push(rec);
  if(L.length&&brand()<P.alleyP){const id=L[Math.floor(brand()*L.length)];if(DL(id).ok()){rec.taken=id;takeDeal(id);log(()=>`  alley: took ${DL(id).n} of ${L.join(', ')}`);if(G.phase!='alley')return}}
  log(()=>`  alley: walked on (${L.join(', ')})`);leaveAlley();
 }
 const swapWanted=id=>P.swapBoss=='always'||Array.isArray(P.swapBoss)&&P.swapBoss.includes(id);
 function betPolicy(){
  if(G.boss&&vh('cut')&&!G.bossSw&&swapWanted(G.boss.id)){const from=G.boss.id;swapBoss();R.swaps.push({round:G.round,from,to:G.boss.id})}
  if(G.boss)R.bosses.push({round:G.round,id:G.boss.id});log(()=>`round ${G.round}: target ${G.target}${G.boss?' BOSS '+G.boss.n:''}, $${Math.round(G.money)}, relics ${G.relics.join(',')||'-'}, ${G.dice.length} dice`);
  if(P.bets&&G.betOpts&&G.betOpts.length&&G.money>=P.betStake){const o=G.betOpts.slice().sort((a,b)=>b.p-a.p)[0];placeBet(G.betOpts.indexOf(o),P.betStake);R.bets++}
  startRound();
 }

 // ----- one run -----
 function playRun(seed){
  R={seed,won:false,over:false,round:1,cleared:0,sold:0,chaseUp:0,shopRR:0,gambles:0,helpers:0,up:{},relics:{},sets:{},rules:{},bosses:[],swaps:[],deals:[],throws:0,rerolls:0,bets:0,err:null,hist:[],money:0,maxThrow:0,dice:0,nrel:0,log:[]};
  bsr.v=hs(seed+'|bot');busy=false;
  PROF=loadProf('player');PROF.unl[P.set]=1;PROF.stake=6;init(seed);G.stake=P.stake;pickSet(P.set);
  if(G.phase!='idle')throw new Error('could not pick the set '+P.set);giveL().forEach(({id,l})=>{if(!G.relics.includes(id)){addRelic(id);if(l>1)G.rlv[id]=2}});G.mq=[];log(()=>`round 1: target ${G.target}`);
  const seen=()=>{G.relics.forEach(id=>{if(R.relics[id]==null)R.relics[id]=G.round});activeSets().forEach(s=>{if(R.sets[s.n]==null)R.sets[s.n]=G.round});G.vouch.forEach(v=>{if(R.rules[v]==null)R.rules[v]=G.round})};
  let g=0;
  while(g++<3000){
   seen();
   if(G.phase=='over'){R.over=true;break}
   if(G.won&&P.stopAtWin){R.won=true;break}
   if(G.round>P.maxRound)break;
   if(G.phase=='idle')playRound();
   else if(G.phase=='shop'){shopPolicy();seen();nextRound()}
   else if(G.phase=='alley')alleyPolicy();
   else if(G.phase=='bet')betPolicy();
   else if(G.phase=='pack')packPolicy();
   else throw new Error('unexpected phase '+G.phase);
  }
  CH.forEach(id=>{if(G.relics.includes(id)&&lv(id)>1)R.up[id]=1});R.won=R.won||!!G.won;
  R.round=R.won&&P.stopAtWin?G.round+1:G.round;R.cleared=R.won&&P.stopAtWin?G.round:G.round-1;log(()=>(R.won?'WON (cleared round '+CFG.win+')':'')+(R.over?(R.won?', then ':'')+'LOST in round '+G.round:R.won?'':'stopped'));R.hist=(G.hist||[]).slice();R.money=Math.round(G.money);R.maxThrow=G.st.maxThrow;R.dice=G.dice.length;R.nrel=G.relics.length;
  return R;
 }
 const meta=()=>({relics:RELIC.map(r=>[r.id,r.n,r.r]),sets:SETS.map(s=>[s.n,s.rel]),rules:VOUCHERS.map(v=>[v.id,v.n]),bosses:BOSSES.map(b=>[b.id,b.n]),deals:DEALS.map(x=>[x.id,x.n]),cfg:Object.assign({},CFG),chase:CH,give:giveL().map(g=>g.id+(g.l>1?' (upgraded)':'')),setName:(DSETS.find(s=>s.id==P.set)||{}).n||P.set});
 return{playRun,last:()=>R,meta};
}

// ---------- sandbox ----------
// stubs run after the game script: animations resolve at once, sound and the online boards do nothing
const STUBS=`
muted=true;
render=function(){syncMaxT();if(G&&G.phase=='bet'&&!G.betOpts)G.betOpts=makeBets(G.betX);if(G&&G.case){const c=G.case;G.case=null;caseWin(c)}if(G&&G.mq)G.mq.length=0};
toss=function(free,done){free.forEach(d=>{d.f=d.fin;d.r=0;d.x=0});busy=false;done()};
slideToChain=function(){return false};
gather=function(){return{then(f){f();return this}}};
animBets=function(res){G.bets=[];return{then(f){f();return this}}};
playScore=async function(){};centerAll=function(){};scatter=function(){};
cloneFx=function(){};smashFx=function(){};comboFx=async function(){};coinFx=function(){return{then(f){f();return this}}};skipFx=function(){return{then(f){f();return this}}};burst=function(){};toast=function(){};countNums=function(){};buzz=function(){};
caseRoll=async function(res){G.case=null;caseWin(res)};mergeAnim=async function(){};
fbPut=async function(){};fbTop=async function(){return[]};fbDoc=async function(){return null};postRun=async function(){};checkUpdate=function(){};progress=function(){};
`;
function makeSandbox(policy){
 const html=fs.readFileSync(path.join(ROOT,'game.html'),'utf8'),m=html.match(/<script>([\s\S]*)<\/script><\/body>/);
 const src=m[1].replace(/\nboot\(\);\s*$/,'\n'),lineOffset=html.slice(0,m.index).split('\n').length;// so stack traces point at game.html lines
 const noop=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='then'?undefined:noop,set:()=>true,apply:()=>noop,construct:()=>noop});
 const ctx={document:noop,localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{},matchMedia:()=>({matches:false}),performance:{now:()=>Date.now()},
  addEventListener(){},removeEventListener(){},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},
  innerWidth:1000,innerHeight:800,devicePixelRatio:1,location:{hostname:'balance-bot',protocol:'file:'},fetch:()=>new Promise(()=>{}),URL:{createObjectURL:()=>'',revokeObjectURL(){}},
  console:OPT.verbose?console:{log(){},warn(){},error(){},info(){}}};
 ctx.window=ctx;ctx.__tool=1;vm.createContext(ctx);// __tool: game.html skips its tamper check (seal, fromGame) in the sandbox

 vm.runInContext(src,ctx,{filename:'game.html',lineOffset:lineOffset-1});
 vm.runInContext(STUBS,ctx,{filename:'balance-bot-stubs.js'});
 // price experiments: every offer the shop makes (and remakes on a reroll) is scaled by kind before the bot sees it
 if(Object.keys(PRICEX).length)vm.runInContext(`const PRICEX=${JSON.stringify(PRICEX)},_mo=makeOffers;makeOffers=function(){_mo();offers.forEach(o=>{const k=o.id=='rr'||o.id=='ld'||o.id=='slot'||o.id=='gam'?o.id:o.id.startsWith('pk')?'pk':o.id[0],x=PRICEX[k];if(x!=null)o.c=Math.max(0,Math.round(o.c*x))})}`,ctx);
 if(!policy.bets)vm.runInContext('makeBets=function(){return[]}',ctx);// the bet odds simulation is the slowest thing in a round; skip it when the bot never bets
 const mk=vm.runInContext('('+BOT.toString()+')',ctx,{filename:'balance-bot.js'});
 return mk(vm.runInContext('('+JSON.stringify(policy)+')',ctx));
}

// ---------- stats and report ----------
const mean=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:null,pct=x=>x==null?'-':(x*100).toFixed(0)+'%',num=(x,d)=>x==null?'-':x.toFixed(d==null?1:d);
const table=(H,rows)=>['| '+H.join(' | ')+' |','|'+H.map(()=>'---').join('|')+'|',...rows.map(r=>'| '+r.join(' | ')+' |')].join('\n');
function report(runs,meta,policy,ms){
 const ok=runs.filter(r=>!r.err),crashed=runs.filter(r=>r.err),n=ok.length,wins=ok.filter(r=>r.won).length;
 const base={n,wins,winP:n?wins/n:0,avgRound:mean(ok.map(r=>r.round)),avgCleared:mean(ok.map(r=>r.cleared))};
 // the baseline is matched on the round an item was picked: a relic bought in round r is only ever held by runs that cleared round r, so its cohort is compared
 // with the win rate (and average round) of every run that cleared round r. expected = the mean of those over the cohort, ratio = observed / expected
 const aliveWin=[],aliveRound=[];for(let r=0;r<=200;r++){const L=ok.filter(x=>x.cleared>=r);aliveWin[r]=L.length?L.filter(x=>x.won).length/L.length:0;aliveRound[r]=L.length?mean(L.map(x=>x.round)):0}
 const sub=(L,at)=>{const n=L.length,w=L.filter(r=>r.won).length,A=L.map(r=>at?Math.min(200,at(r)):0),exp=n?mean(A.map(a=>aliveWin[a])):null;return{n,wins:w,winP:n?w/n:null,avgRound:mean(L.map(r=>r.round)),exp,expRound:n?mean(A.map(a=>aliveRound[a])):null,ratio:n&&exp>0?(w/n)/exp:null}};
 const flagOf=s=>s.n<OPT.min?(s.n?'low n':''):s.ratio==null?'':s.ratio>1.5?'STRONG':s.ratio<.6?'WEAK':'';
 const strong=[],weak=[];const note=(label,s,f)=>{if(f!='STRONG'&&f!='WEAK')return;(f=='STRONG'?strong:weak).push({t:`${label}: ${pct(s.winP)} win rate (${s.wins}/${s.n}) against ${pct(s.exp)} expected, ${num(s.ratio,2)}x`,r:s.ratio})};
 const cell=(a,b)=>a+' / '+b;
 const out=[];
 out.push('# Dice Den balance report','',`Generated ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC by tools/balance-bot.js.${Object.keys(PRICEX).length?' Prices scaled '+JSON.stringify(PRICEX)+'.':''} ${runs.length} runs, seeds ${runs[0]&&runs[0].seed}..${runs[runs.length-1]&&runs[runs.length-1].seed}, ${meta.setName}, Player-style rules (win = clearing round ${meta.cfg.win}). ${(ms/1000).toFixed(1)}s (${(ms/Math.max(1,runs.length)).toFixed(0)} ms/run). Crashes: ${crashed.length}.${runs.filter(r=>!r.won&&!r.over&&!r.err).length?` Stalled (neither won nor lost, check --one on these): ${runs.filter(r=>!r.won&&!r.over&&!r.err).length}, e.g. ${runs.filter(r=>!r.won&&!r.over&&!r.err).slice(0,3).map(r=>r.seed).join(', ')}.`:''}`,'');
 out.push('## Baseline','',table(['Runs','Wins','Win rate','Avg round reached','Avg rounds cleared','Throws/run','Rerolls/run','Relics/run','Dice at end','$ at end'],[[n,wins,pct(base.winP),num(base.avgRound),num(base.avgCleared),num(mean(ok.map(r=>r.throws))),num(mean(ok.map(r=>r.rerolls))),num(mean(ok.map(r=>r.nrel))),num(mean(ok.map(r=>r.dice))),num(mean(ok.map(r=>r.money)),0)]]),'');
 const RR=ok.map(r=>r.round).sort((a,b)=>a-b),q=p=>RR.length?RR[Math.min(RR.length-1,Math.floor(p*RR.length))]:'-';
 if(meta.give.length)out.push(`Every run starts holding ${meta.give.join(', ')}.`,'');
 out.push(`Round reached: median ${q(.5)}, top quarter ${q(.75)}, top tenth ${q(.9)}, best ${RR[RR.length-1]||'-'}.${policy.stopAtWin?'':` Endless: runs keep going past the win, up to round ${policy.maxRound}.`}`,'');
 if(meta.chase.length){const got=id=>ok.filter(r=>r.relics[id]!=null),all=ok.filter(r=>meta.chase.every(id=>r.relics[id]!=null)),none=ok.filter(r=>!meta.chase.some(id=>r.relics[id]!=null)),nm=id=>(meta.relics.find(x=>x[0]==id)||[0,id])[1];
  const row=(lab,L)=>[lab,L.length,pct(L.length/n),pct(L.length?L.filter(r=>r.won).length/L.length:null),num(mean(L.map(r=>r.round))),L.length?L.map(r=>r.round).sort((a,b)=>a-b)[Math.floor(L.length/2)]:'-'];
  out.push('## Chase','',`Chasing ${meta.chase.map(nm).join(', ')}. Per run on average: ${num(mean(ok.map(r=>r.shopRR)))} shop rerolls, ${num(mean(ok.map(r=>r.gambles)))} Mystery Relics, ${pct(mean(ok.map(r=>r.helpers?1:0)))} of runs found a gambling helper (The Fence or Loaded Odds), ${num(mean(ok.map(r=>r.sold)))} relics sold to make room.`,'',
   table(['Cohort','Runs','Share','Win rate','Avg round reached','Median round'],[row('Found a gambling helper',ok.filter(r=>r.helpers)),...meta.chase.map(id=>row('Got '+nm(id),got(id))),...meta.chase.map(id=>row('Upgraded '+nm(id),ok.filter(r=>r.up[id]))),...(meta.chase.length>1?[row('Got all of them',all)]:[]),row('Got none',none)]),'',
   meta.chase.map(id=>{const L=got(id);return `- ${nm(id)}: found by round ${L.length?num(mean(L.map(r=>r.relics[id]))):'-'} on average (median ${L.length?L.map(r=>r.relics[id]).sort((a,b)=>a-b)[Math.floor(L.length/2)]:'-'}).`}).join('\n'),'')}
 const lost={};ok.filter(r=>r.over).forEach(r=>lost[r.round]=(lost[r.round]||0)+1);const rounds=Object.keys(lost).map(Number).sort((a,b)=>a-b);
 out.push('Where runs end (round the target was missed):','',table(['Round',...rounds,'Won'],[['Runs',...rounds.map(r=>lost[r]),wins],['Share',...rounds.map(r=>pct(lost[r]/n)),pct(base.winP)]]),'');
 // relics
 const relRows=[],byR8=id=>ok.filter(r=>r.relics[id]!=null&&r.relics[id]<=8),ever=id=>ok.filter(r=>r.relics[id]!=null);
 meta.relics.forEach(([id,name,rar])=>{const e=ever(id);if(!e.length)return;const s=sub(byR8(id),r=>r.relics[id]),f=flagOf(s);note('Relic '+name,s,f);relRows.push([name,rar,e.length,s.n,cell(num(s.avgRound),num(s.expRound)),cell(pct(s.winP),pct(s.exp)),num(s.ratio,2),f,id])});
 relRows.sort((a,b)=>(b[6]=='-'?-1:+b[6])-(a[6]=='-'?-1:+a[6])||b[3]-a[3]);
 // sets, rules
 const setRows=[];meta.sets.forEach(([name])=>{const L=ok.filter(r=>r.sets[name]!=null);if(!L.length)return;const s=sub(L,r=>r.sets[name]),f=flagOf(s);note('Set '+name,s,f);setRows.push([name,s.n,num(mean(L.map(x=>x.sets[name]))),cell(num(s.avgRound),num(s.expRound)),cell(pct(s.winP),pct(s.exp)),num(s.ratio,2),f])});
 const ruleRows=[];meta.rules.forEach(([id,name])=>{const e=ok.filter(r=>r.rules[id]!=null);if(!e.length)return;const s=sub(e.filter(r=>r.rules[id]<=8),r=>r.rules[id]),f=flagOf(s);note('House rule '+name,s,f);ruleRows.push([name,e.length,s.n,cell(num(s.avgRound),num(s.expRound)),cell(pct(s.winP),pct(s.exp)),num(s.ratio,2),f])});
 // bosses: faced = the boss the round was played against (after any swap); failed = the run ended on that round
 const bossRows=[];const faced=[];ok.forEach(r=>r.bosses.forEach(b=>faced.push({id:b.id,round:b.round,fail:r.over&&r.round==b.round})));
 const swapped={};ok.forEach(r=>r.swaps.forEach(s=>swapped[s.from]=(swapped[s.from]||0)+1));
 const fr=L=>L.length?`${pct(L.filter(x=>x.fail).length/L.length)} (${L.filter(x=>x.fail).length}/${L.length})`:'-';
 meta.bosses.forEach(([id,name])=>{const L=faced.filter(x=>x.id==id);if(!L.length&&!swapped[id])return;bossRows.push([name,L.length,fr(L),fr(L.filter(x=>x.round==5)),fr(L.filter(x=>x.round==10)),fr(L.filter(x=>x.round==15)),swapped[id]||0])});
 const allB=fr(faced);
 // deals: per run, taken ever vs offered but never taken
 const dealRows=[];meta.deals.forEach(([id,name])=>{const off=ok.filter(r=>r.deals.some(d=>d.offered.includes(id))),tk=off.filter(r=>r.deals.some(d=>d.taken==id)),sk=off.filter(r=>!r.deals.some(d=>d.taken==id));if(!off.length)return;const st=sub(tk),ss=sub(sk);const rr=st.n&&ss.n&&ss.winP>0?st.winP/ss.winP:null;const f=st.n<OPT.min||ss.n<OPT.min?(st.n?'low n':''):rr==null?'':rr>1.5?'STRONG':rr<.6?'WEAK':'';if(f=='STRONG'||f=='WEAK')(f=='STRONG'?strong:weak).push({t:`Deal ${name}: ${pct(st.winP)} win rate when taken (${st.wins}/${st.n}) against ${pct(ss.winP)} when walked past (${ss.wins}/${ss.n}), ${num(rr,2)}x`,r:rr});dealRows.push([name,off.length,st.n,pct(st.winP),num(st.avgRound),ss.n,pct(ss.winP),num(ss.avgRound),num(rr,2),f])});
 const visits=ok.reduce((a,r)=>a+r.deals.length,0),took=ok.reduce((a,r)=>a+r.deals.filter(d=>d.taken).length,0),anyDeal=sub(ok.filter(r=>r.deals.some(d=>d.taken))),noDeal=sub(ok.filter(r=>r.deals.length&&!r.deals.some(d=>d.taken)));
 // outliers
 strong.sort((a,b)=>b.r-a.r);weak.sort((a,b)=>a.r-b.r);
 out.push(`## Outliers (win rate against the matched baseline, items held by at least ${OPT.min} runs)`,'',`Each item's runs are compared with the win rate of all runs that cleared the round the item was picked in (the matched baseline), not with the ${pct(base.winP)} of all runs: that removes the edge of items that only late, already-winning runs can buy. Back Alley deals compare taken with walked past.`,'');
 out.push(`### Stronger than 1.5x`,'',strong.length?strong.map(s=>'- '+s.t).join('\n'):'- none','',`### Weaker than 0.6x`,'',weak.length?weak.map(s=>'- '+s.t).join('\n'):'- none','');
 if(base.wins<10)out.push(`Note: only ${base.wins} wins in ${n} runs, so win-rate ratios are noisy. Read the average round columns too.`,'');
 out.push('## Relics','','Picked = runs that held the relic at any point. The other columns use runs that held it by the end of round 8 (bought in that shop or earlier). An "x / y" cell is the cohort / its matched baseline (all runs that cleared the round the relic was picked in); Ratio = win rate / expected win rate.','',table(['Relic','Rarity','Picked','By r8','Avg round / expected','Win rate / expected (by r8)','Ratio','Flag','id'],relRows),'');
 out.push('## Relic sets','',table(['Set','Completed (runs)','Avg round completed','Avg round / expected','Win rate / expected','Ratio','Flag'],setRows.length?setRows:[['none completed','','','','','','']]),'');
 out.push('## House rules','',table(['House rule','Bought','By r8','Avg round / expected','Win rate / expected (by r8)','Ratio','Flag'],ruleRows.length?ruleRows:[['none bought','','','','','','']]),'');
 out.push('## Bosses','',`Fail rate = runs that ended on that boss round / runs that faced it. All bosses: ${allB}. Swapped away = replaced with Pit Boss's Favour before the round.`,'',table(['Boss','Faced','Fail rate','Round 5','Round 10','Round 15','Swapped away'],bossRows),'');
 out.push('## Back Alley deals','',`${visits} alley visits, ${took} deals taken (the bot takes a random deal with ${pct(policy.alleyP)} chance). Runs that took any deal: ${pct(anyDeal.winP)} win rate (n=${anyDeal.n}); runs that visited but never took one: ${pct(noDeal.winP)} (n=${noDeal.n}). Per deal: runs that took it vs runs that were offered it and never took it.`,'',table(['Deal','Offered (runs)','Taken','Win rate taken','Avg round taken','Skipped','Win rate skipped','Avg round skipped','Taken vs skipped','Flag'],dealRows.length?dealRows:[['no visits','','','','','','','','','']]),'');
 if(crashed.length)out.push('## Crashes','',crashed.slice(0,20).map(r=>`- ${r.seed}: ${r.err}${r.stack?' ('+r.stack+')':''}`).join('\n'),crashed.length>20?`- ... and ${crashed.length-20} more`:'','');
 out.push('## How the bot plays','',
  `- Throws: picks the highest-scoring legal pick of up to ${meta.cfg.use} dice (every subset, like bestPick, plus the reverse scoring order); rerolls when the best pick is under ${policy.rerollBelow}x of (target-score)/throws left, keeping the combo dice (up to 5 rerolled, lowest first). When the bag is bigger than the throw it throws the fanciest dice.`,
  `- Shop: greedy, dearest first within a kind, in this order: ${policy.shopOrder.join(' > ')}; keeps $${policy.reserve} ($${policy.reserve+policy.alleyReserve} when a Back Alley follows the shop). Relics: set-completing first, then rarity. Charms and seals go on the first die without one. Packs: fanciest die, preferred face paint (${policy.facePref}), highest rarity relic, first chart; Arcana packs are skipped. It never buys or uses Arcana cards, never sells, never skips a round for a tag and never shackles a die.`,
  `- Back Alley: takes a random deal with ${pct(policy.alleyP)} chance. Bosses: with Pit Boss's Favour it swaps the boss (${Array.isArray(policy.swapBoss)?policy.swapBoss.join(', '):policy.swapBoss}). Bets: ${policy.bets?'$'+policy.betStake+' on the most likely option each round':'none (makeBets is skipped, so the loot stream differs from a real run on the same seed)'}.`,
  policy.stopAtWin?`- Runs stop at the win (round ${meta.cfg.win} cleared) and are counted as "round ${meta.cfg.win+1} reached"; a lost run reached the round it missed. Seeds replay exactly.`:`- Endless: runs keep playing past the win (round ${meta.cfg.win}) until they miss a target or reach round ${policy.maxRound}. A lost run reached the round it missed. Seeds replay exactly.`,
  ...(meta.chase.length?[`- Chase: hunts ${meta.chase.join(', ')}. It saves the price of the cheapest missing one, rerolls the shop (not while it holds a gambling relic) up to ${policy.chaseRR} times a shop, buys up to ${policy.chaseGam} Mystery Relics a shop (rigging the case after 10), takes them first from Relic Packs, sells its cheapest other relic to make room, and upgrades them before anything else.`]:[]),'');
 return out.join('\n');
}

// ---------- main ----------
const t0=Date.now(),bot=makeSandbox(POLICY),meta=bot.meta(),runs=[];
if(OPT.one){let R;try{R=bot.playRun(OPT.one.toUpperCase())}catch(e){R=bot.last();R.err=e.message;R.stack=e.stack}console.log(R.log.join('\n'));if(R.err)console.log('CRASH: '+R.err+'\n'+R.stack);process.exit(0)}
for(let i=1;i<=OPT.runs;i++){
 const seed=OPT.seed+String(i).padStart(4,'0');let R;
 try{R=bot.playRun(seed)}catch(e){R=Object.assign({},bot.last()||{seed});R.err=String(e&&e.message||e);R.stack=String(e&&e.stack||'').split('\n').slice(1,3).map(s=>s.trim()).join(' <- ')}
 runs.push(R);
 if(OPT.verbose)process.stderr.write(`${seed} ${R.err?'CRASH '+R.err:R.won?'WON':'lost r'+R.round} relics ${Object.keys(R.relics||{}).join(',')}\n`);
 else if(i%25==0||i==OPT.runs)process.stderr.write(`${i}/${OPT.runs} runs, ${runs.filter(r=>r.won).length} wins, ${runs.filter(r=>r.err).length} crashes (${((Date.now()-t0)/1000).toFixed(1)}s)\n`);
}
const md=report(runs,meta,POLICY,Date.now()-t0);
process.stdout.write(md+'\n');
if(OPT.out&&OPT.out!='none'){const p=path.isAbsolute(OPT.out)?OPT.out:path.join(ROOT,OPT.out);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,md+'\n');process.stderr.write('Saved '+path.relative(ROOT,p)+'\n')}
