import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvaliacoesComponent } from './pages/avaliacoes/avaliacoes.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { GraficosComponent } from './pages/graficos/graficos.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'new',
    component: AvaliacaoComponent,
  },
  {
    path: 'avaliacoes',
    component: AvaliacoesComponent
  },
  {
    path: 'grafico',
    component: GraficosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
