import { signalStore, withState } from '@ngrx/signals';
import { Template, TemplateFieldType } from '../models/template-interface';

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
        ]
    },
    {
        id: 2,
        name: "Project",
        fields: [
            { name: "Start Date", type: TemplateFieldType.DATE },
            { name: "End Date", type: TemplateFieldType.DATE },
            { name: "Status", type: TemplateFieldType.SELECT },
            { name: "Priority", type: TemplateFieldType.SELECT }
        ]
    },
    {
        id: 3,
        name: "Person",
        fields: [
            { name: "Title", type: TemplateFieldType.TEXT },
            { name: "Department", type: TemplateFieldType.TEXT },
            { name: "Manager", type: TemplateFieldType.NUMBER },
            { name: "Email", type: TemplateFieldType.TEXT },
        ]
    },
    {
        id: 4,
        name: "Segment",
        fields: [
            { name: "Created Date", type: TemplateFieldType.DATE },
        ]
    },
    {
        id: 5,
        name: "Memo",
        fields: [
            { name: "Subject", type: TemplateFieldType.TEXT },
            { name: "Date", type: TemplateFieldType.DATE },
        ]
    }
    ]
}

export const TemplatesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
);