import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { hasDatabase, db } from "@/db";
import { jornadas } from "@/db/schema";
import { calcularTodas, resumir, rowToJornada } from "@/lib/calc";
import { parseBody, type Payload } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes") ?? "";

    const rows = await db.select().from(jornadas).orderBy(desc(jornadas.fecha));
    const todas = calcularTodas(rows.map(rowToJornada));

    const meses = Array.from(new Set(todas.map((j) => j.fecha.slice(0, 7)))).sort(
      (a, b) => b.localeCompare(a),
    );

    const filtradas =
      mes && mes !== "todos"
        ? todas.filter((j) => j.fecha.startsWith(mes))
        : todas;

    return NextResponse.json({
      jornadas: filtradas,
      resumen: resumir(filtradas),
      global: resumir(todas),
      meses,
      ultimoKmFinal: todas.length > 0 ? todas[0].kmFinal : 0,
      ultimoSaldo: todas.length > 0 ? todas[0].saldoAcumulado : 0,
      ultimoRendimiento: todas.length > 0 ? todas[0].rendimientoKmL : 0,
      ultimoPrecio: todas.length > 0 ? todas[0].precioGasolina : 0,
    });
  } catch {
    return NextResponse.json(
      {
        jornadas: [] as never[],
        resumen: resumir([]),
        global: resumir([]),
        meses: [] as string[],
        ultimoKmFinal: 0,
        ultimoSaldo: 0,
        ultimoRendimiento: 0,
        ultimoPrecio: 0,
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
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
    .insert(jornadas)
    .values(parsed.values)
    .onConflictDoUpdate({
      target: jornadas.fecha,
      set: parsed.values,
    })
    .returning();

  return NextResponse.json({ jornada: rowToJornada(row) }, { status: 201 });
}
