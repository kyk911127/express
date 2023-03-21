const express = require('express')
const app = express()
const port = 4000
const fs = require('fs');
const qs = require('querystring');
const errorPage = require('./lib/error.js');
const bodyParser = require('body-parser');  // Third-party middleware
const compression = require('compression')	// Third-party middleware
const topicRouter = require('./routes/topic');
const mainRouter = require('./routes/main');
const helmet = require('helmet');

/**
 * 웹 취약점 보호 helmet, HTTP 응답 헤더를 설정하는 여러개의 작은 미들웨어 기능 모음
 * npm i nsp -g : dependencies 리스트에 문제가 있는지 체크하는 모듈
 */
app.use(helmet());

/**
 * 미들웨어
 * 	실행 중간에 실행되며 next() 호출을 통해 다음 미들웨어의 실행 여부를 결정함
 * 	여러개의 미들웨어를 붙여 사용할 수 있음
 */

app.use(express.static('src'));	// 정적 이미지 처리
app.use(bodyParser.urlencoded({ extended: false }))	// req.body 처리
app.use(compression())	// 용량이큰 html 압축
app.get('*', (req, res, next) => {	// Application-level middleware, 반복해서 사용하는 작업 미들웨어 처리
	fs.readdir('./data', function(error, filelist){
		req.list = filelist;
		next();
	});
})

app.use('/', mainRouter);
app.use('/topic', topicRouter);

app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})

app.use((req, res, next) => {
  	res.status(404).send(errorPage.err404());
})

app.use((err, req, res, next) => {
	console.log(err);
  	res.status(500).send("500에러");
})