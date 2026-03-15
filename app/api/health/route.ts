/**
 * Health check para monitoreo externo (Uptime Robot, etc.).
 * GET /api/health → { ok: true, timestamp }
 */
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
  })
}
