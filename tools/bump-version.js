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
fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({build})+'\n');
console.log('build',build);
