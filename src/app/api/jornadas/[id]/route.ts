import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { jornadas } from "@/db/schema";
import { rowToJornada } from "@/lib/calc";
import { parseBody } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const jornadaId = Number(id);
  if (!Number.isInteger(jornadaId)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  const [row] = await db
    .update(jornadas)
    .set(parsed.values)
    .where(eq(jornadas.id, jornadaId))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  }

  return NextResponse.json({ jornada: rowToJornada(row) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const jornadaId = Number(id);
  if (!Number.isInteger(jornadaId)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  await db.delete(jornadas).where(eq(jornadas.id, jornadaId));
  return NextResponse.json({ ok: true });
}
