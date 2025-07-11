import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  loading = false;
  uploading = false;

  
  user: User | null = null;
  profile: Profile | null = null;
  avatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getProfile();
  }

  
  async getProfile() {
    try {
      this.loading = true;
      const profile = await this.profileService.getProfile();
      if (profile) {
        this.profile = profile;
        if (profile.avatar_url) {
          this.avatarUrl = this.profileService.getAvatarUrl(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      alert('Não foi possível carregar os dados do perfil.');
    } finally {
      this.loading = false;
    }
  }

  
  async updateProfile() {
    if (!this.profile) return;
    
    try {
      this.loading = true;
      await this.profileService.updateProfile({
        username: this.profile.username
      });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Não foi possível atualizar o perfil.');
    } finally {
      this.loading = false;
    }
  }

  
  async uploadAvatar(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    try {
      this.uploading = true;
      const filePath = await this.profileService.uploadAvatar(file);
      
      
      await this.profileService.updateProfile({ avatar_url: filePath });

      
      this.avatarUrl = this.profileService.getAvatarUrl(filePath);

      alert('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      alert('Não foi possível fazer o upload do avatar.');
    } finally {
      this.uploading = false;
    }
  }
}