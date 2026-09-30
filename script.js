const sections=[...document.querySelectorAll('.section')];
const ids=sections.map(s=>s.id);
const titles={
pretest:'Before We Begin',objectives:'Learning Objectives',hook:'The Athlete Question',food:'Food → Substrates',energy:'Energy & ATP',metabolism:'Digestion → Cellular Fuel',
'atp-pcr':'ATP-PCr / Phosphagen',glycolysis:'Glycolysis',pyruvate:'Pyruvate → Lactate',tca:'Krebs / TCA Cycle',etc:'ETC → Oxidative Phosphorylation',
fatprotein:'Fat & Protein Metabolism',systems:'All Systems Together',continuum:'Exercise Continuum',journey:'Athlete Journey',acute:'Acute Response',recovery:'Immediate Recovery',
adaptation:'Chronic Adaptation',monitor:'Monitoring + Calculators',cases:'Case-Based Learning',data:'Data Interpretation',practical:'Practical Application',summary:'Final Concept Map',posttest:'Post-Test',reflection:'Reflection'
};
let mode=localStorage.getItem('tceMode')||'student';
document.body.classList.toggle('mode-lecturer',mode==='lecturer');document.body.classList.toggle('mode-student',mode==='student');
function save(){localStorage.setItem('tceProgress',JSON.stringify([...document.querySelectorAll('.section.done')].map(x=>x.id)))}
function go(id){
 sections.forEach(s=>s.classList.toggle('active',s.id===id));
 const s=document.getElementById(id);if(s)s.classList.add('done');
 document.getElementById('pageTitle').textContent=titles[id]||id;
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
 const idx=ids.indexOf(id);document.getElementById('progress').style.width=((idx+1)/ids.length*100)+'%';
 document.getElementById('content-area')?.scrollTo({top:0,behavior:'smooth'});
 save();window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.go));
function reveal(id){document.getElementById(id)?.classList.toggle('show')}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function toggleMode(){mode=mode==='student'?'lecturer':'student';document.body.classList.toggle('mode-lecturer',mode==='lecturer');document.body.classList.toggle('mode-student',mode==='student');localStorage.setItem('tceMode',mode);document.getElementById('modeText').textContent=mode==='student'?'Student Mode':'Lecturer Mode'}
function toggleFull(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen()}
function resetAll(){if(confirm('Reset all local progress, quiz scores and reflections?')){localStorage.clear();location.reload()}}

const preQs=[
['Which molecule is the immediate energy currency used for muscle contraction?',['Glucose','ATP','Fatty acid','Lactate'],1],
['Where does glycolysis occur?',['Mitochondrial matrix','Nucleus','Cytosol','Liver only'],2],
['Which pathway can regenerate ATP most rapidly?',['ATP-PCr','Oxidative phosphorylation','Fat oxidation','Protein oxidation'],0],
['What is a major product of glycolysis?',['Acetyl-CoA','Pyruvate','Urea','Oxygen'],1],
['During a prolonged endurance event, which system generally provides the largest sustained ATP contribution?',['ATP-PCr','Oxidative metabolism','Only glycolysis','Only stored ATP'],1],
['True or False: Energy systems switch completely off when another system becomes dominant.',['True','False'],1],
['A 400-m runner suddenly increases speed. What generally happens to ATP demand?',['It falls','It stays identical','It rises rapidly','It stops'],2],
['Which molecule carries electrons from earlier pathways toward the ETC?',['NADH','Glucose only','Lactate only','Creatine'],0],
['After hard exercise, which process helps restore high-energy phosphate availability?',['PCr resynthesis','Stopping blood flow','Stopping ventilation','Blocking mitochondria'],0],
['Which statement best describes exercise intensity and fuel use?',['Only fat is used during exercise','Only carbohydrate is used during exercise','Both can contribute, with relative contribution changing with demand','Protein always dominates'],2]
];
const postQs=[
['A student asks why ATP-PCr cannot sustain a marathon. What is the best explanation?',['It cannot make ATP','Its rate is low','Its available capacity is small','It requires no muscle'],2],
['A 400-m effort produces high glycolytic flux. Which pathway is directly supplying rapid carbohydrate breakdown?',['Glycolysis','TCA only','β-oxidation only','Urea cycle'],0],
['Why is lactate formation useful during rapid glycolysis?',['It creates oxygen','It regenerates NAD⁺ so glycolysis can continue','It stores all ATP','It stops carbohydrate use'],1],
['Acetyl-CoA from carbohydrate and fat metabolism can converge at which pathway?',['TCA cycle','Glycolysis only','Cori cycle only','Creatine kinase'],0],
['What is the major role of NADH/FADH₂ in oxidative metabolism?',['They are final ATP molecules','They deliver electrons to the respiratory chain','They digest food','They contract muscle'],1],
['Which statement best explains the three energy systems?',['They operate one at a time','They all contribute, but relative contribution changes','Only oxidative metabolism works during exercise','Only ATP-PCr works above rest'],1],
['After exercise stops, why can VO₂ remain elevated above resting levels for a period?',['Recovery processes require energy and oxygen','The muscles stop using ATP','Digestion stops','The heart stops'],0],
['A cyclist maintains moderate intensity for 90 minutes. Which fuel pattern is most reasonable?',['Only PCr','A mixture of carbohydrate and fat with substantial oxidative metabolism','Only protein','Only lactate'],1],
['Which variable is an example of external load?',['RPE','HR','Power output','Blood lactate'],2],
['A trained endurance athlete performs the same submaximal workload after training. Which is a reasonable adaptation?',['No physiological change is possible','Improved oxidative capacity and potentially lower internal strain at the same task','PCr disappears','Glycolysis stops'],1],
['Which sequence best captures the complete learning chain?',['Food → ATP → adaptation → digestion','Food → substrates → energy systems → demand → response → adaptation → performance → application','Exercise → food → ATP only','Lactate → food → exercise'],1],
['During increasing exercise intensity, which is most likely?',['ATP demand decreases','Relative carbohydrate contribution tends to rise','Oxidative metabolism disappears','All pathways stop'],1]
];

