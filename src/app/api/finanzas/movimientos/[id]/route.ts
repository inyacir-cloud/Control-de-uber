import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { movimientos } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const movId = Number(id);
  if (!Number.isInteger(movId)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  await db.delete(movimientos).where(eq(movimientos.id, movId));
  return NextResponse.json({ ok: true });
}
