import { Component } from '@angular/core';
import { Auth, updateProfile } from '@angular/fire/auth';
import { user } from 'rxfire/auth';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { PlaylistService } from '../../services/playlist.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user$: Observable<any>;
  isEditOpen = false;

  editDisplayName = '';
  editPhotoUrl = ''; // ถ้ายังอยากให้ใส่ URL ได้
  selectedFile: File | null = null;

  previewUrl: string | null = null;
  fileError: string | null = null;
  saving = false;
  myListPreview: any[] = [];

  avatarBlobUrl: string | null = null;
  myListCount = 0;
  ratingCount = 0;
  watchedCount = 0;



  constructor(private auth: Auth, private authService: AuthService, private profileService: ProfileService, private playlistService: PlaylistService, private router: Router) {
    this.user$ = user(this.auth);

    this.auth.onAuthStateChanged(() => {
      this.loadAvatarFromApi();
    });
  }
  openMovie(movieId: number) {
  this.router.navigate(['/movie', movieId]);
}


  logout() {
    this.auth.signOut();
  }
  getImage(path?: string) {
  return path
    ? 'https://image.tmdb.org/t/p/w500' + path
    : 'assets/no-image.png';
}


  openEdit(u: any) {
    this.isEditOpen = true;
    this.editDisplayName = u.displayName || '';
    this.editPhotoUrl = u.photoUrl || u.photoURL || '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.fileError = null;
  }
  async loadAvatarFromApi() {
    if (this.avatarBlobUrl) {
      URL.revokeObjectURL(this.avatarBlobUrl);
    }

    const current = this.auth.currentUser;
    if (!current) return;

    const token = await current.getIdToken();

    this.authService.getMyPhoto(token).subscribe(blob => {
      this.avatarBlobUrl = URL.createObjectURL(blob);
    });
  }
ngOnInit() {
  this.profileService.getStats().subscribe(stats => {
    this.myListCount = stats.myLists;
    this.ratingCount = stats.ratings;
    this.watchedCount = stats.watched;
  });

  this.playlistService.getMyItems().subscribe(res => {
    this.myListPreview = res.items.slice(0, 6);
  });
}



  closeEdit() {
    this.isEditOpen = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // ตรวจ type / size แบบง่าย
    if (!file.type.startsWith('image/')) {
      this.fileError = 'ไฟล์ต้องเป็นรูปภาพเท่านั้น';
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.fileError = 'รูปใหญ่เกิน 2MB';
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }

    this.fileError = null;
    this.selectedFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = String(reader.result));
    reader.readAsDataURL(file);
  }


  async saveProfile() {
    try {
      this.saving = true;

      const current = this.auth.currentUser;
      if (!current) return;

      let uploadedPhotoUrl: string | undefined;

      if (this.selectedFile) {
        const res: any = await this.authService.uploadMyPhoto(this.selectedFile);
        uploadedPhotoUrl = res?.photoUrl;
      }



      await updateProfile(current, {
        displayName: this.editDisplayName || current.displayName,
        photoURL: uploadedPhotoUrl || current.photoURL
      });


      await this.authService.updateMe({
        displayName: this.editDisplayName,
        photoUrl: uploadedPhotoUrl
      });
      await this.loadAvatarFromApi();
      this.authService.notifyAvatarChanged();

      this.closeEdit();
    } catch (e) {
      console.error(e);
    } finally {
      this.saving = false;
    }
  }
}
