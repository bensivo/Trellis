import {signalStore, withState} from '@ngrx/signals';
import { TemplateFieldType } from '../models/template-interface';

interface NoteField {
    name: string;
    type: TemplateFieldType;
    value: any;
}

interface Note {
    id: number;
    name: string;
    template: string;
    fields: NoteField[];
}
type NotesStore = {
    notes: Note[]
}

const initialState: NotesStore = {
    notes: [
       {
           id: 1,
           name: "Team Standup - March 5th",
           template: "Meeting",
           fields: [
               { name: "Date", type: TemplateFieldType.DATE, value: "2025-03-05" },
               { name: "Location", type: TemplateFieldType.TEXT, value: "Conference Room A" },
               { name: "Organizer", type: TemplateFieldType.TEXT, value: "Sarah Johnson" },
               { name: "Attendees", type: TemplateFieldType.TEXT, value: "John, Mike, Lisa, Alex, Emily, David, Rachel, Tom" }
           ]
       },
       {
           id: 2,
           name: "E-commerce Redesign",
           template: "Project",
           fields: [
               { name: "Start Date", type: TemplateFieldType.DATE, value: "2025-02-01" },
               { name: "End Date", type: TemplateFieldType.DATE, value: "2025-06-30" },
               { name: "Status", type: TemplateFieldType.SELECT, value: "In Progress" },
               { name: "Priority", type: TemplateFieldType.SELECT, value: "High" }
           ]
       },
       {
           id: 3,
           name: "John Smith Profile",
           template: "Person",
           fields: [
               { name: "Title", type: TemplateFieldType.TEXT, value: "Senior Software Engineer" },
               { name: "Department", type: TemplateFieldType.TEXT, value: "Engineering" },
               { name: "Manager", type: TemplateFieldType.NUMBER, value: 1001 },
               { name: "Email", type: TemplateFieldType.TEXT, value: "john.smith@company.com" }
           ]
       },
       {
           id: 4,
           name: "Mobile Users Segment",
           template: "Segment",
           fields: [
               { name: "Created Date", type: TemplateFieldType.DATE, value: "2025-01-15" }
           ]
       },
       {
           id: 5,
           name: "Remote Work Policy Update",
           template: "Memo",
           fields: [
               { name: "Subject", type: TemplateFieldType.TEXT, value: "Updated Remote Work Guidelines" },
               { name: "Date", type: TemplateFieldType.DATE, value: "2025-03-01" }
           ]
       },
       {
           id: 6,
           name: "Q1 Planning Meeting",
           template: "Meeting",
           fields: [
               { name: "Date", type: TemplateFieldType.DATE, value: "2025-03-15" },
               { name: "Location", type: TemplateFieldType.TEXT, value: "Boardroom" },
               { name: "Organizer", type: TemplateFieldType.TEXT, value: "Lisa Martinez" },
               { name: "Attendees", type: TemplateFieldType.TEXT, value: "All Team Leads and Directors" }
           ]
       },
       {
           id: 7,
           name: "Mobile App Development",
           template: "Project",
           fields: [
               { name: "Start Date", type: TemplateFieldType.DATE, value: "2025-01-10" },
               { name: "End Date", type: TemplateFieldType.DATE, value: "2025-04-15" },
               { name: "Status", type: TemplateFieldType.SELECT, value: "Planning" },
               { name: "Priority", type: TemplateFieldType.SELECT, value: "Medium" }
           ]
       },
       {
           id: 8,
           name: "Emily Davis Contact",
           template: "Person",
           fields: [
               { name: "Title", type: TemplateFieldType.TEXT, value: "UX Designer" },
               { name: "Department", type: TemplateFieldType.TEXT, value: "Design" },
               { name: "Manager", type: TemplateFieldType.NUMBER, value: 1005 },
               { name: "Email", type: TemplateFieldType.TEXT, value: "emily.davis@company.com" }
           ]
       },
       {
           id: 9,
           name: "Premium Customers",
           template: "Segment",
           fields: [
               { name: "Created Date", type: TemplateFieldType.DATE, value: "2025-02-10" }
           ]
       },
       {
           id: 10,
           name: "Security Protocol Changes",
           template: "Memo",
           fields: [
               { name: "Subject", type: TemplateFieldType.TEXT, value: "New Security Procedures" },
               { name: "Date", type: TemplateFieldType.DATE, value: "2025-02-28" }
           ]
       }
   ] 
}

export const NotesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
);