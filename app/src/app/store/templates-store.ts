import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Template, TemplateFieldType } from '../models/template-interface';

interface TemplatesStore {
    templates: Template[];
}

const initialState: TemplatesStore = {
    templates: [
        {
            id: 0,
            name: 'Person',
            fields: [
                {
                    name: "Department",
                    type: TemplateFieldType.TEXT,
                },
                {
                    name: "Manager",
                    type: TemplateFieldType.TEXT,
                },
            ],
            content: {"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Responsibilities:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Notes:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}},
        },
        {
            id: 1,
            name: 'Segment',
            fields: [
                {
                    name: "Created Date",
                    type: TemplateFieldType.DATE,
                },
            ],
            content: {"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Description","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Lorem Ipsum","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"People","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}},
        }
     ]
}

export const TemplatesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        createTemplate(dto: Partial<Template>) {
            const templates = store.templates();
            const newId = templates.length === 0 ? 0 : Math.max(...templates.map(t => t.id)) + 1; 

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
        deleteTemplate(id: number) {
            patchState(store, (state) => ({
                templates: state.templates.filter(t => t.id !== id),
            }));
        },
        updateTemplateName(id: number, name: string) {
            patchState(store, (state) => ({
                templates: state.templates.map(t =>
                    t.id === id ? { ...t, name } : t
                )
            }));
        },

        addField(id: number) {
            patchState(store, (state) => ({
                templates: state.templates.map(t =>
                    t.id === id ? {
                        ...t,
                        fields: [...t.fields, {
                            name: '',
                            type: TemplateFieldType.TEXT
                        }]
                    }
                        : t
                )
            }));
        },
        removeField(id: number, index: number) {
            patchState(store, (state) => ({
                templates: state.templates.map(t =>
                    t.id === id ? {
                        ...t,
                        fields: t.fields.filter((v, i) => i !== index),
                    }
                        : t
                )
            }));
        },
        updateTemplateContent(id: number, content: any) {
            console.log('Template id content', id, content)
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

        moveFieldUp(id: number, index: number) {
            if (index === 0) return;

            patchState(store, (state) => ({
                templates: state.templates.map(t => {
                    if (t.id !== id) return t;

                    const fields = [...t.fields];
                    [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];

                    return { ...t, fields };
                })
            }));
        },

        moveFieldDown(id: number, index: number) {
            patchState(store, (state) => ({
                templates: state.templates.map(t => {
                    if (t.id !== id) return t;
                    if (index === t.fields.length - 1) return t;

                    const fields = [...t.fields];
                    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];

                    return { ...t, fields };
                })
            }));
        }
    }))
);