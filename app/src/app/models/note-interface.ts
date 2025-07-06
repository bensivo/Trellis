import { TemplateFieldType } from "./template-interface";

export interface Note {
    id: number;
    name: string;
    templateId: number;
    fields: NoteField[];
    content: any;
}

export interface NoteField {
    name: string;
    type: TemplateFieldType;
    value: any;
}