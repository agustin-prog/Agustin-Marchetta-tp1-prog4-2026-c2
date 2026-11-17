import { Injectable, inject } from "@angular/core";
import { LogAdminService, FiltroLog, LogModel } from "./log-admin.service";

export type { FiltroLog, LogModel };

@Injectable({ providedIn: "root" })
export class LogAdminStore {
  private readonly service = inject(LogAdminService);

  listar(f: FiltroLog): Promise<LogModel[]> {
    return this.service.listar(f);
  }
}