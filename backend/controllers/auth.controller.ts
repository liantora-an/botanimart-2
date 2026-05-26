import { signUp, signIn, signOut, getCurrentUser } from '@/backend/services/auth.service';
import type { RegisterRequest, LoginRequest } from '@/backend/types/api';

/**
 * auth.controller.ts
 * Handles HTTP request/response for authentication endpoints.
 */

export async function handleRegister(body: RegisterRequest): Promise<Response> {
  const { email, password, full_name, phone } = body;

  if (!email || !password || !full_name) {
    return Response.json(
      { success: false, error: 'Email, password, dan nama lengkap wajib diisi.' },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return Response.json(
      { success: false, error: 'Password minimal 8 karakter.' },
      { status: 400 }
    );
  }

  const result = await signUp({ email, password, full_name, phone });

  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return Response.json(
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
    return Response.json(
      { success: false, error: 'Email dan password wajib diisi.' },
      { status: 400 }
    );
  }

  const result = await signIn({ email, password });

  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 401 }
    );
  }

  return Response.json({
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
  return Response.json({ success: true, message: 'Logout berhasil.' });
}

export async function handleGetMe(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { success: false, error: 'Sesi tidak ditemukan.' },
      { status: 401 }
    );
  }
  return Response.json({
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
