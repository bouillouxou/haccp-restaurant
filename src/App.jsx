import { useState, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const STORAGES = [
  { id: "fridge1", label: "Frigo 1", icon: "🧊", min: 0, max: 4 },
  { id: "fridge2", label: "Frigo 2", icon: "🧊", min: 0, max: 4 },
  { id: "freezer", label: "Congélateur", icon: "❄️", min: -25, max: -18 },
  { id: "ambient", label: "Ambiant", icon: "🌡️", min: 15, max: 22 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const today = () =>
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

const dlcStatus = (dlcStr) => {
  if (!dlcStr) return null;
  const dlc = new Date(dlcStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((dlc - now) / 86400000);
  if (diff < 0) return { label: `Expiré (${Math.abs(diff)}j)`, color: "#ef4444", bg: "#450a0a" };
  if (diff === 0) return { label: "Expire aujourd'hui", color: "#f97316", bg: "#431407" };
  if (diff <= 3) return { label: `${diff}j restant${diff > 1 ? "s" : ""}`, color: "#eab308", bg: "#422006" };
  return { label: `${diff}j restants`, color: "#22c55e", bg: "#052e16" };
};

const useStorage = () => {
  const [records, setRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("haccp_v2") || "[]"); } catch { return []; }
  });
  const add = (r) => {
    const next = [{ ...r, id: Date.now() }, ...records];
    setRecords(next);
    localStorage.setItem("haccp_v2", JSON.stringify(next));
  };
  const remove = (id) => {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    localStorage.setItem("haccp_v2", JSON.stringify(next));
  };
  return { records, add, remove };
};

// ─── SHARED UI ───────────────────────────────────────────────────────────────
const Badge = ({ children, color, bg }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, color, background: bg, whiteSpace: "nowrap",
  }}>{children}</span>
);

const Card = ({ children, style }) => (
  <div style={{
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: 14, padding: "16px", marginBottom: 12, ...style,
  }}>{children}</div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 5, fontWeight: 500 }}>{label}</label>}
    <input style={{
      width: "100%", padding: "11px 13px", background: "#0f172a",
      border: "1px solid #334155", borderRadius: 9, color: "#f1f5f9",
      fontSize: 15, outline: "none", boxSizing: "border-box",
    }} {...props} />
  </div>
);

const Btn = ({ children, variant = "primary", style: s, ...props }) => (
  <button style={{
    width: "100%", padding: "13px", border: "none", borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4,
    background: variant === "primary" ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "#1e293b",
    color: "#fff", letterSpacing: 0.2, ...s,
  }} {...props}>{children}</button>
);

const Flash = ({ show, text = "✓ Enregistré" }) =>
  show ? (
    <div style={{
      marginTop: 10, padding: "10px", borderRadius: 8, textAlign: "center",
      background: "#052e16", color: "#22c55e", fontSize: 13, fontWeight: 600,
    }}>{text}</div>
  ) : null;

