import { type TemplateData } from '../types';
import { ExpressionUtils } from './utils';

enum ControlFlowTypes {
	IF = 'if',
	WHILE = 'while',
	FOR = 'for',
	FOREACH = 'foreach',
	SWITCH = 'switch',
}

class ControlFlow {
	private readonly FLOW_REGEX =
		/@(if|switch)\s+(.*?)\s+then\s+([\s\S]*?)@end\1/gs;

	public exists = (template: string): boolean => {
		return this.FLOW_REGEX.test(template);
	};

	public parseFlow(template: string, data: TemplateData): string {
		let matches: RegExpExecArray | null;
		const flows: { [key: string]: string } = {};

		while ((matches = this.FLOW_REGEX.exec(template)) !== null) {
			const [_, keyword, condition, content] = matches;
			const newContent: string = this.executeFlow(
				_,
				keyword,
				condition,
				content,
				data
			);

			flows[_] = newContent;
		}

		if (matches || Object.keys(flows).length > 0) {
			template = template.replace(
				this.FLOW_REGEX,
				(_: string, _keyword: string, _condition: string) => {
					return flows[_] || '';
				}
			);
		}

		return template;
	}

	private executeFlow(
		_: string,
		keyword: string,
		condition: string,
		content: string,
		data: TemplateData
	): string {
		switch (keyword) {
			case ControlFlowTypes.IF:
				return this.parseIf(_, condition, content, data);
			case ControlFlowTypes.SWITCH:
				return this.parseSwitch(_, condition, content, data);
			default:
				return _;
		}
	}

	private parseIf(
		_: string,
		condition: string,
		content: string,
		data: TemplateData
	): string {
		const result = this.evaluateExpression(condition, data);

		if (result) {
			const newContent = content.split('@else')[0];
			return newContent;
		}

		let matches: RegExpExecArray | null;
		const regex = /@elseif\s+(.*?)\s+then\s+([\s\S]*?)@endif/gs;
		while ((matches = regex.exec(_)) !== null) {
			const [_, elseifCondition, elseifContent] = matches;
			const elseifResult = this.evaluateExpression(elseifCondition, data);
			if (elseifResult) {
				const dta = elseifContent.split('@else')[0];
				return _.replace(elseifContent, dta);
			} else {
				_.replace(_.split('@elseif')[0], '');
			}
		}

		const elseContent = _.split('@else')[1];
		if (elseContent) {
			return elseContent.split('@endif')[0];
		}

		return '';
	}

	private evaluateExpression(expression: string, data: TemplateData): boolean {
		const expressionVariables = ExpressionUtils.extractVariables(expression);
		const expressionWithValues = ExpressionUtils.replaceVariables(
			expression,
			expressionVariables,
			data
		);
		try {
			const result = eval(expressionWithValues);
			return result;
		} catch (e: any) {
			return true;
		}
	}

	private parseSwitch(
		_: string,
		condition: string,
		content: string,
		data: TemplateData
	): string {
		const expressionVariables = ExpressionUtils.extractVariables(condition);

		if (
			expressionVariables.length === 0 ||
			expressionVariables.filter(
				(variable: any) => data[variable] === undefined
			).length > 0
		) {
			const expresion = _.replace(
				/@switch\s*([\s\S]*?)@endswitch/g,
				(_, cases) => {
					cases = cases.replace(
						/@case\s+"([^"]*)"\s*([\s\S]*?)(?=@case|@default|$)/g,
						(_: any, caseValue: any, codeBlock: any) => {
							return `case "${caseValue}" :  "${codeBlock.trim()}"; break;\n`;
						}
					);
					cases = cases.replace(
						/@default\s*([\s\S]*?)(?=@case|$)/g,
						(_: any, codeBlock: any) => {
							return `default :  "${codeBlock.trim()}";\n`;
						}
					);

					return (
						`switch ${cases.trim()} `
							.trim()
							.replaceAll(
								/switch\s*([^"]*)\s*then/g,
								'switch("' + condition.trim().toString() + '") {'
							) + '}'
					);
				}
			);

			return eval(expresion);
		}

		const expressionWithValues = ExpressionUtils.replaceVariables(
			condition,
			expressionVariables,
			data
		);

		const exp = expressionWithValues.replaceAll('(', '"').replaceAll(')', '"');

		const expresion = _.replace(
			/@switch\s*([\s\S]*?)@endswitch/g,
			(_, cases) => {
				cases = cases.replace(
					/@case\s*(?:"([^"]*)"|([^@\s]+))\s*([\s\S]*?)(?=@case|@default|$)/g,
					(
						_: any,
						quotedCaseValue: any,
						unquotedCaseValue: any,
						codeBlock: any
					) => {
						const caseValue =
							quotedCaseValue !== undefined
								? quotedCaseValue
								: unquotedCaseValue;
						return `case "${caseValue.trim()}" : "${codeBlock.trim()}";\n break;\n`;
					}
				);
				cases = cases.replace(
					/@default\s*([\s\S]*?)(?=@case|$)/g,
					(_: any, codeBlock: any) => {
						return `default :  "${codeBlock.trim()}";\n`;
					}
				);

				return (
					`switch ${cases.trim()} `
						.trim()
						.replaceAll(
							/switch\s*([^"]*)\s*then/g,
							'switch(' + exp.trim().toString() + ') {'
						) + '}'
				);
			}
		);

		return eval(expresion);
	}
}

export default ControlFlow;
