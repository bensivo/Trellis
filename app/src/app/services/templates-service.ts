import { computed, inject, Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { Template } from "../models/template-interface";
import { TemplatesStore } from "../store/templates-store";

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  readonly templatesStore = inject(TemplatesStore);

  readonly router = inject(Router);

  private readonly navigationEnd$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.router.routerState.root),
    startWith(this.router.routerState.root)
  );
  
  // Signal based on the router navigation events which returns a map of routeparams
  readonly routeParams = toSignal(
    this.navigationEnd$.pipe(
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.params;
      })
    ), 
    { 
      initialValue: null 
    }
  );

  readonly currentTemplateId: Signal<number | null> = computed(() => {
    const params = this.routeParams();
    if (params == null) {
      return null;
    }
    return +params['templateid'];
  });

  readonly currentTemplate: Signal<Template| null> = computed(() => {
    const templateId = this.currentTemplateId();
    const templates = this.templatesStore.templates();

    if (templateId == null) {
      return null;
    }

    const template = templates.find(n => n.id == templateId);
    return template ?? null;
  })

}