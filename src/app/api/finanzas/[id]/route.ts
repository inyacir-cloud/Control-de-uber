import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { presupuestos } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const presupuestoId = Number(id);
  if (!Number.isInteger(presupuestoId)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  await db.delete(presupuestos).where(eq(presupuestos.id, presupuestoId));
  return NextResponse.json({ ok: true });
}
