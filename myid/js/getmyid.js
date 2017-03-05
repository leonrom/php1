var GetMyId = function(tag, url, clear) {
    /*
     * tag - nme of tag in HTML-page, which may contain uesr's name
     * url - url of PHP-server
     * clear - additional parameter,- means to reinitialize user's name in PHP-server
     */
    'use strict'
    /* global Fingerprint2 */
    /* global lscook */

    this.p = {
        state: {
            server_id: undefined,
            id_browse: undefined,
            id_cookie: undefined,
            user_name: undefined,
            user_last: undefined,
        },
        cnsts: {
            TAG: undefined,
            URL: undefined
        },
        user: {
            tag: undefined,
            namePHP: undefined
        }
    }

    init(this.p, tag, url, clear)

    this.act = function() {
        console.log('--> this.act()')
        if (this.user.tag && !this.user.nameTag) { // read name in current page
            var tag = document.getElementById("this.user.tag");
            if (tag) {
                var nam = ''.trim();
                if (nam.length > 0) {
                    this.user.nameTag = nam
                }
            }
        }
        if (this.php_HTTP) { // send to server info about: 1) options 2) current page name 3) current (local) time

        }
    }

    function init(p, tag, url, clear) {
        console.log('--> init()' +
            '\n    tag="' + tag + '"' +
            '\n    url="' + url + '"'
        )
        p.cnsts.TAG = tag
        p.cnsts.URL = url

        var stateU = lscook(tag)
        if (!stateU || (stateU.server_id === undefined) || clear) {
            var s = 'Для сохранения истории посещений '
            if (!window.navigator.cookieEnabled) {
                var msg = s + 'включите cookie (и перезапустите браузер)'
                    //          alert(msg)
                console.log(msg)
            }
            else {
                var msg = s + 'используются cookie. Если Вы не согласны - покиньте сайт или отключите cookie в браузере '
                    //        alert(msg)
                console.log(msg)
            }

            getNewUserFromServer(p)
        }
        else {
            getHistoryFromServer(p, stateU.server_id)
        }
    }

    function getNewUserFromServer(p) { // get current browser's hash
        console.log('--> getNewUserFromServer()')
        var options = {
            swfPath: '/assets/FontList.swf',
            excludeUserAgent: true
        };
        var fingerprint2 = new Fingerprint2(options)
        fingerprint2.get(phpGetUserId);

        function phpGetUserId(hash) { // get user's Id from PHP-serverisFirstTime
            console.log('--> phpGetUserId()' +
                '\n    hash="' + hash + '"'
            )
            p.xmlhttp = new XMLHttpRequest();
            p.xmlhttp.onreadystatechange = getFromPHP

            // p.xmlhttp.open("GET", p.cnsts.URL + "?new=" + hash+'_1', true);
            // p.xmlhttp.send();
            p.xmlhttp.open("POST", p.cnsts.URL + "?r=" + Math.random(), true);
            p.xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            
            p.xmlhttp.send("new=" + hash);
            var timeout = setTimeout(function() {
                if (p.xmlhttp) {
                    console.error('? TimeOut on XMLHttpRequest ')
                    p.xmlhttp.abort();
                    p.xmlhttp = undefined // признак доступности нового запроса
                }
            }, 20000);
        }

        function getFromPHP() {
            if (p.xmlhttp.readyState == 4) {
                if (p.xmlhttp.status == 200) {
                    var s = p.xmlhttp.responseText
                    console.log('--> getFromPHP(txt)' +
                        '\n    p.xmlhttp.responseText=\n' + s
                    )
                    var doc = document.getElementById("txtHint")
                    if (doc) {
                        doc.innerHTML = s
                    }
                    var ss = s.split("=>")
                    if (ss.length > 1) {
                        s = ss[1]
                    }
                    try {
                        var dat = JSON.parse(s);
                        console.log('--> dat' +
                            ': server_id=' + dat.server_id +
                            ', id_browse=' + dat.id_browse +
                            ', user_name=' + dat.user_name)
                    }
                    catch (e) {
                        console.error('getFromPHP(): e=' + e.message)
                    }
                }
                else {
                    var s = HTTP_STATUS_CODES[p.xmlhttp.status]
                    if (!(s && s.length > 0)) s = 'look at https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'
                    console.log('--> p.xmlhttp.status=' + p.xmlhttp.status + ': ' + s)
                }
                p.xmlhttp = undefined
            }
        }
    }


    function getHistoryFromServer(p, id) { // get current browser's hash
        console.log('--> getHistoryFromServer()')

        p.xmlhttp = new XMLHttpRequest();
        p.xmlhttp.onreadystatechange = getFromPHP
        p.xmlhttp.open("GET", p.cnsts.URL + "?q=" + hash, true);
        p.xmlhttp.send();


        function getFromPHP() {
            if (p.xmlhttp.readyState == 4) {
                if (p.xmlhttp.status == 200) {
                    console.log('--> getFromPHP(txt)' +
                        '\n    p.xmlhttp.responseText="' + p.xmlhttp.responseText + '"'
                    )
                }
                else {
                    var s = HTTP_STATUS_CODES[p.xmlhttp.status]
                    if (!(s && s.length > 0)) s = 'look at https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'
                    console.log('--> p.xmlhttp.status=' + p.xmlhttp.status + ': ' + s)
                }
                p.xmlhttp = undefined
            }
        }
    }


    function checkCook(key, id) {
        console.log('--> checkCook()')
        var dat = lscook(key)
        var add = false
        if (dat.id_cookie) {
            if (dat.id_cookie != id) {
                console.error('change dat.id_* from ' + dat.id_browse + ' to ' + this.state.id_browse);
                add = true
            }
        }
        else {
            console.log('set new dat.id_* '); //a hash, representing your device fingerprint
            add = true
        }
        if (add) {
            dat.id_browse = id
            lscook(key, id) // store sate in my LS/cookie
        }
    }
}

var HTTP_STATUS_CODES = {
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Request Entity Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
