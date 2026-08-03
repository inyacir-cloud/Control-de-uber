import { hasDatabase, db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabase) {
    return Response.json({ ok: false, databaseConfigured: false }, { status: 503 });
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
