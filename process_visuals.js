/* TCE504 PROCESS VISUAL LAYER
   Purpose: turn each major section into a see -> predict -> play -> explain learning experience.
   Uses local educational illustrations for Glycolysis and Fat Metabolism and lightweight SVG/CSS
   process diagrams for the other sections so the page stays fast and editable.
*/
(function(){
  'use strict';
  const ROOT = document;
  const PURPLE = '#53257f', GOLD = '#ffb703', BLUE = '#2563eb', GREEN = '#16845b', RED = '#c0392b', INK='#172033', MUTED='#667085';

  const V = {
    food:{title:'From Food to Usable Fuel',kicker:'FOLLOW THE FOOD',steps:[['1','FOOD','carbohydrate • fat • protein'],['2','DIGEST','large molecules are broken down'],['3','ABSORB','small molecules enter circulation'],['4','DELIVER','blood transports substrates'],['5','USE / STORE','muscle uses or stores fuel']],prompt:'Click a stage. The explanation changes without leaving the pathway.'},
    energy:{title:'ATP Is the Immediate Energy Currency',kicker:'SEE THE CYCLE',steps:[['1','ATP','ready to power cellular work'],['2','HYDROLYSIS','ATP → ADP + Pi'],['3','WORK','energy supports contraction / transport'],['4','RESYNTHESIS','ADP + Pi → ATP'],['5','REPEAT','ATP is continuously regenerated']],prompt:'The key idea is turnover: ATP is used and resynthesised continuously.'},
    metabolism:{title:'Digestion → Blood → Muscle Cell',kicker:'FOLLOW THE SUBSTRATE',steps:[['1','DIGESTION','food becomes absorbable molecules'],['2','ABSORPTION','molecules cross the gut wall'],['3','CIRCULATION','substrates are delivered'],['4','MUSCLE UPTAKE','fuel enters the cell'],['5','METABOLIC PATHWAY','ATP resynthesis begins']],prompt:'Location matters: what is happening in the gut is different from what happens in the muscle cell.'},
    'atp-pcr':{title:'ATP-PCr: Rapid Phosphate Transfer',kicker:'WATCH THE PHOSPHATE MOVE',steps:[['1','ATP','immediate energy'],['2','ADP + Pi','after ATP hydrolysis'],['3','PCr','rapid phosphate donor'],['4','TRANSFER','PCr + ADP → ATP + Cr'],['5','LIMIT','fast rate, limited capacity']],prompt:'The animation should make the phosphate transfer feel physical, not abstract.'},
    pyruvate:{title:'Pyruvate Is a Branch Point',kicker:'SEE THE TWO FATES',steps:[['1','PYRUVATE','product of glycolysis'],['2','BRANCH','cellular conditions influence fate'],['3','LACTATE','NAD⁺ regenerated'],['4','MITOCHONDRION','acetyl-CoA → TCA'],['5','INTERPRET','context matters']],prompt:'Do not teach lactate as simply “waste”. Follow the NAD⁺ regeneration logic.'},
    tca:{title:'TCA Cycle: Follow Carbon and Electrons',kicker:'TRACK THE CARBON',steps:[['1','ACETYL-CoA','2-carbon input'],['2','CITRATE','6-carbon entry molecule'],['3','CARBON LOSS','CO₂ released'],['4','CARRIERS','NADH + FADH₂ produced'],['5','NEXT','reducing equivalents go to ETC']],prompt:'Click each stage to reveal what changes: carbon number, CO₂, or electron carrier.'},
    etc:{title:'ETC: Electrons → Gradient → ATP',kicker:'WATCH THE GRADIENT BUILD',steps:[['1','NADH / FADH₂','deliver electrons'],['2','ELECTRON FLOW','through respiratory complexes'],['3','H⁺ PUMPING','gradient develops'],['4','ATP SYNTHASE','H⁺ flow drives ATP formation'],['5','O₂','final electron acceptor → H₂O']],prompt:'The important visual event is H⁺ accumulation followed by flow through ATP synthase.'},
    systems:{title:'Energy Systems Work Together',kicker:'NO ON / OFF SWITCH',steps:[['1','START','ATP demand rises'],['2','ATP-PCr','very rapid contribution'],['3','GLYCOLYSIS','rapid carbohydrate pathway'],['4','OXIDATIVE','large capacity'],['5','ALL TOGETHER','relative contribution changes']],prompt:'Move through the stages: every pathway contributes, but the relative contribution changes.'},
    continuum:{title:'Rest → Walk → Run → Marathon',kicker:'INTENSITY CHANGES THE MIX',steps:[['REST','LOW','low ATP demand'],['WALK','LOW–MOD','oxidative support'],['RUN','MOD–HIGH','carbohydrate contribution rises'],['SPRINT','VERY HIGH','rapid ATP pathways rise'],['MARATHON','SUSTAINED','oxidative capacity dominates']],prompt:'This is a continuum, not five isolated boxes.'},
    journey:{title:'One Athlete, Changing Physiology',kicker:'FOLLOW THE ATHLETE',steps:[['START','REST','baseline physiology'],['ACCELERATE','ATP DEMAND ↑','rapid pathways respond'],['SUSTAIN','O₂ DELIVERY ↑','oxidative support'],['FATIGUE','STRAIN ↑','multiple systems interact'],['RECOVER','RESTORE','different variables recover at different rates']],prompt:'The athlete is the story. The pathways are changing underneath the story.'},
    acute:{title:'Acute Exercise Response',kicker:'SEE THE WHOLE BODY',steps:[['MUSCLE','ATP demand ↑','metabolic rate rises'],['HEART','HR / CO ↑','delivery increases'],['LUNGS','ventilation ↑','O₂ / CO₂ exchange'],['BLOOD','substrates / lactate','transport + buffering'],['BRAIN','control','motor + autonomic regulation']],prompt:'Click an organ/system to connect the response to exercise demand.'},
    recovery:{title:'Recovery Is a Collection of Curves',kicker:'NOT EVERYTHING RECOVERS TOGETHER',steps:[['0 MIN','EXERCISE STOPS','demand falls'],['EARLY','PCr','rapid restoration'],['MINUTES','HR / VO₂','fall toward baseline'],['LATER','LACTATE','clearance / oxidation / gluconeogenesis'],['BASELINE','HOMEOSTASIS','depends on person + exercise']],prompt:'Use the curves as evidence: different processes have different kinetics.'},
    adaptation:{title:'Training Stimulus → Adaptation',kicker:'REPEATED EXPOSURE CHANGES THE SYSTEM',steps:[['STIMULUS','exercise','acute disturbance'],['RECOVERY','repair','restoration'],['REPEAT','training','repeated signal'],['ADAPT','capacity ↑','physiological change'],['SAME LOAD','STRAIN ↓','or capacity / performance ↑']],prompt:'Adaptation is the result of repeated stimulus plus recovery, not one session.'},
    monitor:{title:'Monitor → Interpret → Adjust',kicker:'CLINICAL EXERCISE SCIENCE',steps:[['EXTERNAL LOAD','speed • power • duration','what was performed'],['INTERNAL RESPONSE','HR • RPE • VO₂ • lactate','how the body responded'],['CONTEXT','fitness • modality • duration','what changes interpretation'],['DECISION','continue / modify','evidence-informed action'],['REASSESS','next session','close the loop']],prompt:'RER stays a measurement tool, not the centre of the pathway.'},
    detective:{title:'Metabolism Detective',kicker:'EVIDENCE BEFORE CONCLUSION',steps:[['OBSERVE','exercise + data','what actually happened?'],['COMPARE','HR / RPE / RER / lactate','what pattern appears?'],['LINK','pathway','what mechanism could explain it?'],['CHECK','alternative explanation','is there another interpretation?'],['CONCLUDE','evidence-based','state the most defensible explanation']],prompt:'A single variable rarely proves a metabolic pathway by itself.'},
    cases:{title:'Case → Evidence → Mechanism → Decision',kicker:'CASE-BASED LEARNING',steps:[['CASE','athlete / client','start with the person'],['QUESTION','what needs explaining?','define the problem'],['DATA','measurements','look for patterns'],['MECHANISM','physiology','connect evidence to process'],['ACTION','exercise decision','apply the interpretation']],prompt:'Do not jump from case to prescription. Make the physiology visible first.'},
    data:{title:'Data → Pattern → Mechanism → Meaning',kicker:'DATA INTERPRETATION',steps:[['1','LOOK','axes • units • trend'],['2','DESCRIBE','what changed?'],['3','EXPLAIN','what mechanism could cause it?'],['4','CONTEXT','what else matters?'],['5','DECIDE','what can the data support?']],prompt:'Describe the graph before naming a pathway.'},
    practical:{title:'Physiology → Exercise Prescription',kicker:'FROM SCIENCE TO PRACTICE',steps:[['ASSESS','person + baseline','starting point'],['PRESCRIBE','mode • intensity • duration','exercise stimulus'],['MONITOR','HR • RPE • symptoms','internal response'],['ADJUST','progress / regress','individualise'],['REVIEW','outcome','close the loop']],prompt:'The clinical exercise scientist uses physiology to make decisions, not just to memorise pathways.'},
    summary:{title:'The Complete Metabolism Story',kicker:'CONNECT THE WHOLE COURSE',steps:[['FOOD','substrates','carbohydrate • fat • protein'],['ATP','energy demand','ATP turnover'],['PATHWAYS','ATP-PCr • glycolysis • oxidative','overlapping contributions'],['EXERCISE','acute response','whole-body physiology'],['TRAINING','recovery → adaptation','capacity changes']],prompt:'Click through the story from food to adaptation.'}
  };

  function svgFor(id, active){
    const colors=[PURPLE,GOLD,BLUE,GREEN,RED];
    const n=V[id].steps.length;
    let out=`<svg class="pv-svg" viewBox="0 0 1000 250" role="img" aria-label="${V[id].title}">`;
    out+=`<defs><marker id="pvArrow" markerWidth="11" markerHeight="11" refX="9" refY="3.5" orient="auto"><path d="M0,0 L10,3.5 L0,7 Z" fill="${PURPLE}"/></marker></defs>`;
    out+=`<line x1="85" y1="128" x2="915" y2="128" stroke="#d9dce6" stroke-width="8" stroke-linecap="round"/>`;
    for(let i=0;i<n;i++){
      const x=85+(830/(n-1))*i;
      const c=colors[i%colors.length];
      const is=i===active;
      out+=`<circle cx="${x}" cy="128" r="${is?30:23}" fill="${is?c:'#fff'}" stroke="${c}" stroke-width="4" class="pv-dot" data-step="${i}"/>`;
      out+=`<text x="${x}" y="133" text-anchor="middle" font-size="${is?15:13}" font-weight="900" fill="${is?'#fff':c}">${i+1}</text>`;
      if(i<n-1) out+=`<line x1="${x+30}" y1="128" x2="${x+(830/(n-1))-30}" y2="128" stroke="${PURPLE}" stroke-width="4" marker-end="url(#pvArrow)" class="pv-arrow"/>`;
    }
    out+=`<circle cx="${85+(830/(n-1))*active}" cy="128" r="44" fill="none" stroke="${colors[active%colors.length]}" stroke-width="3" opacity=".18" class="pv-pulse"/>`;
    out+='</svg>';
    return out;
  }

  function locationVisual(id){
    if(id==='glycolysis') return `<div class="pv-location"><div class="pv-muscle-cell"><div class="pv-cell-core">MUSCLE CELL</div><div class="pv-cytosol">CYTOSOL<br><small>glycolysis occurs here</small></div><div class="pv-mito">MITOCHONDRION<br><small>TCA + ETC</small></div></div><div class="pv-location-copy"><b>Where?</b><span>Glycolysis takes place in the <strong>cytosol</strong> of the muscle cell.</span><button type="button" class="pv-mini" data-action="explain" data-text="Cytosol = the fluid region of the cell outside the mitochondria. Glycolysis occurs here.">Why cytosol?</button></div></div>`;
    if(['tca','etc','fatprotein'].includes(id)) return `<div class="pv-location"><div class="pv-mito-large"><div class="pv-matrix">MITOCHONDRIAL MATRIX</div><div class="pv-membrane">INNER MEMBRANE</div><div class="pv-interspace">H⁺</div></div><div class="pv-location-copy"><b>Where?</b><span>${id==='tca'?'TCA cycle: mainly the mitochondrial matrix.':'Oxidative phosphorylation: inner mitochondrial membrane.'}</span><button type="button" class="pv-mini" data-action="explain" data-text="Location is part of the mechanism. The structure tells you where each process can occur.">Show location logic</button></div></div>`;
    return '';
  }

  function specialBody(id){
    if(id==='glycolysis') return `<div class="pv-special"><div class="pv-molecule-row"><div class="pv-molecule"><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span><b>Glucose • 6C</b></div><div class="pv-split-arrow">↓<small>cleavage</small></div><div class="pv-molecule three"><span>●</span><span>●</span><span>●</span><b>3C</b></div><span class="plus">+</span><div class="pv-molecule three"><span>●</span><span>●</span><span>●</span><b>3C</b></div></div><div class="pv-account"><span>2 ATP used</span><span>4 ATP produced</span><strong>NET = 2 ATP</strong><span>+ 2 NADH</span></div></div>`;
    if(id==='atp-pcr') return `<div class="pv-special"><div class="pv-transfer"><div class="pv-round gold">PCr</div><div class="pv-phosphate">P</div><div class="pv-round blue">ADP</div><div class="pv-transfer-arrow">→</div><div class="pv-round green">ATP</div><div class="pv-round muted">Cr</div></div><p class="pv-short">Phosphate transfer is the mechanism. ATP is regenerated rapidly, but PCr capacity is limited.</p></div>`;
    if(id==='tca') return `<div class="pv-special"><div class="pv-carbon-track"><span>2C</span><b>+</b><span>4C</span><b>→</b><strong>6C</strong><b>→</b><strong>5C</strong><b>→</b><strong>4C</strong><b>→</b><span>4C</span></div><div class="pv-carriers"><span>NADH</span><span>NADH</span><span>NADH</span><span>FADH₂</span><span>GTP/ATP</span><span>CO₂</span></div></div>`;
    if(id==='etc') return `<div class="pv-special"><div class="pv-membrane-flow"><div>NADH/FADH₂<br><small>electrons</small></div><i>→</i><div>H⁺ H⁺ H⁺<br><small>gradient</small></div><i>→</i><div>ATP synthase<br><small>H⁺ flow</small></div><i>→</i><strong>ATP</strong></div><div class="pv-oxygen">O₂ → H₂O</div></div>`;
    if(id==='fatprotein') return `<div class="pv-special"><div class="pv-chain"><span>C16</span><i>−2C</i><span>C14</span><i>−2C</i><span>C12</span><i>−2C</i><span>…</span><i>−2C</i><strong>Acetyl-CoA</strong></div><div class="pv-carriers"><span>β-oxidation</span><span>NADH</span><span>FADH₂</span></div></div>`;
    return `<div class="pv-generic-illustration"><div class="pv-gi-main">${id==='acute'?'WHOLE-BODY RESPONSE':id==='recovery'?'RECOVERY CURVES':id==='adaptation'?'TRAINING ADAPTATION':'PHYSIOLOGY PROCESS'}</div><div class="pv-gi-arrow">→</div><div class="pv-gi-out">INTERPRETATION</div></div>`;
  }

  function install(id, sec){
    if(sec.dataset.processVisualInstalled==='1') return;
    const old=sec.querySelector('.process-visual') || sec.querySelector('.v6-visual') || sec.querySelector('.visual-map');
    if(!old) return;
    sec.dataset.processVisualInstalled='1';
    const wrap=document.createElement('div');
    wrap.className='process-visual interactive-only';
    wrap.innerHTML=`<div class="pv-header"><div><span class="pv-kicker">${V[id].kicker}</span><h3>${V[id].title}</h3><p>${V[id].prompt}</p></div><div class="pv-controls"><button type="button" class="pv-play">▶ Play</button><button type="button" class="pv-reset">↺ Reset</button><label>Speed <select class="pv-speed"><option value="1">1×</option><option value="0.7">0.7×</option><option value="1.4">1.4×</option></select></label></div></div>${locationVisual(id)}<div class="pv-stage">${svgFor(id,0)}</div><div class="pv-step-row">${V[id].steps.map((s,i)=>`<button type="button" class="pv-step ${i===0?'active':''}" data-step="${i}"><span>${s[0]}</span><b>${s[1]}</b><small>${s[2]}</small></button>`).join('')}</div><div class="pv-explain"><div class="pv-explain-title">${V[id].steps[0][1]}</div><div class="pv-explain-text">${V[id].steps[0][2]}</div></div>${specialBody(id)}${id==='glycolysis'?`<div class="pv-image-wrap"><img src="images/glycolysis-process.png" alt="Detailed glycolysis teaching illustration showing a muscle cell, cytosol, glucose 6-carbon molecule splitting into two 3-carbon molecules, ATP accounting and pyruvate fate." loading="lazy"><div class="pv-image-note">Detailed process illustration • use the numbered controls above to focus attention on one stage at a time.</div></div>`:''}${id==='fatprotein'?`<div class="pv-image-wrap"><img src="images/fat-metabolism-process.png" alt="Detailed fat metabolism teaching illustration showing fatty acid mobilisation, muscle uptake, carnitine shuttle, beta oxidation, TCA cycle and ATP production." loading="lazy"><div class="pv-image-note">Detailed fat-oxidation illustration • trace the pathway from adipose tissue to mitochondrial ATP production.</div></div>`:''}`;
    old.replaceWith(wrap);
    let active=0, timer=null;
    const setStep=(i)=>{
      active=Math.max(0,Math.min(V[id].steps.length-1,i));
      wrap.querySelector('.pv-stage').innerHTML=svgFor(id,active);
      wrap.querySelectorAll('.pv-step').forEach((b,j)=>b.classList.toggle('active',j===active));
      const s=V[id].steps[active];
      wrap.querySelector('.pv-explain-title').textContent=s[1];
      wrap.querySelector('.pv-explain-text').textContent=s[2];
      wrap.querySelectorAll('.pv-step').forEach((b,j)=>b.setAttribute('aria-current',j===active?'step': 'false'));
    };
    wrap.querySelectorAll('.pv-step').forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.step))));
    wrap.querySelector('.pv-play').addEventListener('click',()=>{
      if(timer){clearInterval(timer);timer=null;wrap.querySelector('.pv-play').textContent='▶ Play';return;}
      wrap.querySelector('.pv-play').textContent='⏸ Pause';
      const speed=()=>Number(wrap.querySelector('.pv-speed').value)||1;
      timer=setInterval(()=>{if(active>=V[id].steps.length-1){clearInterval(timer);timer=null;wrap.querySelector('.pv-play').textContent='▶ Play';return;}setStep(active+1)},1800/speed());
    });
    wrap.querySelector('.pv-reset').addEventListener('click',()=>{if(timer){clearInterval(timer);timer=null;}wrap.querySelector('.pv-play').textContent='▶ Play';setStep(0)});
    wrap.querySelectorAll('[data-action="explain"]').forEach(b=>b.addEventListener('click',()=>{
      const box=wrap.querySelector('.pv-explain'); box.classList.add('flash'); box.querySelector('.pv-explain-title').textContent='LOCATION'; box.querySelector('.pv-explain-text').textContent=b.dataset.text; setTimeout(()=>box.classList.remove('flash'),650);
    }));
  }

  function installAll(){
    Object.keys(V).forEach(id=>{const sec=ROOT.getElementById(id); if(sec) install(id,sec);});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installAll); else installAll();
})();
