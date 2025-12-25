import { Injectable } from "@angular/core";
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
    constructor(private auth: Auth) {}


    // auth state observer
    user$: Observable<User | null> = new Observable((observer) => {
        this.auth.onAuthStateChanged(observer);
    });

    // สมัครสมาชิก
    signUp(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }
    // เข้าสู่ระบบ
    signIn(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    // ออกจากระบบ
    signOut() {
        return signOut(this.auth);
    }
    // รับข้อมูลผู้ใช้ปัจจุบัน
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }
    // เข้าสู่ระบบด้วย Google
    signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }
    // เข้าสู่ระบบด้วย Facebook
    signInWithFacebook() {
        const provider = new FacebookAuthProvider();
        return signInWithPopup(this.auth, provider);
    }
}