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


var _pagination = (total_record, now_page, page_size) => {

    now_page = now_page || 1
    now_page_size = page_size == 'ALL' ? total_record : parseInt(page_size || 10)

    var block_size = 10
    var total_page = Math.ceil(total_record / now_page_size)
    var total_block = Math.ceil(total_page / block_size)
    var now_block = Math.ceil(now_page / block_size)

    var now_block_size = now_block != total_block ? block_size : total_page - ((now_block - 1) * block_size)
    var prev_page = now_block - 2 >= 0 ? (now_block - 2) * block_size + 1 : null
    var next_page = now_block != total_block ? now_block * block_size + 1 : null

    return {
        total_record,
        now_page,
        now_page_size,
        page_size,
        block_size,
        total_page,
        total_block,
        now_block,
        now_block_size,
        prev_page,
        next_page,
        no(o, n) {
            return o.total_record - (o.now_page_size * (o.now_page - 1)) - n
        },
        p_no(o, n) {
            return o.block_size * (o.now_block - 1) + n
        },
        page_size_list: [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 50, 100, 200, 300, 500, 1000, 'ALL']
    }
}

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





