Array.prototype.GroupBy = function(groupKey) {

  var groups = [];
  var grouped = {};

  for(var i = 0; i < this.length; i++) {
    if(groups.indexOf(this[i][groupKey]) === -1) {
      groups.push(this[i][groupKey]);
    }
  }

  for(var i = 0; i < groups.length; i++) {

    grouped[groups[i]] = this.filter(function(e) {
      return e[groupKey] === groups[i];
    });

  }

  return grouped;

}

String.prototype.asTitle = function() {
  var title = this.replace("_"," ");
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title;
}

const includeHTML = function(cb) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          elmnt.innerHTML = this.responseText;
          elmnt.removeAttribute("include-html");
          includeHTML(cb);
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (cb) cb();
};