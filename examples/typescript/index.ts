import { Vyuha } from '../../dist';

const baseTemplate = `
<!DOCTYPE html>
<html>
    <head>
        <title>
            @block title @endblock
        </title>
    </head>
    <body>
        <h1>{{ title }}</h1>
        @block content @endblock
    </body>
</html>
`;

const extendedHtml = `
@extends "base"

@block title
    {{ title }}
@endblock

@block content
    <h1>Hello, {{ name }}</h1>
@endblock
`;

const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>
                {{ title }}
            </title>
        </head>
        <body>
            <h1>Hello, {{ name }}</h1>
        </body>
    </html>

`;

const template = new Vyuha(extendedHtml, baseTemplate);

const rendered = template.render({
	title: 'Hello World',
	name: 'Raman Sharma',
	test: 'test',
});
console.log(rendered);
