import type { TemplateData } from '../types/index';
class Vyuha {
	private template: string;
	private readonly BLOCK_REGEX = /@block\s+(\w+)\s*(.*?)\s*@endblock/gs;

	constructor(template: string) {
		this.template = template;
	}

	render = (data: TemplateData): string => {
		let renderedTemplate = this.template;
		renderedTemplate = this.renderBlocks(renderedTemplate, data);
		for (const [key, value] of Object.entries(data)) {
			const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
			renderedTemplate = renderedTemplate.replace(regex, String(value));
		}
		return renderedTemplate;
	};

	private renderBlocks = (
		renderedTemplate: string,
		data: TemplateData
	): string => {
		console.log('renderBlocks', data);
		const blocks: { [key: string]: string } = {};
		let match: RegExpExecArray | null;
		while ((match = this.BLOCK_REGEX.exec(renderedTemplate)) !== null) {
			const [_, blockName, blockContent] = match;
			blocks[blockName] = blockContent;
		}

		return renderedTemplate.replace(
			this.BLOCK_REGEX,
			(_: string, blockName: string) => {
				return blocks[blockName] || '';
			}
		);
	};
}

export default Vyuha;
