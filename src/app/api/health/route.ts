import { hasDatabase, db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const errorDetails = (error: unknown) => {
  if (error instanceof Error) {
    const cause = error.cause as { message?: string; code?: string } | undefined;
    return {
      message: error.message,
      causeMessage: cause?.message,
      causeCode: cause?.code,
    };
  }

  return { message: "Error desconocido" };
};

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
        ...errorDetails(error),
      },
      { status: 500 },
    );
  }
}
