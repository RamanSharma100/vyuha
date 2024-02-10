# Vyuha (व्यूह)

A Node.js Template Engine inspired by EJS, Angular and Laravel Blade.

## Installation

### NPM

```bash
npm install vyuha
```

### Yarn

```bash
yarn add vyuha

```

### PNPM

```bash
pnpm add vyuha
```

## Features

- Control Flow with `@ @end`
- Interpolation with `{{ }}`
- Javascript expressions with `{{ }}`
- Pipes with `{{ <expression> | <pipe> }}`
- Compiles With [Express](https://expressjs.com/) view system
- Use without Express in Native Node.js
- Typescript Support
- Custom `.vyuha` file extension

## Supported Control Flow

- Extend Layouts with `@extends`
- Create Blocks with `@block`
- Start with `@<controlName>` and end with `@end<controlName>`
- More to come, stay tuned!

## Supported Pipes

- `uppercase`
- `lowercase`
- `capitalize`
- `reverse`

## Usage

### CommonJS (Javascript)

```javascript
const Vyuha = require('vyuha');

const template = `
  <h1>{{ title | uppercase }}</h1>
  <p>{{ description }}</p>
`;

const data = {
	title: 'Hello, World!',
	description: 'This is a simple example of Vyuha.',
};

const template = new Vyuha(template);
const compiled = template.render(data);

console.log(compiled);
```

### ES6 (Typescript)

```typescript
import { Vyuha } from 'vyuha';

const template = `
  <h1>{{ title | uppercase }}</h1>
  <p>{{ description }}</p>
`;

const data = {
	title: 'Hello, World!',
	description: 'This is a simple example of Vyuha.',
};

const template = new Vyuha(template);
const compiled = template.render(data);

console.log(compiled);
```

## Express

```typescript
import express from 'express';
import VyuhaEngine from 'vyuha';

const app = express();

const __dirname = path.resolve(path.dirname(''));

// set view engine
app.set('view engine', 'vyuha');
app.set('views', path.join(__dirname, 'views'));

app.engine('vyuha', VyuhaEngine.render);

// routes

app.get('/', (req, res) => {
	return res.render('index', {
		title: 'Hello World',
		name: 'Vyuha',
	});
});

app.get('/welcome', (req, res) => {
	return res.render('extended', {
		title: 'Welcome to Vyuha',
		name: 'Vyuha',
	});
});

app.listen(3000, () => {
	console.log('Server started on http://localhost:3000');
});
```

## Examples

### Control Flow

```html
<!-- index.vyuha -->
@extends "layout"

@block title
<h1>{{ title }}</h1>
@endblock

@block content
<p>{{ description }}</p>
@endblock
```

```html
<!-- layout.vyuha -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  @block content
  @endblock
</body>
```

### Pipes

```html
<!-- index.vyuha -->
@extends "layout"

@block title
<h1>{{ title }}</h1>
@endblock

@block content
<h1>{{ title | uppercase }}</h1>
<!-- HELLO, WORLD! -->
<p>{{ description | lowercase }}</p>
<!-- this is a simple example of vyuha. -->
@endblock
```

## Important

- This is a work in progress, expect breaking changes.
- Please report any issues you find.

## Client-Side Support

- CDN Support coming soon!
- Standalone Vyuha.js file coming soon!

## String Compilation

```typescript
import { Vyuha } from 'vyuha';

const template = `
  <h1>{{ title | uppercase }}</h1>
  <p>{{ description }}</p>
`;

const data = {
	title: 'Hello, World!',
	description: 'This is a simple example of Vyuha.',
};

const template = new Vyuha(template);
const compiled = template.render(data);

console.log(compiled);
```

### Output

```html
<h1>HELLO, WORLD!</h1>
<p>This is a simple example of Vyuha.</p>
```

## CLI Support

CLI Support coming soon!

## Syntax Highlighting

Syntax Highlighting for VSCode coming soon!

## License

MIT

## Author

[Raman Sharma](https://github.com/RamanSharma100)

## Contributing

Contributions are welcome! Feel free to open an issue or a pull request.

## Inspiration

- [EJS](https://ejs.co/)
- [Angular](https://angular.io/)
- [Laravel Blade](https://laravel.com/docs/10.x/blade)

## Support

If you like this project, consider supporting it by starring the repository.

## Disclaimer

- This is a personal project and is not affiliated with any organization.
- This project is not affiliated with EJS or Angular in any way.

## Changelog

- 0.1.0 - Initial Release (Beta)
- 0.1.1 - Typo Fixes in Readme (commonjs)

## Roadmap

- 0.2.0 - Add All Basic Control Flow
- 0.3.0 - Add All Basic Pipes
- 0.4.0 - Add Cache Support
- 0.5.0 - Add CLI Support
- 0.6.0 - Add Syntax Highlighting for VSCode
- 0.7.0 - Add CDN Support
- 0.8.0 - Add Standalone Vyuha.js file
- 1.0.0 - Stable Release

# Enjoy Vyuha!
