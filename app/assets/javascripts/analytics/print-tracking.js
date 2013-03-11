(function() {
  var utm = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/__utm.gif';

  // Construct the gif hit url.
  utm += "?utmwv=" + "5.3.9";
  utm += "&utmn=" + Math.floor(Math.random() * parseInt('0x7fffffff', 16));
  utm += "&utmhn=" + encodeURIComponent(document.location.hostname);
  utm += "&utmp=" + encodeURIComponent("/print" + document.location.pathname);
  utm += "&utmac=" + "UA-26179049-1";
  utm += "&utmcc=__utma%3D999.999.999.999.999.1%3B";

  var styleNode = document.createElement('style');
  styleNode.setAttribute("type", "text/css");
  var css = document.createTextNode("@media print { body:after { content: url(" + utm + "); } body { *background: url(" + utm + ") no-repeat; }}");

  if (styleNode.styleSheet) {
      styleNode.styleSheet.cssText = css.nodeValue;
  } else {
      styleNode.appendChild(css);
  }

  var head = document.getElementsByTagName('head')[0];

  if (head) {
    head.appendChild(styleNode);
  }
})();
