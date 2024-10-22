if (window.layoutTestController)
    layoutTestController.dumpAsText();

function log(msg) {
    var txt = document.createTextNode(msg);
    document.querySelector('body').appendChild(txt);
    document.querySelector('body').appendChild(document.createElement('br'));
}

function injectPolicy(policy) {
    var meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'X-WebKit-CSP');
    meta.setAttribute('content', policy);
    document.head.appendChild(meta);
}

if (!document.SecurityPolicy)
    log('FAIL document.securityPolicy is not defined.')

