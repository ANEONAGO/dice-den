// Usage: node tools/codex-data.js game.html codex.html
// Runs game.html's script in a sandbox with no-op browser stubs, then prints the Codex's RELICS and SETS arrays.
const fs=require('fs'),vm=require('vm');const html=fs.readFileSync(process.argv[2],'utf8');
let src=html.match(/<script>([\s\S]*)<\/script><\/body>/)[1].replace(/\nboot\(\);\s*$/,'\n');
const noop=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':noop,apply:()=>noop,construct:()=>noop});
const ctx={document:noop,window:{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{},matchMedia:()=>({matches:false}),performance:{now:()=>0},addEventListener(){},setTimeout(){},setInterval(){},requestAnimationFrame(){},innerWidth:1000,innerHeight:800,console};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src+`
G={relics:[],rlv:{},grow:{},dice:[],red:{},merged:[],off:[],money:0,slots:5,cfg:{...CFG},fort:[]};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1),clean=s=>cap(String(s).replace(/<[^>]+>/g,'').replace(/ \\(now[^)]*\\)/,'').replace(/\\s+/g,' ').trim());
const L2=id=>{G.rlv[id]=2;const t=words(RL[id].d(2));delete G.rlv[id];return t};
globalThis.OUT='const RELICS='+JSON.stringify(RELIC.map(r=>[r.n,r.r,r.ph,clean(words(r.d(1))),clean(L2(r.id)),SETS.filter(s=>s.rel.includes(r.id)).map(s=>s.n).join(', ')]))+';\\nconst SETS='+JSON.stringify(SETS.map(s=>[s.n,s.rel.map(r=>RL[r].n).join(', '),cap(words(s.d))]))+';';`,ctx);
// swap the two arrays in the Codex page
const page=process.argv[3];let p=fs.readFileSync(page,'utf8');const a=p.indexOf('// relics: [name'),b=p.indexOf('const FSETS=');
p=p.slice(0,a)+'// relics: [name, rarity, when, level 1, level 2, sets] (generated from game.html)\n'+ctx.OUT+'\n'+p.slice(b);fs.writeFileSync(page,p);
// real counts (the old count of '],[' added the relic and set tables together)
console.log('relics',(ctx.OUT.match(/^const RELICS=(.*);$/m)?JSON.parse(ctx.OUT.match(/^const RELICS=(.*);$/m)[1]).length:'?'),'sets',(ctx.OUT.match(/^const SETS=(.*);$/m)?JSON.parse(ctx.OUT.match(/^const SETS=(.*);$/m)[1]).length:'?'));
