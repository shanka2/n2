window.Event = new Vue()

var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>td { border: 0.5pt #000 solid; vertical-align: middle; } thead td { background-color: #fed;}</style></head><body>{table}</body></html>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
    return function (name) {
        var table = document.getElementsByClassName('_excel');

        var clns = "";

        for (var i = 0; i < table.length; i++) {
            var cln = table[i].cloneNode(true);
            var paras = cln.getElementsByClassName('_no_excel');

            while (paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }

            clns += cln.outerHTML + '<br/>'
        }

        var ctx = {
            worksheet: name || 'Worksheet',
            table: clns
        }

        var link = document.createElement('a');
        link.download = name + ".xls";
        link.href = uri + base64(format(template, ctx))
        link.click();
    }
})();

var _query = (f = []) => {
    var q = _.omit($$.qs, f)
    var r = ""
    for (k in q) {
        if(q[k] != "") r += '&' + k + '=' + q[k]
    }
    return r
}

axios.defaults.headers.common['Auth-Token'] = 'axios';

var file_upload_config = {headers: {'content-type': 'multipart/form-data'}}

var __pathname = (window.location.pathname + "/").replace("//","/")


function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ ';
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}


