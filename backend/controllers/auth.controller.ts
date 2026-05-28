import { signUp, signIn, signOut, getCurrentUser, updateCurrentUser } from '@/backend/services/auth.service';
import type { RegisterRequest, LoginRequest } from '@/backend/types/api';
import { NextResponse } from 'next/server';

/**
 * auth.controller.ts
 * Handles HTTP request/response for authentication endpoints.
 */

export async function handleRegister(body: RegisterRequest): Promise<Response> {
  const { email, password, full_name, phone } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { success: false, error: 'Email, password, dan nama lengkap wajib diisi.' },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'Password minimal 8 karakter.' },
      { status: 400 }
    );
  }

  const result = await signUp({ email, password, full_name, phone });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
      data: { id: result.user!.id, email: result.user!.email },
    },
    { status: 201 }
  );
}

export async function handleLogin(body: LoginRequest): Promise<Response> {
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email dan password wajib diisi.' },
      { status: 400 }
    );
  }

  const result = await signIn({ email, password });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Login berhasil.',
    data: {
      id: result.user!.id,
      email: result.user!.email,
      full_name: result.user!.full_name,
      role: result.user!.role,
    },
  });
}

export async function handleLogout(): Promise<Response> {
  await signOut();
  return NextResponse.json({ success: true, message: 'Logout berhasil.' });
}

export async function handleGetMe(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Sesi tidak ditemukan.' },
      { status: 401 }
    );
  }
  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
  });
}

export async function handleUpdateMe(body: {
  full_name?: string;
  phone?: string;
  address?: string;
}): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Sesi tidak ditemukan.' },
      { status: 401 }
    );
  }

  const result = await updateCurrentUser(user.id, body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Profil berhasil diperbarui.',
    data: result.user,
  });
}
