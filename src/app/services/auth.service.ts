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
    
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabaseInBrowser();
    }
  }

  private initializeSupabaseInBrowser() {
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  
  private getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('O cliente Supabase não foi inicializado. Este método só pode ser chamado no navegador.');
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