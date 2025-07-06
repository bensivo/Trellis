import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Template, TemplateField, TemplateFieldType } from '../models/template-interface';

interface TemplatesStore {
    templates: Template[];
}

const initialState: TemplatesStore = {
    templates: [{
        id: 1,
        name: "Meeting",
        fields: [
            { name: "Date", type: TemplateFieldType.DATE },
            { name: "Location", type: TemplateFieldType.TEXT },
            { name: "Organizer", type: TemplateFieldType.TEXT },
            { name: "Attendees", type: TemplateFieldType.TEXT }
        ],
        content: null
    },
    {
        id: 2,
        name: "Project",
        fields: [
            { name: "Start Date", type: TemplateFieldType.DATE },
            { name: "End Date", type: TemplateFieldType.DATE },
            { name: "Status", type: TemplateFieldType.SELECT },
            { name: "Priority", type: TemplateFieldType.SELECT }
        ],
        content: null
    },
    {
        id: 3,
        name: "Person",
        fields: [
            { name: "Title", type: TemplateFieldType.TEXT },
            { name: "Department", type: TemplateFieldType.TEXT },
            { name: "Manager", type: TemplateFieldType.NUMBER },
            { name: "Email", type: TemplateFieldType.TEXT },
        ],
        content: null

    },
    {
        id: 4,
        name: "Segment",
        fields: [
            { name: "Created Date", type: TemplateFieldType.DATE },
        ],
        content: null

    },
    {
        id: 5,
        name: "Memo",
        fields: [
            { name: "Subject", type: TemplateFieldType.TEXT },
            { name: "Date", type: TemplateFieldType.DATE },
        ],
        content: null

    }
    ]
}

export const TemplatesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        createTemplate(dto: Partial<Template>) {
            const templates = store.templates();
            const maxId = Math.max(...templates.map(t => t.id));
            const newId = maxId + 1;

            const newTemplate: Template = {
                id: newId,
                name: dto.name || '',
                fields: dto.fields || [],
                content: dto.content || null
            };

            patchState(store, (state) => ({
                templates: [...state.templates, newTemplate]
            }));

            return newId;
        },
        updateTemplateName(id: number, name: string) {
            patchState(store, (state) => ({
                templates: state.templates.map(t =>
                    t.id === id ? { ...t, name } : t
                )
            }));
        },
        updateTemplateContent(id: number, content: any) {
            patchState(store, (state) => ({
                templates: state.templates.map(t =>
                    t.id === id ? { ...t, content } : t
                )
            }));
        },
        updateFieldName(id: number, index: number, name: string) {
            patchState(store, (state) => {
                const newState = {
                    templates: state.templates.map(t => {
                        if (t.id !== id) {
                            return t;
                        }

                        return {
                            ...t,
                            fields: t.fields.map((f, i) => {
                                if (i !== index) {
                                    return f;
                                }

                                return {
                                    ...f,
                                    name: name,
                                }
                            })
                        }
                    })
                }
                return newState;
            })
        },
        updateFieldType(id: number, index: number, type: TemplateFieldType) {
            patchState(store, (state) => {
                const newState = {
                    templates: state.templates.map(t => {
                        if (t.id !== id) {
                            return t;
                        }

                        return {
                            ...t,
                            fields: t.fields.map((f, i) => {
                                if (i !== index) {
                                    return f;
                                }

                                return {
                                    ...f,
                                    type: type,
                                }
                            })
                        }
                    })
                }
                return newState;
            })
        },

    }))
);