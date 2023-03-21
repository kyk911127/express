const http = require('http');
const cookie = require('cookie');

http.createServer((req, res) => {
    console.log(req.headers.cookie);

    let cookies = {};
    if(req.headers.cookie !== undefined)
        cookies = cookie.parse(req.headers.cookie);

    console.log(cookies.yummy_cookie);
    console.log(cookies.tasty_cookie);

    res.writeHead(200, {
        'Set-Cookie' : [
            /**
             * Session cookies : 웹브라우저가 켜져있는 동안에만 유효
             */
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            /**
             * Permanet cookies : 웹브라우저가 꺼져도 유효
             * Expires=Wed
             *  쿠키가 언제 만료되는지
             * Max-Age=60
             *  현재 시점을 기준으로 얼마간 쿠키가 살아있는지
             */
            `Permanent=cookies; Max-Age=${60}`,
        ]
    })

    res.end('Cookie');
}).listen(4001);