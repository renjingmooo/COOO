const gateForm=document.querySelector('#gate-form');
const gateMessage=document.querySelector('#gate-message');
const gateAnswer=document.querySelector('#gate-answer');
const albumConfig=window.PRIVATE_ALBUM_CONFIG;
const albumReady=albumConfig&&albumConfig.url.startsWith('https://')&&!albumConfig.anonKey.includes('YOUR_')&&window.supabase;
const albumClient=albumReady?window.supabase.createClient(albumConfig.url,albumConfig.anonKey):null;
gateForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!albumClient){gateMessage.textContent='小窝还没连接好，请先按 README.txt 完成 Supabase 设置。';return;}
  const submit=gateForm.querySelector('button[type="submit"]');
  submit.disabled=true;gateMessage.textContent='正在确认暗号…';
  const {data,error}=await albumClient.functions.invoke('unlock-album',{body:{answer:gateAnswer.value}});
  submit.disabled=false;
  if(error){
    const status=error.context?.status;
    gateMessage.textContent=status===401?'暗号不对，再试一次吧。':'暂时无法打开小窝，请检查 Supabase Function 设置。';
    gateAnswer.focus();gateAnswer.select();return;
  }
  sessionStorage.setItem('privateAlbumAccess',JSON.stringify(data));
  window.location.href='nest.html';
});
