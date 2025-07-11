import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // SÓ escutamos o estado de autenticação se estivermos no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabase();
    }
  }

  private initializeSupabase() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);


    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.userSubject.next(session?.user ?? null);
    });
  }


  private getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client has not been initialized. This method can only be called in the browser.');
    }
    return this.supabase;
  }


  async signIn(credentials: { email: string, pass: string }) {
    return this.getClient().auth.signInWithPassword({
      email: credentials.email,
      password: credentials.pass,
    });
  }

  async signUp(credentials: { email: string, pass: string }) {
    return this.getClient().auth.signUp({
      email: credentials.email,
      password: credentials.pass,
    });
  }

  async signOut() {
    return this.getClient().auth.signOut();
  }
  isLoggedIn(): boolean {
    
    return !!this.userSubject.getValue();
  }
}