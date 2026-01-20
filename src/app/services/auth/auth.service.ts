import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,

} from "@angular/fire/auth";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { environment } from '../../../environmemts/environment';

export interface UpdateProfileRequest {
  displayName?: string;
  photoUrl?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiBase = environment.apiBaseUrl +"/api/users";

  constructor(private auth: Auth, private http: HttpClient) {}

  user$: Observable<User | null> = new Observable((observer) => {
    this.auth.onAuthStateChanged(observer);
  });

  // ---------- Firebase auth ----------
async signUp(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);

  // ส่งเมลยืนยัน
  await sendEmailVerification(cred.user);

  // สำคัญมาก: logout ทันที
  await signOut(this.auth);

  return cred;
}

 async signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(this.auth, email, password);

  //  ถ้ายังไม่ยืนยันอีเมล
  if (!cred.user.emailVerified) {
    //  ส่งเมลยืนยันให้อีกครั้ง
    await sendEmailVerification(cred.user);

    //  logout กัน session ค้าง
    await signOut(this.auth);

    // โยน error กลับไปให้หน้า login
    throw { code: 'auth/email-not-verified' };
  }

  return cred;
}



  signOut() {
    return signOut(this.auth);
  }

  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // signInWithFacebook() {
  //   return signInWithPopup(this.auth, new FacebookAuthProvider());
  // }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // ---------- Helper: auth headers ----------
  private async authHeaders(): Promise<HttpHeaders> {
    const u = this.auth.currentUser;
    if (!u) throw new Error("Not logged in");

    const idToken = await u.getIdToken();
    return new HttpHeaders({ Authorization: `Bearer ${idToken}` });
  }

  // ---------- Backend APIs ----------
async syncUserToDb() {
  const u = this.auth.currentUser;
  if (!u) return;

  const isPasswordProvider =
    u.providerData.some(p => p.providerId === 'password');

  if (isPasswordProvider && !u.emailVerified) {
    console.warn('Email not verified');
    return;
  }

  const headers = await this.authHeaders();
  return firstValueFrom(
    this.http.post(`${this.apiBase}/sync`, {}, { headers })
  );
}



  async getMe() {
    const headers = await this.authHeaders();
    return firstValueFrom(this.http.get(`${this.apiBase}/me`, { headers }));
  }

  async updateMe(payload: UpdateProfileRequest) {
    const headers = await this.authHeaders();
    return firstValueFrom(this.http.patch(`${this.apiBase}/me`, payload, { headers }));
  }

  async uploadMyPhoto(file: File) {
    const headers = await this.authHeaders();
    const fd = new FormData();
    fd.append("file", file);
    return firstValueFrom(this.http.post(`${this.apiBase}/me/photo`, fd, { headers }));
  }
  async debugToken() {
  const u = this.auth.currentUser;
  const t = await u?.getIdToken();
  console.log("ID TOKEN:", t);
  return t;
}
getMyPhoto(token: string) {
  return this.http.get(
     `${environment.apiBaseUrl}/api/users/me/photo`,
    {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
// auth.service.ts
private avatarRefreshSubject = new BehaviorSubject<void>(undefined);
avatarRefresh$ = this.avatarRefreshSubject.asObservable();

notifyAvatarChanged() {
  this.avatarRefreshSubject.next();
}
async resetPassword(email: string) {
  return sendPasswordResetEmail(this.auth, email);
}




}
