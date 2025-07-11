import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private authService: AuthService) { }

  async getProfile() {
    if (!this.authService.supabase || !this.authService.isLoggedIn()) {
      throw new Error('Usuário não autenticado.');
    }
    const user = (await this.authService.supabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error('Sessão de usuário não encontrada.');
    }
    const { data, error } = await this.authService.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
    return data as Profile;
  }

  async updateProfile(profile: Partial<Profile>) {
    const user = (await this.authService.supabase!.auth.getUser()).data.user;
    if (!user) throw new Error('Sessão de usuário não encontrada.');

    const updates = {
      ...profile,
      id: user.id,
      updated_at: new Date().toISOString()
    };

    const { error } = await this.authService.supabase!.from('profiles').upsert(updates);
    if (error) throw error;
  }

  
  async uploadAvatar(file: File): Promise<string> {
    const user = (await this.authService.supabase!.auth.getUser()).data.user;
    if (!user) throw new Error('Sessão de usuário não encontrada.');

    const fileExt = file.name.split('.').pop();
    
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error } = await this.authService.supabase!.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true, 
        contentType: file.type 
      });

    if (error) {
      console.error("Erro no upload:", error);
      throw error;
    }
    return filePath;
  }

  getAvatarUrl(path: string): string {
    if (!path) return '';
    const { data } = this.authService.supabase!.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  }
}