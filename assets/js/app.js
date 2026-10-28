const posts=[
  {title:'A little behind the scenes 🎬',format:'Reel',reach:28400,likes:2180,comments:184,saves:412,engagement:'9.8%',emoji:'🎥',theme:'',date:'Oct 25'},
  {title:'3 things I wish I knew sooner',format:'Carousel',reach:19200,likes:1420,comments:97,saves:683,engagement:'8.1%',emoji:'📑',theme:'t2',date:'Oct 22'},
  {title:'Sunday mood ✨',format:'Image',reach:11700,likes:980,comments:63,saves:109,engagement:'6.4%',emoji:'📸',theme:'t3',date:'Oct 19'},
  {title:'Come create with me',format:'Reel',reach:24300,likes:1940,comments:201,saves:508,engagement:'10.2%',emoji:'🎥',theme:'',date:'Oct 16'},
  {title:'Your weekly reminder',format:'Carousel',reach:14500,likes:1010,comments:88,saves:352,engagement:'7.3%',emoji:'📑',theme:'t2',date:'Oct 12'},
  {title:'Golden hour details',format:'Image',reach:8900,likes:710,comments:42,saves:81,engagement:'5.9%',emoji:'📸',theme:'t3',date:'Oct 08'}
];

const pages=['overview','content','audience','insights','connect','settings'];
const labels={overview:'Overview',content:'Content performance',audience:'Audience',insights:'AI insights',connect:'Connect Instagram',settings:'Preferences'};

function fmt(n){return new Intl.NumberFormat('en-US').format(n)}
function compact(n){return n>=1000?(n/1000).toFixed(1)+'K':String(n)}

function showToast(msg){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

function navigate(page){
  if(!pages.includes(page))page='overview';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));
  const targetPage = document.getElementById('page-'+page);
  if(targetPage) targetPage.classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
  const crumb = document.getElementById('crumb');
  if(crumb) crumb.textContent=labels[page];
  document.title=labels[page]+' - InstaPulse';
  const sidebar = document.getElementById('sidebar');
  if(sidebar) sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  const page=a.dataset.page;
  navigate(page);
  history.replaceState(null,'','#'+page);
}));

window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)||'overview'));

function renderPosts(){
  const top=document.getElementById('topPosts');
  if(top){
    top.innerHTML=posts.slice(0,3).map(p=>`<div class="post-row"><div class="post-thumb ${p.theme}">${p.emoji}</div><div class="post-info"><strong>${p.title}</strong><small>${p.format} • ${p.date}</small></div><div class="post-stats">${compact(p.reach)}<small>reach</small></div></div>`).join('');
  }
  renderContent();
}

function renderContent(){
  const filter=document.getElementById('contentFilter')?.value||'all';
  const rows=document.getElementById('contentRows');
  if(!rows)return;
  rows.innerHTML=posts.filter(p=>filter==='all'||p.format===filter).map(p=>`<tr><td><div class="table-post"><div class="post-thumb ${p.theme}">${p.emoji}</div><div><strong>${p.title}</strong><small>${p.date}, 2026</small></div></div></td><td><span class="format-pill">${p.format}</span></td><td>${fmt(p.reach)}</td><td>${fmt(p.likes)}</td><td>${fmt(p.comments)}</td><td>${fmt(p.saves)}</td><td class="table-engagement">${p.engagement}</td></tr>`).join('');
}

function renderHeatmap(){
  const heat=document.getElementById('heatmap');
  if(!heat)return;
  const vals=[1,1,2,3,2,1,1,1,2,3,4,3,2,1,1,2,3,3,4,3,2,1,1,2,3,4,4,3,2,1,1,2,3,4,4,3,2,1,1,1,2,3,3,2,1,1];
  const timeLabels=['6 AM','9 AM','12 PM','3 PM','6 PM','9 PM'];
  heat.innerHTML='';
  for(let r=0;r<6;r++){
    const label=document.createElement('span');
    label.className='hour-label';
    label.textContent=timeLabels[r];
    heat.appendChild(label);
    for(let c=0;c<7;c++){
      const cell=document.createElement('span');
      cell.className='heat-cell '+(vals[r*7+c]?'l'+vals[r*7+c]:'');
      cell.title=timeLabels[r]+' • '+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][c]+' (sample activity)';
      heat.appendChild(cell);
    }
  }
}

