import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import * as path from 'path';
import { EmailTemplate } from 'src/common/enums';
import { EmailPayload } from 'src/common/interfaces';

@Injectable()
export class TemplateService {
  async createHTML(template: EmailTemplate, payload: EmailPayload) {
    //Get file path
    const filePath = await this.resolveTemplatePath(template);

    //Open template
    const mjmlTemplate = await readFile(filePath, 'utf8');

    //Compile initial HTML
    const htmlTemplate = mjml2html(mjmlTemplate, {
      validationLevel: 'soft',
    }).html;

    //Load handlebars template
    const hbsTemplate = compile(htmlTemplate);

    //Inject payload
    const html = hbsTemplate(payload);

    return html;
  }

  private resolveTemplatePath(template: string) {
    const basePath = process.cwd();

    const filePath = path.join(
      basePath,
      'src',
      'email',
      'data',
      `${template}.mjml`,
    );

    return path.resolve(filePath);
  }
}
