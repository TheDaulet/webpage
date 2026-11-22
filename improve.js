(function(){
const css=`
:root{--bg:#f5f7f8;--card:#fff;--tx:#14202b;--mu:#5d6b77;--ln:#dbe3e8;--ac:#0a7a94;--au:#e0a800}
@media(prefers-color-scheme:dark){:root{--bg:#10181e;--card:#17222a;--tx:#e6eef2;--mu:#93a4b0;--ln:#26343e;--ac:#4cc3dc;--au:#f0be2c}}
html body{background:var(--bg)!important;color:var(--tx)!important;margin:0;font:16px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.orig{display:none!important}
#app{max-width:760px;margin:0 auto;padding:0 14px 40px}
#app h1{font-size:22px;line-height:1.25;margin:18px 0 12px;text-align:left}
.bar{position:sticky;top:0;background:var(--bg);padding:8px 0 10px;z-index:3;border-bottom:1px solid var(--ln)}
#q{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid var(--ln);border-radius:10px;background:var(--card);color:var(--tx);font:inherit}
#q:focus{outline:2px solid var(--ac);outline-offset:1px}
.chips{display:flex;gap:6px;overflow-x:auto;padding:10px 0 2px;scrollbar-width:none}
.chip{flex:none;border:1px solid var(--ln);background:var(--card);color:var(--tx);border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}
.chip.on{border-color:var(--ac);box-shadow:inset 0 -3px 0 var(--au);font-weight:600}
#cnt{color:var(--mu);font-size:14px;margin:10px 0 0}
details{margin:14px 0;background:var(--card);border:1px solid var(--ln);border-radius:12px;overflow:hidden}
summary{cursor:pointer;padding:12px 14px;font-weight:600;list-style:none;display:flex;justify-content:space-between;gap:8px}
summary::-webkit-details-marker{display:none}
summary span{color:var(--mu);font-weight:400}
.it{display:block;padding:11px 14px;border-top:1px solid var(--ln);color:var(--tx);text-decoration:none}
.it:hover,.it:focus-visible{background:rgba(10,122,148,.1);outline:none}
.it:visited{color:var(--mu)}
.none{text-align:center;color:var(--mu);margin:30px 0}
`;
const NAMES={'const':'Конституция','const-zakon':'Конституционные законы',codex:'Кодексы',zakon:'Законы','parlam-decision':'Постановления Парламента',decree:'Указы','gov-decision':'Постановления Правительства',order:'Приказы',decision:'Решения'};
const LOOK={p:'р',a:'а',c:'с',e:'е',o:'о',x:'х',y:'у'};
const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[paceoxy]/g,c=>LOOK[c]);

const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const secs=[];
document.querySelectorAll('body > div').forEach(div=>{
  const key=div.className.trim(),items=[];let a=null;
  div.childNodes.forEach(n=>{
    if(n.nodeName==='A')a=n;
    else if(a&&n.nodeType===3&&n.textContent.trim()){
      const t=n.textContent.trim().replace(/\s+/g,' ');
      items.push({h:a.href,t:t,n:norm(t)});a=null;
    }
  });
  if(items.length){secs.push({key:key,name:NAMES[key]||key,items:items});div.classList.add('orig')}
});
if(!secs.length)return;
const h1=document.querySelector('h1');
const title=h1?h1.textContent.trim():'Законодательство';
if(h1)h1.classList.add('orig');

const app=document.createElement('div');app.id='app';
app.innerHTML='<h1></h1><div class="bar"><input id="q" type="search" placeholder="Поиск: например, налог или труд" autocomplete="off"><div class="chips" id="chips"></div><div id="cnt"></div></div><div id="list"></div>';
app.querySelector('h1').textContent=title;
document.body.appendChild(app);

const q=app.querySelector('#q'),chips=app.querySelector('#chips'),cnt=app.querySelector('#cnt'),list=app.querySelector('#list');
let f='';
function chip(label,key){
  const b=document.createElement('button');b.className='chip';b.type='button';b.textContent=label;b.dataset.k=key;
  b.onclick=()=>{f=(f===key?'':key);render()};chips.appendChild(b);
}
chip('Все','');secs.forEach(s=>chip(s.name,s.key));

function render(){
  chips.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.k===f));
  const words=norm(q.value).split(/\s+/).filter(Boolean);
  let total=0;list.innerHTML='';
  secs.forEach(s=>{
    if(f&&f!==s.key)return;
    const m=s.items.filter(i=>words.every(w=>i.n.includes(w)));
    if(!m.length)return;
    total+=m.length;
    const d=document.createElement('details');
    d.open=!!(words.length||f||s.items.length<=25);
    const sm=document.createElement('summary');
    sm.textContent=s.name+' ';
    const c=document.createElement('span');c.textContent=m.length;sm.appendChild(c);
    d.appendChild(sm);
    m.forEach(i=>{
      const a=document.createElement('a');a.className='it';a.href=i.h;a.target='_blank';a.rel='noopener';a.textContent=i.t;d.appendChild(a);
    });
    list.appendChild(d);
  });
  cnt.textContent=(words.length||f)?'Найдено: '+total:'Всего документов: '+total;
  if(!total){const p=document.createElement('p');p.className='none';p.textContent='Ничего не найдено. Попробуйте другое слово.';list.appendChild(p)}
}
q.addEventListener('input',render);
render();
})();