function renderQuiz(type){
 const arr=type==='pre'?preQs:postQs,box=document.getElementById(type+'testBox');
 box.innerHTML=arr.map((q,i)=>`<div class="card" style="margin-bottom:14px"><h3>${i+1}. ${q[0]}</h3>${q[1].map((o,j)=>`<button class="quiz-option" data-q="${i}" data-a="${j}" onclick="selectQ('${type}',${i},${j})">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}<div id="${type}fb${i}" class="feedback"></div></div>`).join('');
}
const answers={pre:{},post:{}};
function selectQ(type,i,j){answers[type][i]=j;document.querySelectorAll(`[data-q="${i}"]`).forEach(b=>b.classList.remove('selected'));document.querySelector(`[data-q="${i}"][data-a="${j}"]`).classList.add('selected')}
function gradeQuiz(type){
 const arr=type==='pre'?preQs:postQs;let score=0,miss=[];
 arr.forEach((q,i)=>{const fb=document.getElementById(type+'fb'+i);fb.className='feedback show';if(answers[type][i]===q[2]){score++;fb.classList.add('ok');fb.innerHTML='<b>Correct.</b> Good reasoning.'}else{fb.classList.add('bad');miss.push(i+1);fb.innerHTML=`<b>Review this.</b> The best answer is <b>${String.fromCharCode(65+q[2])}</b>. Return to the relevant pathway and try to explain why.`}});
 const pct=Math.round(score/arr.length*100),res=document.getElementById(type+'Result');res.classList.remove('hide');
 res.innerHTML=`${type==='pre'?'Starting point':'Final result'}: <b>${score}/${arr.length}</b> (${pct}%). ${type==='pre'?'This is not graded — use it to identify what to watch for.':'Compare this with your pre-test and revisit the sections linked to your errors.'}`;
 localStorage.setItem(type==='pre'?'tcePreScore':'tcePostScore',JSON.stringify({score,pct,miss}));
 if(type==='pre') localStorage.setItem('tcePreSubmitted','1');
 else localStorage.setItem('tcePostSubmitted','1');
}
renderQuiz('pre');renderQuiz('post');

document.querySelectorAll('[data-obj]').forEach(c=>{const k='obj'+c.dataset.obj;c.checked=localStorage.getItem(k)==='1';c.onchange=()=>localStorage.setItem(k,c.checked?'1':'0')});
['ref1','ref2','ref3','ref4'].forEach(id=>{const v=localStorage.getItem(id);if(v)document.getElementById(id).value=v});
function saveReflection(){['ref1','ref2','ref3','ref4'].forEach(id=>localStorage.setItem(id,document.getElementById(id).value));document.getElementById('saveMsg').textContent='Saved locally ✓'}

function updateContribution(){
 const x=+document.getElementById('intensitySlider').value;document.getElementById('intensityVal').textContent=x+'%';
 let p=Math.max(5,55-x*.35),g=Math.min(85,15+x*.65),o=Math.max(10,80-x*.25);
 const sum=p+g+o; p=p/sum*100;g=g/sum*100;o=o/sum*100;
 document.getElementById('pcrBar').style.width=p+'%';document.getElementById('glyBar').style.width=g+'%';document.getElementById('oxBar').style.width=o+'%';
 document.getElementById('contribText').innerHTML=`At <b>${x}% relative intensity</b>, this teaching model emphasises <b>${x<30?'oxidative metabolism':x<70?'a mixed contribution with growing glycolytic demand':'rapid glycolytic + phosphagen support alongside oxidative contribution'}</b>. All three remain contributors.`;
}
updateContribution();

function prevSection(){const i=ids.indexOf(document.querySelector('.section.active')?.id||'pretest');go(ids[Math.max(0,i-1)])}
function nextSection(){const i=ids.indexOf(document.querySelector('.section.active')?.id||'pretest');go(ids[Math.min(ids.length-1,i+1)])}
let sysTimer=null,sysPos=70;
function animateSystems(){clearInterval(sysTimer);sysTimer=setInterval(()=>{sysPos+=6;if(sysPos>830)sysPos=70;document.getElementById('sysDot')?.setAttribute('cx',sysPos)},40)}
function pauseSystems(){clearInterval(sysTimer)}
function replaySystems(){pauseSystems();sysPos=70;document.getElementById('sysDot')?.setAttribute('cx',70);animateSystems()}

const acts=[
['Rest','Low','Low','Oxidative metabolism supports ongoing cellular ATP needs.'],
['Walking','Low–moderate','Low–moderate','Oxidative metabolism supplies most ATP; carbohydrate and fat both contribute.'],
['Jogging','Moderate','Moderate','Oxidative metabolism remains central, with increased carbohydrate contribution as demand rises.'],
['400 m','Very high','Very high','ATP-PCr supports the rapid start; glycolytic contribution becomes substantial; oxidative contribution is present and increases with time.'],
['5 km','High sustained','High','Oxidative metabolism supplies a large share while glycolytic and phosphagen pathways still contribute.']
];
function showActivity(i){document.querySelectorAll('.timecard').forEach((x,j)=>x.classList.toggle('active',j===i));const a=acts[i];document.getElementById('activityBox').innerHTML=`<h3>${a[0]}</h3><p><b>Intensity:</b> ${a[1]} • <b>ATP demand:</b> ${a[2]}</p><p>${a[3]}</p><div class="rule">Ask yourself: which pathway has the highest RATE requirement? Which has the greatest CAPACITY requirement?</div>`}

const stages=[
['REST','60 bpm','Low','Low','Oxidative','At rest, ATP demand is continuous but relatively low. Oxidative metabolism supports routine cellular work and a mixture of substrates contributes.'],
['EXERCISE','150 bpm','High','High','Mixed','At exercise onset, ATP demand rises immediately. Stored ATP and PCr respond rapidly while glycolysis and oxidative metabolism increase too.'],
['0–5 MIN','165 bpm','High','Very high','Mixed → oxidative rising','Oxygen consumption rises toward the new demand. Phosphagen stores are being restored only after the highest immediate demand falls; glycolytic and oxidative flux remain elevated.'],
['30–60 MIN','145 bpm','Moderate-high','High','Oxidative','Sustained exercise relies heavily on oxidative metabolism. Substrate selection depends on intensity, training and availability.'],
['2 H RECOVERY','75 bpm','Falling','Low','Recovery oxidation','HR and VO₂ move toward baseline while recovery processes continue: PCr resynthesis, lactate handling, temperature regulation and restoration of energy stores.']
];
function setStage(i){const s=stages[i];document.getElementById('stageText').textContent=s[0];document.getElementById('stageHR').textContent=s[1];document.getElementById('stageVO2').textContent=s[2];document.getElementById('stageATP').textContent=s[3];document.getElementById('stageFuel').textContent=s[4];document.getElementById('stageExplain').textContent=s[5];document.getElementById('stageDot').setAttribute('cx',220+i*155)}
setStage(0);

function calcHR(){const age=+document.getElementById('age').value,rhr=+document.getElementById('rhr').value,p=+document.getElementById('pct').value;const hrmax=220-age,hrr=hrmax-rhr,target=rhr+(hrr*p/100);document.getElementById('hrResult').innerHTML=`HRmax ≈ ${hrmax} bpm<br>HRR = ${hrr} bpm<br>Target HR ≈ <b>${Math.round(target)} bpm</b>`}
function calcRER(){const vo=+document.getElementById('vo2').value,vc=+document.getElementById('vco2').value;const r=vc/vo;let interp=r<.75?'Very high relative fat contribution (context matters)':r<.85?'Fat contribution is relatively greater than at higher RER':r<.95?'Mixed carbohydrate + fat oxidation':'Predominantly carbohydrate contribution at high intensities';document.getElementById('rerResult').innerHTML=`RER = <b>${r.toFixed(2)}</b><br><small>${interp}</small>`}
function calcMET(){const vo=+document.getElementById('metvo2').value;document.getElementById('metResult').innerHTML=`≈ <b>${(vo/3.5).toFixed(1)} METs</b>`}
const borg=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
document.getElementById('borgButtons').innerHTML=borg.map(x=>`<button class="btn btn-light" onclick="borgPick(${x})">${x}</button>`).join('');
function borgPick(x){let desc=x<=9?'Very light':x<=11?'Light':x<=13?'Somewhat hard':x<=15?'Hard':x<=17?'Very hard':x<=19?'Extremely hard':'Maximal';document.getElementById('borgText').innerHTML=`<b>${x}/20 — ${desc}</b>. Use the rating alongside the actual exercise task and other monitoring variables.`}

function dataAnswer(a){const f=document.getElementById('dataFeedback');f.className='feedback show '+(a==='A'?'ok':'bad');f.innerHTML=a==='A'?'<b>Correct.</b> VO₂ generally increases as external work increases, within the athlete’s physiological range.':'Not quite. Return to the graph and ask how oxygen consumption responds to increasing metabolic demand.'}
const vo2=[35,60,85,115,145,175];document.getElementById('vo2Bars').innerHTML=vo2.map((v,i)=>`<div><div class="bar" style="height:${v}px"></div><div class="bar-label">${i+1}<br>stage</div></div>`).join('');

function buildSession(){const mode=document.getElementById('mode').value,d=+document.getElementById('dur').value,r=+document.getElementById('rec').value,rpe=+document.getElementById('targetRPE').value;let emphasis=rpe>=16?'high glycolytic + phosphagen demand with oxidative support':rpe>=13?'mixed contribution with substantial oxidative support':'predominantly oxidative metabolism';const el=document.getElementById('sessionResult');el.classList.remove('hide');el.innerHTML=`<b>${mode}, ${d} min, RPE ${rpe}, recovery ${r} min.</b><br>Expected metabolic emphasis: <b>${emphasis}</b>.<br>Practical monitoring: compare HR/RPE and the external task (speed, power or duration). If this is interval work, the recovery interval changes the starting physiological state of the next repetition.`}

showActivity(0);

const checkpointData = {
  hook:{fact:"ATP demand is present at rest and rises rapidly when exercise begins; the body changes the relative contribution of several ATP-producing pathways.",q:"When a runner suddenly starts a maximal sprint, which statement is most accurate?",o:["Only oxidative metabolism supplies ATP","Only ATP-PCr supplies ATP","All major systems contribute, but the fastest pathways increase their relative contribution","ATP is no longer required"],a:2,e:"All major systems contribute simultaneously; ATP-PCr and glycolytic pathways become especially important when ATP demand rises rapidly."},
  food:{fact:"Food is not used directly as 'energy'. Digestion and absorption convert food into circulating substrates such as glucose, fatty acids and amino acids.",q:"Which sequence best describes the early part of the metabolism story?",o:["ATP → food → digestion → substrate","Food → digestion → absorption → circulating substrates","Food → ATP → glycogen → absorption","Substrate → digestion → food → ATP"],a:1,e:"Food must first be digested and absorbed before its components become available as circulating substrates."},
  energy:{fact:"ATP is the immediate chemical energy currency for cellular work, but stored ATP is limited, so ATP must be continuously regenerated.",q:"Why must ATP be continuously regenerated during exercise?",o:["Because ATP cannot be used by muscle","Because muscle ATP stores are limited relative to ongoing demand","Because ATP is only found in the liver","Because exercise stops ATP hydrolysis"],a:1,e:"Muscle contraction continuously hydrolyses ATP. Because stored ATP is limited, metabolic pathways must regenerate it."},
  metabolism:{fact:"Substrate availability at the muscle depends on digestion, absorption, circulation, tissue storage, mobilisation and cellular uptake.",q:"Which event occurs before a substrate can be oxidised inside working muscle?",o:["It must first become available to the cell","It must always become lactate","It must always enter the nucleus","It must first become ATP"],a:0,e:"The substrate must be delivered and taken up by the relevant tissue before cellular metabolism can use it."},
  "atp-pcr":{fact:"The ATP-PCr system has a very high rate of ATP regeneration but a small total capacity.",q:"Why is ATP-PCr especially useful at the start of a maximal effort?",o:["It has a very rapid ATP-regeneration rate","It has the largest energy capacity","It requires hours to activate","It depends entirely on glycogen"],a:0,e:"The phosphagen reaction can regenerate ATP very rapidly, making it valuable when ATP demand rises suddenly."},
  glycolysis:{fact:"Glycolysis occurs in the cytosol and converts glucose or glycogen-derived carbohydrate into pyruvate while generating ATP and NADH.",q:"Where does glycolysis occur?",o:["Cytosol","Mitochondrial inner membrane","Mitochondrial matrix only","Blood plasma"],a:0,e:"Glycolysis is a cytosolic pathway."},
  pyruvate:{fact:"Pyruvate is a metabolic branch point: it can be converted to lactate or enter mitochondrial oxidative metabolism through acetyl-CoA.",q:"Why can lactate formation help rapid glycolysis continue?",o:["It produces unlimited ATP","It helps regenerate NAD⁺","It removes all carbon from the muscle","It stops glycolysis"],a:1,e:"Reduction of pyruvate to lactate regenerates NAD⁺, supporting continued glycolytic flux."},
  tca:{fact:"The TCA cycle is important because it generates NADH and FADH₂ that carry electrons toward the respiratory chain.",q:"What is a major role of the TCA cycle in ATP production?",o:["It directly stores all ATP","It generates electron carriers for oxidative phosphorylation","It replaces oxygen","It occurs only in blood"],a:1,e:"The TCA cycle generates NADH and FADH₂, which deliver electrons to the electron transport chain."},
  etc:{fact:"Oxidative phosphorylation uses electron flow, a proton gradient and ATP synthase to produce ATP; oxygen is the final electron acceptor.",q:"What directly drives ATP synthase during oxidative phosphorylation?",o:["The proton gradient across the inner mitochondrial membrane","Lactate in the blood","Glycogen in the liver","Creatine in the nucleus"],a:0,e:"The proton gradient provides the energy for proton flow through ATP synthase, which supports ATP formation."},
  fatprotein:{fact:"Fat has a large energy capacity but a slower rate of ATP provision; protein generally contributes less to exercise energy than carbohydrate and fat.",q:"Which statement best compares fat with carbohydrate during exercise?",o:["Fat always provides ATP faster","Fat has a large capacity but generally slower ATP provision","Fat cannot enter oxidative metabolism","Carbohydrate cannot support high-intensity exercise"],a:1,e:"Fat oxidation can provide substantial energy but generally has a slower rate of ATP provision than carbohydrate metabolism."},
  systems:{fact:"ATP-PCr, glycolytic and oxidative systems operate simultaneously; exercise intensity and duration alter their relative contribution.",q:"Which statement best represents energy-system integration?",o:["Only one system is active at any moment","All systems contribute, but relative contribution changes with demand","Oxidative metabolism stops during high intensity","ATP-PCr is the only system used during exercise"],a:1,e:"The systems overlap. The dominant relative contribution changes with intensity, duration and other factors."},
  continuum:{fact:"As exercise becomes harder and/or the required ATP supply becomes faster, rapid ATP-producing pathways contribute more, while oxidative metabolism remains active.",q:"Compared with easy walking, what generally happens during a 400-m run?",o:["ATP demand is lower","The need for rapid ATP regeneration is greater","All oxidative metabolism stops","Only fat is used"],a:1,e:"A 400-m run has much greater ATP demand and requires a greater relative contribution from rapid ATP-producing pathways."},
  journey:{fact:"Recovery is an active physiological phase: HR and VO₂ fall progressively while PCr resynthesis and other restoration processes continue.",q:"Immediately after hard exercise stops, which is most accurate?",o:["All physiological processes instantly return to rest","HR and VO₂ can remain elevated while recovery proceeds","ATP production stops completely","The mitochondria stop functioning"],a:1,e:"Recovery takes time. Cardiovascular and metabolic variables decline progressively rather than instantly returning to baseline."},
  acute:{fact:"An acute response is the body's immediate response to a single exercise bout, including changes in cardiovascular, respiratory and metabolic variables.",q:"Which is an acute response to exercise?",o:["Increased heart rate during the exercise bout","A long-term increase in mitochondrial density","A permanent increase in muscle mass","A chronic training adaptation"],a:0,e:"An acute response occurs during or immediately around the exercise bout; chronic adaptations develop with repeated training."},
  recovery:{fact:"Different recovery processes occur on different time scales: PCr restoration is relatively rapid, while glycogen restoration and other processes can continue for hours.",q:"Why can recovery continue after heart rate has fallen substantially?",o:["Recovery processes such as PCr restoration and substrate replenishment may still be occurring","ATP is no longer needed","Muscle cells stop using oxygen forever","The exercise stimulus disappears from the body"],a:0,e:"Physiological recovery is multi-process and multi-timescale; not every process returns to baseline at the same rate."},
  adaptation:{fact:"Repeated exercise stimuli can produce chronic adaptations that change the response to a given workload and support performance.",q:"What distinguishes chronic adaptation from an acute response?",o:["It occurs only during one exercise bout","It develops over repeated training exposure","It never affects performance","It occurs before exercise begins"],a:1,e:"Chronic adaptation develops over repeated training exposure rather than from a single exercise bout."},
  monitor:{fact:"External load describes what the athlete does; internal load describes how the athlete responds.",q:"Which is an example of external load?",o:["Heart rate","RPE","Power output","Blood lactate"],a:2,e:"Power output describes the external work performed. HR, RPE and lactate are internal-response measures."},
  cases:{fact:"Case analysis should connect demand → substrate use → ATP pathway contribution → physiological response → recovery.",q:"When analysing an exercise case, which question should come first?",o:["Which pathway name should I memorise?","What is the exercise demand in intensity and duration?","Which answer looks longest?","What is the athlete's favourite food?"],a:1,e:"Intensity and duration define the ATP demand, which then helps you reason about relative pathway contribution."},
  data:{fact:"Physiological data become meaningful when interpreted in relation to exercise workload, time and the athlete's context.",q:"If VO₂ generally rises as workload increases, what does that suggest?",o:["Metabolic demand is increasing","Exercise demand is disappearing","The athlete has stopped using ATP","Only protein is being oxidised"],a:0,e:"Increasing VO₂ generally reflects increasing aerobic metabolic demand within the relevant exercise range."},
  practical:{fact:"Exercise physiology becomes useful when measurements are translated into exercise prescription, monitoring, recovery and performance decisions.",q:"Why combine external load with internal measures?",o:["To understand both the task performed and the body's response to it","To eliminate all individual differences","To avoid measuring exercise","To prove one energy system is always dominant"],a:0,e:"Combining external and internal measures gives a more complete picture of exercise dose and physiological strain."},
  summary:{fact:"The complete model is a connected chain: food provides substrates; substrates support ATP production; ATP supply must match exercise demand; responses and adaptations influence performance and practice.",q:"Which sequence best captures the whole learning model?",o:["Food → substrates → energy systems → exercise demand → response → adaptation → performance → application","Exercise → ATP → food → digestion only","Lactate → food → performance only","ATP-PCr → marathon → digestion → protein"],a:0,e:"The full model links nutrition, metabolism, exercise demand, acute/recovery responses, adaptation, performance and practical application."}
};

function renderCheckpoints(){
 document.querySelectorAll('.learning-checkpoint').forEach(box=>{
   const id=box.dataset.checkpointSection, d=checkpointData[id]; if(!d)return;
   box.querySelector('.kf-text').textContent=d.fact;
   box.querySelector('.qc-question').textContent=d.q;
   const opts=box.querySelector('.qc-options');
   opts.innerHTML=d.o.map((x,i)=>`<button class="qc-option" data-cp="${id}" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('');
   const fb=box.querySelector('.qc-feedback'), retry=box.querySelector('.qc-retry');
   opts.querySelectorAll('.qc-option').forEach(btn=>btn.onclick=()=>{
      opts.querySelectorAll('.qc-option').forEach(b=>{b.disabled=true;b.classList.remove('correct','wrong')});
      const chosen=+btn.dataset.i;
      btn.classList.add(chosen===d.a?'correct':'wrong');
      fb.className='qc-feedback show '+(chosen===d.a?'ok':'bad');
      fb.innerHTML=chosen===d.a?`<b>Good.</b> ${d.e}`:`<b>Review.</b> ${d.e}`;
      retry.style.display='inline-block';
      localStorage.setItem('cp_'+id,chosen===d.a?'correct':'review');
   });
   retry.onclick=()=>{opts.querySelectorAll('.qc-option').forEach(b=>{b.disabled=false;b.classList.remove('correct','wrong')});fb.className='qc-feedback';fb.textContent='';retry.style.display='none'};
 });
}
renderCheckpoints();


