import alasql from 'alasql'
import { computed, inject, Injectable } from "@angular/core";
import { View } from "../models/view-interface";
import { ViewsStore } from "../store/views-store";
import { NotesStore } from '../store/notes-store';
import { TemplatesStore } from '../store/templates-store';

@Injectable({
    providedIn: 'root'
})
export class ViewsService {
    readonly viewsStore = inject(ViewsStore);
    readonly notesStore = inject(NotesStore);
    readonly templatesStore = inject(TemplatesStore);

    create(dto: Partial<View>) {
        const views = this.viewsStore.views();

        const newId = views.length === 0 ? 0 : Math.max(...views.map(t => t.id)) + 1;
        const newView: View = {
            id: newId,
            name: dto.name || '',
            sql: dto.sql || '',
        };

        this.viewsStore.set([
            ...this.viewsStore.views(),
            newView
        ]);

        return newId;
    }

    update(id: number, dto: Partial<View>) {
        // NOTE: remember to copy the view data, instead of using a reference
        // otherwise, change detection won't trigger
        const views = [...this.viewsStore.views()]; 
        const viewIndex = views.findIndex(v => v.id === id);
        if (viewIndex === -1) {
            return;
        }

        views[viewIndex] = {
            ...views[viewIndex],
            ...dto
        };

        this.viewsStore.set(views);
    }

    delete(id: number) {
        const views = this.viewsStore.views();
        const viewIndex = views.findIndex(v => v.id === id);
        if (viewIndex === -1) {
            return;
        }

        views.splice(viewIndex, 1);
        this.viewsStore.set(views);
    }

    evaluateSQL(sql: string): any[] {
        const templates = this.templatesStore.templates();
        const templatesTable = templates.map(template => {
            const fields: Record<string, any> = {};
            for (const field of template.fields) {
                fields[field.name] = field.type;
            }

            return {
                id: template.id,
                name: template.name,
                ...fields,
            };
        });
        alasql('CREATE TABLE IF NOT EXISTS templates');
        alasql('DELETE FROM templates'); 
        alasql.tables['templates'].data = templatesTable;

        const notes = this.notesStore.notes();
        const notesTable = notes.map(note => {
            const fields: Record<string, any> = {};
            for(const field of note.fields) {
                fields[field.name] = field.value;
            };
            return {
                id: note.id,
                name: note.name,
                link: `link-${note.id}`,
                templateId: note.templateId,
                ...fields,
            };
        });

        alasql('CREATE TABLE IF NOT EXISTS notes');
        alasql('DELETE FROM notes'); 
        alasql.tables['notes'].data = notesTable;

        return alasql(sql);
    } }