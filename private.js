const loginPanel=document.querySelector('#login-panel');
const privatePanel=document.querySelector('#private-panel');
const privateMessage=document.querySelector('#private-message');
const yearNav=document.querySelector('#private-year-nav');
const timeline=document.querySelector('#private-timeline');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let access=null;
try{access=JSON.parse(sessionStorage.getItem('privateAlbumAccess')||'null');}catch{}
if(!access||!Array.isArray(access.memories)||Date.now()>access.expiresAt){
  loginPanel.hidden=false;privatePanel.hidden=true;
  sessionStorage.removeItem('privateAlbumAccess');
}else{
  loginPanel.hidden=true;privatePanel.hidden=false;
  const rows=access.memories;
  if(!rows.length){
    privateMessage.textContent='小窝已经打开。以后把私密照片和视频放进私有相册，就会出现在这里。';
  }else{
    const years=new Map();
    for(const row of rows){
      const match=/^(\d{4})-(\d{2})/.exec(String(row.date||''));
      const year=match?match[1]:'未标年份';
      const month=match?Number(match[2]):0;
      if(!years.has(year)) years.set(year,new Map());
      const months=years.get(year);
      if(!months.has(month)) months.set(month,[]);
      months.get(month).push(row);
    }
    const sortedYears=[...years.keys()].sort((a,b)=>b.localeCompare(a));
    yearNav.hidden=false;
    yearNav.innerHTML=[['all','全部'],...sortedYears.map(year=>[year,year])].map(([value,label],i)=>`<button type="button" class="year-chip${i===0?' is-active':''}" data-year="${esc(value)}">${esc(label)}</button>`).join('');
    timeline.innerHTML=sortedYears.map(year=>{
      const months=years.get(year);
      const sortedMonths=[...months.keys()].sort((a,b)=>b-a);
      const yearId=`private-year-${year}`;
      const monthNav=sortedMonths.map(month=>`<a href="#private-month-${year}-${month}">${month?String(month).padStart(2,'0')+'月':'日期未记录'}</a>`).join('');
      const monthSections=sortedMonths.map(month=>{
        const monthRows=months.get(month).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
        const monthId=`private-month-${year}-${month}`;
        const monthLabel=month?`${String(month).padStart(2,'0')}月`:'日期未记录';
        const cards=monthRows.map(row=>{
          const mediaHtml=(row.media||[]).map(item=>`<figure>${item.type==='video'?`<video controls playsinline preload="metadata" src="${esc(item.url)}">浏览器暂不支持播放。</video>`:`<img class="private-photo" tabindex="0" role="button" aria-label="单击放大查看：${esc(item.caption||row.title)}" loading="lazy" src="${esc(item.url)}" alt="${esc(item.caption||row.title)}">`}<figcaption>${esc(item.caption||'')}</figcaption></figure>`).join('');
          const [y,m,d]=String(row.date||'').split('-');
          const displayDate=y&&m?`${y}.${m}`:'';
          return `<article class="private-card"><div class="private-card-top"><div><h4>${esc(row.title||'一段私藏')}</h4><p class="private-place">${esc(row.place||'')}</p></div><time>${esc(displayDate)}</time></div>${row.story?`<p class="private-story">${esc(row.story)}</p>`:''}${mediaHtml?`<div class="private-media">${mediaHtml}</div>`:''}</article>`;
        }).join('');
        return `<section class="private-month" id="${monthId}"><h4 class="private-month-title">${esc(monthLabel)}<span>${monthRows.length} 段回忆</span></h4><div class="private-grid">${cards}</div></section>`;
      }).join('');
      const count=[...months.values()].reduce((sum,items)=>sum+items.length,0);
      return `<section class="private-year" id="${yearId}" data-year="${esc(year)}"><div class="private-year-heading"><h3>${esc(year)}</h3><span>${count} 段回忆</span></div><nav class="private-month-nav" aria-label="${esc(year)} 年月份">${monthNav}</nav>${monthSections}</section>`;
    }).join('');
    yearNav.addEventListener('click',event=>{
      const button=event.target.closest('button[data-year]');
      if(!button)return;
      yearNav.querySelectorAll('.year-chip').forEach(chip=>chip.classList.toggle('is-active',chip===button));
      timeline.querySelectorAll('.private-year').forEach(section=>{section.hidden=button.dataset.year!=='all'&&section.dataset.year!==button.dataset.year;});
    });
  }
}
document.querySelector('#signout').addEventListener('click',()=>{sessionStorage.removeItem('privateAlbumAccess');window.location.href='index.html';});

const lightbox=document.querySelector('#private-lightbox');
const lightboxImage=document.querySelector('#private-lightbox-image');
const lightboxCaption=document.querySelector('#private-lightbox-caption');
let photoScrollPosition={left:0,top:0};
function openPrivatePhoto(photo){photoScrollPosition={left:window.scrollX,top:window.scrollY};lightboxImage.src=photo.currentSrc||photo.src;lightboxImage.alt=photo.alt||'';lightboxCaption.textContent=photo.closest('figure')?.querySelector('figcaption')?.textContent||photo.alt||'';lightbox.showModal()}
lightbox.addEventListener('close',()=>{const root=document.documentElement,previousBehavior=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(photoScrollPosition.left,photoScrollPosition.top);requestAnimationFrame(()=>{window.scrollTo(photoScrollPosition.left,photoScrollPosition.top);root.style.scrollBehavior=previousBehavior})});
document.addEventListener('click',event=>{const photo=event.target.closest('.private-photo');if(photo)openPrivatePhoto(photo)});
document.addEventListener('keydown',event=>{if(event.target.matches('.private-photo')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openPrivatePhoto(event.target)}});
document.querySelector('#private-lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