function toggleCase(btn){
  const answer = btn.nextElementSibling;
  if(answer){
    answer.classList.toggle('show');
    btn.textContent = answer.classList.contains('show') ? 'Hide mechanism' : 'Reveal mechanism';
  }
}



/* =========================================================
   TCE504 GOOGLE SHEET INTEGRATION
   ========================================================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzawMrdcdA55TrrjW7PlIApkwDrgxirOVUJM4mZ4EpKnOw0F7r3yEN4ml5ht3viDm9N/exec";
const COURSE = "TCE504";
const TOPIC = "Exercise Metabolism";

let student = JSON.parse(localStorage.getItem("tceStudent") || "null") || {
  name:"", matric:"", email:""
};

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}

function hydrateStudent(){
  const n=document.getElementById("studentName");
  const m=document.getElementById("studentMatric");
  const e=document.getElementById("studentEmail");
  if(n)n.value=student.name||"";
  if(m)m.value=student.matric||"";
  if(e)e.value=student.email||"";
  const s=document.getElementById("identityStatus");
  if(s && student.name) s.innerHTML=`<span class="sync-ok">Identity saved on this browser ✓</span>`;
}

function saveStudentIdentity(){
  const name=(document.getElementById("studentName")?.value||"").trim();
  const matric=(document.getElementById("studentMatric")?.value||"").trim();
  const email=(document.getElementById("studentEmail")?.value||"").trim();

  if(!name || !matric || !email){
    alert("Please complete Full Name, Matric Number and USM Email before submitting.");
    return false;
  }
  student={name,matric,email};
  localStorage.setItem("tceStudent",JSON.stringify(student));
  const s=document.getElementById("identityStatus");
  if(s)s.innerHTML=`<span class="sync-ok">Identity confirmed ✓</span>`;
  return true;
}

function requireStudent(){
  if(student?.name && student?.matric && student?.email) return true;
  return saveStudentIdentity();
}

async function sendToGoogleSheet(data){
  try{
    await fetch(GOOGLE_SCRIPT_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(data)
    });
    console.log("Google Sheet submission sent:",data.type);
    return true;
  }catch(err){
    console.error("Google Sheet submission failed",err);
    return false;
  }
}

function identityPayload(){
  return {
    name:student.name,
    matric:student.matric,
    email:student.email,
    course:COURSE,
    topic:TOPIC
  };
}

/* Override mode toggle:
   Student = guided journey.
   Lecturer = direct access to the learning sections. */
function toggleMode(){
  mode=mode==='student'?'lecturer':'student';
  document.body.classList.toggle('mode-lecturer',mode==='lecturer');
  document.body.classList.toggle('mode-student',mode==='student');
  localStorage.setItem('tceMode',mode);
  document.getElementById('modeText').textContent=mode==='student'?'Student Mode':'Lecturer Mode';

  if(mode==='lecturer'){
    go('objectives');
  }else{
    go('pretest');
  }
}

function goToTeaching(){
  if(mode!=='lecturer') toggleMode();
  else go('objectives');
}

/* Log section access/completion for lecturer analytics. */
let lastLoggedSection="";
function logSection(sectionId){
  if(mode!=="student" || !student?.matric) return;
  if(lastLoggedSection===sectionId) return;
  lastLoggedSection=sectionId;
  sendToGoogleSheet({
    type:"activity",
    ...identityPayload(),
    section:sectionId,
    sectionTitle:titles[sectionId]||sectionId,
    timestamp:new Date().toISOString()
  });
}

/* Override navigation to include activity logging. */
const originalGo = go;
go = function(id){
  originalGo(id);
  logSection(id);
};

