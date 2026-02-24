import { NextRequest, NextResponse } from "next/server";
import { SimplexClient } from "simplex-ts";

function getClient() {
  const apiKey = process.env.SIMPLEX_API_KEY;
  if (!apiKey) {
    throw new Error("SIMPLEX_API_KEY is not set");
  }
  return new SimplexClient({ apiKey });
}

export async function GET() {
  try {
    const client = getClient();
    const result = await client.listCredentials();
    return NextResponse.json({ credentials: result.credentials || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list credentials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = getClient();
    const { name, value } = await request.json();
    console.log("[credentials POST] name:", name, "value present:", !!value);

    if (!name || !value) {
      return NextResponse.json({ error: "Name and value are required" }, { status: 400 });
    }

    const result = await client.storeCredential(name, value);
    console.log("[credentials POST] result:", JSON.stringify(result));

    if (!result.succeeded) {
      return NextResponse.json({ error: result.error || "Failed to store credential" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[credentials POST] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to store credential" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = getClient();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await client.deleteCredential(name);

    if (!result.succeeded) {
      return NextResponse.json({ error: result.error || "Failed to delete credential" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete credential" },
      { status: 500 }
    );
  }
}
