import { Vyuha } from '../../src';

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
            
            @if (test) then
                <h2>Test is test true</h2>
            @endif

            @if {{false}} then
                <h2>Test is true 1</h2>
            @else
                <h2>Test is false</h2>
            @endif

            @if {{name}} then
                <h2>Test is true</h2>
            @else
                <h2>Test is false</h2>
            @endif

            @switch {{name}} then

            @case "Raman Sharma"
                <h2>Test is true 1</h2>

            @default
                <h2>Test is false</h2>
            @endswitch


            @switch (test) then

            @case "Raman Sharma"
                <h2>Test is true 2</h2>
            @case false
                <h2>Test is true 3</h2>
            @default
                <h2>Test is false</h2>
            @endswitch
        </body>
    </html>

`;

const template = new Vyuha(html);

const rendered = template.render({
	title: 'Hello World',
	name: 'Raman Sharma',
	test: false,
});
console.log(rendered);
