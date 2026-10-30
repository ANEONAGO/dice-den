#!/usr/bin/env node
// Dice Den fuzzer: plays thousands of seeded runs with random setups and random (legal) actions, checking invariants after every action.
//
//   node tools/fuzz.js [--runs 1000] [--seed FZ] [--from 1] [--max 3000] [--out private/fuzz-report.md] [--json path]
//   node tools/fuzz.js --one FZ0042          (replay one seed: print its setup, every action and every violation with stacks)
//   node tools/fuzz.js --one FZ0042 --tail 40 (only the last 40 actions before each violation)
//   node tools/fuzz.js --one FZ0042 --watch "[used(),G.slots]"   (append a sandbox expression's value to every trail line)
//
// game.html's script runs in a Node vm sandbox like tools/balance-bot.js, but the real render() runs (with a no-op DOM), so every panel
// builder is exercised too. Timers are queued and flushed after each action (so The Shaker, chain slides and merge pop-ups play out),
// Math.random, Date.now and performance.now are seeded/faked so a seed replays exactly, and the Firebase calls are stubbed (nothing is posted).
// Each run randomises its setup from its own seeded RNG (dice set, difficulty, stake, relics with editions and levels, whole sets, house
// rules, charms, seals, faces, loaded dice, clone families, slots, money, a late start), then takes random legal actions: picks, rerolls,
// Arcana, selling, the center ring, moving relics, shackles, bets, tags, the Back Alley, packs, the Mystery Relic and the rigged case,
// swarm opt-outs, pickClones, throwing dice out, swapBoss, menus. After every action it checks the invariants in CHECKS (see FUZZ below).
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..');
const A=process.argv.slice(2),flag=(k,d)=>{const i=A.indexOf('--'+k);return i<0||i+1>=A.length?d:A[i+1]},has=k=>A.includes('--'+k);
if(has('help')||has('h')){console.log(fs.readFileSync(__filename,'utf8').split('\n').slice(1,7).join('\n').replace(/^\/\/ ?/gm,''));process.exit(0)}
const OPT={runs:Math.max(1,+flag('runs',1000)||1000),seed:String(flag('seed','FZ')).toUpperCase(),from:+flag('from',1)||1,max:+flag('max',3000)||3000,
 out:flag('out',path.join('private','fuzz-report.md')),json:flag('json',null),one:flag('one',null),tail:+flag('tail',25)||25,verbose:has('verbose')};

