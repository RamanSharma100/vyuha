import Forma from '../src/Forma';

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

const template = new Forma(html);

const rendered = template.render({
	title: 'Hello World',
	name: 'Raman Sharma',
});
console.log(rendered);
