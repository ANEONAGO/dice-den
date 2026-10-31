// Builds the published game.html from the readable source, src/game.html (git-ignored: only the obfuscated build reaches GitHub and the site).
// It stamps a new BUILD in the source, obfuscates the main script (javascript-obfuscator, installed under private/obf), writes game.html,
// and writes version.json with the published script's hash for that build (the game's tamper check compares a copy against it).
// Usage: node tools/build.js                 stamp a new build and publish game.html (the pre-commit hook runs this)
//        node tools/build.js --no-stamp      rebuild game.html without a new BUILD (local testing)
//        node tools/build.js --install-hook  install the pre-commit hook
// Setup on a new machine: cd private/obf && npm install javascript-obfuscator@4
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
if(process.argv.includes('--install-hook')){
 const hook=path.join(root,'.git','hooks','pre-commit');
 fs.writeFileSync(hook,"#!/bin/sh\n# Dice Den: build the published game.html from src/game.html when game.html is committed (tools/build.js)\nif git diff --cached --name-only | grep -qx 'game.html' && [ -f src/game.html ]; then\n  node tools/build.js && git add game.html version.json\nfi\n");
 try{fs.chmodSync(hook,0o755)}catch(e){}
 console.log('installed',hook);process.exit(0)}
const sf=path.join(root,'src','game.html');if(!fs.existsSync(sf))throw new Error('src/game.html not found: the readable source lives there (git-ignored)');
const Obf=require(path.join(root,'private','obf','node_modules','javascript-obfuscator'));
let h=fs.readFileSync(sf,'utf8');
if(!/const BUILD='[^']*'/.test(h))throw new Error('BUILD line not found in src/game.html');
let build=h.match(/const BUILD='([^']*)'/)[1];
if(!process.argv.includes('--no-stamp')){const p=n=>String(n).padStart(2,'0'),d=new Date();build=`${d.getUTCFullYear()}.${p(d.getUTCMonth()+1)}.${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
 h=h.replace(/const BUILD='[^']*'/,()=>`const BUILD='${build}'`);fs.writeFileSync(sf,h)}
const m=h.match(/<script>([\s\S]*)<\/script><\/body>/);if(!m)throw new Error('main script not found');
// global names stay (inline onclick handlers call them by name); locals are renamed and the code is compacted, and self-defending code stops
// working if it is reformatted. No string array or control-flow flattening: either made scoring 10-45x slower (the bet simulation scores thousands of picks).
const obf=Obf.obfuscate(m[1],{compact:true,simplify:true,target:'browser',identifierNamesGenerator:'hexadecimal',renameGlobals:false,
 stringArray:false,splitStrings:false,controlFlowFlattening:false,deadCodeInjection:false,
 selfDefending:true,debugProtection:false,disableConsoleOutput:false,numbersToExpressions:false,transformObjectKeys:false,unicodeEscapeSequence:false}).getObfuscatedCode();
const out=h.slice(0,m.index)+'<script>'+obf+'</script></body>'+h.slice(m.index+m[0].length);
fs.writeFileSync(path.join(root,'game.html'),out);
// FNV-1a over the UTF-16 code units, base 36: the same ih() as the game's tamper check
const ih=s=>{let x=2166136261;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return(x>>>0).toString(36)};
const vf=path.join(root,'version.json');let old={};try{old=JSON.parse(fs.readFileSync(vf,'utf8')).hashes||{}}catch(e){}
// --no-stamp rebuilds under the live BUILD: keep the hash that build was published with, or every copy of it online is flagged as edited
const hashes=Object.fromEntries([...Object.entries(old),[build,old[build]||ih(obf)]].sort((a,b)=>a[0]<b[0]?-1:1).slice(-40));
fs.writeFileSync(vf,JSON.stringify({build,hashes})+'\n');
console.log('build',build,'game.html',Math.round(out.length/1024)+' KB (source '+Math.round(h.length/1024)+' KB)');
