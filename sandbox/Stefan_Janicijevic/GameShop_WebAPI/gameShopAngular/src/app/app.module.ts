import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamesComponent } from './games/games.component';
import { ShowGameComponent } from './games/show-game/show-game.component';
import { SharedService } from './shared.service';

import {HttpClientModule} from '@angular/common/http';
import { AddGameComponent } from './games/add-game/add-game.component';
import { DeleteGameComponent } from './games/delete-game/delete-game.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    ShowGameComponent,
    AddGameComponent,
    DeleteGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
