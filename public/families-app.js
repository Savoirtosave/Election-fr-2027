const search=document.querySelector('#family-search');
const kind=document.querySelector('#family-kind');
const sort=document.querySelector('#family-sort');
const grid=document.querySelector('#family-cards');
const cards=[...grid.querySelectorAll('.family-browser-card')];
const count=document.querySelector('#family-count');
const empty=document.querySelector('#family-empty');
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function render(){
  const term=normalize(search.value.trim());let total=0;
  const ordered=[...cards].sort((a,b)=>sort.value==='name'?a.dataset.name.localeCompare(b.dataset.name,'fr'):Number(a.dataset.order)-Number(b.dataset.order));
  for(const card of ordered){const visible=(kind.value==='all'||card.dataset.kind===kind.value)&&normalize(card.dataset.search).includes(term);card.hidden=!visible;if(visible)total++;grid.append(card);}
  count.textContent=`${total} dossier${total>1?'s':''} affiché${total>1?'s':''} sur ${cards.length}`;empty.hidden=total>0;
}
search.addEventListener('input',render);kind.addEventListener('change',render);sort.addEventListener('change',render);
document.querySelector('#family-reset').addEventListener('click',()=>{search.value='';kind.value='all';sort.value='reading';render();search.focus();});
const cardsView=document.querySelector('#family-grid-view'),listView=document.querySelector('#family-list-view');
function view(list){grid.classList.toggle('is-list',list);cardsView.setAttribute('aria-pressed',String(!list));listView.setAttribute('aria-pressed',String(list));}
cardsView.addEventListener('click',()=>view(false));listView.addEventListener('click',()=>view(true));
const requested=new URLSearchParams(location.search).get('type');if([...kind.options].some(o=>o.value===requested))kind.value=requested;
render();