// ---------- The fuzzer. Stringified and evaluated inside the sandbox (sees G, busy, offers, PROF, ... directly). Plain JS only. ----------
function FUZZ(){
 let rs={v:1};const R=()=>mb(rs),ri=n=>Math.floor(R()*n),pick=L=>L[ri(L.length)],chance=p=>R()<p,shufL=L=>{L=L.slice();for(let i=L.length-1;i>0;i--){const j=ri(i+1);[L[i],L[j]]=[L[j],L[i]]}return L};
 let RUN=null;const PHASES=['idle','shop','alley','bet','pack','over','select','profile'];
 const clearT=()=>{__T.length=0};
 // run queued timers (the player waits for the animations), soonest first; a timer that throws is a finding of its own
 function flush(){let n=0;while(__T.length&&n<300){__T.sort((a,b)=>a.ms-b.ms||a.i-b.i);const t=__T.shift();if(t.dead)continue;n++;__clock.t+=Math.min(t.ms,2000);try{t.f()}catch(e){bad('timer-exception',String(e&&e.message||e),e)}}if(__T.length){__T.length=0}}
 const log=s=>{RUN.trail.push(s);if(RUN.trail.length>400)RUN.trail.splice(0,100)};
 function bad(kind,msg,err){const key=kind+': '+msg;if(RUN.seen[key])return;RUN.seen[key]=1;RUN.viol.push({kind,msg,round:G&&G.round,phase:G&&G.phase,act:RUN.cur,step:RUN.step,trail:RUN.trail.slice(-60),stack:err&&err.stack?String(err.stack).split('\n').slice(0,8).join('\n'):''})}

 // ----- invariants -----
 const KNOWN_FACE='nmgxsh';
 function walk(o,p,out,depth){if(depth>12||out.length>3)return;if(o===null)return;const t=typeof o;
  if(t=='function'){out.push(p+' is a function');return}if(t=='number'){if(!isFinite(o))out.push(p+' = '+o);return}if(t!='object')return;
  if(Array.isArray(o)){o.forEach((x,i)=>{if(x===undefined)out.push(p+'['+i+'] undefined');else walk(x,p+'['+i+']',out,depth+1)});return}
  for(const k of Object.keys(o))walk(o[k],p+'.'+k,out,depth+1)}
 function check(){
  const v=(k,m)=>bad(k,m);
  if(busy)v('busy','busy is still true after the action');
  if(!PHASES.includes(G.phase))v('phase','unknown phase '+G.phase);
  ['score','money','target','hands','rerolls','round'].forEach(k=>{if(typeof G[k]!='number'||!isFinite(G[k]))v('nan','G.'+k+' = '+G[k])});
  if(G.money<-0.001&&!(G.st&&G.st.debt))v('money','money went negative: '+G.money);// House Credit can leave you in debt (G.st.debt)
  if(G.hands<0)v('hands','G.hands < 0: '+G.hands);if(G.rerolls<0)v('rerolls','G.rerolls < 0: '+G.rerolls);
  if(!(G.target>0)||G.target!=Math.round(G.target))v('target','target not a positive integer: '+G.target);
  if(G.score!=Math.round(G.score))v('score','score not an integer: '+G.score);
  const nan=[];walk(G,'G',nan,0);nan.forEach(m=>v('json-value',m.replace(/\[\d+\]/g,'[i]')));
  let js;try{js=JSON.stringify({G,offers})}catch(e){v('json','G does not stringify: '+e.message)}
  // relics
  const rel=G.relics;if(new Set(rel).size!=rel.length)v('relics','duplicate relic in G.relics');
  rel.forEach(r=>{if(!RL[r])v('relics','unknown relic id '+r)});
  ['red','rlv'].forEach(k=>Object.keys(G[k]||{}).forEach(r=>{if(!rel.includes(r))v('stale-'+k,'G.'+k+' keeps an unowned relic')}));
  (G.off||[]).forEach(r=>{if(!rel.includes(r))v('stale-off','G.off holds an unowned relic')});
  if(G.rig&&rel.includes(G.rig))v('rig','the case is rigged for a relic you own');
  // merged cards
  const seenM={};(G.merged||[]).forEach(m=>{
   m.rel.forEach(r=>{if(!rel.includes(r))v('merge','merged card '+m.n+' holds an unowned relic');if(seenM[r])v('merge','a relic sits on two merged cards');seenM[r]=1});
   if(!mSets(m).length)v('merge','merged card with no sets');
   mSets(m).forEach(n=>{const s=SB(n);if(!s)v('merge','unknown set '+n);else if(!s.rel.every(r=>m.rel.includes(r)&&rel.includes(r)))v('merge','set '+n+' on a card is not complete')});
   if(m.slot!=null){if(!rel.includes(m.slot))v('ring','ring slot holds an unowned relic');if(!m.rel.includes(m.slot)&&!onCard(m.slot))v('ring','ring slot relic is neither on the ring card nor on a set card');if(m!==circus())v('ring','a card that is not the ring card has a slot');if(COPIERS.includes(m.slot))v('ring','a copy relic sits in the ring')}
   // a relic on the card must belong to one of its sets, or be the ring relic
   m.rel.forEach(r=>{if(r!==m.slot&&!mSets(m).some(n=>SB(n)&&SB(n).rel.includes(r)))v('merge','a relic rides on a card without a set or the ring')})});
  SETS.forEach(s=>{if(s.rel.every(r=>rel.includes(r))&&!(G.merged||[]).some(m=>mSets(m).includes(s.n)))v('merge','set '+s.n+' is complete but not merged')});
  if(used()<=G.slots)__spill.on=0;if(used()>G.slots&&!__spill.on)v('slots','used() '+used()+' > G.slots '+G.slots);
  if(G.slots>MAXSLOTS)v('slots','G.slots past MAXSLOTS');
  if(G.pos){const vals=Object.values(G.pos);if(new Set(vals).size!=vals.length)v('pos','two units share a bar spot');
   Object.keys(G.pos).forEach(k=>{if(k.startsWith('m:')){if(!(G.merged||[]).some(m=>m.n==k.slice(2)))v('pos','G.pos keeps a gone merged card')}else if(!rel.includes(k))v('pos','G.pos keeps an unowned relic');else if(inMerge(k))v('pos','G.pos keeps a relic that is on a card')})}
  // dice
  const D=G.dice;if(D.length<5||D.length>MAXDICE)v('dice','dice count '+D.length);
  if(new Set(D).size!=D.length)v('dice','one die object sits twice in G.dice');
  D.forEach(d=>{if(!Array.isArray(d.faces)||d.faces.length!=6||d.faces.some(t=>!KNOWN_FACE.includes(t)||t.length!=1))v('dice','bad faces '+JSON.stringify(d.faces));
   if(!(d.f>=0&&d.f<=5&&d.f==Math.floor(d.f)))v('dice','bad face index '+d.f);if(d.en&&!EN[d.en])v('dice','unknown charm '+d.en);if(d.seal&&!SEALS[d.seal])v('dice','unknown seal '+d.seal)});
  const fam={};D.forEach(d=>{if(d.fam){const k=fam[d.fam];if(k&&k.join()!=d.faces.join())v('clones','a clone family has different faces');fam[d.fam]=d.faces}});
  if(D.some(d=>d.keep)&&!rel.includes('shackle'))v('shackle','a die stays shackled without Iron Shackle');
  if(!bossIs('rust')&&!(G.st&&G.st.rustRound==G.round)&&D.filter(d=>d.stuck&&!d.keep).length>G.cfg.stuckCap)v('chain','more chained dice than stuckCap');
  // arcana, tags
  (G.fort||[]).forEach(f=>{if(!FT(f))v('arcana','unknown Arcana '+f)});if(rel.includes('forger'))RUN.forged=1;if(G.fort.length>G.fcap&&!RUN.forged)v('arcana-cap','more Arcana cards than slots ('+G.fort.length+'/'+G.fcap+')');
  (G.tags||[]).forEach(t=>{if(!TG(t))v('tags','unknown tag '+t)});
  if(G.phase=='pack'&&!G.pk)v('pack','pack phase with no G.pk');
  if(Math.abs(G.money*100-Math.round(G.money*100))>1e-6)v('money','money is not a whole number of cents: '+G.money);
  (offers||[]).forEach(o=>{if(!o||typeof o.id!='string'||!(o.c>=0)||!isFinite(o.c))v('offer','bad offer '+JSON.stringify(o).slice(0,80));else if(o.id[0]=='r'&&o.id!='rr'&&!RL[o.id.slice(1)])v('offer','relic offer for an unknown relic')});
  if(G.phase=='shop'){const ids=offers.filter(o=>o.id[0]=='r'&&o.id!='rr').map(o=>o.id);if(new Set(ids).size!=ids.length)v('offer','the same relic is offered twice')}
  if(G.bets.length>G.betCap)v('bets','more bets than betCap');G.bets.forEach(b=>{if(!(b.o>0)||!isFinite(b.o)||!(b.stake>0))v('bets','bad bet '+b.id)});
  if(G.pk){(G.pk.items||[]).forEach(x=>{if(x==null)v('pack','null pack item')});if(G.pk.kind=='relic')G.pk.items.forEach(x=>{if(!RL[x])v('pack','unknown relic in a pack')})}
  Object.entries(G.lv||{}).forEach(([k,n])=>{if(!(n>=0)||n!=Math.floor(n))v('levels','bad hand level '+k+'='+n)});
  if(G.phase=='idle'&&G.thrown&&!D.some(d=>d.thr))v('throw','thrown with no dice on the table');
  if(G.phase=='bet'&&G.round%5==0&&!G.boss)v('boss','boss round without a boss');
  if(G.boss&&!BOSSES.some(b=>b.id==G.boss.id))v('boss','unknown boss');
  // the score preview matches itself and changes nothing (calc must be pure)
  if(G.phase=='idle'&&G.thrown&&T().length){const a=JSON.stringify({rst:G.rst,m:G.money,g:G.grow,lv:G.lv}),c1=calc(),c2=calc();if(c1.total!==c2.total)v('calc','calc() is not stable');if(!isFinite(c1.total)||!isFinite(c1.mult)||!isFinite(c1.sum))v('calc','calc() not finite: '+c1.total);if(JSON.stringify({rst:G.rst,m:G.money,g:G.grow,lv:G.lv})!=a)v('calc','calc() changed the state')}
  return js}

 // the save/resume round trip: what render() saves, loaded back the way the game loads it. Differences outside the transient panel fields are findings
 const TRANS=['case','mq','fu','cheatP','bm','menu','col','rp','bonusPop','dp','lb','cf','dd','reqBusy','alleyMsg','posting','notes','rigP','sc','mt','myd','ce','dm'];
 function roundTrip(){const pend=G.case,sv=JSON.parse(JSON.stringify({G:{...G,lb:null},offers})),want=JSON.parse(JSON.stringify(sv.G));resume(sv);flush();
  if(pend){if(pend!='dud'&&RL[pend]&&!G.relics.includes(pend))bad('resume','a case won mid-spin was lost on reload');return}
  const got=JSON.parse(JSON.stringify(G));const keys=new Set([...Object.keys(want),...Object.keys(got)]);
  keys.forEach(k=>{if(TRANS.includes(k))return;if(JSON.stringify(want[k])!==JSON.stringify(got[k]))bad('resume','resume changed G.'+k)})}

 // ----- action helpers -----
 const thrown=()=>G.dice.map((d,i)=>[d,i]).filter(([d])=>d.thr);
 const val=d=>d.en=='stone'?0:dv(d);
 function bestPick(){const tb0=G.dice.filter(d=>d.thr&&!(d.stuck&&bossIs('pit'))),tb=tb0.length>10?tb0.slice().sort((a,b)=>val(b)-val(a)).slice(0,10):tb0,k=tb.length,maxN=Math.min(G.maxT,k);let best=null,bt=-1;
  const tryL=L=>{G.dice.forEach(d=>{d.sel=false;d.so=0});L.forEach((d,j)=>{d.sel=true;d.so=j+1});if(!pickCheck().ok)return;const c=calc();if(c.total>bt){bt=c.total;best=L.slice()}};
  for(let m=1;m<1<<k;m++){let c=0;for(let j=0;j<k;j++)c+=m>>j&1;if(c>maxN)continue;const L=[];for(let j=0;j<k;j++)if(m>>j&1)L.push(tb[j]);tryL(L)}
  if(legion()){const fam={};tb0.forEach(d=>{if(d.fam&&d.en!='stone'){const key=d.fam+':'+dv(d);(fam[key]=fam[key]||[]).push(d)}});Object.values(fam).forEach(L=>{if(L.length>maxN)tryL(L)})}
  G.dice.forEach(d=>{d.sel=false;d.so=0});return best}
 const setPick=L=>{G.dice.forEach(d=>{d.sel=false;d.so=0});L.forEach((d,j)=>{d.sel=true;d.so=j+1});G.soN=L.length};
 // score the current pick the way score() does (pickCheck first), then check the score went up by exactly what calc() previewed
 function doScoreChecked(){if(!pickCheck().ok)return false;const c=calc(),t0=G.st.tot||0,s0=G.score,r0=G.round;doScore();flush();
  if(Math.abs((G.st.tot||0)-t0-c.total)>Math.max(0,Math.abs(t0)*1e-12))bad('score-mismatch','doScore added '+((G.st.tot||0)-t0)+' but calc() previewed '+c.total);
  else if(G.round==r0&&G.score!==s0+c.total)bad('score-mismatch','G.score moved by '+(G.score-s0)+', calc() said '+c.total);
  if(G.thrown)bad('score','the throw did not end after doScore');return true}
 const fakeEv=()=>({currentTarget:{getBoundingClientRect:()=>({left:0,top:0,width:100,height:100})},clientX:R()*100,clientY:R()*100});
 // play an Arcana card the way its panel does: open, use, then answer whatever it asks (a die, two dice, a face, a relic, a pip)
 function useArcana(){if(!G.fort.length)return 'no card';const i=ri(G.fort.length),id=G.fort[i];openF(i);if(!G.fu)return 'not opened '+id;
  if(chance(.08)){sellF();return 'sold '+id}
  useF();let g=0;
  while(G.fu&&g++<6){const u=G.fu,f=FT(G.fort[u.i]);if(!f){G.fu=null;break}
   if(u.step==0){G.fu=null;break}// Use refused (canF false): close
   if(id=='hammer'){tap(ri(G.dice.length));continue}
   if(f.t=='relic'){if(!G.relics.length){G.fu=null;break}pickFR(pick(f.setOnly&&G.relics.some(inSet)&&chance(.8)?G.relics.filter(inSet):G.relics));if(G.fu&&chance(.5))G.fu=null;continue}
   if(id=='engraver'&&u.face!=null){engrave(fakeEv());continue}
   if((id=='engraver'||id=='carver')&&u.die!=null){pickF(u.die,ri(6));continue}
   const L=G.dice.map((d,di)=>di).filter(di=>id!='carver'&&id!='flipper'||G.dice[di].thr);if(!L.length){G.fu=null;break}
   pickF(pick(L));if(G.fu&&g>3)G.fu=null}
  return id}
 function sellSomething(){const bar=G.relics.filter(r=>!inMerge(r));const cards=G.merged||[];
  if(cards.length&&(!bar.length||chance(.25))){const m=pick(cards);openMerge(m.n);sellMerge(m.n);sellMerge(m.n);return 'sold card '+m.n}
  if(!bar.length)return 'nothing';const r=pick(bar);openRel(r);sellRel(r);sellRel(r);return 'sold '+r}
 function moveSomething(){const g=layout(),keys=Object.keys(G.pos||{});if(!keys.length)return 'nothing';const k=pick(keys),dir=chance(.5)?1:-1;moveRel(k,dir);return 'moved '+k+' '+dir}
 function ringSomething(){const m=circus();if(!m)return 'no ring';openMerge(m.n);if(m.slot&&chance(.35)){ringOut();return 'ring out'}const L=ringable();if(!L.length)return 'nothing ringable';const r=pick(L);ringIn(r);return 'ring in '+r}
 function menus(){const k=ri(5);if(k==0){G.menu=true;G.mt=pick(['combos','sets','rules','records','settings']);render();G.menu=false}else if(k==1){G.col=true;render();G.col=false;G.dm=true;render();G.dm=false}else if(k==2){G.bm=true;render();G.bm=false}
  else if(k==3&&G.relics.length){const r=pick(G.relics);inMerge(r)?openMerge((G.merged.find(m=>m.rel.includes(r))||{}).n):openRel(r)}else{G.notes=true;render();G.notes=false}render();G.rp=null;G.sc=false;return 'menu '+k}

 // ----- actions by phase: [weight, name, fn]; fn returns a short note for the trail -----
 const common=()=>[[G.fort.length?4:0,'arcana',useArcana],[G.relics.length?1.2:0,'sell',sellSomething],[G.relics.length?2:0,'move',moveSomething],[circus()?4:0,'ring',ringSomething],[1,'menu',menus]];
 function actions(){const P=G.phase,L=common();if(G.pj&&G.pj.length)L.push([8,'paint',()=>{const di=ri(G.dice.length),fi=ri(6);paintPick(di,fi);return 'paint '+di+','+fi}]);
  if(P=='idle'&&!G.thrown){
   L.push([6,'roll',()=>{if(needPick()){if(chance(.5))pickRand();else{const bag=G.dice.map((d,i)=>[d,i]).filter(([d])=>!d.stuck&&!swarmFree(d));shufL(bag).slice(0,room()).forEach(([d,i])=>tap(i))}}roll();return 'thrown '+G.dice.filter(d=>d.thr).length}]);
   L.push([2,'bag-tap',()=>{const bag=G.dice.map((d,i)=>[d,i]).filter(([d])=>!d.thr&&!d.stuck);if(!bag.length)return 'empty';const [d,i]=pick(bag);tap(i);return 'tap '+i+(swarmFree(d)?' (swarm, out='+d.out+')':'')}]);
   L.push([cloneSet().length?2:0,'pickClones',()=>{pickClones();return ''}]);
   L.push([.5,'shackle-bag',()=>{const k=G.dice.findIndex(d=>d.keep);if(k>=0)shackle(k);return 'release '+k}]);
  }else if(P=='idle'&&G.thrown){
   L.push([8,'score',()=>{let L2=null;if(chance(RUN.skill))L2=bestPick();else{const tb=shufL(thrown());const n=1+ri(Math.min(G.maxT+(army()?3:0),tb.length));G.dice.forEach(d=>{d.sel=false});tb.slice(0,n).forEach(([d,i])=>tap(i))}
     if(L2)setPick(L2);if(!pickCheck().ok){const b=bestPick();if(!b)return 'no legal pick';setPick(b)}const n=T().length;doScoreChecked();return 'scored '+n}]);
   L.push([G.rerolls>0?4:0,'reroll',()=>{G.dice.forEach(d=>{d.sel=false});const tb=shufL(thrown());tb.slice(0,ri(Math.min(7,tb.length)+1)).forEach(([d,i])=>tap(i));if(chance(.1)){G.dice.forEach(d=>{d.sel=false});render();return 'cancel'}const n=T().length;rerollSel();return 'reroll '+n}]);
   L.push([2,'tap',()=>{const tb=thrown();if(!tb.length)return '';const [d,i]=pick(tb);tap(i);return 'tap '+i}]);
   L.push([cp('shackle')?2:0,'shackle',()=>{const tb=thrown();if(!tb.length)return '';const [d,i]=pick(tb);shackle(i);return 'shackle '+i}]);
   L.push([cloneSet().length?2:0,'pickClones',()=>{pickClones();return ''}]);
   L.push([cloneSet().length&&G.rerolls>0?1:0,'rerollClones',()=>{pickClones();rerollSel();return ''}]);
  }else if(P=='bet'){
   L.push([5,'start',()=>{startRound();return ''}]);
   L.push([G.betOpts&&G.betOpts.length?3:0,'bet',()=>{const i=ri(G.betOpts.length),s=pick([1,3,5]);placeBet(i,s);return 'bet '+i+' $'+s}]);
   L.push([G.bets.length?1:0,'unbet',()=>{unBet(ri(G.bets.length));return ''}]);
   L.push([G.tagOff?1.5:0,'skip',()=>{skipRound();return 'skip'}]);
   L.push([G.boss&&vh('cut')&&!G.bossSw?3:0,'swapBoss',()=>{swapBoss();return 'now '+(G.boss&&G.boss.id)}]);
  }else if(P=='shop'){
   L.push([5,'leave',()=>{nextRound();return ''}]);
   L.push([offers.length?9:0,'buy',()=>{const ok=offers.map((o,i)=>[o,i]).filter(([o])=>G.money>=o.c);if(!ok.length)return 'broke';const [o,i]=pick(ok);if(o.id=='gam'&&chance(.25)){__hold.case=1;try{buy(i)}finally{__hold.case=0}if(G.case){RUN.cur='resume-case';roundTrip();return 'buy gam + reload mid-spin'}}else buy(i);
     if(G.dp!=null){if(chance(.1)){G.dp=null;render();return 'cancel '+o.id}dpPick(ri(G.dice.length))}return 'buy '+o.id}]);
   L.push([2,'shopRR',()=>{shopRR();return ''}]);
   L.push([G.relics.some(r=>lv(r)<2)?2:0,'upgrade',()=>{const L2=G.relics.filter(r=>lv(r)<2);const r=pick(L2);upRel(r);return 'up '+r}]);
   L.push([G.dice.length>5?1:0,'discard',()=>{const i=ri(G.dice.length);discardDie(i);if(chance(.8))discardDie(i);return 'discard '+i}]);
   L.push([(G.gamT||0)>=RIGN&&offers.some(o=>o.id=='gam')?2:0,'rig',()=>{G.rigP=true;render();const L2=RELIC.filter(r=>!G.relics.includes(r.id)&&(r.id!='swarm'||swarmDue()));if(chance(.15)||!L2.length){rigCase(null);return 'unrig'}const r=pick(L2).id;rigCase(r);return 'rig '+r}]);
  }else if(P=='pack'){const K=G.pk;
   if(K&&K.paint)L.push([6,'paint',()=>{const di=ri(G.dice.length),fi=ri(6);paintFace(di,fi);return 'paint '+di+':'+fi}]);
   else if(K)L.push([6,'packPick',()=>{if(!K.items.length){closePack(1);return 'empty'}const i=ri(K.items.length);pickPack(i);return 'pick '+i}]);
   L.push([1.5,'packSkip',()=>{closePack(1);return ''}]);
  }else if(P=='alley'){
   L.push([4,'deal',()=>{if(!G.alley||!G.alley.length){leaveAlley();return 'none'}const id=pick(G.alley);takeDeal(id);if(G.phase=='alley')leaveAlley();return id}]);
   L.push([2,'walk',()=>{leaveAlley();return ''}]);
  }
  return L}
 function step(){
  if(G.vic){if(chance(.9)){G.vic=false;render();return 'keep playing'}RUN.end='victory';return 'stop'}
  const L=actions().map(a=>[a[0]*(RUN.w[a[1]]||(RUN.w[a[1]]=.2+R()*R()*4)),a[1],a[2]]).filter(a=>a[0]>0),tw=L.reduce((s,a)=>s+a[0],0);let x=R()*tw,a=L[L.length-1];for(const c of L){x-=c[0];if(x<0){a=c;break}}
  RUN.cur=a[1];RUN.counts[a[1]]=(RUN.counts[a[1]]||0)+1;if(G.boss)RUN.bosses[G.boss.id]=1;const note=a[2]();return a[1]+(note?' '+note:'')}

 // ----- setup -----
 const EDS=[null,null,null,null,null,'foil','holo','poly','neg'];
 function addR(id){if(G.relics.includes(id)||!RL[id])return;addRelic(id,pick(EDS));if(chance(.35))G.rlv[id]=2}
 function setup(seed){
  const rec={};const prof=chance(.7)?'test':'player';PROF=loadProf(prof);if(prof=='player'){DSETS.forEach(s=>PROF.unl[s.id]=1);PROF.stake=6}rec.prof=prof;
  if(chance(.04)){startDaily();rec.daily=1;G.seed=seed;flush()}
  else{init(seed);G.diff=pick(Object.keys(DIFF));G.stake=1+ri(6);if(chance(.15))G.custom=true;const set=pick(DSETS).id;pickSet(set);rec.set=set;rec.diff=G.diff;rec.stake=G.stake}
  G.money=cents(G.money+ri(chance(.3)?120:25));
  // whole relic sets (merged cards, the center ring, Clone Army + Hive Mind), then single relics
  const fav=['Looking Glass','Three-Ring Circus','Clone Army','Hive Mind'];
  const ns=chance(.5)?1+ri(3):0;for(let j=0;j<ns;j++){const s=chance(.4)?SB(pick(fav)):pick(SETS);if(s&&used()+s.rel.length<=MAXSLOTS+2)s.rel.forEach(addR)}
  const nr=ri(16);for(let j=0;j<nr&&G.relics.length<15;j++)addR(pick(RELIC).id);
  while(used()>MAXSLOTS){const L=G.relics.filter(r=>!inMerge(r)&&G.red[r]!='neg');if(!L.length)break;const r=L[L.length-1];G.relics=G.relics.filter(x=>x!=r);delete G.rlv[r];delete G.red[r]}
  G.slots=Math.min(MAXSLOTS,Math.max(G.slots,used()+ri(3)));
  if(circus()&&chance(.6)){const L=ringable();if(L.length)ringIn(pick(L))}
  // house rules
  shufL(VOUCHERS).slice(0,ri(5)).forEach(v=>{if(!G.vouch.includes(v.id)){G.vouch.push(v.id);if(v.on)v.on()}});
  // dice: extra dice, charms, seals, faces, loaded, clone families
  for(let j=ri(chance(.3)?8:3);j>0&&G.dice.length<MAXDICE;j--)G.dice.push(chance(.5)?newDie():mkDie(1+ri(6)));
  const ENK=Object.keys(EN),SK=Object.keys(SEALS);
  G.dice.forEach(d=>{if(chance(.2))d.en=pick(ENK);if(chance(.15))d.seal=pick(SK);d.faces=d.faces.map(t=>chance(.1)?pick([...'mgxsh']):t);if(chance(.1))d.loaded=true});
  const nf=chance(.4)?1+ri(2):0;for(let j=0;j<nf;j++){const src=pick(G.dice);famOf(src);const k=1+ri(12);for(let c=0;c<k&&G.dice.length<MAXDICE;c++){const cl=JSON.parse(JSON.stringify(src));Object.assign(cl,{thr:false,sel:false,stuck:0,keep:false,rs:false,pre:false,px:null,py:null,so:0});G.dice.push(cl)}}
  if(chance(.3))COMBOS.forEach(c=>{if(chance(.3))G.lv[c.id]=1+ri(3)});
  for(let j=ri(G.fcap+1);j>0;j--)gainF(pick(FORT).id);
  if(chance(.3))for(let j=1+ri(3);j>0;j--)G.tags.push(pick(TAGS).id);
  if(chance(.2))G.gamT=RIGN+ri(3);
  // a late start: jump to round R through the shop, so the endless rounds and later bosses get played too
  if(chance(.3)){const r=chance(.5)?2+ri(30):25+ri(60);G.round=r-1;G.phase='shop';makeOffers();nextRound();rec.start=G.round}
  G.mq=[];render();flush();rec.relics=G.relics.length;rec.merged=(G.merged||[]).map(m=>m.n);rec.dice=G.dice.length;rec.fam=nf;return rec}

 function playRun(seed,maxAct){
  rs={v:hs(seed+'|fuzz')};__spill.on=0;__rnd.v=hs(seed+'|math');__clock.t=1.7e12;clearT();busy=false;
  RUN={seed,viol:[],seen:{},trail:[],step:0,cur:'setup',skill:R(),resumeP:.02+R()*.2,rounds:0,end:'',acts:0,counts:{},bosses:{},w:{}};
  try{RUN.setup=setup(seed);check()}catch(e){bad('exception','setup: '+String(e&&e.message||e),e);RUN.end='setup crash';return RUN}
  const r0=G.round,maxR=r0+10+ri(40);
  for(RUN.step=1;RUN.step<=maxAct;RUN.step++){
   if(G.phase=='over'){RUN.end='lost';break}if(G.round>maxR){RUN.end='round cap';break}
   __clock.t+=1000;let note='';
   try{note=step();flush()}catch(e){bad('exception',String(e&&e.message||e),e);log(RUN.step+' r'+G.round+' '+G.phase+' '+RUN.cur+' THREW');RUN.end='exception';break}
   log(RUN.step+' r'+G.round+' '+G.phase+(G.thrown?'*':'')+' '+note+(__watch.e?'  | '+(()=>{try{return JSON.stringify(eval(__watch.e))}catch(e){return 'ERR '+e.message}})():''));
   if(RUN.end=='victory')break;
   try{check()}catch(e){bad('check-crash',String(e&&e.message||e),e)}
   if(!busy&&!G.fu&&G.dp==null&&chance(RUN.resumeP)){RUN.cur='resume';try{roundTrip();check()}catch(e){bad('exception','resume: '+String(e&&e.message||e),e);RUN.end='exception';break}}
   if(RUN.viol.length>=8){RUN.end='too many violations';break}
  }
  if(!RUN.end){RUN.end='action cap';bad('stall','the run hit the action cap: a softlock, or a loop that makes no progress')}RUN.relics=G.relics.slice();RUN.sets=(G.merged||[]).flatMap(mSets);RUN.rounds=G.round-r0;RUN.round=G.round;RUN.acts=RUN.step;return RUN}
 return{playRun}
}

