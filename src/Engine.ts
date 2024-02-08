import fs from 'node:fs';
import path from 'node:path';

import Vyuha from './Vyuha';
import type { TemplateData } from '../types';

class TemplateEngine {
	static render = (
		filePath: string,
		options: TemplateData,
		callback: (err: Error | null, rendered: string) => void
	) => {
		const templatePath = path.resolve(filePath);
		if (!templatePath) {
			return callback(new Error('Error: Template not found'), '');
		}

		if (path.extname(templatePath) !== '.vyuha') {
			return callback(
				new Error(
					'File must have .vyuha extension, got ' + path.extname(templatePath)
				),
				''
			);
		}

		try {
			const fileData = fs.readFileSync(templatePath, 'utf-8');
			const template = new Vyuha(fileData.toString());
			if (template.getBaseTemplateMatch()) {
				const baseTemplatePath = path.resolve(
					path.join(
						path.dirname(templatePath),
						template.getBaseTemplateMatch()[1] + '.vyuha'
					)
				);
				if (!baseTemplatePath) {
					return callback(
						new Error(
							`Base template ${template.getBaseTemplateMatch()[1]} not found`
						),
						''
					);
				}
				if (path.extname(baseTemplatePath) !== '.vyuha') {
					return callback(
						new Error(
							'Base template must have .vyuha extension, got ' +
								path.extname(baseTemplatePath)
						),
						''
					);
				}
				const baseTemplateData = fs.readFileSync(baseTemplatePath, 'utf-8');
				template.setBaseTemplate(baseTemplateData.toString());
			}
			const rendered = template.render(options);
			return callback(null, rendered);
		} catch (err: any) {
			if (err.code === 'ENOENT') {
				return callback(new Error('Template not found'), '');
			}
			if (err.code === 'EISDIR') {
				return callback(new Error('Template is a directory'), '');
			}

			if (err.code === 'EACCES') {
				return callback(new Error('Permission denied'), '');
			}

			// check if error is reference error
			if (err instanceof ReferenceError) {
				return callback(new ReferenceError(err.message), '');
			}

			return callback(new Error(err.message || 'Template not found'), '');
		}
	};
}

export default TemplateEngine;
