import Vyuha from '../src/Vyuha';

const html = `
<!DOCTYPE html>
<html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        <p>Welcome {{ name }}</p>
    </body>
</html>
`;

const template = new Vyuha(html);

const rendered = template.render({
	title: 'Hello World',
	name: 'Raman Sharma',
});
console.log(rendered);
