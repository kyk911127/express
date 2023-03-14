module.exports = {
	HTML: (title, list, body, control) => {
		return `
			<!doctype html>
			<html>
				<head>
					<title>WEB1 - ${title}</title>
					<meta charset="utf-8">
				</head>
				<body>
					<h1><a href="/">WEB</a></h1>
					${list}
					${control}
					${body}
				</body>
			</html>
		`;
	},
	
	list: (filelist) => {
		let list = '<ul>';
		filelist.forEach((val) => list = `${list}<li><a href="/page/${val}">${val}</a></li>`);
		list = `${list}</ul>`;
		return list;
	}
}