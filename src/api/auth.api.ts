import { type APIRequestContext } from '@playwright/test';
import { env } from '../config/env';
import type { LoginResponse, UserResponse } from '../types/api';

export class AuthApi {
  constructor(
    private readonly request: APIRequestContext,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<string> {
    const response = await this.request.post(
      `${env.apiBaseUrl}/users/login`,
      {
        data: {
          email,
          password,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `El login por API falló: ${response.status()} ${response.statusText()} - ${await response.text()}`,
      );
    }

    const body = (await response.json()) as LoginResponse;

    if (
      typeof body.access_token !== 'string' ||
      !body.access_token.trim()
    ) {
      throw new Error(
       'El login por API fue exitoso, pero no se recibió un access_token válido.',
      );
    }

    return body.access_token;
  }

  async getCurrentUser(
    token: string,
  ): Promise<UserResponse> {
    const response = await this.request.get(
      `${env.apiBaseUrl}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `No se pudo validar el usuario autenticado: ${response.status()} ${response.statusText()} - ${await response.text()}`,
      );
    }

    return (await response.json()) as UserResponse;
  }
}