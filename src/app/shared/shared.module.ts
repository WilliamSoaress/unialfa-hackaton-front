import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HeaderComponent } from "../components/header/header.component";
import { HideHeaderDirective } from "../components/header/header.directive";
import { MaterialModule } from "./material/material.module";


@NgModule({
  declarations: [HeaderComponent, HideHeaderDirective],
  imports: [CommonModule, MaterialModule],
  exports: [HeaderComponent, MaterialModule],
})
export class SharedModule {}
