"use client";

import { useMemo, useState } from "react";

type Stage = "idle" | "storing" | "corrupting" | "relaxing" | "recalled";
type SpecimenGrid = number[][];

const GRID_COLS = 7;
const GRID_ROWS = 9;

const results = [
  "subject stabilized as a forbidden missing character.",
  "memory recalled with suspicious allowlist energy.",
  "network says this one escaped the ASCII 32–126 archive.",
  "subject is 72% art enjoyer, 28% WL goblin.",
  "noise level too high. vibes still passed.",
  "retrieved as a rare specimen of terminal brainrot.",
  "network refused to converge until Adam was tagged.",
  "subject stored successfully in the basin of hope.",
  "recalled form is unstable, but culturally valid.",
  "this pattern should not exist, but here we are.",
];

const families = [
  "Outside The Archive",
  "Ghost Basin",
  "Dense Symbol Cousin",
  "Unstable Container",
  "Floating Mark Variant",
  "Crossbar Adjacent",
  "Curve Anomaly",
  "Terminal Goblin",
];

const missingCharacters = ["⧉", "⌁", "⌬", "◌", "⌖", "⟟", "⧗", "⊙", "◇", "∆", "∴", "⟁"];

const asciiSymbols = [
  "@",
  "%",
  "#",
  "&",
  "?",
  "$",
  "+",
  "=",
  "*",
  "/",
  "\\",
  "{",
  "}",
  "[",
  "]",
  "~",
];

