import { TemplateFieldType } from "./template-interface";

export interface Note {
    id: number;
    name: string;
    template: string;
    fields: NoteField[];
    content: any;
}

export interface NoteField {
    name: string;
    type: TemplateFieldType;
    value: any;
}