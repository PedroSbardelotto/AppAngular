import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A propriedade 'supabase' é pública para que outros serviços possam usá-la
  public supabase: SupabaseClient | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // A verificação de plataforma é a chave para evitar erros de SSR
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabaseInBrowser();
    }
  }

  private initializeSupabaseInBrowser() {
    // O cliente Supabase é criado SEM o objeto de configuração extra
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // O listener de autenticação também só é ativado no navegador
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  // O getter seguro garante que não tentemos usar o Supabase no servidor
  private getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('O cliente Supabase não foi inicializado. Este método só pode ser chamado no navegador.');
    }
    return this.supabase;
  }

  // Métodos de autenticação
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