// ─── ONGLET TEMPÉRATURES ──────────────────────────────────────────────────────
function TempTab({ records, onAdd }) {
  const [vals, setVals] = useState({});
  const [flash, setFlash] = useState(false);

  const set = (id, v) => setVals((p) => ({ ...p, [id]: v }));

  const submit = (e) => {
    e.preventDefault();
    const entries = STORAGES.map((s) => {
      const val = parseFloat(vals[s.id] ?? "");
      return { ...s, value: val, ok: !isNaN(val) && val >= s.min && val <= s.max };
    }).filter((e) => !isNaN(e.value));
    if (!entries.length) return;
    onAdd({ type: "temp", date: Date.now(), entries });
    setVals({});
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <div>
      <Card>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{today()}</p>
        <form onSubmit={submit}>
          {STORAGES.map((s) => {
            const v = vals[s.id] ?? "";
            const num = parseFloat(v);
            const ok = !isNaN(num) && num >= s.min && num <= s.max;
            const nok = !isNaN(num) && (num < s.min || num > s.max);
            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: "1px solid #0f172a",
              }}>
                <span style={{ fontSize: 22, width: 30 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{s.min}°C → {s.max}°C</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number" step="0.1" value={v}
                    onChange={(e) => set(s.id, e.target.value)}
                    placeholder="—"
                    style={{
                      width: 72, padding: "8px 10px", textAlign: "center",
                      background: "#0f172a", fontSize: 15, fontWeight: 600,
                      borderRadius: 8, color: ok ? "#22c55e" : nok ? "#ef4444" : "#f1f5f9",
                      border: `1.5px solid ${ok ? "#22c55e" : nok ? "#ef4444" : "#334155"}`,
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 16, width: 20 }}>{ok ? "✅" : nok ? "❌" : ""}</span>
                </div>
              </div>
            );
          })}
          <Btn type="submit" style={{ marginTop: 16 }}>Enregistrer le relevé</Btn>
          <Flash show={flash} text="✓ Relevé enregistré" />
        </form>
      </Card>

      {records.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", marginBottom: 10, letterSpacing: 1 }}>
            HISTORIQUE ({records.length})
          </h3>
          {records.map((r) => {
            const hasAlert = r.entries.some((e) => !e.ok);
            return (
              <Card key={r.id} style={{ borderColor: hasAlert ? "#7f1d1d" : "#334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{fmtDate(r.date)}</span>
                  {hasAlert
                    ? <Badge color="#ef4444" bg="#450a0a">⚠ Anomalie</Badge>
                    : <Badge color="#22c55e" bg="#052e16">✓ Conforme</Badge>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {r.entries.map((e) => (
                    <div key={e.id} style={{
                      background: "#0f172a", borderRadius: 8, padding: "8px 10px",
                      borderLeft: `3px solid ${e.ok ? "#22c55e" : "#ef4444"}`,
                    }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{e.label}</div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: e.ok ? "#22c55e" : "#ef4444" }}>
                        {e.value}°C
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── ONGLET TRAÇABILITÉ ───────────────────────────────────────────────────────
function TraceTab({ records, onAdd, onRemove }) {
  const empty = { product: "", lot: "", dlc: "", supplier: "", qty: "", note: "" };
  const [form, setForm] = useState(empty);
  const [flash, setFlash] = useState(false);

  const ch = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.product || !form.dlc) return;
    onAdd({ type: "trace", date: Date.now(), ...form });
    setForm(empty);
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <div>
      <Card>
        <form onSubmit={submit}>
          <Input label="Produit *" value={form.product} onChange={ch("product")} placeholder="ex: Bœuf haché" required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="N° de lot" value={form.lot} onChange={ch("lot")} placeholder="LOT-001" />
            <Input label="Quantité" value={form.qty} onChange={ch("qty")} placeholder="ex: 2 kg" />
          </div>
          <Input label="DLC / DDM *" type="date" value={form.dlc} onChange={ch("dlc")} required />
          <Input label="Fournisseur" value={form.supplier} onChange={ch("supplier")} placeholder="ex: Metro" />
          <Input label="Note" value={form.note} onChange={ch("note")} placeholder="Remarques..." />
          <Btn type="submit">Enregistrer la réception</Btn>
          <Flash show={flash} text="✓ Produit enregistré" />
        </form>
      </Card>

      {records.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", marginBottom: 10, letterSpacing: 1 }}>
            STOCK ({records.length} produits)
          </h3>
          {records.map((r) => {
            const st = dlcStatus(r.dlc);
            return (
              <Card key={r.id} style={{
                borderColor: st?.color === "#ef4444" ? "#7f1d1d"
                  : st?.color === "#eab308" ? "#713f12" : "#334155",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{r.product}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
                      Enregistré le {fmtDate(r.date)}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                      {st && <Badge color={st.color} bg={st.bg}>{st.label}</Badge>}
                      {r.qty && <Badge color="#94a3b8" bg="#1e3a5f">{r.qty}</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 2 }}>
                      {r.dlc && <span>DLC : <b style={{ color: "#94a3b8" }}>{new Date(r.dlc).toLocaleDateString("fr-FR")}</b>  </span>}
                      {r.lot && <span>Lot : <b style={{ color: "#94a3b8" }}>{r.lot}</b>  </span>}
                      {r.supplier && <span>Fourn. : <b style={{ color: "#94a3b8" }}>{r.supplier}</b></span>}
                    </div>
                    {r.note && <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", marginTop: 4 }}>{r.note}</div>}
                  </div>
                  <button onClick={() => onRemove(r.id)} style={{
                    background: "none", border: "none", color: "#475569",
                    fontSize: 20, cursor: "pointer", padding: "0 0 0 12px",
                  }}>×</button>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── ONGLET PHOTOS ────────────────────────────────────────────────────────────
function PhotoTab({ records, onAdd, onRemove }) {
  const inputRef = useRef();
  const [label, setLabel] = useState("");
  const [preview, setPreview] = useState(null);
  const [flash, setFlash] = useState(false);

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!preview) return;
    onAdd({ type: "photo", date: Date.now(), label: label || "Photo", img: preview });
    setLabel(""); setPreview(null);
    inputRef.current.value = "";
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <div>
      <Card>
        <form onSubmit={submit}>
          <Input label="Libellé" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="ex: Livraison légumes frais" />
          <button type="button" onClick={() => inputRef.current.click()} style={{
            width: "100%", padding: "32px 16px", background: "#0f172a",
            border: "2px dashed #334155", borderRadius: 12, color: "#64748b",
            fontSize: 13, cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <span style={{ fontSize: 36 }}>📷</span>
            <span>Appuyer pour prendre une photo</span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />

          {preview && (
            <>
              <img src={preview} alt="preview" style={{
                width: "100%", borderRadius: 10, maxHeight: 240,
                objectFit: "cover", marginBottom: 12,
              }} />
              <Btn type="submit">Enregistrer la photo</Btn>
            </>
          )}
          <Flash show={flash} text="✓ Photo enregistrée" />
        </form>
      </Card>

      {records.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", marginBottom: 10, letterSpacing: 1 }}>
            PHOTOS ({records.length})
          </h3>
          {records.map((r) => (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{fmtDate(r.date)}</div>
                </div>
                <button onClick={() => onRemove(r.id)} style={{
                  background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer",
                }}>×</button>
              </div>
              <img src={r.img} alt={r.label} style={{
                width: "100%", borderRadius: 10, maxHeight: 220, objectFit: "cover",
              }} />
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

// ─── TABLEAU DE BORD ──────────────────────────────────────────────────────────
function DashTab({ records }) {
  const traces = records.filter((r) => r.type === "trace");
  const temps = records.filter((r) => r.type === "temp");

  const expired = traces.filter((r) => dlcStatus(r.dlc)?.color === "#ef4444");
  const warning = traces.filter((r) => {
    const c = dlcStatus(r.dlc)?.color;
    return c === "#eab308" || c === "#f97316";
  });
  const tempAlerts = temps.filter((r) => r.entries?.some((e) => !e.ok));
  const lastTemp = temps[0];

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Produits\nen stock", value: traces.length, color: "#38bdf8", border: "#0369a1" },
          { label: "DLC\nexpirées", value: expired.length, color: "#ef4444", border: "#7f1d1d" },
          { label: "DLC ≤ 3\njours", value: warning.length, color: "#eab308", border: "#713f12" },
          { label: "Anomalies\ntempérature", value: tempAlerts.length, color: tempAlerts.length ? "#f97316" : "#22c55e", border: tempAlerts.length ? "#7c2d12" : "#14532d" },
        ].map((k) => (
          <div key={k.label} style={{
            background: "#1e293b", border: `1px solid ${k.border}`,
            borderRadius: 14, padding: "16px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, whiteSpace: "pre-line", lineHeight: 1.4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Alertes DLC */}
      {(expired.length > 0 || warning.length > 0) && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", marginBottom: 10, letterSpacing: 1 }}>
            ⚠ ALERTES DLC
          </h3>
          {[...expired, ...warning].map((r) => {
            const st = dlcStatus(r.dlc);
            return (
              <div key={r.id} style={{
                background: st.bg, border: `1px solid ${st.color}44`,
                borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{r.product}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    DLC : {new Date(r.dlc).toLocaleDateString("fr-FR")}
                    {r.supplier && ` · ${r.supplier}`}
                  </div>
                </div>
                <Badge color={st.color} bg={st.bg + "99"}>{st.label}</Badge>
              </div>
            );
          })}
        </>
      )}

      {/* Dernier relevé T° */}
      {lastTemp && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", margin: "16px 0 10px", letterSpacing: 1 }}>
            🌡️ DERNIER RELEVÉ TEMPÉRATURE
          </h3>
          <Card>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>{fmtDate(lastTemp.date)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {lastTemp.entries.map((e) => (
                <div key={e.id} style={{
                  background: "#0f172a", borderRadius: 10, padding: "10px 12px",
                  borderLeft: `3px solid ${e.ok ? "#22c55e" : "#ef4444"}`,
                }}>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{e.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: e.ok ? "#22c55e" : "#ef4444" }}>
                    {e.value}°C
                  </div>
                  <div style={{ fontSize: 10, color: e.ok ? "#22c55e88" : "#ef444488" }}>
                    {e.ok ? "Conforme" : `Hors norme (${e.min}–${e.max}°C)`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Tableau stock trié par DLC */}
      {traces.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, color: "#64748b", margin: "16px 0 10px", letterSpacing: 1 }}>
            📋 STOCK — TABLEAU DLC
          </h3>
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #334155" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 360 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Produit", "DLC", "Statut", "Lot", "Qté", "Fournisseur"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 10px", textAlign: "left", color: "#64748b",
                      fontWeight: 600, whiteSpace: "nowrap",
                      borderBottom: "1px solid #334155",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...traces].sort((a, b) => new Date(a.dlc) - new Date(b.dlc)).map((r, i) => {
                  const st = dlcStatus(r.dlc);
                  return (
                    <tr key={r.id} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                      <td style={{ padding: "10px 10px", fontWeight: 600, color: "#f1f5f9" }}>{r.product}</td>
                      <td style={{ padding: "10px 10px", color: st?.color ?? "#94a3b8", whiteSpace: "nowrap" }}>
                        {r.dlc ? new Date(r.dlc).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        {st ? <Badge color={st.color} bg={st.bg}>{st.label}</Badge> : "—"}
                      </td>
                      <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{r.lot || "—"}</td>
                      <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{r.qty || "—"}</td>
                      <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{r.supplier || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {records.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
          <div style={{ fontSize: 52 }}>📊</div>
          <p style={{ marginTop: 16, fontSize: 15, fontWeight: 600, color: "#64748b" }}>Aucune donnée encore</p>
          <p style={{ fontSize: 13, marginTop: 6, color: "#475569" }}>
            Commencez par saisir des températures ou des produits
          </p>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dash", label: "Tableau", icon: "📊" },
  { id: "temp", label: "Temp.", icon: "🌡️" },
  { id: "trace", label: "Traça", icon: "📋" },
  { id: "photo", label: "Photos", icon: "📷" },
];

export default function App() {
  const [tab, setTab] = useState("dash");
  const { records, add, remove } = useStorage();

  const byType = (t) => records.filter((r) => r.type === t);

  const alertCount = records.filter((r) => {
    if (r.type === "trace") {
      const c = dlcStatus(r.dlc)?.color;
      return c === "#ef4444" || c === "#eab308" || c === "#f97316";
    }
    if (r.type === "temp") return r.entries?.some((e) => !e.ok);
    return false;
  }).length;

  return (
    <div style={{
      maxWidth: 480, margin: "0 auto", minHeight: "100vh",
      background: "#0f172a", color: "#f1f5f9",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      paddingBottom: 72,
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
        borderBottom: "1px solid #1e293b",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "#38bdf8", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
              HACCP NUMÉRIQUE
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Restaurant</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          {alertCount > 0 && (
            <div style={{
              background: "#7f1d1d", color: "#fca5a5",
              borderRadius: 20, padding: "6px 14px",
              fontSize: 12, fontWeight: 700, border: "1px solid #ef444444",
            }}>
              ⚠ {alertCount} alerte{alertCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "16px 14px" }}>
        {tab === "dash"  && <DashTab records={records} />}
        {tab === "temp"  && <TempTab records={byType("temp")} onAdd={add} />}
        {tab === "trace" && <TraceTab records={byType("trace")} onAdd={add} onRemove={remove} />}
        {tab === "photo" && <PhotoTab records={byType("photo")} onAdd={add} onRemove={remove} />}
      </div>

      {/* Barre de navigation fixe */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#1e293b", borderTop: "1px solid #334155",
        display: "flex",
      }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 4px 12px", background: "none", border: "none",
              color: active ? "#38bdf8" : "#475569",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", position: "relative",
            }}>
              {t.id === "dash" && alertCount > 0 && (
                <div style={{
                  position: "absolute", top: 6, right: "calc(50% - 18px)",
                  width: 8, height: 8, borderRadius: "50%", background: "#ef4444",
                }} />
              )}
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{t.label}</span>
              {active && <div style={{ width: 20, height: 2, background: "#38bdf8", borderRadius: 2 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
