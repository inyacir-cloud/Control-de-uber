import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { movimientos } from "@/db/schema";
import { CATEGORIAS, rowToMovimiento, type Categoria } from "@/lib/finanzas";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json({ movimientos: [] });
  }

  const rows = await db
    .select()
    .from(movimientos)
    .orderBy(desc(movimientos.fecha), desc(movimientos.id));
  return NextResponse.json({ movimientos: rows.map(rowToMovimiento) });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const semana = typeof body.semana === "string" ? body.semana.trim() : "";
  if (!/^\d{4}-W\d{2}$/.test(semana)) {
    return NextResponse.json({ error: "Semana inválida." }, { status: 400 });
  }

  const categoria =
    typeof body.categoria === "string" &&
    CATEGORIAS.includes(body.categoria as Categoria)
      ? (body.categoria as Categoria)
      : null;
  if (!categoria) {
    return NextResponse.json({ error: "Categoría inválida." }, { status: 400 });
  }

  const concepto =
    typeof body.concepto === "string" && body.concepto.trim() !== ""
      ? body.concepto.trim()
      : "";
  if (!concepto) {
    return NextResponse.json(
      { error: "Escribe un concepto." },
      { status: 400 },
    );
  }

  const montoNum = Number(body.monto);
  if (!Number.isFinite(montoNum) || montoNum <= 0) {
    return NextResponse.json(
      { error: "El monto debe ser mayor a 0." },
      { status: 400 },
    );
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  const fecha =
    typeof body.fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.fecha)
      ? body.fecha
      : new Date().toISOString().slice(0, 10);

  const [row] = await db
    .insert(movimientos)
    .values({
      semana,
      categoria,
      concepto,
      monto: String(montoNum),
      fecha,
    })
    .returning();

  return NextResponse.json({ movimiento: rowToMovimiento(row) }, { status: 201 });
}
