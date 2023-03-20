const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');

router.get('/create', (req, res) => {
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
		<form action="/topic/create" method="post">
			<p><input type="text" name="title" placeholder="title"></p>
			<p><textarea name="description" placeholder="description"></textarea></p>
			<p><input type="submit"></p>
		</form>`, ''
	);
	res.send(html);
})

router.post('/create', (req, res) => {
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
		res.redirect(`/topic/${title}`);
	})
})

router.get('/update/:pageId', (req, res) => {
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
	const filteredId = path.parse(req.params.pageId).base;
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
		const title = req.params.pageId;
		const list = template.list(req.list);
		const html = template.HTML(title, list, `
			<form action="/topic/update" method="post">
				<input type="hidden" name="id" value="${title}">
				<p><input type="text" name="title" placeholder="title" value="${title}"></p>
				<p><textarea name="description" placeholder="description">${description}</textarea></p>
				<p><input type="submit"></p>
			</form>`, `
			<a href="/topic/create">create</a> 
			<a href="/topic/update/${title}">update</a>`
		);
		res.send(html);
	});
})

router.post('/update', (req, res) => {
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
			res.redirect(`/topic/${title}`);
		})
	});
})

router.post('/delete', (req, res) => {
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

router.get('/:pageId', (req, res, next) => {
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
		if(err)
			next(err);
		else {
			const title = req.params.pageId;
			const sanitizedTitle = sanitizeHtml(title);
			const sanitizedDescription = sanitizeHtml(description, {
				allowedTags:['h1']
			});
			const list = template.list(req.list);
			const html = template.HTML(sanitizedTitle, list,
				`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `
				<a href="/topic/create">create</a>
				<a href="/topic/update/${sanitizedTitle}">update</a>
				<form action="/topic/delete" method="post">
					<input type="hidden" name="id" value="${sanitizedTitle}">
					<input type="submit" value="delete">
				</form>`
			);
			res.send(html);
		}
	});
})

module.exports = router;