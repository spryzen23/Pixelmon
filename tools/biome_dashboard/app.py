from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
import streamlit as st


DEFAULT_METRICS_PATH = Path(__file__).with_name("biome_load_metrics.json")


def normalize_payload(payload: object) -> list[dict]:
    if isinstance(payload, list):
        return [event for event in payload if isinstance(event, dict)]

    if isinstance(payload, dict):
        events = payload.get("events", [])
        if isinstance(events, list):
            return [event for event in events if isinstance(event, dict)]

    return []


def load_default_events() -> list[dict]:
    if not DEFAULT_METRICS_PATH.exists():
        return []

    with DEFAULT_METRICS_PATH.open("r", encoding="utf-8") as file:
        return normalize_payload(json.load(file))


def load_uploaded_events(uploaded_file) -> list[dict]:
    if uploaded_file is None:
        return []

    return normalize_payload(json.load(uploaded_file))


def to_dataframe(events: list[dict]) -> pd.DataFrame:
    if not events:
        return pd.DataFrame()

    frame = pd.DataFrame(events)

    if "durationMs" in frame:
        frame["durationMs"] = pd.to_numeric(frame["durationMs"], errors="coerce")
    else:
        return pd.DataFrame()

    if "timestampIso" in frame:
        frame["timestampIso"] = pd.to_datetime(
            frame["timestampIso"],
            errors="coerce",
        )

    for column in ["firstLoad", "cacheHit"]:
        if column not in frame:
            frame[column] = False

        frame[column] = frame[column].fillna(False).astype(bool)

    return frame.dropna(subset=["durationMs"])


def format_ms(value: float | int | None) -> str:
    if value is None or pd.isna(value):
        return "n/a"

    return f"{value:,.1f} ms"


def average_duration(frame: pd.DataFrame) -> float | None:
    if frame.empty or "durationMs" not in frame:
        return None

    return frame["durationMs"].mean()


st.set_page_config(
    page_title="Voxel Legends Biome Load Dashboard",
    layout="wide",
)

st.title("Voxel Legends Biome Load Dashboard")
st.caption(
    "Analyze first-load times, cached reloads, and average wait time per biome."
)

uploaded_file = st.sidebar.file_uploader(
    "Upload biome_load_metrics.json",
    type=["json"],
)

events = load_uploaded_events(uploaded_file) or load_default_events()
df = to_dataframe(events)

with st.sidebar:
    st.markdown("### How to collect data")
    st.markdown(
        "1. Run the React game.\n"
        "2. Switch between biomes a few times.\n"
        "3. Click **Export Metrics** in the game UI.\n"
        "4. Upload the JSON here, or place it next to this file as "
        "`biome_load_metrics.json`."
    )

if df.empty:
    st.info(
        "No biome load metrics found yet. Export metrics from the game and "
        "upload the JSON file here."
    )
    st.code(
        json.dumps(
            {
                "events": [
                    {
                        "biomeId": 0,
                        "biomeName": "Grass Biome",
                        "biomeType": "grass",
                        "cacheHit": False,
                        "chunkCount": 25,
                        "durationMs": 42.4,
                        "firstLoad": True,
                        "timestampIso": "2026-06-04T00:00:00.000Z",
                        "trigger": "initial_mount",
                    }
                ],
                "schemaVersion": 1,
            },
            indent=2,
        ),
        language="json",
    )
    st.stop()

first_loads = df[df.get("firstLoad", False)]
cached_loads = df[~df.get("firstLoad", False)]

metric_1, metric_2, metric_3, metric_4 = st.columns(4)
metric_1.metric("Total Loads", f"{len(df):,}")
metric_2.metric("Average Wait", format_ms(average_duration(df)))
metric_3.metric("Average First Load", format_ms(average_duration(first_loads)))
metric_4.metric("Average Cached Reload", format_ms(average_duration(cached_loads)))

st.divider()

grouped = (
    df.groupby(["biomeId", "biomeName"], dropna=False)
    .agg(
        loads=("durationMs", "count"),
        avg_ms=("durationMs", "mean"),
        min_ms=("durationMs", "min"),
        max_ms=("durationMs", "max"),
        p95_ms=("durationMs", lambda values: values.quantile(0.95)),
        avg_chunks=("chunkCount", "mean")
        if "chunkCount" in df
        else ("durationMs", "count"),
        avg_active_chunks=("activeChunkCount", "mean")
        if "activeChunkCount" in df
        else ("durationMs", "count"),
        avg_cached_chunks=("cachedChunkCount", "mean")
        if "cachedChunkCount" in df
        else ("durationMs", "count"),
        avg_blocks=("blockCount", "mean")
        if "blockCount" in df
        else ("durationMs", "count"),
        avg_active_blocks=("activeBlockCount", "mean")
        if "activeBlockCount" in df
        else ("durationMs", "count"),
        avg_generated_chunks=("generatedChunkCountThisLoad", "mean")
        if "generatedChunkCountThisLoad" in df
        else ("durationMs", "count"),
    )
    .reset_index()
    .sort_values("biomeId")
)

st.subheader("Biome Summary")
st.dataframe(
    grouped.rename(
        columns={
            "avg_blocks": "avg_blocks_loaded",
            "avg_active_blocks": "avg_active_blocks_loaded",
            "avg_active_chunks": "avg_active_chunks_loaded",
            "avg_cached_chunks": "avg_cached_chunks",
            "avg_chunks": "avg_chunks_loaded",
            "avg_generated_chunks": "avg_generated_chunks_this_load",
            "avg_ms": "avg_wait_ms",
            "max_ms": "max_wait_ms",
            "min_ms": "min_wait_ms",
            "p95_ms": "p95_wait_ms",
        }
    ),
    use_container_width=True,
)

chart_data = grouped.set_index("biomeName")[["avg_ms", "p95_ms"]]
st.subheader("Average And P95 Wait By Biome")
st.bar_chart(chart_data)

if "timestampIso" in df and df["timestampIso"].notna().any():
    st.subheader("Load Duration Timeline")
    timeline = df.sort_values("timestampIso").set_index("timestampIso")[
        ["durationMs"]
    ]
    st.line_chart(timeline)

st.subheader("Raw Events")
visible_columns = [
    column
    for column in [
        "timestampIso",
        "biomeId",
        "biomeName",
        "biomeType",
        "trigger",
        "durationMs",
        "firstLoad",
        "cacheHit",
        "activeChunkCount",
        "activeBlockCount",
        "cachedChunkCount",
        "generatedChunkCountThisLoad",
        "chunkCount",
        "blockCount",
    ]
    if column in df
]
st.dataframe(
    df[visible_columns].sort_values("timestampIso", ascending=False)
    if "timestampIso" in df
    else df[visible_columns],
    use_container_width=True,
)
