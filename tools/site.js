// Assembles site/ (git-ignored), the folder Firebase Hosting publishes; firebase.json runs this as the hosting predeploy step.
// The files come from the last commit (HEAD), never the working tree, so a deploy serves exactly what GitHub Pages serves for that commit
// and can't pick up src/ (the readable source, git-ignored), private/, tools/, .claude/ or CLAUDE.md: only the SITE list is copied.
// It refuses a game.html whose script hash isn't the one version.json lists for its BUILD (the tamper check would flag every player).
// Usage: node tools/site.js   (firebase deploy --only hosting runs it; run it alone to see what a deploy would upload)
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process'),root=path.join(__dirname,'..'),out=path.join(root,'site');
const SITE=['game.html','index.html','codex.html','version.json','art'],ok=f=>SITE.some(s=>f==s||f.startsWith(s+'/'));
const git=(...a)=>execFileSync('git',a,{cwd:root,maxBuffer:1<<28}),fail=m=>{console.error('site.js: '+m);process.exit(1)};
const files=git('ls-tree','-r','--name-only','HEAD','--',...SITE).toString().split('\n').filter(Boolean);
if(files.some(f=>!ok(f)))fail('unexpected file in the list: '+files.filter(f=>!ok(f)).join(', '));
for(const s of ['game.html','index.html','codex.html','version.json'])if(!files.includes(s))fail(s+' is not in HEAD');
fs.rmSync(out,{recursive:true,force:true});
let total=0;for(const f of files){const p=path.join(out,f),b=git('show','HEAD:'+f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b);total+=b.length}
// Firebase serves the game at the site root (since 2026-11-07, user request): index.html is a copy of game.html there and
// firebase.json redirects /game.html to /. GitHub Pages keeps the repo's index.html, which forwards to game.html.
fs.copyFileSync(path.join(out,'game.html'),path.join(out,'index.html'));
// the published script, hashed the way tools/build.js and the game's ih() do; the readable source has comment lines, the build has none
const h=fs.readFileSync(path.join(out,'game.html'),'utf8'),m=h.match(/<script>([\s\S]*)<\/script><\/body>/),b=(h.match(/const BUILD='([^']*)'/)||[])[1];
if(!m||!b)fail('game.html has no main script or BUILD');
if(m[1].includes('\n// '))fail('game.html looks like the readable source, not the obfuscated build');
const ih=s=>{let x=2166136261;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return(x>>>0).toString(36)};
const want=(JSON.parse(fs.readFileSync(path.join(out,'version.json'),'utf8')).hashes||{})[b];
if(want!==ih(m[1]))fail(`game.html (build ${b}) hashes to ${ih(m[1])} but version.json lists ${want}: every player would be flagged`);
const head=git('rev-parse','--short','HEAD').toString().trim();
let pushed=true;try{git('merge-base','--is-ancestor','HEAD','origin/master')}catch(e){pushed=e.status!=1}
console.log(`site/ from ${head}, build ${b}: ${files.length} files, ${Math.round(total/1024)} KB`);files.forEach(f=>console.log('  '+f));
if(!pushed)console.log(`note: ${head} is not on origin/master yet, so GitHub Pages doesn't serve this build`);