function cleanHandle(value: string) {
  const cleaned = value.trim().replace(/^https?:\/\/(www\.)?x\.com\//, "");
  if (!cleaned) return "";
  return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
}

function getHash(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return function random() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeNoise(seed: number, length = 420) {
  let text = "";

  for (let i = 0; i < length; i++) {
    const index = (seed + i * 17 + Math.floor(i / 3)) % asciiSymbols.length;
    text += asciiSymbols[index];
    if (i % 28 === 27) text += "\n";
  }

  return text;
}

function corruptHandle(handle: string, seed: number) {
  const chars = handle.split("");

  return chars
    .map((char, index) => {
      if (char === "@") return "@";

      if ((seed + index * 9) % 4 === 0) {
        return asciiSymbols[(seed + index) % asciiSymbols.length];
      }

      if ((seed + index * 5) % 7 === 0) return "█";

      return char;
    })
    .join("");
}

function countCells(grid: SpecimenGrid) {
  return grid.flat().filter(Boolean).length;
}

function setCell(grid: SpecimenGrid, row: number, col: number, value = 1) {
  if (row < 0 || row >= GRID_ROWS) return;
  if (col < 0 || col >= GRID_COLS) return;
  grid[row][col] = value;
}

function generateMissingCharacterGrid(handle: string) {
  const seed = getHash(handle || "@unknown");
  const random = seededRandom(seed);
  const grid: SpecimenGrid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => 0)
  );

  const mode = seed % 6;
  const centerCol = 3;

  if (mode === 0) {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col <= centerCol; col++) {
        const distance = Math.abs(row - 4) + Math.abs(col - centerCol);
        const chance = distance < 4 ? 0.48 : 0.2;

        if (random() < chance) {
          setCell(grid, row, col);
          if (random() < 0.74) setCell(grid, row, GRID_COLS - 1 - col);
        }
      }
    }

    for (let row = 1; row < GRID_ROWS - 1; row += 2) {
      if (random() < 0.78) setCell(grid, row, centerCol);
    }
  }

  if (mode === 1) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const wave = Math.round(3 + Math.sin((row + (seed % 5)) * 0.9) * 2);

      setCell(grid, row, wave);
      if (random() < 0.65) setCell(grid, row, wave - 1);
      if (random() < 0.55) setCell(grid, row, wave + 1);

      if (row % 3 === seed % 3) {
        setCell(grid, row, centerCol);
      }
    }

    for (let i = 0; i < 8; i++) {
      setCell(
        grid,
        Math.floor(random() * GRID_ROWS),
        Math.floor(random() * GRID_COLS)
      );
    }
  }

  if (mode === 2) {
    for (let row = 1; row < GRID_ROWS - 1; row++) {
      setCell(grid, row, centerCol);

      if (row % 2 === 0) {
        setCell(grid, row, centerCol - 2);
        setCell(grid, row, centerCol + 2);
      }

      if (random() < 0.52) setCell(grid, row, centerCol - 1);
      if (random() < 0.52) setCell(grid, row, centerCol + 1);
    }

    for (let col = 1; col < GRID_COLS - 1; col++) {
      if (random() < 0.8) setCell(grid, 1, col);
      if (random() < 0.72) setCell(grid, 7, col);
    }
  }

  if (mode === 3) {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const leftDiag = row - col;
        const rightDiag = row + col;

        if (Math.abs(leftDiag - 1) <= 1 && random() < 0.65) {
          setCell(grid, row, col);
        }

        if (Math.abs(rightDiag - 7) <= 1 && random() < 0.58) {
          setCell(grid, row, col);
        }

        if (random() < 0.055) setCell(grid, row, col);
      }
    }

    setCell(grid, 4, 3);
    setCell(grid, 4, 2);
    setCell(grid, 4, 4);
  }

  if (mode === 4) {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const dx = Math.abs(col - 3);
        const dy = Math.abs(row - 4);
        const ring = dx + dy;

        if ((ring === 3 || ring === 4) && random() < 0.72) {
          setCell(grid, row, col);
        }

        if (ring <= 1 && random() < 0.4) {
          setCell(grid, row, col);
        }
      }
    }

    setCell(grid, 4, 3, 0);
  }

  if (mode === 5) {
    const anchors = [
      [1, 1],
      [1, 5],
      [4, 3],
      [7, 1],
      [7, 5],
    ];

    anchors.forEach(([row, col]) => {
      setCell(grid, row, col);
      if (random() < 0.8) setCell(grid, row + 1, col);
      if (random() < 0.8) setCell(grid, row, col + (col < 3 ? 1 : -1));
    });

    for (let i = 0; i < 16; i++) {
      const row = Math.floor(random() * GRID_ROWS);
      const col = Math.floor(random() * GRID_COLS);

      if (random() < 0.74) setCell(grid, row, col);
    }
  }

  for (let row = 0; row < GRID_ROWS; row++) {
    const rowCount = grid[row].filter(Boolean).length;

    if (rowCount === 0) {
      setCell(grid, row, Math.floor(random() * GRID_COLS));
    }

    if (rowCount > 5) {
      const removable = grid[row]
        .map((cell, col) => (cell ? col : -1))
        .filter((col) => col !== -1);

      while (grid[row].filter(Boolean).length > 5) {
        const col = removable[Math.floor(random() * removable.length)];
        grid[row][col] = 0;
      }
    }
  }

  while (countCells(grid) < 18) {
    setCell(
      grid,
      Math.floor(random() * GRID_ROWS),
      Math.floor(random() * GRID_COLS)
    );
  }

  while (countCells(grid) > 33) {
    const row = Math.floor(random() * GRID_ROWS);
    const col = Math.floor(random() * GRID_COLS);
    grid[row][col] = 0;
  }

  return grid;
}

function corruptGrid(
  grid: SpecimenGrid,
  handle: string,
  stage: Stage,
  pass: number
) {
  const seed = getHash(handle || "@unknown") + pass * 131;
  const random = seededRandom(seed);
  const copy = grid.map((row) => [...row]);

  if (stage === "recalled") return copy;

  let corruptionRate = 0.26;

  if (stage === "idle") corruptionRate = 0.16;
  if (stage === "storing") corruptionRate = 0.05;
  if (stage === "corrupting") corruptionRate = 0.38;
  if (stage === "relaxing") corruptionRate = Math.max(0.02, 0.34 - pass * 0.04);

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (random() < corruptionRate) {
        copy[row][col] = copy[row][col] ? 0 : 1;
      }
    }
  }

  return copy;
}