function updatePeriod(){
  const selectElem = document.getElementById('periodSelect');
  if(!selectElem) return;
  const days=Number(selectElem.value);
  const mult=days===7?.27:days===90?2.8:1;
  
  const reachVal = document.getElementById('reachValue');
  if(reachVal) reachVal.textContent=compact(Math.round(84200*mult));
  
  const engVal = document.getElementById('engagementValue');
  if(engVal) engVal.innerHTML=(5.84*(days===7?1.04:days===90?.94:1)).toFixed(2)+'<span class="unit">%</span>';
  
  const folVal = document.getElementById('followersValue');
  if(folVal) folVal.textContent=fmt(Math.round(12480*(days===7?.99:days===90?1.17:1)));
  
  const intVal = document.getElementById('interactionsValue');
  if(intVal) intVal.textContent=fmt(Math.round(6391*(days===7?.25:days===90?2.6:1)));
  
  const todayLbl = document.getElementById('todayLabel');
  if(todayLbl) todayLbl.textContent=days===7?'Last 7 days':days===90?'Last 90 days':'Last 30 days';
  
  showToast('Showing illustrative '+days+'-day sample metrics.');
}

const periodSelect = document.getElementById('periodSelect');
if(periodSelect) periodSelect.addEventListener('change',updatePeriod);

const contentFilter = document.getElementById('contentFilter');
if(contentFilter) contentFilter.addEventListener('change',renderContent);

const menuBtn = document.getElementById('menuBtn');
if(menuBtn) menuBtn.addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));

const helpBtn = document.getElementById('helpBtn');
if(helpBtn) helpBtn.addEventListener('click',()=>document.getElementById('helpModal').classList.remove('hidden'));

function closeModal(){
  const helpModal = document.getElementById('helpModal');
  if(helpModal) helpModal.classList.add('hidden');
}
const closeModalBtn = document.getElementById('closeModal');
if(closeModalBtn) closeModalBtn.addEventListener('click',closeModal);

const modalDone = document.getElementById('modalDone');
if(modalDone) modalDone.addEventListener('click',closeModal);

const helpModal = document.getElementById('helpModal');
if(helpModal) helpModal.addEventListener('click',e=>{if(e.target.id==='helpModal')closeModal()});

const setupInfoBtn = document.getElementById('setupInfoBtn');
if(setupInfoBtn){
  setupInfoBtn.addEventListener('click',()=>{
    const el=document.getElementById('setupChecklist');
    if(!el) return;
    el.classList.toggle('hidden');
    setupInfoBtn.innerHTML=el.classList.contains('hidden')?'Show setup checklist <span>↓</span>':'Hide setup checklist ↑';
  });
}

const exportBtn = document.getElementById('exportBtn');
if(exportBtn){
  exportBtn.addEventListener('click',()=>{
    const csv=[['Post','Format','Reach','Likes','Comments','Saves','Engagement'],...posts.map(p=>[p.title,p.format,p.reach,p.likes,p.comments,p.saves,p.engagement])].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='instapulse-demo-report.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Demo report exported as CSV.');
  });
}

const compactToggle=document.getElementById('compactToggle');
if(compactToggle){
  compactToggle.addEventListener('change',()=>{
    document.body.classList.toggle('expanded-numbers',!compactToggle.checked);
    showToast('Number display preference updated.');
  });
}

const motionToggle = document.getElementById('motionToggle');
if(motionToggle){
  motionToggle.addEventListener('change',e=>{
    document.body.classList.toggle('reduce-motion',e.target.checked);
    showToast(e.target.checked?'Reduced motion enabled.':'Animations restored.');
  });
}

const demoToggle = document.getElementById('demoToggle');
if(demoToggle){
  demoToggle.addEventListener('change',e=>{
    document.querySelectorAll('.demo-banner').forEach(el=>el.classList.toggle('hidden',!e.target.checked));
    showToast('Demo label preference updated.');
  });
}

const resetBtn = document.getElementById('resetBtn');
if(resetBtn){
  resetBtn.addEventListener('click',()=>{
    if(compactToggle) compactToggle.checked=true;
    if(motionToggle) motionToggle.checked=false;
    if(demoToggle) demoToggle.checked=true;
    document.body.classList.remove('reduce-motion','expanded-numbers');
    document.querySelectorAll('.demo-banner').forEach(el=>el.classList.remove('hidden'));
    if(periodSelect) periodSelect.value='30';
    updatePeriod();
    showToast('Preferences reset.');
  });
}

// --- Instagram Login Trigger ---
document.addEventListener('DOMContentLoaded', () => {
  const metaLoginBtn = document.getElementById('metaLoginBtn');
  if (metaLoginBtn) {
    metaLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "https://instapulse-backend.onrender.com/auth/meta/start";
    });
  }
});

renderPosts();
renderHeatmap();
if(location.hash)navigate(location.hash.slice(1));
