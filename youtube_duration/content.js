function parseTimer(timeStr){
    const parts = timeStr.trim().split(":").map(Number);
    if (parts.length===3){
        return parts[0]*3600 + parts[1]*60 + parts[2];
    }
    if (parts.length===2){
        return parts[0]*60 + parts[1];
    }
    return parts[0];
}

function formatTimer(seconds){
    const H = Math.floor(seconds/3600);
    const M = Math.floor((seconds%3600)/60);
    const S = Math.floor(seconds%60);
  return `${H}h ${M}m ${S}s`;

}

function showduration() {
  const times = document.querySelectorAll(
    "ytd-playlist-video-renderer #text.ytd-thumbnail-overlay-time-status-renderer"
  );
  let total = 0;

  times.forEach((element) => {
    const time = element.innerText.replace(/\n/g,"").trim();
    if time 
  });
}
