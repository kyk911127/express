const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const template = require('./lib/template.js');
const errorPage = require('./lib/error.js');
const bodyParser = require('body-parser');  // Third-party middleware
const compression = require('compression')	// Third-party middleware

/**
 * 미들웨어
 * 	실행 중간에 실행되며 next() 호출을 통해 다음 미들웨어의 실행 여부를 결정함
 * 	여러개의 미들웨어를 붙여 사용할 수 있음
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get('*', (req, res, next) => {	// Application-level middleware
	fs.readdir('./data', function(error, filelist){
		req.list = filelist;
		next();
	});
})

app.get('/', (req, res) => {
	/*
	fs.readdir('./data', function(error, filelist){
		const title = 'Welcome';
		const description = 'Hello, Node.js';
		const list = template.list(filelist);
		const html = template.HTML(title, list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`
		);
		res.send(html);
	});
	*/
	const title = 'Welcome';
	const description = 'Hello, Node.js';
	const list = template.list(req.list);
	const html = template.HTML(title, list,
		`<h2>${title}</h2>${description}`,
		`<a href="/create">create</a>`
	);
	res.send(html);
})

app.get('/page/:pageId', (req, res) => {
	/*
	fs.readdir('./data', function(error, filelist){
		const filteredId = path.parse(req.params.pageId).base;
		fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
			const title = req.params.pageId;
			const sanitizedTitle = sanitizeHtml(title);
			const sanitizedDescription = sanitizeHtml(description, {
				allowedTags:['h1']
			});
			const list = template.list(filelist);
			const html = template.HTML(sanitizedTitle, list,
				`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `
				<a href="/create">create</a>
				<a href="/update/${sanitizedTitle}">update</a>
				<form action="/delete" method="post">
					<input type="hidden" name="id" value="${sanitizedTitle}">
					<input type="submit" value="delete">
				</form>`
			);
			res.send(html);
		});
	});
	*/
	const filteredId = path.parse(req.params.pageId).base;
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
		const title = req.params.pageId;
		const sanitizedTitle = sanitizeHtml(title);
		const sanitizedDescription = sanitizeHtml(description, {
			allowedTags:['h1']
		});
		const list = template.list(req.list);
		const html = template.HTML(sanitizedTitle, list,
			`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `
			<a href="/create">create</a>
			<a href="/update/${sanitizedTitle}">update</a>
			<form action="/delete" method="post">
				<input type="hidden" name="id" value="${sanitizedTitle}">
				<input type="submit" value="delete">
			</form>`
		);
		res.send(html);
	});
})

app.get('/create', (req, res) => {
	/*
	fs.readdir('./data', function(error, filelist){
		const title = 'WEB - create';
		const list = template.list(filelist);
		const html = template.HTML(title, list, `
			<form action="/create" method="post">
				<p><input type="text" name="title" placeholder="title"></p>
				<p><textarea name="description" placeholder="description"></textarea></p>
				<p><input type="submit"></p>
			</form>`, ''
		);
		res.send(html);
	});
	*/
	const title = 'WEB - create';
	const list = template.list(req.list);
	const html = template.HTML(title, list, `
		<form action="/create" method="post">
			<p><input type="text" name="title" placeholder="title"></p>
			<p><textarea name="description" placeholder="description"></textarea></p>
			<p><input type="submit"></p>
		</form>`, ''
	);
	res.send(html);
})

app.post('/create', (req, res) => {
	/*
	let body = '';
	req.on('data', function(data){
		body = body + data;
	});
	req.on('end', function(){
		const post = qs.parse(body);
		const title = post.title;
		const description = post.description;
		fs.writeFile(`data/${title}`, description, 'utf8', function(err){
			res.redirect(`/page/${title}`);
		})
	});
	*/

	const post = req.body;
	const title = post.title;
	const description = post.description;
	fs.writeFile(`data/${title}`, description, 'utf8', function(err){
		res.redirect(`/page/${title}`);
	})
})

app.get('/update/:pageId', (req, res) => {
	/*
	fs.readdir('./data', function(error, filelist){
		var filteredId = path.parse(req.params.pageId).base;
		fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
			var title = req.params.pageId;
			var list = template.list(filelist);
			var html = template.HTML(title, list, `
				<form action="/update" method="post">
					<input type="hidden" name="id" value="${title}">
					<p><input type="text" name="title" placeholder="title" value="${title}"></p>
					<p><textarea name="description" placeholder="description">${description}</textarea></p>
					<p><input type="submit"></p>
				</form>`, `
				<a href="/create">create</a> 
				<a href="/update/${title}">update</a>`
			);
			res.send(html);
		});
	});
	*/
	var filteredId = path.parse(req.params.pageId).base;
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
		var title = req.params.pageId;
		var list = template.list(req.list);
		var html = template.HTML(title, list, `
			<form action="/update" method="post">
				<input type="hidden" name="id" value="${title}">
				<p><input type="text" name="title" placeholder="title" value="${title}"></p>
				<p><textarea name="description" placeholder="description">${description}</textarea></p>
				<p><input type="submit"></p>
			</form>`, `
			<a href="/create">create</a> 
			<a href="/update/${title}">update</a>`
		);
		res.send(html);
	});
})

app.post('/update', (req, res) => {
	/*
	let body = '';
	req.on('data', function(data){
		body = body + data;
	});
	req.on('end', function(){
		const post = qs.parse(body);
		const id = post.id;
		const title = post.title;
		const description = post.description;
		fs.rename(`data/${id}`, `data/${title}`, function(error){
			fs.writeFile(`data/${title}`, description, 'utf8', function(err){
			res.redirect(`/page/${title}`);
			})
		});
	});
	*/

	const post = req.body;
  	const id = post.id;
  	const title = post.title;
  	const description = post.description;
	fs.rename(`data/${id}`, `data/${title}`, function(error){
		fs.writeFile(`data/${title}`, description, 'utf8', function(err){
			res.redirect(`/page/${title}`);
		})
	});
})

app.post('/delete', (req, res) => {
	/*
	let body = '';
	req.on('data', function(data){
		body = body + data;
	});
	req.on('end', function(){
		const post = qs.parse(body);
		const id = post.id;
		const filteredId = path.parse(id).base;
		fs.unlink(`data/${filteredId}`, function(error){
			res.redirect('/');
		})
	});
	*/
	const post = req.body;
	const id = post.id;
	const filteredId = path.parse(id).base;
	fs.unlink(`data/${filteredId}`, function(error){
		res.redirect('/');
	})
})

app.listen(port, () => {
  	console.log(`Example app listening on port ${port}`)
})

app.use(express.static('images'), (req, res) => {
  	res.status(404).send(errorPage.err404());
})