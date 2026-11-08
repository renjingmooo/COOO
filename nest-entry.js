const birdEntry=document.querySelector('#nest-entry');
const gateDialog=document.querySelector('#gate-dialog');
function enterNest(){
  if(birdEntry.classList.contains('opening')) return;
  birdEntry.classList.add('opening');
  window.setTimeout(()=>{birdEntry.classList.remove('opening');gateDialog.showModal();document.querySelector('#gate-answer').focus();},620);
}
birdEntry.addEventListener('click',enterNest);
document.querySelector('.gate-close').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();gateDialog.close();});
gateDialog.addEventListener('click',event=>{if(event.target===gateDialog) gateDialog.close();});
