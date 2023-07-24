const getEnvVar = (name: string) => {
  const value = process.env[name];
  if (value === undefined) {
    throw `Missing environment variable: ${name}`;
  }
  return value;
};

class StackEnv {
  get identifier(): number {
    return parseInt(getEnvVar('STACK_IDENTIFIER'));
  }

  get endpointId(): number {
    return parseInt(getEnvVar('STACK_ENDPOINT_ID'));
  }

  get service(): string {
    return getEnvVar('STACK_SERVICE');
  }
}

class AuthEnv {
  get username(): string {
    return getEnvVar('AUTH_USERNAME');
  }

  get password(): string {
    return getEnvVar('AUTH_PASSWORD');
  }
}

class Env {
  private authEnv = new AuthEnv();
  private stackEnv = new StackEnv();

  get auth(): AuthEnv {
    return this.authEnv;
  }

  get stack(): StackEnv {
    return this.stackEnv;
  }

  get newTag(): string {
    return getEnvVar('NEW_TAG');
  }

  get portainerApiBaseUrl(): string {
    return getEnvVar('PORTAINER_API_BASE_URL');
  }
}

export const env = new Env();