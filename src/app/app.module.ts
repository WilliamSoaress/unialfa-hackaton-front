
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import 'tslib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenericDialogComponent } from './components/dialog/generic-dialog/generic-dialog.component';
import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { AvaliacoesComponent } from './pages/avaliacoes/avaliacoes.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from './shared/material/material.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { CanvasJSChart } from 'src/assets/canvasjs.angular.component';






@NgModule({
  declarations: [
    AppComponent,
    AvaliacaoComponent,
    AvaliacoesComponent,
    HomeComponent,
    GenericDialogComponent,
    LoginComponent,
    GraficosComponent,
    CanvasJSChart

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatPaginatorModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
