import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const METRICS_FILE_PATH = path.join(
  process.cwd(),
  "references",
  "biome",
  "tools",
  "biome_dashboard",
  "biome_load_metrics.json"
);

export async function POST(request) {
  try {
    const metric = await request.json();

    let existingData = { events: [], schemaVersion: 1 };
    try {
      const fileContent = await fs.readFile(METRICS_FILE_PATH, "utf8");
      if (fileContent.trim()) {
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed)) {
          existingData.events = parsed;
        } else if (parsed && parsed.events) {
          existingData = parsed;
        }
      }
    } catch (err) {
      // If file doesn't exist or is invalid, start fresh
      if (err.code !== "ENOENT") {
        console.warn(
          "Could not read existing metrics file, starting fresh",
          err
        );
      }
    }

    // Append the new metric, keeping historic data intact
    existingData.events.push(metric);

    // Save back to disk
    await fs.mkdir(path.dirname(METRICS_FILE_PATH), { recursive: true });
    await fs.writeFile(
      METRICS_FILE_PATH,
      JSON.stringify(existingData, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      count: existingData.events.length,
    });
  } catch (error) {
    console.error("Failed to save biome metric", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
