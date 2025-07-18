import { inject, Injectable } from "@angular/core";
import { View } from "../models/view-interface";
import { ViewsStore } from "../store/views-store";

@Injectable({
    providedIn: 'root'
})
export class ViewsService {
    viewsStore = inject(ViewsStore);

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
        const views = this.viewsStore.views();
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
}