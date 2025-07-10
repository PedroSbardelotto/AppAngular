import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public supabase: SupabaseClient;

  //  BehaviorSubject para emitir o estado do usuário em tempo real
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSubject.next(session?.user ?? null);
      console.log('Estado da autenticação mudou:', event, session);
    });
  }

  
  async signIn(credentials: { email: string, pass: string }) {
    return this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.pass,
    });
  }

  
  async signUp(credentials: { email: string, pass: string }) {
    return this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.pass,
    });
  }

 
  async signOut() {
    return this.supabase.auth.signOut();
  }
  
  //  verificar se o usuário está logado (para o AuthGuard)
  isLoggedIn(): boolean {
    return !!this.userSubject.getValue();
  }
}