/* Robust quiz rendering */
const TCE_PRE = [
["Which molecule is the immediate energy currency used for muscle contraction?",["Glucose","ATP","Fatty acid","Lactate"],1],
["Where does glycolysis occur?",["Mitochondrial matrix","Nucleus","Cytosol","Liver only"],2],
["Which pathway can regenerate ATP most rapidly?",["ATP-PCr","Oxidative phosphorylation","Fat oxidation","Protein oxidation"],0],
["What is a major product of glycolysis?",["Acetyl-CoA","Pyruvate","Urea","Oxygen"],1],
["During a prolonged endurance event, which system generally provides the largest sustained ATP contribution?",["ATP-PCr","Oxidative metabolism","Only glycolysis","Only stored ATP"],1],
["True or False: Energy systems switch completely off when another system becomes dominant.",["True","False"],1],
["A 400-m runner suddenly increases speed. What generally happens to ATP demand?",["It falls","It stays identical","It rises rapidly","It stops"],2],
["Which molecule carries electrons from earlier pathways toward the ETC?",["NADH","Glucose only","Lactate only","Creatine"],0],
["After hard exercise, which process helps restore high-energy phosphate availability?",["PCr resynthesis","Stopping blood flow","Stopping ventilation","Blocking mitochondria"],0],
["Which statement best describes exercise intensity and fuel use?",["Only fat is used during exercise","Only carbohydrate is used during exercise","Both can contribute, with relative contribution changing with demand","Protein always dominates"],2]
];

const TCE_POST = [
["A student asks why ATP-PCr cannot sustain a marathon. What is the best explanation?",["It cannot make ATP","Its rate is low","Its available capacity is small","It requires no muscle"],2],
["A 400-m effort produces high glycolytic flux. Which pathway is directly supplying rapid carbohydrate breakdown?",["Glycolysis","TCA only","β-oxidation only","Urea cycle"],0],
["Why is lactate formation useful during rapid glycolysis?",["It creates oxygen","It regenerates NAD⁺ so glycolysis can continue","It stores all ATP","It stops carbohydrate use"],1],
["Acetyl-CoA from carbohydrate and fat metabolism can converge at which pathway?",["TCA cycle","Glycolysis only","Cori cycle only","Creatine kinase"],0],
["What is the major role of NADH/FADH₂ in oxidative metabolism?",["They are final ATP molecules","They deliver electrons to the respiratory chain","They digest food","They contract muscle"],1],
["Which statement best explains the three energy systems?",["They operate one at a time","They all contribute, but relative contribution changes","Only oxidative metabolism works during exercise","Only ATP-PCr works above rest"],1],
["After exercise stops, why can VO₂ remain elevated above resting levels for a period?",["Recovery processes require energy and oxygen","The muscles stop using ATP","Digestion stops","The heart stops"],0],
["A cyclist maintains moderate intensity for 90 minutes. Which fuel pattern is most reasonable?",["Only PCr","A mixture of carbohydrate and fat with substantial oxidative metabolism","Only protein","Only lactate"],1],
["Which variable is an example of external load?",["RPE","HR","Power output","Blood lactate"],2],
["A trained endurance athlete performs the same submaximal workload after training. Which is a reasonable adaptation?",["No physiological change is possible","Improved oxidative capacity and potentially lower internal strain at the same task","PCr disappears","Glycolysis stops"],1],
["Which sequence best captures the complete learning chain?",["Food → substrates → energy systems → demand → response → adaptation → performance → application","Exercise → food → ATP only","Lactate → food → exercise","ATP-PCr → marathon → digestion → protein"],0],
["During increasing exercise intensity, which is most likely?",["ATP demand decreases","Relative carbohydrate contribution tends to rise","Oxidative metabolism disappears","All pathways stop"],1]
];

const tceAnswers={pre:{},post:{}};

function renderTCEQuiz(type){
  const arr=type==="pre"?TCE_PRE:TCE_POST;
  const box=document.getElementById(type+"testBox");
  if(!box)return;
  box.innerHTML=arr.map((q,i)=>`
    <div class="card" style="margin-bottom:14px">
      <h3>${i+1}. ${escapeHtml(q[0])}</h3>
      ${q[1].map((o,j)=>`
        <button type="button" class="quiz-option" data-tce-q="${type}-${i}" data-tce-a="${j}" onclick="selectTCEQuiz('${type}',${i},${j})">
          ${String.fromCharCode(65+j)}. ${escapeHtml(o)}
        </button>`).join("")}
      <div id="${type}TCEfb${i}" class="feedback"></div>
    </div>`).join("");
}

function selectTCEQuiz(type,i,j){
  tceAnswers[type][i]=j;
  document.querySelectorAll(`[data-tce-q="${type}-${i}"]`).forEach(b=>b.classList.remove("selected"));
  const btn=document.querySelector(`[data-tce-q="${type}-${i}"][data-tce-a="${j}"]`);
  if(btn)btn.classList.add("selected");
}

async function gradeTCEQuiz(type){
  if(type==="pre" && !requireStudent()) return;
  if(type==="post" && !requireStudent()) return;

  const arr=type==="pre"?TCE_PRE:TCE_POST;
  let score=0,miss=[];
  for(let i=0;i<arr.length;i++){
    const fb=document.getElementById(`${type}TCEfb${i}`);
    const selected=tceAnswers[type][i];
    if(selected===undefined){
      alert(`Please answer Question ${i+1} before submitting.`);
      return;
    }
    fb.className="feedback show";
    if(selected===arr[i][2]){
      score++;
      fb.classList.add("ok");
      fb.innerHTML="<b>Correct.</b> Good reasoning.";
    }else{
      miss.push(i+1);
      fb.classList.add("bad");
      fb.innerHTML=`<b>Review this.</b> The best answer is <b>${String.fromCharCode(65+arr[i][2])}</b>.`;
    }
  }

  const pct=Math.round(score/arr.length*100);
  const result={score,percentage:pct,missed:miss};
  localStorage.setItem(type==="pre"?"tcePreScore":"tcePostScore",JSON.stringify(result));

  const res=document.getElementById(type+"Result");
  res.classList.remove("hide");
  res.innerHTML=type==="pre"
    ? `Starting point: <b>${score}/${arr.length}</b> (${pct}%). This is your baseline — it is not graded. <span class="sync-ok">Submitted to learning record.</span>`
    : `Final result: <b>${score}/${arr.length}</b> (${pct}%). <span class="sync-ok">Submitted to learning record.</span>`;

  const payload={
    type:type==="pre"?"pretest":"posttest",
    ...identityPayload(),
    score,
    percentage:pct,
    missed:miss.join(","),
    answers:arr.map((q,i)=>tceAnswers[type][i]),
    timestamp:new Date().toISOString()
  };

  const sent=await sendToGoogleSheet(payload);
  if(!sent)res.innerHTML += `<div class="sync-warn" style="margin-top:10px">The browser could not confirm the connection. Please check the Apps Script deployment and URL.</div>`;
}

function gradeQuiz(type){ return gradeTCEQuiz(type); }

/* Reflection: save locally + Google Sheet */
async function saveReflection(){
  if(!requireStudent())return;

  const fields=["ref1","ref2","ref3","ref4"];
  const vals=fields.map(id=>(document.getElementById(id)?.value||"").trim());
  if(vals.some(v=>!v)){
    alert("Please complete all four reflection questions.");
    return;
  }

  fields.forEach((id,i)=>localStorage.setItem(id,vals[i]));
  const payload={
    type:"reflection",
    ...identityPayload(),
    mostImportant:vals[0],
    unclear:vals[1],
    explainToOthers:vals[2],
    practicalApplication:vals[3],
    confidence:document.getElementById("confidence")?.value||"",
    timestamp:new Date().toISOString()
  };

  const sent=await sendToGoogleSheet(payload);
  const msg=document.getElementById("saveMsg");
  if(msg){
    msg.innerHTML=sent
      ? '<span class="sync-ok">Reflection saved to Google Sheet ✓</span>'
      : '<span class="sync-warn">Saved locally, but Google Sheet connection could not be confirmed.</span>';
  }
}

/* Initialisation */
document.addEventListener("DOMContentLoaded",()=>{
  hydrateStudent();
  renderTCEQuiz("pre");
  renderTCEQuiz("post");

  /* restore local reflection */
  ["ref1","ref2","ref3","ref4"].forEach(id=>{
    const v=localStorage.getItem(id);
    if(v && document.getElementById(id))document.getElementById(id).value=v;
  });

  /* Restore mode */
  mode=localStorage.getItem("tceMode")||"student";
  document.body.classList.toggle("mode-lecturer",mode==="lecturer");
  document.body.classList.toggle("mode-student",mode==="student");
  const mt=document.getElementById("modeText");
  if(mt)mt.textContent=mode==="student"?"Student Mode":"Lecturer Mode";

  /* Ensure students begin at Pre-Test; lecturer can begin at objectives. */
  if(mode==="lecturer") originalGo("objectives");
  else originalGo("pretest");
});

(function(){
  const root=document.getElementById('tca-simulator');
  if(!root) return;
  const nodes=[...root.querySelectorAll('.tca-node')];
  const token=root.querySelector('.tca-token');
  const titles=[
    "Step 1 — Citrate",
    "Step 2 — Isocitrate",
    "Step 3 — α-Ketoglutarate",
    "Step 4 — Succinyl-CoA",
    "Step 5 — Succinate",
    "Step 6 — Fumarate",
    "Step 7 — Malate",
    "Step 8 — Oxaloacetate"
  ];
  const texts=[
    "Acetyl-CoA combines with oxaloacetate to form citrate. The cycle begins with a 2-carbon acetyl group entering a 4-carbon acceptor.",
    "Citrate is rearranged to isocitrate. This prepares the molecule for oxidative decarboxylation.",
    "Isocitrate is oxidised and decarboxylated, producing NADH and releasing CO₂. The carbon skeleton becomes α-ketoglutarate.",
    "α-Ketoglutarate is oxidised and decarboxylated, producing NADH and CO₂ and forming succinyl-CoA.",
    "Succinyl-CoA is converted to succinate with substrate-level phosphorylation, producing GTP/ATP.",
    "Succinate is oxidised to fumarate, producing FADH₂.",
    "Fumarate is hydrated to form malate.",
    "Malate is oxidised to regenerate oxaloacetate, producing NADH. Oxaloacetate is now ready to combine with another acetyl-CoA."
  ];
  const coords=[
    [350,78],[505,235],[445,365],[255,365],[195,235],[255,105],[350,150],[350,235]
  ];
  let step=0, timer=null;
  function outputs(n){
    // Cumulative products associated with a single turn up to each displayed step.
    let nadh=0, fadh2=0, atp=0, co2=0;
    if(n>=2)nadh++;
    if(n>=3){nadh++;co2++;}
    if(n>=4){atp++;} // succinyl-CoA -> succinate
    if(n>=5){fadh2++;}
    if(n>=7){nadh++;}
    if(n>=3){} // second CO2 is produced in step 4, represented below
    if(n>=3)co2=1;
    if(n>=4)co2=2;
    return {nadh,fadh2,atp,co2};
  }
  function render(){
    nodes.forEach((el,i)=>el.classList.toggle('active',i===step));
    const [x,y]=coords[step];
    token.setAttribute('cx',x); token.setAttribute('cy',y);
    root.querySelector('#tca-title').textContent=titles[step];
    root.querySelector('#tca-text').textContent=texts[step];
    const o=outputs(step);
    root.querySelector('#tca-nadh').textContent=o.nadh;
    root.querySelector('#tca-fadh2').textContent=o.fadh2;
    root.querySelector('#tca-atp').textContent=o.atp;
    root.querySelector('#tca-co2').textContent=o.co2;
    root.querySelector('#tca-nadh-small').textContent=o.nadh;
    root.querySelector('#tca-fadh2-small').textContent=o.fadh2;
    root.querySelector('#tca-atp-small').textContent=o.atp;
  }
  function stop(){if(timer){clearInterval(timer);timer=null;} root.querySelector('#tca-play').textContent="▶ Play cycle";}
  root.querySelector('#tca-next').addEventListener('click',()=>{stop();step=(step+1)%8;render();});
  root.querySelector('#tca-prev').addEventListener('click',()=>{stop();step=(step+7)%8;render();});
  root.querySelector('#tca-reset').addEventListener('click',()=>{stop();step=0;render();});
  root.querySelector('#tca-play').addEventListener('click',()=>{
    if(timer){stop();return;}
    root.querySelector('#tca-play').textContent="⏸ Pause";
    timer=setInterval(()=>{step=(step+1)%8;render();},1100);
  });
  render();
})();

