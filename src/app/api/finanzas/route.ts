import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { presupuestos } from "@/db/schema";
import { rowToPresupuesto } from "@/lib/finanzas";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json({ presupuestos: [] });
  }

  const rows = await db
    .select()
    .from(presupuestos)
    .orderBy(desc(presupuestos.semana));
  return NextResponse.json({ presupuestos: rows.map(rowToPresupuesto) });
}

const numStr = (v: unknown, fallback = "0"): string => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? String(parsed) : fallback;
};

export async function PUT(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const semana =
    typeof body.semana === "string" ? body.semana.trim() : "";
  if (!/^\d{4}-W\d{2}$/.test(semana)) {
    return NextResponse.json(
      { error: "La semana es obligatoria (formato YYYY-Wnn)." },
      { status: 400 },
    );
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { error: "DATABASE_URL is required." },
      { status: 503 },
    );
  }

  const values = {
    semana,
    monto: numStr(body.monto),
    pctGastos: numStr(body.pctGastos, "50"),
    pctDeudas: numStr(body.pctDeudas, "30"),
    pctDisponible: numStr(body.pctDisponible, "20"),
    notas:
      typeof body.notas === "string" && body.notas.trim() !== ""
        ? body.notas.trim()
        : null,
  };

  const [row] = await db
    .insert(presupuestos)
    .values(values)
    .onConflictDoUpdate({ target: presupuestos.semana, set: values })
    .returning();

  return NextResponse.json({ presupuesto: rowToPresupuesto(row) });
}
