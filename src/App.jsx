import { useState, useRef } from "react";

const STORAGES = [
  { id: "fridge1", label: "Frigo 1", min: 0, max: 4, unit: "°C" },
  { id: "fridge2", label: "Frigo 2", min: 0, max: 4, unit: "°C" },
  { id: "freezer", label: "Congélateur", min: -25, max: -18, unit: "°C" },
  { id: "ambient", label: "Ambiant", min: 15, max: 22, unit: "°C" },
];

function now() {
  return new Date().toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function today() {
  return new Date().toLocaleDateString("fr-FR");
}

// ─── TEMPÉRATURES ────────────────────────────────────────────────────────────
function TempTab({ records, onAdd }) {
  const [vals, setVals] = useState({});
  const [saved, setSaved] = useState(null);

  function set(id, v) {
    setVals((p) => ({ ...p, [id]: v }));
  }

  function submit(e) {
    e.preventDefault();
    const entries = STORAGES.map((s) => ({
      id: s.id,
      label: s.label,
      value: parseFloat(vals[s.id] ?? ""),
      min: s.min,
      max: s.max,
      ok: parseFloat(vals[s.id] ?? "") >= s.min && parseFloat(vals[s.id] ?? "") <= s.max,
    })).filter((e) => !isNaN(e.value));

    if (entries.length === 0) return;
    onAdd({ type: "temp", date: now(), entries });
    setSaved(now());
    setVals({});
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Relevé températures</h2>
      <p style={styles.meta}>Aujourd'hui : {today()}</p>

      <form onSubmit={submit}>
        {STORAGES.map((s) => {
          const v = vals[s.id] ?? "";
          const num = parseFloat(v);
          const ok = !isNaN(num) && num >= s.min && num <= s.max;
          const nok = !isNaN(num) && (num < s.min || num > s.max);
          return (
            <div key={s.id} style={styles.row}>
              <span style={styles.label}>{s.label}</span>
              <span style={styles.range}>{s.min} à {s.max}{s.unit}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  step="0.1"
                  value={v}
                  onChange={(e) => set(s.id, e.target.value)}
                  style={{ ...styles.input, borderColor: ok ? "#22c55e" : nok ? "#ef4444" : "#374151" }}
                  placeholder="—"
                />
                <span style={{ fontSize: 18 }}>
                  {ok ? "✅" : nok ? "❌" : ""}
                </span>
              </div>
            </div>
          );
        })}
        <button type="submit" style={styles.btn}>Enregistrer</button>
      </form>

      {saved && <p style={styles.saved}>✓ Enregistré à {saved}</p>}

      {records.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={styles.subTitle}>Historique</h3>
          {records.map((r, i) => (
            <div key={i} style={styles.card}>
              <p style={styles.cardDate}>{r.date}</p>
              {r.entries.map((e) => (
                <p key={e.id} style={{ color: e.ok ? "#22c55e" : "#ef4444", fontSize: 13, margin: "2px 0" }}>
                  {e.ok ? "✅" : "❌"} {e.label} : {e.value}°C
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TRAÇABILITÉ ─────────────────────────────────────────────────────────────
function TraceTab({ records, onAdd }) {
  const [form, setForm] = useState({ product: "", lot: "", dlc: "", supplier: "", note: "" });
  const [saved, setSaved] = useState(null);

  function change(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    if (!form.product || !form.dlc) return;
    onAdd({ type: "trace", date: now(), ...form });
    setSaved(now());
    setForm({ product: "", lot: "", dlc: "", supplier: "", note: "" });
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Traçabilité produit</h2>
      <form onSubmit={submit}>
        {[
          { key: "product", label: "Produit *", placeholder: "ex: Bœuf haché", required: true },
          { key: "lot", label: "N° de lot", placeholder: "ex: LOT-2025-001" },
          { key: "dlc", label: "DLC / DDM *", placeholder: "jj/mm/aaaa", required: true, type: "date" },
          { key: "supplier", label: "Fournisseur", placeholder: "ex: Metro" },
          { key: "note", label: "Note", placeholder: "Remarques éventuelles" },
        ].map(({ key, label, placeholder, required, type }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={styles.fieldLabel}>{label}</label>
            <input
              type={type || "text"}
              value={form[key]}
              onChange={(e) => change(key, e.target.value)}
              placeholder={placeholder}
              required={required}
              style={styles.input}
            />
          </div>
        ))}
        <button type="submit" style={styles.btn}>Enregistrer</button>
      </form>

      {saved && <p style={styles.saved}>✓ Enregistré à {saved}</p>}

      {records.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={styles.subTitle}>Historique</h3>
          {records.map((r, i) => (
            <div key={i} style={styles.card}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{r.product}</p>
              <p style={styles.cardDate}>{r.date}</p>
              {r.lot && <p style={styles.meta}>Lot : {r.lot}</p>}
              <p style={styles.meta}>DLC : {r.dlc}</p>
              {r.supplier && <p style={styles.meta}>Fournisseur : {r.supplier}</p>}
              {r.note && <p style={{ ...styles.meta, fontStyle: "italic" }}>{r.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PHOTOS ──────────────────────────────────────────────────────────────────
function PhotoTab({ records, onAdd }) {
  const inputRef = useRef();
  const [label, setLabel] = useState("");
  const [preview, setPreview] = useState(null);

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!preview) return;
    onAdd({ type: "photo", date: now(), label: label || "Photo", img: preview });
    setLabel("");
    setPreview(null);
    inputRef.current.value = "";
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Photos traçabilité</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label style={styles.fieldLabel}>Libellé</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="ex: Livraison légumes"
            style={styles.input}
          />
        </div>

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          style={{ ...styles.btn, background: "#1f2937", marginBottom: 12 }}
        >
          📷 Prendre / choisir une photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFile}
          style={{ display: "none" }}
        />

        {preview && (
          <div style={{ marginBottom: 12 }}>
            <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 10, maxHeight: 220, objectFit: "cover" }} />
          </div>
        )}

        {preview && (
          <button type="submit" style={styles.btn}>Enregistrer</button>
        )}
      </form>

      {records.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={styles.subTitle}>Photos enregistrées</h3>
          {records.map((r, i) => (
            <div key={i} style={styles.card}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</p>
              <p style={styles.cardDate}>{r.date}</p>
              <img src={r.img} alt={r.label} style={{ width: "100%", borderRadius: 8, marginTop: 8, maxHeight: 180, objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "system-ui, -apple-system, sans-serif",
    paddingBottom: 80,
  },
  header: {
    background: "#1e293b",
    padding: "16px 20px 12px",
    borderBottom: "1px solid #334155",
  },
  headerTitle: { fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
  headerSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  tabs: {
    display: "flex",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tab: (active) => ({
    flex: 1,
    padding: "12px 0",
    background: "none",
    border: "none",
    color: active ? "#38bdf8" : "#64748b",
    fontWeight: active ? 700 : 400,
    fontSize: 13,
    cursor: "pointer",
    borderBottom: active ? "2px solid #38bdf8" : "2px solid transparent",
    transition: "all 0.15s",
  }),
  content: { padding: "20px 16px" },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#f1f5f9" },
  subTitle: { fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#94a3b8" },
  meta: { fontSize: 12, color: "#64748b", marginBottom: 12 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #1e293b",
  },
  label: { fontSize: 14, fontWeight: 500, flex: 1 },
  range: { fontSize: 11, color: "#64748b", marginRight: 12 },
  fieldLabel: { display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  input: {
    width: "100%",
    padding: "10px 12px",
    background: "#1e293b",
    border: "1px solid #374151",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  saved: { color: "#22c55e", fontSize: 13, marginTop: 10, textAlign: "center" },
  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 10,
  },
  cardDate: { fontSize: 11, color: "#64748b", marginBottom: 4 },
};

// ─── APP ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "temp", label: "🌡️ Temp." },
  { id: "trace", label: "📋 Traça" },
  { id: "photo", label: "📷 Photos" },
];

export default function App() {
  const [tab, setTab] = useState("temp");
  const [records, setRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("haccp_records") || "[]"); } catch { return []; }
  });

  function addRecord(r) {
    const next = [r, ...records];
    setRecords(next);
    localStorage.setItem("haccp_records", JSON.stringify(next));
  }

  const byType = (t) => records.filter((r) => r.type === t);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>HACCP Restaurant</div>
        <div style={styles.headerSub}>Registre numérique — {today()}</div>
      </div>

      <div style={styles.tabs}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={styles.tab(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tab === "temp" && <TempTab records={byType("temp")} onAdd={addRecord} />}
        {tab === "trace" && <TraceTab records={byType("trace")} onAdd={addRecord} />}
        {tab === "photo" && <PhotoTab records={byType("photo")} onAdd={addRecord} />}
      </div>
    </div>
  );
}
