export type Payload = Record<string, unknown>;

const numOrNull = (v: unknown): string | null => {
  if (v === null || v === undefined || v === "") return null;
  const parsed = Number(v);
  return Number.isFinite(parsed) ? String(parsed) : null;
};

const numStr = (v: unknown, fallback = "0"): string => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? String(parsed) : fallback;
};

export type ParsedJornada = {
  fecha: string;
  kmInicial: string;
  kmFinal: string;
  rendimientoKmL: string;
  precioGasolina: string;
  totalUber: string;
  saldoAcumulado: string;
  retiro: string;
  efectivoManual: string | null;
  otrosGastos: string;
  notas: string | null;
};

export function parseBody(
  body: Payload,
): { error: string } | { values: ParsedJornada } {
  const fecha = typeof body.fecha === "string" ? body.fecha.slice(0, 10) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return { error: "La fecha es obligatoria (formato YYYY-MM-DD)." };
  }
  return {
    values: {
      fecha,
      kmInicial: numStr(body.kmInicial),
      kmFinal: numStr(body.kmFinal),
      rendimientoKmL: numStr(body.rendimientoKmL),
      precioGasolina: numStr(body.precioGasolina),
      totalUber: numStr(body.totalUber),
      saldoAcumulado: numStr(body.saldoAcumulado),
      retiro: numStr(body.retiro),
      efectivoManual: numOrNull(body.efectivoManual),
      otrosGastos: numStr(body.otrosGastos),
      notas:
        typeof body.notas === "string" && body.notas.trim() !== ""
          ? body.notas.trim()
          : null,
    },
  };
}
