export interface Template {
    id: number;
    name: string;
    fields: TemplateField[];
}

export interface TemplateField {
    name: string;
    type: TemplateFieldType
}

export enum TemplateFieldType {
    DATE = 'date',
    TEXT = 'text',
    NUMBER = 'number',
    SELECT = 'select',
}