// ---------- sandbox ----------
// stubs: the throw lands at once (then renders, as the real toss does), the animations resolve at once, and nothing reaches Firebase.
// render() is the real one, followed by what the browser would do next: a pending case resolves and merge pop-ups are dismissed.
const STUBS=`
muted=true;
{const _render=render;render=function(s){_render(s);if(G&&G.case&&!busy&&!__hold.case){const c=G.case;G.case=null;caseWin(c);_render(s)}if(G&&G.mq)G.mq.length=0}}
toss=function(free,done){free.forEach(d=>{d.f=d.fin;d.r=0;d.x=0});busy=false;done();render()};
slideToChain=function(){return false};
gather=function(){return{then(f){f();return this}}};
animBets=function(res){G.bets=[];return{then(f){f();return this}}};
playScore=async function(){};centerAll=function(){};scatter=function(){};
cloneFx=function(){};smashFx=function(){};comboFx=async function(){};coinFx=function(){return{then(f){f();return this}}};skipFx=function(){return{then(f){f();return this}}};burst=function(){};toast=function(){};countNums=function(){};buzz=function(){};
caseRoll=async function(res){G.case=null;caseWin(res)};mergeAnim=async function(){};
{const _b=burnRel;burnRel=function(id){const u=used();_b(id);if(used()>u&&used()>G.slots)__spill.on=1}}
fbPut=async function(){};fbTop=async function(){return[]};fbDoc=async function(){return null};postRun=async function(){};sendReq=async function(){};checkUpdate=function(){};
{const _mb=makeBets;makeBets=function(){return __bets.on?_mb():[]}}
`;
function makeSandbox(){
 const html=fs.readFileSync(fs.existsSync(path.join(ROOT,'src','game.html'))?path.join(ROOT,'src','game.html'):path.join(ROOT,'game.html'),'utf8'),m=html.match(/<script>([\s\S]*)<\/script><\/body>/);
 const src=m[1].replace(/\nboot\(\);\s*$/,'\n'),lineOffset=html.slice(0,m.index).split('\n').length;
 const noop=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='then'?undefined:noop,set:()=>true,apply:()=>noop,construct:()=>noop});
 const T=[];let ti=0;const clock={t:1.7e12};
 const ctx={document:noop,localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{},matchMedia:()=>({matches:false}),performance:{now:()=>clock.t},
  addEventListener(){},removeEventListener(){},setTimeout:(f,ms)=>{if(typeof f=='function')T.push({f,ms:+ms||0,i:ti++});return ti},clearTimeout(id){const t=T.find(x=>x.i==id-1);if(t)t.dead=true},
  setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},
  innerWidth:1000,innerHeight:800,devicePixelRatio:1,location:{hostname:'fuzz',protocol:'file:'},fetch:()=>new Promise(()=>{}),URL:{createObjectURL:()=>'',revokeObjectURL(){}},
  console:OPT.verbose?console:{log(){},warn(){},error(){},info(){}},__T:T,__clock:clock,__rnd:{v:1},__bets:{on:false},__watch:{e:flag('watch',null)},__hold:{case:0},__spill:{on:0}};
 ctx.window=ctx;ctx.__tool=1;vm.createContext(ctx);// __tool: game.html skips its tamper check (seal, fromGame) in the sandbox

 // seeded Math.random and a fake clock, so a seed replays exactly (bet odds, visual randomness, double-tap timing)
 vm.runInContext(`Math.random=function(){let t=(__rnd.v+=0x6D2B79F5)|0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};{const _D=Date;Date=class extends _D{constructor(...a){a.length?super(...a):super(__clock.t)}static now(){return __clock.t}}}`,ctx);
 vm.runInContext(src,ctx,{filename:'game.html',lineOffset:lineOffset-1});
 vm.runInContext(STUBS,ctx,{filename:'fuzz-stubs.js'});
 const api=vm.runInContext('('+FUZZ.toString()+')()',ctx,{filename:'fuzz.js'});
 return{api,ctx};
}