(function(){
  const root = document.body;
  if(!root) return;

  // Collapsible reference toolkit
  const toggle=document.querySelector('.toolkit-toggle');
  const content=document.getElementById('metabolism-toolkit-content');
  if(toggle && content){
    toggle.addEventListener('click',()=>{
      const open=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!open));
      content.hidden=open;
    });
  }

  // Click-to-learn glossary
  const glossary={
    "ATP":["ATP","Adenosine triphosphate — the immediate phosphoryl-transfer energy source used to support cellular work such as muscle contraction."],
    "ATP-PCr":["ATP–PCr system","The phosphagen system. Phosphocreatine donates a phosphate to ADP through creatine kinase to rapidly resynthesise ATP."],
    "PCr":["Phosphocreatine (PCr)","A high-energy phosphate reserve in muscle that supports very rapid ATP resynthesis during high-power exercise."],
    "TCA":["TCA cycle","Tricarboxylic acid cycle, also called the Krebs or citric acid cycle. It generates NADH and FADH₂ that feed oxidative phosphorylation."],
    "Krebs cycle":["Krebs cycle","Another name for the TCA/citric acid cycle in the mitochondrial matrix."],
    "ETC":["Electron transport chain (ETC)","A series of respiratory protein complexes in the inner mitochondrial membrane that transfer electrons and help create the proton gradient used for ATP synthesis."],
    "VO₂":["VO₂","Oxygen uptake: the amount of oxygen consumed by the body per unit time. It reflects integrated oxygen delivery and utilisation."],
    "RER":["RER","Respiratory exchange ratio: VCO₂ divided by VO₂ measured at the lungs. Under appropriate steady-state conditions it can help estimate whole-body substrate oxidation."],
    "substrate":["Substrate","A molecule that enters a metabolic pathway and can be transformed to support energy production, such as glucose, fatty acids or amino acids."],
    "glycolysis":["Glycolysis","A cytosolic pathway that converts glucose or glycogen-derived carbohydrate to pyruvate while producing ATP and NADH."],
    "oxidative phosphorylation":["Oxidative phosphorylation","Mitochondrial ATP synthesis driven by the proton-motive force generated by electron transport."],
    "lactate":["Lactate","The reduced form of pyruvate produced by lactate dehydrogenase; its formation helps regenerate NAD⁺ and lactate can subsequently be oxidised."],
    "β-oxidation":["β-oxidation","A mitochondrial pathway that breaks fatty acids into acetyl-CoA units while generating NADH and FADH₂."],
    "acetyl-CoA":["Acetyl-CoA","A central metabolic intermediate that can enter the TCA cycle and links carbohydrate, fat and some amino-acid metabolism."]
  };

  function makeTerms(){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        const p=node.parentElement;
        if(!p || ['SCRIPT','STYLE','TEXTAREA','INPUT','BUTTON','OPTION'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        if(p.closest('.term,.term-popover,.tca-svg')) return NodeFilter.FILTER_REJECT;
        if(node.nodeValue.trim().length<3) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    // Longest first to avoid wrapping parts of multi-word terms.
    const keys=Object.keys(glossary).sort((a,b)=>b.length-a.length);
    nodes.forEach(node=>{
      let text=node.nodeValue, changed=false;
      const frag=document.createDocumentFragment();
      let cursor=0;
      const re=new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi');
      let match;
      while((match=re.exec(text))){
        const key=keys.find(k=>k.toLowerCase()===match[0].toLowerCase());
        if(!key) continue;
        if(match.index>cursor) frag.appendChild(document.createTextNode(text.slice(cursor,match.index)));
        const span=document.createElement('span');
        span.className='term';
        span.tabIndex=0;
        span.setAttribute('role','button');
        span.dataset.term=key;
        span.textContent=match[0];
        frag.appendChild(span);
        cursor=match.index+match[0].length;
        changed=true;
      }
      if(changed){
        if(cursor<text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        node.parentNode.replaceChild(frag,node);
      }
    });
  }

  let pop=null;
  function closePop(){if(pop){pop.remove();pop=null;}}
  function showPop(termEl){
    closePop();
    const key=termEl.dataset.term;
    const d=glossary[key];
    if(!d) return;
    pop=document.createElement('div');
    pop.className='term-popover';
    pop.innerHTML='<div class="term-type">Click-to-learn term</div><h4>'+d[0]+'</h4><div>'+d[1]+'</div>';
    document.body.appendChild(pop);
    const r=termEl.getBoundingClientRect();
    const x=Math.min(Math.max(15,r.left),window.innerWidth-375);
    const y=Math.min(r.bottom+8,window.innerHeight-180);
    pop.style.left=x+'px'; pop.style.top=Math.max(12,y)+'px';
    pop.addEventListener('click',e=>e.stopPropagation());
  }
  root.addEventListener('click',e=>{
    const term=e.target.closest('.term');
    if(term){e.stopPropagation();showPop(term);}
    else if(pop && !e.target.closest('.term-popover')) closePop();
  });
  root.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ') && e.target.classList.contains('term')){
      e.preventDefault();showPop(e.target);
    }
  });
  window.addEventListener('scroll',closePop,{passive:true});

  // Section continuity messages.
  const sections=[...document.querySelectorAll('main section[id]')];
  const bridges={
    pretest:["First, establish what you already know.","Now we can test those ideas against the physiology."],
    objectives:["We have a map of the learning goals.","Next, we need a real exercise problem that makes the metabolism necessary."],
    hook:["The athlete gives us the problem: different exercise demands require different ATP supply.","Next, we need to ask where the usable fuel comes from."],
    food:["Food provides the raw materials, but food itself does not directly power contraction.","Next, we need to follow those nutrients into the cell."],
    energy:["Substrates can only help when their energy is transferred into ATP.","Next, we need to see how ATP is continuously resynthesised."],
    metabolism:["Now we know how nutrients become cellular fuels.","Next, we start with the fastest route to ATP: the phosphagen system."],
    "atp-pcr":["We now have the rapid ATP solution.","Next, ask what happens when high ATP demand continues beyond the small PCr reserve."],
    glycolysis:["Glycolysis can rapidly supply ATP from carbohydrate.","Next, we need to explain the fate of pyruvate and why lactate appears."],
    pyruvate:["Pyruvate has more than one possible fate, and lactate is part of that story.","Next, follow pyruvate-derived carbon into mitochondrial metabolism."],
    tca:["The TCA cycle captures reducing equivalents and prepares electrons for the respiratory chain.","Next, we need to see how those electrons become ATP."],
    etc:["Oxidative phosphorylation links electron transfer to ATP synthesis.","Next, we compare this pathway with fat and protein metabolism."],
    fatprotein:["Now we have several fuel sources feeding the metabolic network.","Next, integrate them rather than treating the systems as separate boxes."],
    systems:["The key idea is contribution, not switching.","Next, place the systems on the real exercise continuum."],
    continuum:["Exercise demand continuously changes the relative contribution of pathways.","Next, follow one athlete through changing demands."],
    journey:["The athlete's metabolism changes from moment to moment.","Next, isolate what happens during the acute exercise response."],
    acute:["Exercise creates an immediate physiological response.","Next, ask how the body returns toward baseline."],
    recovery:["Recovery is an active physiological process.","Next, repeated recovery plus training creates adaptation."],
    adaptation:["Repeated exercise can remodel metabolic capacity.","Next, we need measurements that allow us to observe these changes."],
    monitor:["Measurements turn invisible metabolism into observable physiology.","Next, become the investigator and infer mechanisms from patterns."],
    detective:["Now we can reason from physiological clues.","Next, use the same reasoning on realistic cases."],
    cases:["Cases require mechanism-based decisions.","Next, the data will test whether your explanation fits the evidence."],
    data:["Data can support or challenge a physiological explanation.","Next, translate the interpretation into practical exercise decisions."],
    practical:["Physiology becomes useful when it changes what we assess, prescribe or monitor.","Next, build the complete concept map."],
    summary:["The concept map connects the entire chapter.","Next, demonstrate what you can now explain independently."],
    posttest:["The post-test checks whether the model has changed your understanding.","Next, reflect on what became clearer and what still needs work."],
    reflection:["Reflection closes the learning loop.","You can now return to the sections where you want a deeper explanation."]
  };
  sections.forEach((sec,i)=>{
    if(sec.id==='pretest' || sec.id==='posttest') return;
    const bridge=bridges[sec.id];
    if(!bridge) return;
    const box=document.createElement('div');
    box.className='continuity';
    box.innerHTML='<div class="label">Learning continuity</div><div class="now">Now you know: '+bridge[0]+'</div><div class="connector"></div><div class="next"><b>Next:</b> '+bridge[1]+'</div>';
    sec.appendChild(box);
  });

  // Exercise state simulator on the journey section.
  const journey=document.getElementById('journey');
  if(journey && !document.getElementById('exercise-state')){
    const el=document.createElement('div');
    el.className='exercise-state';
    el.id='exercise-state';
    el.innerHTML='<div class="exercise-state-head"><h3>🏃 See the metabolic state change</h3><p>Run the same athlete through rest, steady exercise and high-intensity work. The visual changes with the metabolic demand.</p></div><div class="exercise-state-body"><div class="state-scene"><div class="state-person resting" id="state-person" aria-label="Athlete at rest">🧍</div><div class="state-ground"></div></div><div class="state-buttons"><button type="button" data-state="rest" class="active">🧘 Rest</button><button type="button" data-state="steady">🚶 Steady exercise</button><button type="button" data-state="run">🏃 Run</button><button type="button" data-state="sprint">⚡ Sprint</button></div><div class="state-info" id="state-info">At rest, ATP demand is relatively low and oxidative metabolism supplies most ongoing ATP turnover.</div><div class="state-metrics"><div><b id="m-hr">Low</b>HR</div><div><b id="m-vo2">Low</b>VO₂</div><div><b id="m-carb">Moderate</b>Carbohydrate contribution</div><div><b id="m-fast">Low</b>Rapid ATP contribution</div></div></div>';
    journey.querySelector('.section-content, .content, .card, h2')?.parentElement?.appendChild(el) || journey.appendChild(el);
    const person=el.querySelector('#state-person');
    const info=el.querySelector('#state-info');
    const states={
      rest:{cls:'resting',icon:'🧍',text:'At rest, ATP demand is relatively low and oxidative metabolism supplies most ongoing ATP turnover.',hr:'Low',vo2:'Low',carb:'Moderate',fast:'Low'},
      steady:{cls:'resting',icon:'🚶',text:'During steady moderate exercise, oxygen uptake rises and carbohydrate and fat oxidation both contribute to ATP resynthesis.',hr:'↑',vo2:'↑',carb:'Moderate–High',fast:'Moderate'},
      run:{cls:'running',icon:'🏃',text:'As exercise intensity rises, ATP demand rises and rapid pathways contribute more while oxidative metabolism also increases.',hr:'High',vo2:'High',carb:'High',fast:'High'},
      sprint:{cls:'running',icon:'⚡',text:'During maximal sprinting, ATP demand and power output are extremely high, increasing the relative contribution of rapid ATP resynthesis pathways.',hr:'Very high',vo2:'Rising',carb:'Very high',fast:'Very high'}
    };
    el.querySelectorAll('[data-state]').forEach(btn=>btn.addEventListener('click',()=>{
      el.querySelectorAll('[data-state]').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const st=states[btn.dataset.state];
      person.className='state-person '+st.cls; person.textContent=st.icon;
      info.textContent=st.text;
      el.querySelector('#m-hr').textContent=st.hr; el.querySelector('#m-vo2').textContent=st.vo2;
      el.querySelector('#m-carb').textContent=st.carb; el.querySelector('#m-fast').textContent=st.fast;
    }));
  }

  makeTerms();
})();

