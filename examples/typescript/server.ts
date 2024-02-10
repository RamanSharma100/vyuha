import path from 'path';
import express from 'express';

import VyuhaEngine from '../../src';

const app = express();

const __dirname = path.resolve(path.dirname(''));

// set view engine
app.set('view engine', 'vyuha');
app.set('views', path.join(__dirname, 'views'));

app.engine('vyuha', VyuhaEngine.render);

app.get('/', (req, res) => {
	return res.render('index', {
		title: 'Hello World',
		name: 'Raman Sharma',
	});
});

app.get('/welcome', (req, res) => {
	return res.render('extended', {
		title: 'Welcome to Vyuha',
		name: 'Raman Sharma',
	});
});

app.listen(3000, () => {
	console.log('Server started on http://localhost:3000');
});
