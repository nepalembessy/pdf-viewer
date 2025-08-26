export interface PDFEntry {
  id: string
  name: string
  email: string
  password: string
  filename: string
  blobUrl: string
  createdAt: string
}

export interface AdminUser {
  username: string
  password: string
}

class RedisClient {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = process.env.KV_REST_API_URL!
    this.token = process.env.KV_REST_API_TOKEN!
  }

  private async request(command: string[]) {
    const response = await fetch(`${this.baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([command]),
    })

    if (!response.ok) {
      throw new Error(`Redis request failed: ${response.statusText}`)
    }

    const [result] = await response.json()
    return result.result
  }

  async set(key: string, value: string) {
    return this.request(["SET", key, value])
  }

  async get(key: string): Promise<string | null> {
    return this.request(["GET", key])
  }

  async del(key: string) {
    return this.request(["DEL", key])
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.request(["EXISTS", key])
    return result === 1
  }

  async keys(pattern: string): Promise<string[]> {
    return this.request(["KEYS", pattern])
  }

  async hset(key: string, field: string, value: string) {
    return this.request(["HSET", key, field, value])
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.request(["HGET", key, field])
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const result = await this.request(["HGETALL", key])
    const obj: Record<string, string> = {}
    for (let i = 0; i < result.length; i += 2) {
      obj[result[i]] = result[i + 1]
    }
    return obj
  }
}

export const redis = new RedisClient()

// Helper functions for PDF entries
export async function savePDFEntry(entry: PDFEntry): Promise<void> {
  const key = `pdf:${entry.id}`
  await redis.hset(key, "name", entry.name)
  await redis.hset(key, "email", entry.email)
  await redis.hset(key, "password", entry.password)
  await redis.hset(key, "filename", entry.filename)
  await redis.hset(key, "blobUrl", entry.blobUrl)
  await redis.hset(key, "createdAt", entry.createdAt)
}

export async function getPDFEntry(id: string): Promise<PDFEntry | null> {
  const key = `pdf:${id}`
  const exists = await redis.exists(key)
  if (!exists) return null

  const data = await redis.hgetall(key)
  return {
    id,
    name: data.name,
    email: data.email,
    password: data.password,
    filename: data.filename,
    blobUrl: data.blobUrl,
    createdAt: data.createdAt,
  }
}

export async function getAllPDFEntries(): Promise<PDFEntry[]> {
  const keys = await redis.keys("pdf:*")
  const entries: PDFEntry[] = []

  for (const key of keys) {
    const id = key.replace("pdf:", "")
    const entry = await getPDFEntry(id)
    if (entry) entries.push(entry)
  }

  return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function deletePDFEntry(id: string): Promise<void> {
  const key = `pdf:${id}`
  await redis.del(key)
}