/* ===== v5 learning + exam prep functions ===== */
function openFramework(btn,id){
  const fw=btn.closest('.framework');
  fw.querySelectorAll('.framework-tab').forEach(b=>b.classList.remove('active'));
  fw.querySelectorAll('.framework-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const panel=fw.querySelector('#'+CSS.escape(id)); if(panel) panel.classList.add('active');
}
function toggleExamPrep(on){
  document.body.classList.toggle('exam-prep',on);
  localStorage.setItem('tceExamPrep',on?'1':'0');
  const t=document.getElementById('examPrepToggle'); if(t)t.checked=on;
}
function setAnimSpeed(mode){
  document.body.classList.remove('anim-slow','anim-fast');
  if(mode==='anim-slow')document.body.classList.add('anim-slow');
  if(mode==='anim-fast')document.body.classList.add('anim-fast');
}
function downloadRevision(id){
  const sec=document.getElementById(id); if(!sec)return;
  const summary=sec.querySelector('.exam-summary'); if(!summary)return;
  const title=(sec.querySelector('h2')?.innerText||id).trim();
  const html='<!doctype html><html><head><meta charset="utf-8"><title>'+title+' — TCE504 Revision</title><style>body{font-family:Arial,sans-serif;max-width:850px;margin:40px auto;padding:20px;line-height:1.6;color:#222}h1,h2,h3{color:#53257f}.box{border:1px solid #ddd;border-radius:12px;padding:14px;margin:12px 0}strong{color:#53257f}@media print{body{margin:10mm}}</style></head><body><h1>TCE504 Applied Exercise Physiology</h1><h2>'+title+'</h2>'+summary.innerHTML.replace(/<div class="revision-actions">[\s\S]*?<\/div>/,'')+'</body></html>';
  const blob=new Blob([html],{type:'text/html;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='TCE504_'+id+'_Revision_Summary.html'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
document.addEventListener('DOMContentLoaded',()=>{
  const saved=localStorage.getItem('tceExamPrep')==='1';
  if(saved)toggleExamPrep(true);
});

(function(){
const NS='http://www.w3.org/2000/svg';
const purple='#53257f', gold='#ffb703', blue='#2563eb', green='#16845b', red='#c0392b', ink='#1f2937', pale='#faf8fd';
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function box(x,y,w,h,title,sub='',fill='#fff',stroke='#d8cde4',tc=ink){return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x+w/2}" y="${y+30}" text-anchor="middle" font-weight="800" font-size="15" fill="${tc}">${esc(title)}</text>${sub?`<text x="${x+w/2}" y="${y+52}" text-anchor="middle" font-size="12" fill="#64748b">${esc(sub)}</text>`:''}</g>`}
function arrow(x1,y1,x2,y2,color=purple){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="5" marker-end="url(#arr)"/>`}
function svgWrap(inner,w=1000,h=300,defs=''){return `<svg class="v6-svg" viewBox="0 0 ${w} ${h}" role="img"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${purple}"/></marker>${defs}</defs>${inner}</svg>`}
function flow(nodes){let x=30, out=''; const w=150,gap=38; nodes.forEach((n,i)=>{out+=box(x,80,w,95,n[0],n[1],n[2]||'#fff',n[3]||'#d8cde4',n[4]||ink); if(i<nodes.length-1)out+=arrow(x+w+5,127,x+w+gap-5,127); x+=w+gap});return svgWrap(out, nodes.length*(w+gap)+30,260)}
function glycolysis(){let inner=box(25,75,155,105,'GLUCOSE','6-C','#fff',gold)+arrow(185,127,225,127)+box(235,75,155,105,'INVESTMENT','−2 ATP','#fff8df',gold)+arrow(395,127,435,127)+box(445,75,155,105,'CLEAVAGE','2 × 3-C','#fff',purple)+arrow(605,127,645,127)+box(655,75,155,105,'PAYOFF','+4 ATP + 2 NADH','#eef7ff',blue)+arrow(815,127,855,127)+box(865,75,110,105,'2 PYRUVATE','2 × 3-C','#eef8f2',green);inner+=`<path d="M920 180 C920 235 770 235 770 180" fill="none" stroke="${red}" stroke-width="4" marker-end="url(#arr)"/><text x="845" y="250" text-anchor="middle" font-size="13" font-weight="800" fill="${red}">High glycolytic demand → lactate branch</text>`;return svgWrap(inner,1000,280)}
function tca(){const pts=[[500,45,'Citrate','6C'],[710,105,'Isocitrate','6C'],[675,220,'α-KG','5C'],[500,265,'Succinyl-CoA','4C'],[325,220,'Succinate','4C'],[290,105,'Fumarate','4C'],[500,45,'Oxaloacetate','4C']];let out=`<circle cx="500" cy="155" r="120" fill="#faf8fd" stroke="#d8cde4" stroke-width="4"/>`; const labels=[[500,45,'Citrate','6C'],[710,105,'Isocitrate','6C'],[675,220,'α-KG','5C'],[500,265,'Succinyl-CoA','4C'],[325,220,'Succinate','4C'],[290,105,'Fumarate','4C'],[500,155,'Malate → Oxaloacetate','4C']]; labels.forEach((p,i)=>{out+=box(p[0]-70,p[1]-28,140,56,p[2],p[3],i===0?'#fff8df':'#fff',i===0?gold:'#cfc1dc')});out+=arrow(570,50,670,92)+arrow(710,140,690,195)+arrow(620,235,570,250)+arrow(430,250,365,235)+arrow(310,195,300,140)+arrow(330,90,430,50);out+=`<text x="785" y="45" font-size="14" font-weight="800" fill="${red}">CO₂ ×2</text><text x="785" y="75" font-size="14" font-weight="800" fill="${blue}">NADH ×3</text><text x="785" y="105" font-size="14" font-weight="800" fill="${green}">FADH₂ ×1</text><text x="785" y="135" font-size="14" font-weight="800" fill="${purple}">GTP/ATP ×1</text><text x="500" y="157" text-anchor="middle" font-size="18" font-weight="900" fill="${purple}">TCA CYCLE</text><text x="500" y="178" text-anchor="middle" font-size="12" fill="#64748b">mitochondrial matrix</text>`;return svgWrap(out,1000,310)}
function etc(){let out=`<rect x="80" y="55" width="840" height="205" rx="24" fill="#f7f8ff" stroke="#d8cde4" stroke-width="3"/><text x="500" y="82" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">INNER MITOCHONDRIAL MEMBRANE</text>`;[[150,'Complex I'],[320,'Complex III'],[490,'Complex IV']].forEach((a,i)=>{out+=box(a[0],120,110,65,a[1],i===0?'NADH electrons':i===2?'O₂ → H₂O':'electron transfer','#fff',blue)});out+=arrow(260,152,315,152)+arrow(430,152,485,152);for(let x of [180,350,520,690])out+=`<text x="${x}" y="108" font-size="22" fill="${blue}">H⁺ ↑</text>`;out+=box(690,120,150,65,'ATP SYNTHASE','H⁺ flow → ATP','#fff8df',gold);out+=`<text x="500" y="225" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">Electron flow → proton gradient → ATP synthesis</text>`;return svgWrap(out,1000,290)}
function fat(){let out=box(25,75,150,90,'TRIGLYCERIDE','stored fat','#fff8df',gold)+arrow(180,120,215,120)+box(225,75,150,90,'FATTY ACIDS','mobilised','#fff',gold)+arrow(380,120,415,120)+box(425,65,180,110,'β-OXIDATION','2-carbon units removed','#eef7ff',blue)+arrow(610,120,645,120)+box(655,75,150,90,'ACETYL-CoA','enters TCA','#eef8f2',green)+arrow(810,120,845,120)+box(855,75,110,90,'ETC','ATP','#f6effb',purple);for(let i=0;i<4;i++)out+=`<circle cx="455" cy="205" r="9" fill="${purple}"/><text x="475" y="210" font-size="12" fill="#64748b">C-chain −2C</text>`;return svgWrap(out,1000,260)}
function food(){return flow([['CARBOHYDRATE','glucose / glycogen','#fff8df',gold],['FAT','fatty acids / TAG','#fff',gold],['PROTEIN','amino acids','#fff',blue],['SUBSTRATES','available to tissue','#eef8f2',green]])}
function energy(){let out=box(60,95,170,80,'ATP','immediate work','#fff8df',gold)+arrow(240,135,315,135)+box(330,95,170,80,'ADP + Pi','after hydrolysis','#eef7ff',blue)+arrow(510,135,585,135)+box(600,95,170,80,'ATP RESYNTHESIS','multiple pathways','#eef8f2',green)+`<path d="M685 185 C685 240 145 240 145 185" fill="none" stroke="${purple}" stroke-width="5" marker-end="url(#arr)"/><text x="415" y="228" text-anchor="middle" font-weight="800" fill="${purple}">ATP demand ↔ continuous ATP resynthesis</text>`;return svgWrap(out,900,270)}
function metabolism(){return flow([['DIGESTION','break food down'],['ABSORPTION','enter blood / lymph'],['DELIVERY','circulation'],['CELLULAR UPTAKE','muscle cell'],['PATHWAY','ATP resynthesis']])}
function atppcr(){let out=box(50,80,160,85,'ATP','immediate energy','#fff8df',gold)+arrow(220,122,300,122)+box(315,80,170,85,'ADP + Pi','needs phosphate','#eef7ff',blue)+arrow(495,122,575,122)+box(590,80,170,85,'PCr → Cr','phosphate donor','#f6effb',purple)+arrow(770,122,850,122)+box(865,80,100,85,'ATP','rapidly restored','#eef8f2',green);out+=`<text x="500" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">Very high ATP-regeneration rate • small capacity</text>`;return svgWrap(out,1000,270)}
function pyruvate(){let out=box(60,95,180,85,'PYRUVATE','branch point','#fff8df',gold)+arrow(250,120,390,80)+box(405,35,200,80,'LACTATE','NAD⁺ regenerated','#feecec',red)+arrow(250,155,390,190)+box(405,160,200,80,'ACETYL-CoA','mitochondrial oxidation','#eef8f2',green);out+=`<text x="705" y="70" font-size="14" font-weight="800" fill="${red}">High glycolytic flux</text><text x="705" y="100" font-size="13" fill="#64748b">pyruvate → lactate supports continued glycolysis</text><text x="705" y="190" font-size="14" font-weight="800" fill="${green}">Aerobic pathway</text><text x="705" y="220" font-size="13" fill="#64748b">pyruvate → acetyl-CoA → TCA → ETC</text>`;return svgWrap(out,1000,280)}
function systems(){let out=box(45,55,200,70,'ATP-PCr','fastest rate','#f6effb',purple)+box(400,55,200,70,'GLYCOLYSIS','rapid carbohydrate','#fff8df',gold)+box(755,55,200,70,'OXIDATIVE','large capacity','#eef8f2',green);out+=`<path d="M145 160 Q500 250 855 160" fill="none" stroke="${purple}" stroke-width="7" opacity=".7"/><text x="500" y="220" text-anchor="middle" font-size="16" font-weight="900" fill="${purple}">ALL CONTRIBUTE — relative contribution changes with demand and time</text>`;return svgWrap(out,1000,270)}
function continuum(){let out=`<line x1="90" y1="180" x2="910" y2="180" stroke="#cfc1dc" stroke-width="8"/>`;[['Rest',100],['Walk',260],['Jog',420],['400 m',580],['5 km',740],['Marathon',900]].forEach((a,i)=>{out+=`<circle cx="${a[1]}" cy="180" r="18" fill="${i>2?gold:purple}"/><text x="${a[1]}" y="145" text-anchor="middle" font-weight="800" font-size="13">${a[0]}</text>`});out+=`<text x="500" y="240" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">As demand rises, rapid pathways contribute more; sustained exercise increases the importance of oxidative metabolism</text>`;return svgWrap(out,1000,280)}
function journey(){let out=`<path d="M80 210 C200 80 340 80 470 170 S730 260 900 90" fill="none" stroke="${purple}" stroke-width="7"/>`;[['REST',90,210],['ONSET',300,105],['SUSTAINED',550,205],['RECOVERY',850,110]].forEach(a=>{out+=`<circle cx="${a[1]}" cy="${a[2]}" r="20" fill="${gold}"/><text x="${a[1]}" y="${a[2]-32}" text-anchor="middle" font-size="13" font-weight="800">${a[0]}</text>`});out+=`<text x="500" y="270" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">Demand changes → ATP pathways respond → physiological variables change → recovery follows</text>`;return svgWrap(out,1000,300)}
function acute(){let out=box(390,25,220,65,'EXERCISE DEMAND','speed / power / duration','#fff8df',gold);const arr=[['❤️ HR','↑ cardiac output',70,125],['🫁 VENTILATION','↑ gas exchange',330,125],['🩸 DELIVERY','O₂ + substrates',590,125],['💪 MUSCLE','↑ ATP demand',850,125]];arr.forEach(a=>out+=box(a[2]-75,a[3],150,75,a[0],a[1],'#fff','#d8cde4'));out+=arrow(500,95,145,120)+arrow(500,95,405,120)+arrow(500,95,665,120)+arrow(500,95,925,120);out+=`<text x="500" y="250" text-anchor="middle" font-size="15" font-weight="900" fill="${purple}">Acute response = coordinated cardiovascular + respiratory + metabolic + muscular adjustments</text>`;return svgWrap(out,1000,285)}
function recovery(){let out=`<line x1="90" y1="235" x2="920" y2="235" stroke="#bbb"/><line x1="90" y1="70" x2="90" y2="235" stroke="#bbb"/>`;const curves=[['HR',gold,'M90 95 C250 100 280 150 450 190 S750 220 900 230'],['VO₂',blue,'M90 115 C240 120 300 170 480 200 S760 220 900 232'],['Lactate',red,'M90 225 C200 220 280 150 390 155 S600 195 900 228'],['PCr',green,'M90 220 C210 205 300 175 430 125 S700 100 900 85']];curves.forEach(c=>out+=`<path d="${c[2]}" fill="none" stroke="${c[1]}" stroke-width="5"/><text x="${905}" y="${c[2].includes('95')?85:c[0]==='VO₂'?115:c[0]==='Lactate'?175:60}" text-anchor="end" font-weight="800" fill="${c[1]}">${c[0]}</text>`);out+=`<text x="500" y="265" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">Different recovery processes have different time courses</text>`;return svgWrap(out,1000,300)}
function adaptation(){let out=box(55,75,220,100,'REPEATED TRAINING','stimulus','#fff8df',gold)+arrow(290,125,365,125)+box(380,75,220,100,'ADAPTATION','mitochondria • capillaries • function','#eef8f2',green)+arrow(615,125,690,125)+box(705,75,220,100,'NEW RESPONSE','lower strain / improved capacity','#eef7ff',blue);out+=`<text x="500" y="225" text-anchor="middle" font-size="14" font-weight="800" fill="${purple}">The same external workload can produce a different internal response after training</text>`;return svgWrap(out,1000,270)}
function monitor(){let out=box(45,45,220,75,'EXTERNAL LOAD','speed • power • distance','#fff8df',gold)+arrow(280,82,370,82)+box(385,45,220,75,'INTERNAL RESPONSE','HR • VO₂ • RPE • lactate','#eef7ff',blue)+arrow(620,82,710,82)+box(725,45,220,75,'INTERPRETATION','mechanism + context','#eef8f2',green);out+=box(250,155,500,70,'EXERCISE SCIENTIST QUESTION','What happened? Why? What should we change?','#f6effb',purple);return svgWrap(out,1000,270)}
function detective(){let out=box(35,80,150,80,'DEMAND','intensity / duration','#fff8df',gold);out+=arrow(195,120,245,120)+box(260,80,150,80,'FUEL','substrate','#fff',gold)+arrow(420,120,470,120)+box(485,80,150,80,'PATHWAY','ATP rate','#f6effb',purple)+arrow(645,120,695,120)+box(710,80,150,80,'MEASURE','HR / VO₂ / lactate','#eef7ff',blue)+arrow(870,120,920,120)+`<text x="965" y="125" font-size="13" font-weight="800" fill="${green}">DECIDE</text>`;return svgWrap(out,1000,250)}
function cases(){let out=box(70,70,180,90,'CASE','athlete / patient','#fff8df',gold)+arrow(265,115,330,115)+box(345,70,180,90,'PREDICT','what should happen?','#f6effb',purple)+arrow(540,115,605,115)+box(620,70,180,90,'EVIDENCE','data / variables','#eef7ff',blue)+arrow(815,115,880,115)+box(895,70,80,90,'DECIDE','apply','#eef8f2',green);return svgWrap(out,1000,240)}
function data(){let out=`<line x1="90" y1="235" x2="920" y2="235" stroke="#9ca3af"/><line x1="90" y1="55" x2="90" y2="235" stroke="#9ca3af"/><path d="M110 220 L250 205 L390 180 L530 145 L670 105 L820 65" fill="none" stroke="${blue}" stroke-width="6"/>`;[[110,220],[250,205],[390,180],[530,145],[670,105],[820,65]].forEach(p=>out+=`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="${blue}"/>`);out+=`<text x="500" y="265" text-anchor="middle" font-weight="800" fill="${purple}">Workload ↑ → VO₂ generally ↑ within the physiological range</text><text x="20" y="75" font-size="12" fill="#64748b" transform="rotate(-90 20 75)">VO₂</text><text x="900" y="255" font-size="12" fill="#64748b">Workload →</text>`;return svgWrap(out,1000,290)}
function practical(){let out=box(35,70,150,85,'ASSESS','baseline','#fff', '#d8cde4')+arrow(195,112,235,112)+box(250,70,150,85,'INTERPRET','mechanism','#f6effb',purple)+arrow(410,112,450,112)+box(465,70,150,85,'PRESCRIBE','dose','#fff8df',gold)+arrow(625,112,665,112)+box(680,70,150,85,'MONITOR','response','#eef7ff',blue)+arrow(840,112,880,112)+box(895,70,80,85,'ADJUST','next','#eef8f2',green);return svgWrap(out,1000,230)}
function summary(){let out=box(30,80,140,70,'FOOD','substrates','#fff8df',gold)+arrow(180,115,220,115)+box(235,80,140,70,'PATHWAYS','ATP','#f6effb',purple)+arrow(385,115,425,115)+box(440,80,140,70,'DEMAND','exercise','#fff',purple)+arrow(590,115,630,115)+box(645,80,140,70,'RESPONSE','measure','#eef7ff',blue)+arrow(795,115,835,115)+box(850,80,120,70,'ADAPT','perform','#eef8f2',green);return svgWrap(out,1000,230)}
function hook(){return flow([['ATHLETE','task changes'],['ATP DEMAND','rises'],['PATHWAYS','contribute'],['RESPONSE','HR • VO₂ • RPE'],['QUESTION','why?']])}
function objectives(){return flow([['KNOW','concept'],['SEE','mechanism'],['MEASURE','variables'],['APPLY','exercise'],['EXPLAIN','clinical lens']])}
const visualizers={objectives,hook,food,energy,metabolism,'atp-pcr':atppcr,glycolysis,pyruvate,tca,etc,fatprotein,systems,continuum,journey,acute,recovery,adaptation,monitor,detective,cases,data,practical,summary};
const titles={objectives:'LEARNING ROADMAP',hook:'THE ATHLETE QUESTION',food:'FOOD → SUBSTRATES',energy:'ATP DEMAND ↔ ATP RESYNTHESIS',metabolism:'FOOD → DIGESTION → CELLULAR FUEL','atp-pcr':'ATP-PCr: RAPID PHOSPHATE TRANSFER',glycolysis:'GLYCOLYSIS: 3 FUNCTIONAL PHASES',pyruvate:'PYRUVATE: A METABOLIC BRANCH POINT',tca:'KREBS / TCA: FOLLOW THE CARBON + ELECTRON CARRIERS',etc:'ETC: ELECTRONS → PROTON GRADIENT → ATP',fatprotein:'FAT OXIDATION: β-OXIDATION → ACETYL-CoA',systems:'ALL ENERGY SYSTEMS CONTRIBUTE',continuum:'EXERCISE CONTINUUM',journey:'FOLLOW ONE ATHLETE THROUGH TIME',acute:'ACUTE EXERCISE RESPONSE',recovery:'RECOVERY KINETICS',adaptation:'TRAINING → ADAPTATION',monitor:'EXERCISE SCIENCE MONITORING',detective:'METABOLISM DETECTIVE REASONING',cases:'CASE-BASED REASONING',data:'DATA INTERPRETATION',practical:'PHYSIOLOGY → PRACTICE',summary:'THE COMPLETE PHYSIOLOGY MAP'};
const captions={glycolysis:'The pathway is shown as a functional teaching model: investment → cleavage → payoff. The visual emphasises ATP accounting and the pyruvate/lactate branch.',tca:'Carbon is tracked through one turn of the cycle. The key teaching point is that NADH and FADH₂ carry reducing equivalents toward oxidative phosphorylation.',etc:'The respiratory chain uses electron transfer to establish a proton gradient; ATP synthase uses that gradient to support ATP formation.',fatprotein:'Fatty acids are progressively shortened during β-oxidation, generating acetyl-CoA and reducing equivalents that feed mitochondrial oxidative metabolism.',recovery:'Recovery is multi-process: different physiological variables return toward baseline on different time scales.'};
function installVisual(id,sec){const old=sec.querySelector('.visual-map'); if(!old)return; old.classList.add('v6-visual'); old.innerHTML=`<div class="v6-head"><h3>🖼️ VISUAL: ${titles[id]||id}</h3><p>See the physiology before reading the explanation.</p></div><div class="v6-canvas">${visualizers[id]()}</div>${captions[id]?`<div class="v6-caption">${captions[id]}</div>`:''}`;}
function addDataLabs(){
 const acute=document.getElementById('acute'); if(acute&&!acute.querySelector('.v6-data-lab')){const d=document.createElement('div');d.className='v6-data-lab interactive-only';d.innerHTML=`<h3>📈 DATA LAB — ACUTE RESPONSE</h3><p>Watch how physiological responses rise as exercise demand increases. This is a conceptual teaching graph; the exact response depends on the individual and protocol.</p><div class="v6-chart"><svg viewBox="0 0 900 300"><line x1="70" y1="245" x2="850" y2="245" stroke="#9ca3af"/><line x1="70" y1="40" x2="70" y2="245" stroke="#9ca3af"/><path d="M90 225 L220 205 L360 170 L510 125 L670 80 L820 50" fill="none" stroke="#53257f" stroke-width="5"/><path d="M90 235 L220 225 L360 195 L510 155 L670 115 L820 80" fill="none" stroke="#2563eb" stroke-width="5"/><text x="830" y="42" fill="#53257f" font-weight="800">HR</text><text x="830" y="76" fill="#2563eb" font-weight="800">VO₂</text><text x="450" y="280" text-anchor="middle" fill="#64748b">Increasing external exercise demand → physiological response</text></svg></div><div class="v6-question"><b>Think:</b> Why do both curves rise, but not necessarily at the same rate?</div><button class="v6-reveal" type="button">Reveal reasoning</button><div class="v6-answer">Heart rate and oxygen consumption are related but represent different physiological processes. Interpretation should consider exercise intensity, duration, fitness, modality and individual response.</div>`;const r=d.querySelector('.v6-reveal');r.onclick=()=>{d.querySelector('.v6-answer').classList.toggle('show');r.textContent=d.querySelector('.v6-answer').classList.contains('show')?'Hide reasoning':'Reveal reasoning'};acute.appendChild(d)}
 const rec=document.getElementById('recovery'); if(rec&&!rec.querySelector('.v6-data-lab')){const d=document.createElement('div');d.className='v6-data-lab interactive-only';d.innerHTML=`<h3>📈 DATA LAB — RECOVERY</h3><p>Compare the conceptual recovery patterns of HR, VO₂, lactate and PCr.</p><div class="v6-chart"><svg viewBox="0 0 900 300"><line x1="70" y1="245" x2="850" y2="245" stroke="#9ca3af"/><line x1="70" y1="40" x2="70" y2="245" stroke="#9ca3af"/><path d="M90 70 C200 120 320 180 820 235" fill="none" stroke="#ffb703" stroke-width="5"/><path d="M90 95 C210 140 360 195 820 235" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M90 225 C200 205 260 120 390 150 C560 185 690 215 820 235" fill="none" stroke="#c0392b" stroke-width="5"/><path d="M90 230 C220 215 360 160 500 105 C650 70 750 65 820 65" fill="none" stroke="#16845b" stroke-width="5"/><text x="830" y="230" fill="#ffb703" font-weight="800">HR</text><text x="830" y="210" fill="#2563eb" font-weight="800">VO₂</text><text x="830" y="190" fill="#c0392b" font-weight="800">Lactate</text><text x="830" y="70" fill="#16845b" font-weight="800">PCr</text><text x="450" y="280" text-anchor="middle" fill="#64748b">Time after exercise →</text></svg></div><div class="v6-question"><b>Think:</b> Why don't all recovery variables return to baseline together?</div><button class="v6-reveal" type="button">Reveal reasoning</button><div class="v6-answer">Recovery involves several processes—including PCr resynthesis, lactate handling, restoration of oxygen stores and replenishment of energy substrates—that have different kinetics.</div>`;const r=d.querySelector('.v6-reveal');r.onclick=()=>{d.querySelector('.v6-answer').classList.toggle('show');r.textContent=d.querySelector('.v6-answer').classList.contains('show')?'Hide reasoning':'Reveal reasoning'};rec.appendChild(d)}
 const data=document.getElementById('data'); if(data&&!data.querySelector('.v6-data-lab')){const d=document.createElement('div');d.className='v6-data-lab interactive-only';d.innerHTML=`<h3>🧪 DATA INTERPRETATION LAB</h3><p>Use the graph as evidence. Do not jump straight to naming a pathway.</p><div class="v6-chart"><svg viewBox="0 0 900 300"><line x1="70" y1="245" x2="850" y2="245" stroke="#9ca3af"/><line x1="70" y1="40" x2="70" y2="245" stroke="#9ca3af"/><path d="M90 225 L220 210 L350 190 L480 160 L610 115 L760 70 L830 55" fill="none" stroke="#2563eb" stroke-width="6"/><circle cx="90" cy="225" r="7" fill="#2563eb"/><circle cx="220" cy="210" r="7" fill="#2563eb"/><circle cx="350" cy="190" r="7" fill="#2563eb"/><circle cx="480" cy="160" r="7" fill="#2563eb"/><circle cx="610" cy="115" r="7" fill="#2563eb"/><circle cx="760" cy="70" r="7" fill="#2563eb"/><circle cx="830" cy="55" r="7" fill="#2563eb"/><text x="450" y="280" text-anchor="middle" fill="#64748b">External workload →</text><text x="25" y="90" fill="#64748b" transform="rotate(-90 25 90)">VO₂</text></svg></div><div class="v6-question"><b>Question:</b> What general relationship does the graph show, and what additional variable would help you interpret it?</div><button class="v6-reveal" type="button">Reveal reasoning</button><div class="v6-answer">VO₂ generally rises with increasing workload within the relevant physiological range. Context such as time, modality, HR, RPE and individual fitness helps determine what the response means.</div>`;const r=d.querySelector('.v6-reveal');r.onclick=()=>{d.querySelector('.v6-answer').classList.toggle('show');r.textContent=d.querySelector('.v6-answer').classList.contains('show')?'Hide reasoning':'Reveal reasoning'};data.appendChild(d)}
}
function install(){Object.keys(visualizers).forEach(id=>{const sec=document.getElementById(id);if(sec)installVisual(id,sec)});addDataLabs();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