// ---------- main ----------
const norm=s=>String(s).replace(/\d+(\.\d+)?/g,'N');
function main(){
 const sb=makeSandbox(),t0=Date.now();
 const run=seed=>{sb.ctx.__bets.on=(require('crypto').createHash('md5').update(seed).digest()[0]%4)==0;return sb.api.playRun(seed,OPT.max)};
 if(OPT.one){const R=run(OPT.one.toUpperCase());
  console.log(`${R.seed}: setup ${JSON.stringify(R.setup)}; skill ${R.skill.toFixed(2)}; bets ${sb.ctx.__bets.on}; ended ${R.end} at round ${R.round} after ${R.acts} actions`);
  if(!R.viol.length)console.log('No violations.');
  R.viol.forEach(v=>{console.log(`\n== ${v.kind}: ${v.msg}\n   round ${v.round}, phase ${v.phase}, action ${v.act} (step ${v.step})`);if(v.stack)console.log(v.stack.split('\n').map(s=>'   '+s).join('\n'));console.log('   last actions:\n'+v.trail.slice(-OPT.tail).map(s=>'     '+s).join('\n'))});
  return}
 const groups={},runs=[],cov={acts:{},relics:{},sets:{},bosses:{}};let nv=0,rounds=0,acts=0;const ends={};
 for(let i=OPT.from;i<OPT.from+OPT.runs;i++){const seed=OPT.seed+String(i).padStart(4,'0');let R;
  try{R=run(seed)}catch(e){R={seed,viol:[{kind:'harness',msg:String(e&&e.message||e),stack:String(e.stack||'')}],end:'harness',rounds:0,acts:0}}
  Object.entries(R.counts||{}).forEach(([k,n])=>cov.acts[k]=(cov.acts[k]||0)+n);(R.relics||[]).forEach(r=>cov.relics[r]=(cov.relics[r]||0)+1);(R.sets||[]).forEach(r=>cov.sets[r]=(cov.sets[r]||0)+1);Object.keys(R.bosses||{}).forEach(r=>cov.bosses[r]=(cov.bosses[r]||0)+1);
  runs.push({seed,end:R.end,rounds:R.rounds,round:R.round,acts:R.acts,n:R.viol.length});rounds+=R.rounds||0;acts+=R.acts||0;ends[R.end]=(ends[R.end]||0)+1;
  R.viol.forEach(v=>{nv++;const top=(v.stack.split('\n').find(l=>/game\.html:\d+/.test(l))||'').replace(/.*game\.html:(\d+).*/,'game.html:$1');const key=v.kind+' | '+norm(v.msg)+(v.kind.includes('exception')?' | '+top:'');
   const g=groups[key]||(groups[key]={key,kind:v.kind,msg:v.msg,n:0,seeds:[],ex:v});g.n++;if(g.seeds.length<8)g.seeds.push(seed+' r'+v.round)});
  const done=i-OPT.from+1;if(done%100==0||done==OPT.runs)process.stderr.write(`${done}/${OPT.runs} runs, ${Object.keys(groups).length} violation groups, ${nv} violations (${((Date.now()-t0)/1000).toFixed(0)}s)\n`)}
 const G=Object.values(groups).sort((a,b)=>b.n-a.n),ms=Date.now()-t0;
 const out=['# Dice Den fuzz report','',`${OPT.runs} runs (${OPT.seed}${String(OPT.from).padStart(4,'0')}..), ${acts} actions, ${rounds} rounds played, ${(ms/1000).toFixed(0)}s. Run ends: ${Object.entries(ends).map(([k,v])=>k+' '+v).join(', ')}.`,'',
  '## Coverage','',`Actions: ${Object.entries(cov.acts).sort((a,b)=>b[1]-a[1]).map(([k,n])=>k+' '+n).join(', ')}.`,'',`Relics held at the end of a run: ${Object.keys(cov.relics).length} distinct. Sets merged at the end: ${Object.entries(cov.sets).sort((a,b)=>b[1]-a[1]).map(([k,n])=>k+' '+n).join(', ')}. Bosses faced: ${Object.entries(cov.bosses).map(([k,n])=>k+' '+n).join(', ')}.`,'',`## Violation groups (${G.length})`,'',...(G.length?G.map(g=>`### ${g.kind}: ${g.msg}\n\n- ${g.n} hits, e.g. ${g.seeds.join(', ')} (replay: \`node tools/fuzz.js --one ${g.seeds[0].split(' ')[0]}\`)\n- at round ${g.ex.round}, phase ${g.ex.phase}, action ${g.ex.act}\n${g.ex.stack?'\n```\n'+g.ex.stack+'\n```\n':''}\n<details><summary>last actions</summary>\n\n\`\`\`\n${g.ex.trail.slice(-15).join('\n')}\n\`\`\`\n</details>\n`):['None.'])];
 const md=out.join('\n');
 if(OPT.out&&OPT.out!='none'){const p=path.isAbsolute(OPT.out)?OPT.out:path.join(ROOT,OPT.out);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,md+'\n');process.stderr.write('Saved '+path.relative(ROOT,p)+'\n')}
 if(OPT.json)fs.writeFileSync(OPT.json,JSON.stringify({cov,groups:G.map(g=>({key:g.key,n:g.n,seeds:g.seeds,round:g.ex.round,phase:g.ex.phase,act:g.ex.act,stack:g.ex.stack})),runs},null,1));
 console.log(G.length?G.map(g=>`${String(g.n).padStart(5)}  ${g.key}  [${g.seeds.slice(0,3).join(', ')}]`).join('\n'):'No violations.');
}
main();
