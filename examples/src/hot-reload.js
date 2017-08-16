/**
 * @Date:   2017-08-16T14:22:42+08:00
 * @Last modified time: 2017-08-16T14:25:53+08:00
 */

 const socket = io.connect(':1107');
 const scriptIndex = document.getElementById('script-index');
 const src = scriptIndex.src;
 const srcArr = src.split('/');
 socket.on ('ConnectionChannel', function(messageFromServer)       {
   console.log ('WebSocket message: ' + messageFromServer);
 }).on('AutoReloadChannel', (messageFromServer) => {
   const data = JSON.parse(messageFromServer);
   if (data.pageName === srcArr[srcArr.length - 2]) {
     location.reload();
   }
 });
