import { NgModule } from '@angular/core';
import { BrowserModule,provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS,withFetch,withInterceptorsFromDi } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, // <-- Añade esto
    
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