function stringToBytes(value: string) {
  return Array.from(new TextEncoder().encode(value));
}

function bytesToString(bytes: number[]) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function writeHiddenPayload(
  ctx: CanvasRenderingContext2D,
  payload: string,
  width: number,
  height: number
) {
  const bytes = stringToBytes(payload);
  const length = bytes.length;

  const bits: number[] = [];

  for (let i = 15; i >= 0; i--) {
    bits.push((length >> i) & 1);
  }

  bytes.forEach((byte) => {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  });

  const startX = 8;
  const startY = height - 12;
  const maxPerRow = width - 16;

  bits.forEach((bit, index) => {
    const x = startX + (index % maxPerRow);
    const y = startY + Math.floor(index / maxPerRow);

    ctx.fillStyle = bit ? "rgb(255,255,255)" : "rgb(0,0,0)";
    ctx.fillRect(x, y, 1, 1);
  });
}

function readHiddenPayloadFromCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const startX = 8;
  const startY = height - 12;
  const maxPerRow = width - 16;

  function readBit(index: number) {
    const x = startX + (index % maxPerRow);
    const y = startY + Math.floor(index / maxPerRow);
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    return pixel[0] > 120 && pixel[1] > 120 && pixel[2] > 120 ? 1 : 0;
  }

  let length = 0;

  for (let i = 0; i < 16; i++) {
    length = (length << 1) | readBit(i);
  }

  if (!length || length > 500) {
    throw new Error("No readable Pattern Retrieval payload found.");
  }

  const bytes: number[] = [];

  for (let byteIndex = 0; byteIndex < length; byteIndex++) {
    let byte = 0;

    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
      byte = (byte << 1) | readBit(16 + byteIndex * 8 + bitIndex);
    }

    bytes.push(byte);
  }

  return bytesToString(bytes);
}

