type Pipe = (input: any) => any;

enum PipeTypes {
	uppercase = 'uppercase',
	lowercase = 'lowercase',
	capitalize = 'capitalize',
	reverse = 'reverse',
}
class PipeLines {
	private upperCase = (input: string): string => {
		return input.toUpperCase();
	};

	private lowerCase = (input: string): string => {
		return input.toLowerCase();
	};

	private capitalize = (input: string): string => {
		return input.charAt(0).toUpperCase() + input.slice(1);
	};

	private reverseTransform = (input: string): string => {
		return input.split('').reverse().join('');
	};

	private getPipe = (pipeType: PipeTypes): Pipe => {
		switch (pipeType) {
			case PipeTypes.uppercase:
				return this.upperCase;
			case PipeTypes.lowercase:
				return this.lowerCase;
			case PipeTypes.capitalize:
				return this.capitalize;
			case PipeTypes.reverse:
				return this.reverseTransform;
			default:
				throw new Error(`Pipe ${pipeType} do not support`);
		}
	};

	public checkPipeExists = (template: string): boolean => {
		const pipeRegex = /{{\s*(.*?)\s*\|\s*(.*?)\s*}}/g;
		return pipeRegex.test(template);
	};

	public resolvePipes = (template: string, data: any): string => {
		const pipeRegex = /{{\s*(.*?)\s*\|\s*(.*?)\s*}}/g;
		let match: RegExpExecArray | null;
		while ((match = pipeRegex.exec(template)) !== null) {
			const [_, variable, pipeType] = match;

			const pipe = this.getPipe(pipeType as PipeTypes);

			if (variable === 'true' || variable === 'false') {
				throw new Error('Cannot user pipe on boolean value');
			}

			if (variable === 'null') {
				throw new Error('Cannot user pipe on null value');
			}

			if (variable === 'undefined') {
				throw new Error('Cannot user pipe on undefined value');
			}

			if (variable === 'NaN') {
				throw new Error('Cannot user pipe on NaN value');
			}

			if (variable === 'Infinity') {
				throw new Error('Cannot user pipe on Infinity value');
			}

			if (typeof variable === 'number') {
				throw new Error('Cannot user pipe on number');
			}

			if (typeof variable === 'string') {
				return template.replace(_, pipe(variable));
			}

			if (typeof variable === 'object') {
				throw new Error('Cannot user pipe on object');
			}

			if (variable === 'function') {
				throw new Error('Cannot user pipe on function');
			}

			if (variable === 'symbol') {
				throw new Error('Cannot user pipe on symbol');
			}

			if (variable === 'bigint') {
				throw new Error('Cannot user pipe on bigint');
			}

			if (variable === 'number') {
				throw new Error('Cannot user pipe on number');
			}

			if (variable === 'boolean') {
				throw new Error('Cannot user pipe on boolean');
			}

			template = template.replace(_, pipe(data[variable]));
		}
		return template;
	};

	public applyPipeOperations = (input: any, pipeType: string): any => {
		const pipe = this.getPipe(pipeType as PipeTypes);

		if (typeof input === 'string') {
			return pipe(input);
		}

		if (typeof input === 'number') {
			return pipe(String(input));
		}

		if (typeof input === 'boolean') {
			return pipe(String(input));
		}

		if (typeof input === 'undefined') {
			return pipe(String(input));
		}

		if (input === null) {
			throw new Error('Cannot user pipe on null value');
		}

		if (typeof input === 'symbol') {
			throw new Error('Cannot user pipe on symbol');
		}

		if (typeof input === 'bigint') {
			throw new Error('Cannot user pipe on bigint');
		}

		if (input === 'NaN') {
			throw new Error('Cannot user pipe on NaN value');
		}

		if (input === 'Infinity') {
			throw new Error('Cannot user pipe on Infinity value');
		}

		if (input === 'function') {
			throw new Error('Cannot user pipe on function');
		}

		if (input === 'symbol') {
			throw new Error('Cannot user pipe on symbol');
		}

		if (input === 'bigint') {
			throw new Error('Cannot user pipe on bigint');
		}

		if (input === 'number') {
			throw new Error('Cannot user pipe on number');
		}

		if (input === 'boolean') {
			throw new Error('Cannot user pipe on boolean');
		}

		if (input === 'object') {
			throw new Error('Cannot user pipe on object');
		}

		return pipe(input);
	};

	public pipeLine = (template: string, data: any): string => {
		if (this.checkPipeExists(template)) {
			template = this.resolvePipes(template, data);
		}
		return template;
	};
}

export default PipeLines;
