export type OAuthProvider = "github" | "google"

const INVALID_VALUE_PATTERNS = [
  /^seu_/i,
  /^your_/i,
  /^insira/i,
  /^change[-_]?me/i,
  /^xxx+$/i,
]

function isValidOAuthValue(value: string | undefined): boolean {
  if (!value) return false

  const normalized = value.trim()

  if (!normalized) return false

  return !INVALID_VALUE_PATTERNS.some((pattern) => pattern.test(normalized))
}

function getProviderEnv(provider: OAuthProvider) {
  if (provider === "github") {
    return {
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }
  }

  return {
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }
}

export function hasValidOAuthConfig(provider: OAuthProvider): boolean {
  const { clientId, clientSecret } = getProviderEnv(provider)

  return isValidOAuthValue(clientId) && isValidOAuthValue(clientSecret)
}

export function getOAuthConfigError(provider: OAuthProvider): string | null {
  if (hasValidOAuthConfig(provider)) return null

  if (provider === "github") {
    return "OAuth do GitHub não está configurado. Defina AUTH_GITHUB_ID e AUTH_GITHUB_SECRET no arquivo .env.local."
  }

  return "OAuth do Google não está configurado. Defina AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET no arquivo .env.local."
}