export default function Home() {
  const [input, setInput] = useState("");
  const [handle, setHandle] = useState("");
  const [decodedOwner, setDecodedOwner] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [pass, setPass] = useState(0);
  const [seed, setSeed] = useState(95);
  const [result, setResult] = useState("");
  const [family, setFamily] = useState("");
  const [noise, setNoise] = useState(makeNoise(95));

  const cleaned = useMemo(() => cleanHandle(input), [input]);

  const specimenId = useMemo(() => {
    const id = (getHash(handle || cleaned || "specimen") % 900) + 95;
    return String(id).padStart(3, "0");
  }, [cleaned, handle]);

  const missingCharacter = useMemo(() => {
    const source = handle || cleaned || "@unknown";
    return missingCharacters[getHash(source) % missingCharacters.length];
  }, [cleaned, handle]);

  const corruption = useMemo(() => {
    if (!handle) return 0;
    return (getHash(handle) % 61) + 34;
  }, [handle]);

  const baseGrid = useMemo(() => {
    return generateMissingCharacterGrid(handle || cleaned || "@unknown");
  }, [cleaned, handle]);

  const displayGrid = useMemo(() => {
    return corruptGrid(baseGrid, handle || cleaned || "@unknown", stage, pass);
  }, [baseGrid, cleaned, handle, pass, stage]);

  const recalledText = useMemo(() => {
    if (!handle) return "";
    if (stage === "idle") return handle;
    if (stage === "storing") return handle;
    if (stage === "corrupting") return corruptHandle(handle, seed);
    if (stage === "relaxing") return corruptHandle(handle, seed + pass);
    return handle;
  }, [handle, pass, seed, stage]);

  async function beginRetrieval() {
    const nextHandle = cleanHandle(input);

    if (!nextHandle || nextHandle.length < 2) {
      alert("Enter your X handle first.");
      return;
    }

    const nextSeed = getHash(nextHandle);

    setHandle(nextHandle);
    setSeed(nextSeed);
    setNoise(makeNoise(nextSeed));
    setResult(results[nextSeed % results.length]);
    setFamily(families[nextSeed % families.length]);
    setPass(0);

    setStage("storing");
    await wait(900);

    setStage("corrupting");
    await wait(1200);

    setStage("relaxing");

    for (let i = 1; i <= 8; i++) {
      setPass(i);
      setNoise(makeNoise(nextSeed + i * 101));
      await wait(420);
    }

    setStage("recalled");
  }

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function reset() {
    setStage("idle");
    setPass(0);
    setHandle("");
    setResult("");
    setFamily("");
    setNoise(makeNoise(95));
  }

  function getStageLabel() {
    if (stage === "idle") return "AWAITING SUBJECT";
    if (stage === "storing") return "STORING MEMORY";
    if (stage === "corrupting") return "ADDING NOISE";
    if (stage === "relaxing") return `RELAXING PASS ${pass}/8`;
    return "RECALL COMPLETE";
  }

  function drawSpecimenOnCanvas(
    ctx: CanvasRenderingContext2D,
    grid: SpecimenGrid,
    startX: number,
    startY: number,
    cellSize: number,
    gap: number
  ) {
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = startX + colIndex * (cellSize + gap);
        const y = startY + rowIndex * (cellSize + gap);

        ctx.fillStyle = cell ? "#deded3" : "#111b11";
        ctx.fillRect(x, y, cellSize, cellSize);

        if (cell) {
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.fillRect(x + 4, y + 4, cellSize - 8, 4);
        }
      });
    });
  }

  function downloadCard() {
  if (!handle) return;

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1700;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const finalGrid = generateMissingCharacterGrid(handle);

  const gradient = ctx.createLinearGradient(0, 0, 1200, 1700);
  gradient.addColorStop(0, "#050805");
  gradient.addColorStop(0.5, "#0c130c");
  gradient.addColorStop(1, "#050805");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 1700);

  ctx.strokeStyle = "#243324";
  ctx.lineWidth = 6;
  ctx.strokeRect(70, 70, 1060, 1560);

  ctx.fillStyle = "#e8a320";
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.fillText("MISSING CHARACTER LAB", 600, 155);

  ctx.fillStyle = "#b46e14";
  ctx.font = "28px monospace";
  ctx.fillText("PATTERN//RETRIEVAL FAN TRANSMISSION", 600, 205);

  ctx.fillStyle = "#081008";
  ctx.fillRect(180, 270, 840, 650);

  ctx.strokeStyle = "#2d402d";
  ctx.lineWidth = 3;
  ctx.strokeRect(180, 270, 840, 650);

  ctx.fillStyle = "#b46e14";
  ctx.font = "22px monospace";
  ctx.fillText(`MISSING CHARACTER ${missingCharacter} / PASS 8 OF 8`, 600, 325);

  const cellSize = 58;
  const gap = 5;
  const gridWidth = GRID_COLS * cellSize + (GRID_COLS - 1) * gap;
  const gridHeight = GRID_ROWS * cellSize + (GRID_ROWS - 1) * gap;
  const startX = 600 - gridWidth / 2;
  const startY = 370 + (470 - gridHeight) / 2;

  drawSpecimenOnCanvas(ctx, finalGrid, startX, startY, cellSize, gap);

  ctx.fillStyle = "#e8a320";
  ctx.font = "bold 40px monospace";
  ctx.fillText(`MISSING CHARACTER ${specimenId}`, 600, 1000);

  ctx.textAlign = "left";
  ctx.fillStyle = "#d8d8cc";
  ctx.font = "30px monospace";

  let y = 1100;

  const normalLines = [
    `SUBJECT: ${handle}`,
    `CHARACTER: ${missingCharacter}`,
    `FAMILY: ${family}`,
    `NOISE: ${corruption}%`,
    `PASSES: 8/8`,
  ];

  normalLines.forEach((line) => {
    ctx.fillText(line, 150, y);
    y += 64;
  });

  y += 12;

  ctx.fillStyle = "#e8a320";
  ctx.font = "28px monospace";
  ctx.fillText("RESULT:", 150, y);

  ctx.fillStyle = "#d8d8cc";
  ctx.font = "26px monospace";
  y = wrapCanvasText(ctx, result, 150, y + 46, 900, 34) + 40;

  ctx.textAlign = "center";
  ctx.fillStyle = "#b46e14";
  ctx.font = "24px monospace";
  ctx.fillText(
    "94 specimens in the archive. 1 unstable visitor outside it.",
    600,
    1580
  );

  const link = document.createElement("a");
  link.download = `${handle.replace("@", "")}-missing-character-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadGridBlock() {
  if (!handle) return;

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1100;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const finalGrid = generateMissingCharacterGrid(handle);

  ctx.fillStyle = "#050805";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#243324";
  ctx.lineWidth = 5;
  ctx.strokeRect(50, 50, 800, 1000);

  ctx.fillStyle = "#e8a320";
  ctx.font = "bold 38px monospace";
  ctx.textAlign = "center";
  ctx.fillText("MISSING CHARACTER", 450, 120);

  ctx.fillStyle = "#b46e14";
  ctx.font = "22px monospace";
  ctx.fillText(`SPECIMEN ${specimenId} / ${missingCharacter}`, 450, 165);

  ctx.fillStyle = "#081008";
  ctx.fillRect(145, 230, 610, 700);

  ctx.strokeStyle = "#2d402d";
  ctx.lineWidth = 3;
  ctx.strokeRect(145, 230, 610, 700);

  const cellSize = 68;
  const gap = 6;
  const gridWidth = GRID_COLS * cellSize + (GRID_COLS - 1) * gap;
  const gridHeight = GRID_ROWS * cellSize + (GRID_ROWS - 1) * gap;
  const startX = 450 - gridWidth / 2;
  const startY = 580 - gridHeight / 2;

  drawSpecimenOnCanvas(ctx, finalGrid, startX, startY, cellSize, gap);

  ctx.fillStyle = "#e8e5d8";
  ctx.font = "24px monospace";
  ctx.fillText(handle, 450, 990);

  ctx.fillStyle = "#b46e14";
  ctx.font = "16px monospace";
  ctx.fillText("generated by the missing character lab", 450, 1030);

  const payload = JSON.stringify({
    app: "missing-character-lab",
    version: 1,
    handle,
    specimenId,
    missingCharacter,
    family,
  });

  writeHiddenPayload(ctx, payload, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = `${handle.replace("@", "")}-grid-block.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function readUploadedGrid(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      try {
        const payload = readHiddenPayloadFromCanvas(ctx, canvas.width, canvas.height);
        const parsed = JSON.parse(payload);

        if (parsed.app !== "missing-character-lab" || !parsed.handle) {
          throw new Error("Invalid grid block.");
        }

        setDecodedOwner(parsed.handle);
        setInput(parsed.handle);
        setHandle(parsed.handle);

        const nextSeed = getHash(parsed.handle);

        setSeed(nextSeed);
        setNoise(makeNoise(nextSeed));
        setResult(results[nextSeed % results.length]);
        setFamily(families[nextSeed % families.length]);
        setPass(8);
        setStage("recalled");
      } catch {
        setDecodedOwner("");
        alert("Could not read this grid. Upload a grid block downloaded directly from this site.");
      } finally {
        event.target.value = "";
      }
    };

    img.src = String(reader.result);
  };

  reader.readAsDataURL(file);
}

  function shareToX() {
    const text = `I entered The Missing Character Lab.

94 specimens were archived.
The network stored me, corrupted me, relaxed me for 8 passes,
and recalled me as missing character ${missingCharacter}.

"${result || "unstable but aesthetically valid."}"

@adamilenich`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="page">
      <div className="noise" aria-hidden="true">
        {noise}
      </div>

      <section className="shell">
        <div className="topbar">
          <span>PTRN//095</span>
          <span>{getStageLabel()}</span>
          <span>VT100</span>
        </div>

        <section className="hero">
          <p className="eyebrow">fan-made experiment</p>

          <h1>
            Missing
            <br />
            Character Lab
          </h1>

          <p className="subtitle">
            94 printable specimens were archived. This machine searches for the
            unstable visitor outside the set.
          </p>
        </section>

        <section className="terminal">
          <div className="terminalHeader">
            <span>MEMORY INPUT</span>
            <span>STORE → CORRUPT → RELAX → RECALL</span>
          </div>

          <div className="inputRow">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="@yourhandle"
              disabled={stage !== "idle" && stage !== "recalled"}
            />

            <button onClick={beginRetrieval}>
              {stage === "idle" || stage === "recalled"
                ? "BEGIN RETRIEVAL"
                : "RUNNING..."}
            </button>
          </div>

          <div className="previewGrid">
            <div className="specimenBox">
              <div className="scanlines" />

              <div className="specimenMeta">
                <span>CHARACTER {missingCharacter}</span>
                <span>SPECIMEN {specimenId}</span>
              </div>

              <div className="blockSpecimen">
                {displayGrid.map((row, rowIndex) => (
                  <div className="blockRow" key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <span
                        className={cell ? "blockCell on" : "blockCell"}
                        key={`${rowIndex}-${cellIndex}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="corruptedHandle">
                {recalledText || cleaned || "@????"}
              </div>
            </div>

            <div className="readout">
              <p>
                <span>ARCHIVE COUNT</span>
                <strong>94</strong>
              </p>
              <p>
                <span>ANOMALY COUNT</span>
                <strong>{stage === "idle" ? "00" : "01"}</strong>
              </p>
              <p>
                <span>RELAX PASSES</span>
                <strong>{stage === "recalled" ? "8/8" : `${pass}/8`}</strong>
              </p>
              <p>
                <span>NOISE</span>
                <strong>{handle ? `${corruption}%` : "--"}</strong>
              </p>
            </div>
          </div>
        </section>

        <section className={`resultCard ${stage === "recalled" ? "show" : ""}`}>
          <div className="cardTop">
            <span>PATTERN//RETRIEVAL</span>
            <span>RECALL 8/8</span>
          </div>

          <h2>Missing Character {missingCharacter}</h2>

          <div className="report">
            <p>
              <span>Subject</span>
              <strong>{handle || "@unknown"}</strong>
            </p>
            <p>
              <span>Specimen</span>
              <strong>{specimenId}</strong>
            </p>
            <p>
              <span>Family</span>
              <strong>{family || "Outside The Archive"}</strong>
            </p>
            <p>
              <span>Status</span>
              <strong>Unstable But Recalled</strong>
            </p>
            <p>
              <span>Diagnosis</span>
              <strong>{result || "awaiting retrieval."}</strong>
            </p>
          </div>

          <div className="actions">
  <button onClick={downloadCard}>DOWNLOAD RESULT CARD</button>
  <button onClick={downloadGridBlock}>DOWNLOAD GRID BLOCK</button>
  <button onClick={shareToX}>POST TO X</button>

  <label className="uploadButton">
    READ GRID BLOCK
    <input accept="image/png,image/jpeg,image/webp" type="file" onChange={readUploadedGrid} />
  </label>

  <button className="ghost" onClick={reset}>
    RESET
  </button>
</div>

{decodedOwner && (
  <p className="decodedOwner">
    GRID READ SUCCESSFULLY: <strong>{decodedOwner}</strong>
  </p>
)}
        </section>

        <footer>
          <span>fan-made. not affiliated.</span>
          <span>made for the pattern retrieval enjoyers.</span>
        </footer>
      </section>
    </main>
  );
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);

  return y;
}