import type { TemplateData } from '../types/index';

import PipeLines from './Pipelines';
class Vyuha {
	private template: string;
	private baseTemplate?: string | null;
	private readonly BLOCK_REGEX = /@block\s+(\w+)\s*(.*?)\s*@endblock/gs;
	private readonly EXTENDS_REGEX = /@extends\s+"(.*?)"/;

	constructor(template: string, baseTemplate?: string | null) {
		this.template = template;
		if (baseTemplate) {
			this.baseTemplate = baseTemplate;
		}
	}

	public setBaseTemplate = (baseTemplate: string): void => {
		this.baseTemplate = baseTemplate;
	};

	public getBaseTemplateMatch = (): any => {
		return this.template.match(this.EXTENDS_REGEX);
	};

	public render = (data: TemplateData): string => {
		let renderedTemplate = this.template;

		const templateMatches = this.template.match(this.EXTENDS_REGEX);

		data = JSON.parse(JSON.stringify(data));

		if (templateMatches) {
			return this.mergeTemplates(renderedTemplate, data, templateMatches[1]);
		}

		return this.renderBlocks(renderedTemplate, data);
	};

	private renderBlocks = (
		renderedTemplate: string,
		data: TemplateData
	): string => {
		const blocks: { [key: string]: string } = {};
		let match: RegExpExecArray | null;
		while ((match = this.BLOCK_REGEX.exec(renderedTemplate)) !== null) {
			const [_, blockName, blockContent] = match;
			blocks[blockName] = blockContent;
		}

		let result: string = renderedTemplate.trim();
		if (match || Object.keys(blocks).length > 0) {
			result = renderedTemplate.replace(
				this.BLOCK_REGEX,
				(_: string, blockName: string) => {
					return blocks[blockName] || '';
				}
			);
		}

		result = result.replace(
			/{{\s*([^|{}]+?)\s*(?:\|\s*([^{}]+?)\s*)?}}/g,
			(_: string, expression: string, pipeline?: string) => {
				let subResult: any;
				if (expression in data) {
					subResult = data[expression];
				} else {
					try {
						subResult = new Function(
							'data',
							`with(data) { return ${expression} }`
						)(data);
					} catch (e: any) {
						throw new Error(
							e.message
								? e.message + ` in expression ${expression}`
								: `Failed evaluating expression ${expression}`
						);
					}
				}

				if (pipeline) {
					const pipeLines = new PipeLines();
					subResult = pipeLines.applyPipeOperations(subResult, pipeline);
				}

				return subResult !== undefined ? String(subResult) : '';
			}
		);

		return result.trim();
	};

	private mergeTemplates = (
		extendedTemplate: string,
		data: TemplateData,
		baseTemplateName: string
	): string => {
		if (!this.baseTemplate) {
			throw new Error(
				`
			Error: Base template "${baseTemplateName}" does not exist.
			`.trim()
			);
		}

		const result = this.baseTemplate?.replace(
			this.BLOCK_REGEX,
			(_: string, blockName: string) => {
				const match = extendedTemplate.match(
					new RegExp(`@block\\s+${blockName}\\s+(.*?)@endblock`, 'gs')
				);
				return match ? match[0] : '';
			}
		);

		if (!result) {
			throw new Error(
				`Base template "${this.baseTemplate}" does not contain any blocks.
			`.trim()
			);
		}

		return this.renderBlocks(result!, data);
	};
}

export default Vyuha;
