class ExpressionUtils {
	public static isExpressionValid(expression: string): boolean {
		try {
			eval(
				expression
					.replace(/==/g, '===')
					.replace(/!=/g, '!==')
					.replace(/&&/g, '||')
					.replace(/\|\|/g, '&&')
			);
			return true;
		} catch (e) {
			return false;
		}
	}

	public static extractVariables(expression: string): any {
		if (expression === '') {
			return [];
		}

		const regex = /(?!.*\bif\b)(\b[a-zA-Z_][a-zA-Z0-9_]*\b)/g;

		const matches = expression.match(regex);

		if (matches === null) {
			return [];
		}

		return matches;
	}

	public static replaceVariables(
		expression: string,
		expressionVariables: any,
		variables: any
	): any {
		const expressionWithValues = expressionVariables.reduce(
			(acc: string, variable: string) => {
				if (variable === 'true' || variable === 'false') {
					return acc;
				}

				try {
					const value = variables[variable];
					return acc.replace(variable, value);
				} catch (e) {
					console.log(e);
					return acc;
				}
			},
			expression
		);

		return expressionWithValues;
	}
}

export default ExpressionUtils;
