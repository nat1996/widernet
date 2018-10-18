$(document).ready(function () {
  $.getJSON("http://jsonip.com/?callback=?", function (data) {
      console.log(data);
      ipd = data.ip;
      //out("address");
      //alert(ipd);
      //alert("hwow")
      //document.write("address", ipd);
  });

   let event_handler = function(){
     //document.write(ipd);
     alert(ipd);
     const rows = [["machine public IP address", ipd], ["Website", "Catalog", "status"]];
let csvContent = "data:text/csv;charset=utf-8,";
rows.forEach(function(rowArray){
   let row = rowArray.join(",");
   csvContent += row + "\r\n";
});
     var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "local catalog record.csv");
link.innerHTML= "Click Here to download";
document.body.appendChild(link); // Required for FF

link.click();
   };
   $("#d1").on('click', event_handler);

});
