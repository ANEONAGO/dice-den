// Stamps a new build: sets BUILD in game.html and writes version.json (the file downloaded copies check against).
// Runs from the pre-commit hook whenever game.html is committed (install it with: node tools/bump-version.js --install-hook).
// Usage: node tools/bump-version.js            stamp now
//        node tools/bump-version.js --install-hook
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
if(process.argv.includes('--install-hook')){
 const hook=path.join(root,'.git','hooks','pre-commit');
 fs.writeFileSync(hook,"#!/bin/sh\n# Dice Den: stamp a new build when game.html is committed (tools/bump-version.js)\nif git diff --cached --name-only | grep -qx 'game.html'; then\n  node tools/bump-version.js && git add game.html version.json\nfi\n");
 try{fs.chmodSync(hook,0o755)}catch(e){}
 console.log('installed',hook);process.exit(0)}
const p=n=>String(n).padStart(2,'0'),d=new Date(),build=`${d.getUTCFullYear()}.${p(d.getUTCMonth()+1)}.${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
const gf=path.join(root,'game.html');let h=fs.readFileSync(gf,'utf8');
if(!/const BUILD='[^']*'/.test(h))throw new Error('BUILD line not found in game.html');
h=h.replace(/const BUILD='[^']*'/,()=>`const BUILD='${build}'`);fs.writeFileSync(gf,h);
// the script's hash for this build (BUILD blanked), so a copy can tell whether its file was edited (game.html tamperBoot); the last 40 builds are kept
const ih=s=>{let x=2166136261;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return(x>>>0).toString(36)};
const src=h.match(/<script>([\s\S]*)<\/script><\/body>/)[1].replace(/const BUILD='[^']*'/,()=>"const BUILD=''");
const vf=path.join(root,'version.json');let old={};try{old=JSON.parse(fs.readFileSync(vf,'utf8')).hashes||{}}catch(e){}
const hashes=Object.fromEntries([...Object.entries(old),[build,ih(src)]].sort((a,b)=>a[0]<b[0]?-1:1).slice(-40));
fs.writeFileSync(vf,JSON.stringify({build,hashes})+'\n');
console.log('build',build);
