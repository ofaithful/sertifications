/*jshint browser: true, strict: true, globalstrict: true, indent: 4, immed: true, latedef: true, undef: true, regexdash: false */
/*global Hex, Base64, ASN1 */
"use strict";

var maxLength = 10240,
    reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/,
    tree = id('tree'),
    dump = id('dump'),
    temp = id('temp'),
    wantHex = id('wantHex'),
    area = id('dropZone'),
    file = id('file'),
    hash = null;
function id(elem) {
    return document.getElementById(elem);
}
function decode(der) {
    try {
        var asn1 = ASN1.decode(der);
        var hex = (der.length < maxLength) ? asn1.toHexString() : '';
        temp.appendChild(asn1.sub[0].sub[3].sub[2].sub[0].sub[1].toDOM());
        temp.appendChild(asn1.sub[0].sub[5].sub[3].sub[0].sub[1].toDOM());
        temp.appendChild(asn1.sub[0].sub[4].sub[0].toDOM());
        temp.appendChild(asn1.sub[0].sub[4].sub[1].toDOM());
        if (area.value === '') 
            area.value = hex;
        try {

        } catch (e) { // fails with "Access Denied" on IE with URLs longer than ~2048 chars
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}
function decodeArea() {
    try {
        var val = area.value,
            der = reHex.test(val) ? Hex.decode(val) : Base64.unarmor(val);
        decode(der);
    } catch (e) {
        console.log(e);
    }
}
function decodeBinaryString(str) {
    var der;
    try {
        if (reHex.test(str)) {
            der = Hex.decode(str);
            console.log(der);
        }
        else if (Base64.re.test(str)) {
            der = Base64.unarmor(str);
            console.log(der);
        }   else {
            der = str;
        }
        decode(der);
    } catch (e) {
        console.log(e, 'Cannot decode file.');
    }
}
function clearAll() {
    area.value = '';
    tree.innerHTML = '';
    dump.innerHTML = '';
    hash = window.location.hash = '';
}
// this is only used if window.FileReader
function read(f, callback) {
    area.value = ''; // clear text area, will get hex content
    var r = new FileReader();
    r.onloadend = function () {
        if (r.error)
            alert("Your browser couldn't read the specified file (error code " + r.error.code + ").");
        else {
            decodeBinaryString(r.result);
            callback();
        }
    };
    r.readAsBinaryString(f);
}
function load() {
    if (file.files.length === 0)
        alert("Select a file to load first.");
    else
        read(file.files[0]);
}
function loadFromHash() {
    if (window.location.hash && window.location.hash != hash) {
        hash = window.location.hash;
        // Firefox is not consistent with other browsers and return an
        // already-decoded hash string so we risk double-decoding here,
        // but since % is not allowed in base64 nor hexadecimal, it's ok
        area.value = decodeURIComponent(hash.substr(1));
        decodeArea();
    }
}
function stop(e) {
    e.stopPropagation();
    e.preventDefault();
}
function dragAccept(e) {
    stop(e);
    if (e.dataTransfer.files.length > 0)
        read(e.dataTransfer.files[0]);
}
// main
if ('onhashchange' in window)
    window.onhashchange = loadFromHash;
loadFromHash();
document.ondragover = stop;
document.ondragleave = stop;
if ('FileReader' in window) {
    file.style.display = 'block';
    file.onchange = load;
    document.ondrop = dragAccept;
}
