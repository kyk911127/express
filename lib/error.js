module.exports = {
    err404: () => {
        return `
            <!doctype html>
            <html>
                <head>
                    <title>404에러</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <div>
                        <img src='/images/err404.jpg' width='100%'/>
                    </div>
                    <div style='text-align: center; margin-top: 10px;'>
                        <a href='/'>홈으로 이동</a>
                    </div>
                </body>
            </html>
        `;
    }
  }