import { useState, useEffect } from "react";

// ─── DESIGN SYSTEM ───────────────────────────────────────────────────────────
const theme = {
  bg: "#0D1117",
  surface: "#161B22",
  card: "#1C2230",
  border: "#2A3441",
  accent: "#00D4AA",
  accentDim: "#00D4AA22",
  accentDark: "#009E7E",
  danger: "#FF4D6D",
  dangerDim: "#FF4D6D22",
  warning: "#FFB547",
  warningDim: "#FFB54722",
  success: "#00D4AA",
  text: "#E6EDF3",
  textMuted: "#7D8DA0",
  textDim: "#4A5568",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; font-family: 'Sora', sans-serif; color: ${theme.text}; }
  
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; position: relative; background: ${theme.bg}; overflow: hidden; }
  
  .status-bar { height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: ${theme.bg}; }
  .status-time { font-size: 15px; font-weight: 600; font-family: 'JetBrains Mono'; }
  .status-icons { display: flex; gap: 6px; align-items: center; }
  
  .header { padding: 8px 20px 16px; }
  .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .header-greeting { font-size: 13px; color: ${theme.textMuted}; }
  .header-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .header-date { font-size: 12px; color: ${theme.accent}; font-family: 'JetBrains Mono'; margin-top: 2px; }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, ${theme.accent}, #0088CC); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #000; }
  
  .alert-banner { margin: 0 16px 14px; background: ${theme.dangerDim}; border: 1px solid ${theme.danger}44; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
  .alert-dot { width: 8px; height: 8px; border-radius: 50%; background: ${theme.danger}; flex-shrink: 0; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.5; transform:scale(1.3); } }
  .alert-text { font-size: 12px; color: ${theme.danger}; font-weight: 500; }
  
  .score-strip { display: flex; gap: 10px; padding: 0 16px 16px; overflow-x: auto; scrollbar-width: none; }
  .score-strip::-webkit-scrollbar { display: none; }
  .score-card { flex-shrink: 0; background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 12px 14px; min-width: 100px; }
  .score-card.ok { border-color: ${theme.accent}33; }
  .score-card.warn { border-color: ${theme.warning}33; }
  .score-card.bad { border-color: ${theme.danger}33; }
  .score-label { font-size: 10px; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .score-value { font-size: 22px; font-weight: 700; font-family: 'JetBrains Mono'; }
  .score-value.ok { color: ${theme.accent}; }
  .score-value.warn { color: ${theme.warning}; }
  .score-value.bad { color: ${theme.danger}; }
  .score-sub { font-size: 10px; color: ${theme.textMuted}; margin-top: 2px; }
  
  .section-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px 10px; }
  .section-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${theme.textMuted}; }
  .section-action { font-size: 12px; color: ${theme.accent}; font-weight: 500; cursor: pointer; }
  
  .module-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px 16px; }
  .module-btn { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 16px; cursor: pointer; transition: all 0.15s; text-align: left; position: relative; overflow: hidden; }
  .module-btn:active { transform: scale(0.97); }
  .module-btn.active { border-color: ${theme.accent}66; background: ${theme.accentDim}; }
  .module-icon { font-size: 28px; margin-bottom: 10px; display: block; }
  .module-name { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .module-count { font-size: 11px; color: ${theme.textMuted}; }
  .module-badge { position: absolute; top: 10px; right: 10px; background: ${theme.danger}; color: white; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  
  .screen { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
  
  /* Temperature Screen */
  .temp-list { padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }
  .temp-item { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; }
  .temp-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .temp-icon-wrap.ok { background: ${theme.accentDim}; }
  .temp-icon-wrap.warn { background: ${theme.warningDim}; }
  .temp-icon-wrap.bad { background: ${theme.dangerDim}; }
  .temp-info { flex: 1; }
  .temp-name { font-size: 14px; font-weight: 600; }
  .temp-zone { font-size: 11px; color: ${theme.textMuted}; margin-top: 2px; }
  .temp-val { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono'; }
  .temp-val.ok { color: ${theme.accent}; }
  .temp-val.warn { color: ${theme.warning}; }
  .temp-val.bad { color: ${theme.danger}; }
  .temp-time { font-size: 10px; color: ${theme.textDim}; }
  .temp-range { font-size: 10px; color: ${theme.textMuted}; }
  
  /* HACCP Screen */
  .task-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .task-item { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.15s; }
  .task-item.done { border-color: ${theme.accent}33; opacity: 0.7; }
  .task-item:active { transform: scale(0.98); }
  .task-check { width: 24px; height: 24px; border-radius: 8px; border: 2px solid ${theme.border}; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .task-check.checked { background: ${theme.accent}; border-color: ${theme.accent}; }
  .task-info { flex: 1; }
  .task-name { font-size: 14px; font-weight: 500; }
  .task-name.done { text-decoration: line-through; color: ${theme.textMuted}; }
  .task-meta { font-size: 11px; color: ${theme.textMuted}; margin-top: 3px; }
  .task-freq { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
  .task-freq.matin { background: #FFB54722; color: ${theme.warning}; }
  .task-freq.midi { background: #00D4AA22; color: ${theme.accent}; }
  .task-freq.soir { background: #0088CC22; color: #5BA3FF; }
  .task-freq.continu { background: #FF4D6D22; color: ${theme.danger}; }
  
  /* Stock Screen */
  .stock-filter { display: flex; gap: 8px; padding: 0 16px 14px; overflow-x: auto; scrollbar-width: none; }
  .stock-filter::-webkit-scrollbar { display: none; }
  .filter-chip { flex-shrink: 0; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1px solid ${theme.border}; color: ${theme.textMuted}; background: ${theme.card}; }
  .filter-chip.active { background: ${theme.accent}; color: #000; border-color: ${theme.accent}; font-weight: 600; }
  .stock-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .stock-item { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 12px 16px; }
  .stock-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .stock-name { font-size: 14px; font-weight: 600; }
  .stock-qty { font-size: 13px; font-family: 'JetBrains Mono'; font-weight: 600; }
  .stock-qty.low { color: ${theme.danger}; }
  .stock-qty.medium { color: ${theme.warning}; }
  .stock-qty.good { color: ${theme.accent}; }
  .stock-bar-bg { height: 4px; background: ${theme.border}; border-radius: 2px; overflow: hidden; }
  .stock-bar { height: 4px; border-radius: 2px; transition: width 0.5s; }
  .stock-bar.low { background: ${theme.danger}; }
  .stock-bar.medium { background: ${theme.warning}; }
  .stock-bar.good { background: ${theme.accent}; }
  .stock-meta { display: flex; justify-content: space-between; margin-top: 6px; }
  .stock-cat { font-size: 11px; color: ${theme.textMuted}; }
  .stock-exp { font-size: 11px; }
  .stock-exp.urgent { color: ${theme.danger}; }
  .stock-exp.ok { color: ${theme.textMuted}; }
  
  /* Label Screen */
  .label-form { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
  .form-field { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px 16px; }
  .form-label { font-size: 11px; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .form-input { background: transparent; border: none; color: ${theme.text}; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 500; width: 100%; outline: none; }
  .form-input::placeholder { color: ${theme.textDim}; }
  .form-select { background: transparent; border: none; color: ${theme.text}; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 500; width: 100%; outline: none; appearance: none; cursor: pointer; }
  .form-select option { background: ${theme.card}; }
  .label-preview { margin: 0 16px; background: white; border-radius: 14px; padding: 16px; color: #111; }
  .lp-title { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-family: 'Sora'; }
  .lp-name { font-size: 18px; font-weight: 700; color: #000; margin-bottom: 6px; }
  .lp-info { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 8px; }
  .lp-row { font-size: 11px; color: #444; }
  .lp-row span { font-weight: 600; color: #000; }
  .lp-allergens { font-size: 11px; color: #cc2200; font-weight: 500; border-top: 1px solid #eee; padding-top: 8px; margin-top: 4px; }
  .lp-lot { font-family: 'JetBrains Mono'; font-size: 10px; color: #888; margin-top: 6px; }
  .print-btn { margin: 12px 16px 0; background: ${theme.accent}; color: #000; border: none; border-radius: 14px; padding: 16px; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; width: calc(100% - 32px); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; }
  .print-btn:active { transform: scale(0.98); background: ${theme.accentDark}; }
  
  /* Traceability Screen */
  .trace-list { padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }
  .trace-item { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px 16px; }
  .trace-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .trace-name { font-size: 14px; font-weight: 600; }
  .trace-status { font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
  .trace-status.ok { background: ${theme.accentDim}; color: ${theme.accent}; }
  .trace-status.warn { background: ${theme.warningDim}; color: ${theme.warning}; }
  .trace-status.bad { background: ${theme.dangerDim}; color: ${theme.danger}; }
  .trace-details { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .trace-detail { font-size: 11px; color: ${theme.textMuted}; }
  .trace-detail span { color: ${theme.text}; font-weight: 500; }
  .trace-lot { font-size: 11px; font-family: 'JetBrains Mono'; color: ${theme.accent}; margin-top: 8px; padding-top: 8px; border-top: 1px solid ${theme.border}; }
  
  /* Bottom Nav */
  .bottom-nav { position: sticky; bottom: 0; background: ${theme.surface}; border-top: 1px solid ${theme.border}; display: flex; padding: 8px 0 20px; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 8px 4px; transition: all 0.15s; }
  .nav-icon { font-size: 22px; transition: transform 0.15s; }
  .nav-item.active .nav-icon { transform: scale(1.15); }
  .nav-label { font-size: 10px; font-weight: 500; color: ${theme.textMuted}; }
  .nav-item.active .nav-label { color: ${theme.accent}; }
  
  .add-btn { position: fixed; right: 20px; bottom: 100px; background: ${theme.accent}; color: #000; width: 52px; height: 52px; border-radius: 50%; border: none; font-size: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px ${theme.accent}55; transition: all 0.15s; z-index: 10; }
  .add-btn:active { transform: scale(0.93); }
  
  .scroll-area { overflow-y: auto; max-height: calc(100vh - 260px); padding-bottom: 20px; }
  .scroll-area::-webkit-scrollbar { display: none; }
  
  .temp-add-btn { margin: 12px 16px 0; background: ${theme.card}; border: 1px dashed ${theme.border}; border-radius: 14px; padding: 14px; text-align: center; color: ${theme.textMuted}; font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .temp-add-btn:active { background: ${theme.accentDim}; color: ${theme.accent}; }
  
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: flex-end; animation: fadeIn 0.2s; }
  .modal { background: ${theme.surface}; border-radius: 24px 24px 0 0; padding: 20px; width: 100%; max-width: 430px; margin: 0 auto; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-handle { width: 36px; height: 4px; background: ${theme.border}; border-radius: 2px; margin: 0 auto 16px; }
  .modal-title { font-size: 17px; font-weight: 700; margin-bottom: 16px; }
  .modal-input { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 14px 16px; color: ${theme.text}; font-family: 'Sora', sans-serif; font-size: 16px; width: 100%; outline: none; margin-bottom: 10px; }
  .modal-input:focus { border-color: ${theme.accent}; }
  .modal-row { display: flex; gap: 10px; margin-bottom: 10px; }
  .modal-confirm { background: ${theme.accent}; color: #000; border: none; border-radius: 12px; padding: 14px; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; width: 100%; cursor: pointer; margin-top: 6px; }
  .modal-cancel { background: ${theme.card}; color: ${theme.textMuted}; border: none; border-radius: 12px; padding: 14px; font-family: 'Sora', sans-serif; font-size: 15px; width: 100%; cursor: pointer; margin-top: 6px; }
  
  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .tag.green { background: ${theme.accentDim}; color: ${theme.accent}; }
  .tag.red { background: ${theme.dangerDim}; color: ${theme.danger}; }
  .tag.yellow { background: ${theme.warningDim}; color: ${theme.warning}; }

  /* Photo Scan Screen */
  .scan-container { padding: 0 16px; display: flex; flex-direction: column; gap: 14px; }
  .camera-zone { background: ${theme.card}; border: 2px dashed ${theme.border}; border-radius: 20px; padding: 36px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .camera-zone:hover { border-color: ${theme.accent}66; background: ${theme.accentDim}; }
  .camera-zone.has-image { border-style: solid; border-color: ${theme.accent}44; padding: 0; }
  .camera-zone img { width: 100%; border-radius: 18px; max-height: 220px; object-fit: cover; display: block; }
  .camera-icon { font-size: 48px; }
  .camera-text { font-size: 15px; font-weight: 600; color: ${theme.text}; }
  .camera-sub { font-size: 12px; color: ${theme.textMuted}; text-align: center; }
  .camera-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .camera-badge { position: absolute; top: 10px; right: 10px; background: ${theme.accent}; color: #000; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }

  .scan-loading { background: ${theme.card}; border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 14px; border: 1px solid ${theme.accent}33; }
  .scan-spinner { width: 32px; height: 32px; border: 3px solid ${theme.border}; border-top-color: ${theme.accent}; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .scan-loading-text { font-size: 14px; font-weight: 500; }
  .scan-loading-sub { font-size: 12px; color: ${theme.textMuted}; margin-top: 2px; }

  .extracted-card { background: ${theme.card}; border: 1px solid ${theme.accent}44; border-radius: 16px; padding: 16px; }
  .extracted-title { font-size: 12px; font-weight: 600; color: ${theme.accent}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .extracted-field { display: flex; flex-direction: column; gap: 3px; margin-bottom: 10px; }
  .extracted-label { font-size: 10px; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 0.6px; }
  .extracted-value { font-size: 14px; font-weight: 500; }
  .extracted-input { background: transparent; border: none; border-bottom: 1px solid ${theme.border}; color: ${theme.text}; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500; width: 100%; outline: none; padding-bottom: 3px; }
  .extracted-input:focus { border-bottom-color: ${theme.accent}; }
  .extracted-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .save-btn { background: ${theme.accent}; color: #000; border: none; border-radius: 14px; padding: 16px; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; }
  .save-btn:active { transform: scale(0.98); }
  .scan-again-btn { background: ${theme.card}; color: ${theme.textMuted}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px; font-family: 'Sora', sans-serif; font-size: 14px; width: 100%; cursor: pointer; }

  .labels-table-wrap { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; overflow: hidden; }
  .labels-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .labels-table th { background: ${theme.surface}; color: ${theme.textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 0.7px; padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 1px solid ${theme.border}; }
  .labels-table td { padding: 10px 12px; border-bottom: 1px solid ${theme.border}22; vertical-align: middle; }
  .labels-table tr:last-child td { border-bottom: none; }
  .labels-table tr:hover td { background: ${theme.surface}; }
  .dlc-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .dlc-badge.ok { background: ${theme.accentDim}; color: ${theme.accent}; }
  .dlc-badge.soon { background: ${theme.warningDim}; color: ${theme.warning}; }
  .dlc-badge.expired { background: ${theme.dangerDim}; color: ${theme.danger}; }

  .key-banner { background: ${theme.warningDim}; border: 1px solid ${theme.warning}44; border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .key-banner-text { font-size: 12px; color: ${theme.warning}; font-weight: 500; flex: 1; }
  .key-modal-input { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 12px 14px; color: ${theme.text}; font-family: 'JetBrains Mono', monospace; font-size: 13px; width: 100%; outline: none; margin-bottom: 10px; }
  .key-modal-input:focus { border-color: ${theme.accent}; }
  .empty-state { text-align: center; padding: 32px 20px; color: ${theme.textMuted}; font-size: 13px; }
  .empty-icon { font-size: 40px; margin-bottom: 10px; }
  .scan-error { background: ${theme.dangerDim}; border: 1px solid ${theme.danger}44; border-radius: 14px; padding: 14px 16px; font-size: 13px; color: ${theme.danger}; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const initialTemps = [
  { id:1, name:"Chambre froide viande", zone:"Cuisine froide", temp:-1.2, min:-3, max:4, icon:"🥩", time:"08:30", status:"ok" },
  { id:2, name:"Réfrigérateur poissons", zone:"Cuisine", temp:1.8, min:-2, max:3, icon:"🐟", time:"08:32", status:"ok" },
  { id:3, name:"Vitrine pâtisserie", zone:"Salle", temp:6.4, min:2, max:6, icon:"🍰", time:"08:35", status:"bad" },
  { id:4, name:"Congélateur", zone:"Réserve", temp:-18.5, min:-25, max:-15, icon:"❄️", time:"08:31", status:"ok" },
  { id:5, name:"Bain-marie service", zone:"Cuisine chaude", temp:62.0, min:63, max:85, icon:"🍲", time:"11:45", status:"warn" },
];

const initialTasks = [
  { id:1, name:"Contrôle temp. ouverture", freq:"matin", done:true, who:"Chef cuisine" },
  { id:2, name:"Nettoyage friteuse", freq:"matin", done:true, who:"Équipe cuisine" },
  { id:3, name:"Désinfection plans de travail", freq:"midi", done:false, who:"Tout le personnel" },
  { id:4, name:"Contrôle temp. service midi", freq:"midi", done:false, who:"Chef de partie" },
  { id:5, name:"Vidange bacs à graisse", freq:"soir", done:false, who:"Plongeur" },
  { id:6, name:"Nettoyage hotte aspirante", freq:"soir", done:false, who:"Équipe cuisine" },
  { id:7, name:"Lavage mains obligatoire", freq:"continu", done:false, who:"Tout le personnel" },
  { id:8, name:"Contrôle réception marchandises", freq:"matin", done:false, who:"Responsable" },
];

const initialStock = [
  { id:1, name:"Filet de bœuf", cat:"Viande", qty:4.2, max:10, unit:"kg", exp:"2026-03-10", level:"medium" },
  { id:2, name:"Saumon frais", cat:"Poisson", qty:1.5, max:5, unit:"kg", exp:"2026-03-09", level:"low" },
  { id:3, name:"Crème fraîche", cat:"Laitier", qty:12, max:15, unit:"L", exp:"2026-03-15", level:"good" },
  { id:4, name:"Farine T55", cat:"Épicerie", qty:2, max:20, unit:"kg", exp:"2026-09-01", level:"low" },
  { id:5, name:"Huile olive vierge", cat:"Épicerie", qty:8, max:10, unit:"L", exp:"2026-12-01", level:"good" },
  { id:6, name:"Œufs frais", cat:"Laitier", qty:48, max:120, unit:"pcs", exp:"2026-03-20", level:"medium" },
  { id:7, name:"Tomates cerises", cat:"Légumes", qty:0.8, max:5, unit:"kg", exp:"2026-03-09", level:"low" },
];

const initialTrace = [
  { id:1, name:"Entrecôte Angus", fournisseur:"Boucherie Dupont", lot:"LOT-2026-0312", reception:"08/03/2026", ddm:"10/03/2026", status:"ok", origine:"France / Normandie", poids:"12.4 kg" },
  { id:2, name:"Saumon Atlantique", fournisseur:"Marée Fraîche SA", lot:"LOT-MAR-0891", reception:"08/03/2026", ddm:"09/03/2026", status:"warn", origine:"Norvège", poids:"6.0 kg" },
  { id:3, name:"Camembert AOP", fournisseur:"Fermage Normand", lot:"FM-2026-122", reception:"06/03/2026", ddm:"08/03/2026", status:"bad", origine:"France / Normandie", poids:"3.2 kg" },
  { id:4, name:"Agneau de lait", fournisseur:"Élevage Pirénées", lot:"AGN-26-0045", reception:"07/03/2026", ddm:"12/03/2026", status:"ok", origine:"France / Pyrénées", poids:"8.5 kg" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function HomeScreen({ temps, tasks, stock, onNavigate }) {
  const doneCount = tasks.filter(t => t.done).length;
  const alertTemp = temps.filter(t => t.status !== "ok").length;
  const lowStock = stock.filter(s => s.level === "low").length;
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="screen">
      <div className="header">
        <div className="header-top">
          <div>
            <div className="header-greeting">Bonjour, Chef 👋</div>
            <div className="header-title">Tableau de bord</div>
            <div className="header-date">{today.charAt(0).toUpperCase() + today.slice(1)}</div>
          </div>
          <div className="avatar">CL</div>
        </div>
      </div>

      {(alertTemp > 0 || lowStock > 0) && (
        <div className="alert-banner">
          <div className="alert-dot"/>
          <div className="alert-text">
            {alertTemp > 0 && `${alertTemp} alerte(s) température`}
            {alertTemp > 0 && lowStock > 0 && " · "}
            {lowStock > 0 && `${lowStock} produit(s) en rupture`}
          </div>
        </div>
      )}

      <div className="score-strip">
        <div className="score-card ok">
          <div className="score-label">Tâches</div>
          <div className="score-value ok">{doneCount}/{tasks.length}</div>
          <div className="score-sub">Complétées</div>
        </div>
        <div className={`score-card ${alertTemp > 0 ? "bad" : "ok"}`}>
          <div className="score-label">Températures</div>
          <div className={`score-value ${alertTemp > 0 ? "bad" : "ok"}`}>{alertTemp}</div>
          <div className="score-sub">Alertes</div>
        </div>
        <div className={`score-card ${lowStock > 0 ? "warn" : "ok"}`}>
          <div className="score-label">Stocks</div>
          <div className={`score-value ${lowStock > 0 ? "warn" : "ok"}`}>{lowStock}</div>
          <div className="score-sub">Ruptures</div>
        </div>
        <div className="score-card ok">
          <div className="score-label">Traçabilité</div>
          <div className="score-value ok">{initialTrace.filter(t=>t.status==="ok").length}</div>
          <div className="score-sub">Conformes</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">Modules</div>
        <div className="section-action">Tout voir</div>
      </div>

      <div className="module-grid">
        {[
          { id:"temp", icon:"🌡️", name:"Températures", count:`${temps.length} points`, badge: alertTemp||0 },
          { id:"haccp", icon:"✅", name:"Plan HACCP", count:`${doneCount}/${tasks.length} tâches`, badge: tasks.length - doneCount },
          { id:"stock", icon:"📦", name:"Stocks", count:`${stock.length} produits`, badge: lowStock||0 },
          { id:"trace", icon:"🔍", name:"Traçabilité", count:`${initialTrace.length} lots`, badge: initialTrace.filter(t=>t.status!=="ok").length },
          { id:"label", icon:"🏷️", name:"Étiquetage", count:"Créer étiquette", badge: 0 },
          { id:"scan", icon:"📷", name:"Scan Photo", count:"Scanner une étiquette", badge: 0 },
        ].map(m => (
          <div key={m.id} className={`module-btn`} onClick={() => onNavigate(m.id)}>
            {m.badge > 0 && <div className="module-badge">{m.badge}</div>}
            <span className="module-icon">{m.icon}</span>
            <div className="module-name">{m.name}</div>
            <div className="module-count">{m.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TempScreen({ temps, setTemps }) {
  const [showModal, setShowModal] = useState(false);
  const [newTemp, setNewTemp] = useState({ name:"", zone:"", temp:"" });

  const getStatus = (t) => {
    if (t.temp < t.min || t.temp > t.max) return "bad";
    if (Math.abs(t.temp - t.min) < 1 || Math.abs(t.temp - t.max) < 1) return "warn";
    return "ok";
  };

  const addReading = () => {
    if (!newTemp.name || !newTemp.temp) return;
    const val = parseFloat(newTemp.temp);
    setTemps(prev => [...prev, {
      id: Date.now(), name: newTemp.name, zone: newTemp.zone || "Cuisine",
      temp: val, min: -2, max: 5, icon: "🌡️", time: new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}), status:"ok"
    }]);
    setNewTemp({ name:"", zone:"", temp:"" });
    setShowModal(false);
  };

  return (
    <div className="screen">
      <div className="temp-list">
        {temps.map(t => {
          const s = getStatus(t);
          return (
            <div key={t.id} className="temp-item">
              <div className={`temp-icon-wrap ${s}`}>{t.icon}</div>
              <div className="temp-info">
                <div className="temp-name">{t.name}</div>
                <div className="temp-zone">{t.zone}</div>
                <div className="temp-range">Min {t.min}° / Max {t.max}°C</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className={`temp-val ${s}`}>{t.temp > 0 ? "+" : ""}{t.temp}°C</div>
                <div className="temp-time">{t.time}</div>
                {s !== "ok" && <div className="tag" style={{marginTop:4, background: s==="bad"?"#FF4D6D22":"#FFB54722", color: s==="bad"?"#FF4D6D":"#FFB547", fontSize:10}}>{s==="bad"?"⚠️ Hors norme":"⚡ Limite"}</div>}
              </div>
            </div>
          );
        })}
        <div className="temp-add-btn" onClick={()=>setShowModal(true)}>
          + Enregistrer une nouvelle mesure
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Nouvelle mesure 🌡️</div>
            <input className="modal-input" placeholder="Nom de l'équipement" value={newTemp.name} onChange={e=>setNewTemp({...newTemp,name:e.target.value})}/>
            <input className="modal-input" placeholder="Zone (ex: Cuisine, Réserve...)" value={newTemp.zone} onChange={e=>setNewTemp({...newTemp,zone:e.target.value})}/>
            <input className="modal-input" type="number" placeholder="Température (°C)" value={newTemp.temp} onChange={e=>setNewTemp({...newTemp,temp:e.target.value})}/>
            <button className="modal-confirm" onClick={addReading}>✅ Enregistrer</button>
            <button className="modal-cancel" onClick={()=>setShowModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HACCPScreen({ tasks, setTasks }) {
  const toggle = (id) => setTasks(prev => prev.map(t => t.id===id ? {...t, done:!t.done} : t));
  const doneCount = tasks.filter(t=>t.done).length;
  const pct = Math.round((doneCount/tasks.length)*100);

  return (
    <div className="screen">
      <div style={{padding:"0 16px 16px"}}>
        <div style={{background:theme.card,borderRadius:14,padding:"14px 16px",border:`1px solid ${theme.border}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:theme.textMuted}}>Avancement du jour</span>
            <span style={{fontSize:16,fontWeight:700,color:theme.accent,fontFamily:"'JetBrains Mono'"}}>{pct}%</span>
          </div>
          <div style={{height:6,background:theme.border,borderRadius:3,overflow:"hidden"}}>
            <div style={{height:6,width:`${pct}%`,background:theme.accent,borderRadius:3,transition:"width 0.5s"}}/>
          </div>
          <div style={{marginTop:8,fontSize:12,color:theme.textMuted}}>{doneCount} sur {tasks.length} tâches complétées</div>
        </div>
      </div>
      <div className="task-list">
        {["matin","midi","soir","continu"].map(freq => {
          const freqTasks = tasks.filter(t=>t.freq===freq);
          const labels = {matin:"🌅 Matin",midi:"☀️ Midi",soir:"🌙 Soir",continu:"🔄 Continu"};
          return (
            <div key={freq}>
              <div style={{fontSize:12,fontWeight:600,color:theme.textMuted,paddingBottom:8,paddingTop:4,letterSpacing:"0.5px"}}>{labels[freq]}</div>
              {freqTasks.map(t => (
                <div key={t.id} className={`task-item ${t.done?"done":""}`} onClick={()=>toggle(t.id)} style={{marginBottom:8}}>
                  <div className={`task-check ${t.done?"checked":""}`}>
                    {t.done && <CheckIcon/>}
                  </div>
                  <div className="task-info">
                    <div className={`task-name ${t.done?"done":""}`}>{t.name}</div>
                    <div className="task-meta">{t.who}</div>
                  </div>
                  <span className={`task-freq ${freq}`}>{freq}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StockScreen({ stock }) {
  const [filter, setFilter] = useState("Tous");
  const cats = ["Tous", ...new Set(stock.map(s=>s.cat))];
  const filtered = filter==="Tous" ? stock : stock.filter(s=>s.cat===filter);

  const expColor = (date) => {
    const d = new Date(date); const today = new Date();
    const diff = (d - today) / (1000*60*60*24);
    if (diff < 1) return "urgent";
    return "ok";
  };

  return (
    <div className="screen">
      <div className="stock-filter">
        {cats.map(c => (
          <div key={c} className={`filter-chip ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</div>
        ))}
      </div>
      <div className="stock-list">
        {filtered.map(s => (
          <div key={s.id} className="stock-item">
            <div className="stock-top">
              <div className="stock-name">{s.name}</div>
              <div className={`stock-qty ${s.level}`}>{s.qty} {s.unit}</div>
            </div>
            <div className="stock-bar-bg">
              <div className={`stock-bar ${s.level}`} style={{width:`${Math.round((s.qty/s.max)*100)}%`}}/>
            </div>
            <div className="stock-meta">
              <span className="stock-cat">📂 {s.cat}</span>
              <span className={`stock-exp ${expColor(s.exp)}`}>
                {expColor(s.exp)==="urgent" ? "⚠️ " : "📅 "}DLC : {new Date(s.exp).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LabelScreen() {
  const [form, setForm] = useState({
    nom:"Tartare de bœuf", prep:"08/03/2026", use:"09/03/2026",
    lot:"LOT-2026-0308-001", allergens:"Gluten, Moutarde", chef:"Chef Martin"
  });

  return (
    <div className="screen">
      <div className="label-form">
        {[
          {key:"nom",label:"Nom du plat",placeholder:"Ex: Tartare de bœuf"},
          {key:"prep",label:"Date de préparation",placeholder:"JJ/MM/AAAA"},
          {key:"use",label:"À utiliser avant",placeholder:"JJ/MM/AAAA"},
          {key:"lot",label:"N° de lot",placeholder:"Ex: LOT-2026-..."},
          {key:"allergens",label:"Allergènes",placeholder:"Ex: Gluten, Lait, Œufs..."},
          {key:"chef",label:"Responsable",placeholder:"Nom du chef"},
        ].map(f => (
          <div key={f.key} className="form-field">
            <div className="form-label">{f.label}</div>
            <input className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>
          </div>
        ))}
      </div>

      <div style={{padding:"16px 16px 0",fontWeight:700,fontSize:13,color:theme.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Aperçu étiquette</div>
      <div className="label-preview">
        <div className="lp-title">🏷️ Étiquette traçabilité</div>
        <div className="lp-name">{form.nom || "—"}</div>
        <div className="lp-info">
          <div className="lp-row">Préparé le : <span>{form.prep || "—"}</span></div>
          <div className="lp-row">À utiliser avant : <span>{form.use || "—"}</span></div>
          <div className="lp-row">Responsable : <span>{form.chef || "—"}</span></div>
        </div>
        {form.allergens && <div className="lp-allergens">⚠️ Contient : {form.allergens}</div>}
        <div className="lp-lot">{form.lot || "LOT-—"}</div>
      </div>

      <button className="print-btn">🖨️ Imprimer l'étiquette</button>
      <div style={{height:16}}/>
    </div>
  );
}

function TraceScreen() {
  return (
    <div className="screen">
      <div className="trace-list">
        {initialTrace.map(t => (
          <div key={t.id} className="trace-item">
            <div className="trace-header">
              <div className="trace-name">{t.name}</div>
              <div className={`trace-status ${t.status}`}>
                {t.status==="ok"?"✅ Conforme":t.status==="warn"?"⚡ À surveiller":"⛔ Non conforme"}
              </div>
            </div>
            <div className="trace-details">
              <div className="trace-detail">Fournisseur : <span>{t.fournisseur}</span></div>
              <div className="trace-detail">Poids : <span>{t.poids}</span></div>
              <div className="trace-detail">Réception : <span>{t.reception}</span></div>
              <div className="trace-detail">DLC : <span style={{color: t.status==="bad"?theme.danger:t.status==="warn"?theme.warning:theme.text}}>{t.ddm}</span></div>
              <div className="trace-detail" style={{gridColumn:"1/-1"}}>Origine : <span>{t.origine}</span></div>
            </div>
            <div className="trace-lot">📦 {t.lot}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHOTO LABEL SCREEN ───────────────────────────────────────────────────────

function dlcStatus(dateStr) {
  if (!dateStr) return "ok";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "ok";
  const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  const now = new Date();
  const diffDays = (d - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "expired";
  if (diffDays <= 2) return "soon";
  return "ok";
}

function dlcLabel(status) {
  if (status === "expired") return "Expiré";
  if (status === "soon") return "Bientôt";
  return "OK";
}

const STORAGE_LABELS = "haccp_scan_labels";
const STORAGE_KEY = "haccp_api_key";

function PhotoLabelScreen() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_LABELS) || "[]"); } catch { return []; }
  });
  const [view, setView] = useState("scan"); // "scan" | "table"
  const fileRef = useState(null);

  const saveKey = () => {
    localStorage.setItem(STORAGE_KEY, keyInput);
    setApiKey(keyInput);
    setShowKeyModal(false);
  };

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setExtracted(null);
    const url = URL.createObjectURL(file);
    setImage(url);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      const mediaType = file.type || "image/jpeg";
      analyzeImage(base64, mediaType);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64, mediaType) => {
    if (!apiKey) { setShowKeyModal(true); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              { type: "text", text: `Analyse cette étiquette alimentaire HACCP. Extrait les informations en JSON uniquement (sans texte autour) :
{
  "nom": "nom du produit",
  "dateFabrication": "date de fabrication au format JJ/MM/AAAA ou null",
  "dlc": "date limite de consommation au format JJ/MM/AAAA ou null",
  "lot": "numéro de lot ou null",
  "allergenes": "liste des allergènes ou null",
  "responsable": "nom du responsable/chef ou null",
  "temperature": "température de conservation ou null",
  "poids": "poids ou quantité ou null"
}
Réponds UNIQUEMENT avec le JSON valide, rien d'autre.` }
            ]
          }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Erreur API ${res.status}`);
      }
      const data = await res.json();
      const text = data.content[0].text.trim();
      const json = JSON.parse(text.replace(/```json|```/g, "").trim());
      setExtracted(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, val) => setExtracted(prev => ({ ...prev, [key]: val }));

  const saveLabel = () => {
    if (!extracted) return;
    const entry = {
      ...extracted,
      id: Date.now(),
      scanDate: new Date().toLocaleDateString("fr-FR"),
    };
    const updated = [entry, ...labels];
    setLabels(updated);
    localStorage.setItem(STORAGE_LABELS, JSON.stringify(updated));
    setImage(null);
    setExtracted(null);
    setView("table");
  };

  const deleteLabel = (id) => {
    const updated = labels.filter(l => l.id !== id);
    setLabels(updated);
    localStorage.setItem(STORAGE_LABELS, JSON.stringify(updated));
  };

  const resetScan = () => { setImage(null); setExtracted(null); setError(null); };

  return (
    <div className="screen">
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px" }}>
        {[["scan", "📷 Scanner"], ["table", `📋 Tableau (${labels.length})`]].map(([id, label]) => (
          <div key={id} className={`filter-chip ${view === id ? "active" : ""}`} onClick={() => setView(id)} style={{ flex: 1, textAlign: "center" }}>{label}</div>
        ))}
      </div>

      {/* API Key banner */}
      {!apiKey && view === "scan" && (
        <div style={{ padding: "0 16px 14px" }}>
          <div className="key-banner" onClick={() => { setKeyInput(""); setShowKeyModal(true); }}>
            <span style={{ fontSize: 20 }}>🔑</span>
            <div className="key-banner-text">Configurez votre clé API Anthropic pour activer la lecture automatique des étiquettes</div>
            <span style={{ color: theme.warning, fontSize: 18 }}>›</span>
          </div>
        </div>
      )}
      {apiKey && view === "scan" && !image && (
        <div style={{ padding: "0 16px 14px", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 11, color: theme.textMuted, cursor: "pointer" }} onClick={() => { setKeyInput(apiKey); setShowKeyModal(true); }}>⚙️ Changer la clé API</span>
        </div>
      )}

      {view === "scan" && (
        <div className="scan-container">
          {/* Camera zone */}
          <label className={`camera-zone ${image ? "has-image" : ""}`}>
            {image ? (
              <>
                <img src={image} alt="Étiquette scannée" />
                {!loading && !extracted && <div className="camera-badge">Analyse...</div>}
              </>
            ) : (
              <>
                <span className="camera-icon">📷</span>
                <div className="camera-text">Prendre en photo une étiquette</div>
                <div className="camera-sub">Appuyez pour ouvrir la caméra ou choisir une photo</div>
              </>
            )}
            <input className="camera-input" type="file" accept="image/*" capture="environment" onChange={handleCapture} />
          </label>

          {/* Loading */}
          {loading && (
            <div className="scan-loading">
              <div className="scan-spinner" />
              <div>
                <div className="scan-loading-text">Analyse en cours...</div>
                <div className="scan-loading-sub">Claude Vision lit l'étiquette</div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="scan-error">⚠️ {error}</div>
          )}

          {/* Extracted data */}
          {extracted && !loading && (
            <div className="extracted-card">
              <div className="extracted-title">✅ Données extraites — modifiables</div>
              <div className="extracted-field">
                <div className="extracted-label">Nom du produit</div>
                <input className="extracted-input" value={extracted.nom || ""} onChange={e => updateField("nom", e.target.value)} placeholder="—" />
              </div>
              <div className="extracted-grid">
                <div className="extracted-field">
                  <div className="extracted-label">Date fabrication</div>
                  <input className="extracted-input" value={extracted.dateFabrication || ""} onChange={e => updateField("dateFabrication", e.target.value)} placeholder="JJ/MM/AAAA" />
                </div>
                <div className="extracted-field">
                  <div className="extracted-label">DLC</div>
                  <input className="extracted-input" value={extracted.dlc || ""} onChange={e => updateField("dlc", e.target.value)} placeholder="JJ/MM/AAAA" />
                </div>
                <div className="extracted-field">
                  <div className="extracted-label">N° de lot</div>
                  <input className="extracted-input" value={extracted.lot || ""} onChange={e => updateField("lot", e.target.value)} placeholder="—" />
                </div>
                <div className="extracted-field">
                  <div className="extracted-label">Poids / Qté</div>
                  <input className="extracted-input" value={extracted.poids || ""} onChange={e => updateField("poids", e.target.value)} placeholder="—" />
                </div>
              </div>
              <div className="extracted-field">
                <div className="extracted-label">Allergènes</div>
                <input className="extracted-input" value={extracted.allergenes || ""} onChange={e => updateField("allergenes", e.target.value)} placeholder="—" />
              </div>
              <div className="extracted-grid">
                <div className="extracted-field">
                  <div className="extracted-label">Responsable</div>
                  <input className="extracted-input" value={extracted.responsable || ""} onChange={e => updateField("responsable", e.target.value)} placeholder="—" />
                </div>
                <div className="extracted-field">
                  <div className="extracted-label">Conservation</div>
                  <input className="extracted-input" value={extracted.temperature || ""} onChange={e => updateField("temperature", e.target.value)} placeholder="—" />
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="save-btn" onClick={saveLabel}>💾 Enregistrer dans le tableau</button>
                <button className="scan-again-btn" onClick={resetScan}>↩ Scanner une autre étiquette</button>
              </div>
            </div>
          )}

          {/* Manual entry if no API key */}
          {!apiKey && !image && (
            <div style={{ textAlign: "center", padding: "8px 0", color: theme.textMuted, fontSize: 12 }}>
              Sans clé API, vous pouvez scanner manuellement après la photo
            </div>
          )}
        </div>
      )}

      {view === "table" && (
        <div style={{ padding: "0 16px" }}>
          {labels.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <div>Aucune étiquette scannée</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>Allez dans "Scanner" pour photographier une étiquette</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>{labels.length} étiquette(s) enregistrée(s)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {labels.map(l => {
                  const status = dlcStatus(l.dlc);
                  return (
                    <div key={l.id} style={{ background: theme.card, border: `1px solid ${status === "expired" ? theme.danger + "44" : status === "soon" ? theme.warning + "44" : theme.border}`, borderRadius: 14, padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{l.nom || "—"}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className={`dlc-badge ${status}`}>{dlcLabel(status)}</span>
                          <span style={{ fontSize: 18, cursor: "pointer", color: theme.danger, opacity: 0.6 }} onClick={() => deleteLabel(l.id)}>✕</span>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {[
                          ["Fabrication", l.dateFabrication],
                          ["DLC", l.dlc],
                          ["Lot", l.lot],
                          ["Poids", l.poids],
                          ["Conservation", l.temperature],
                          ["Scanné le", l.scanDate],
                        ].map(([k, v]) => v && (
                          <div key={k} style={{ fontSize: 11, color: theme.textMuted }}>
                            {k} : <span style={{ color: k === "DLC" && status !== "ok" ? (status === "expired" ? theme.danger : theme.warning) : theme.text, fontWeight: 500 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {l.allergenes && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.border}`, fontSize: 11, color: theme.danger }}>
                          ⚠️ Allergènes : {l.allergenes}
                        </div>
                      )}
                      {l.responsable && (
                        <div style={{ marginTop: 4, fontSize: 11, color: theme.textMuted }}>
                          Chef : <span style={{ color: theme.text }}>{l.responsable}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">🔑 Clé API Anthropic</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 14 }}>
              Votre clé API permet d'utiliser Claude Vision pour lire automatiquement le contenu des étiquettes. Elle est stockée localement sur votre appareil.
            </div>
            <input
              className="key-modal-input"
              type="password"
              placeholder="sk-ant-api03-..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              autoFocus
            />
            <button className="modal-confirm" onClick={saveKey} disabled={!keyInput}>✅ Enregistrer</button>
            <button className="modal-cancel" onClick={() => setShowKeyModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [temps, setTemps] = useState(initialTemps);
  const [tasks, setTasks] = useState(initialTasks);
  const [stock] = useState(initialStock);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});

  const navItems = [
    {id:"home",icon:"🏠",label:"Accueil"},
    {id:"temp",icon:"🌡️",label:"Temp."},
    {id:"haccp",icon:"✅",label:"HACCP"},
    {id:"stock",icon:"📦",label:"Stocks"},
    {id:"label",icon:"🏷️",label:"Étiq."},
    {id:"trace",icon:"🔍",label:"Traça."},
    {id:"scan",icon:"📷",label:"Scan"},
  ];

  const screenTitles = {
    home:"Accueil", temp:"Températures", haccp:"Plan HACCP",
    stock:"Gestion des stocks", label:"Étiquetage", trace:"Traçabilité",
    scan:"Scan Étiquettes"
  };

  return (
    <>
      <style>{fonts + css}</style>
      <div className="app">
        <div className="status-bar">
          <span className="status-time">{timeStr}</span>
          <div className="status-icons">
            <span style={{fontSize:12}}>●●●●</span>
            <span style={{fontSize:12}}>WiFi</span>
            <span style={{fontSize:14}}>🔋</span>
          </div>
        </div>

        {screen !== "home" && (
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 16px 12px"}}>
            <div style={{fontSize:22,cursor:"pointer"}} onClick={()=>setScreen("home")}>←</div>
            <div style={{fontSize:18,fontWeight:700}}>{screenTitles[screen]}</div>
          </div>
        )}

        <div className="scroll-area">
          {screen === "home" && <HomeScreen temps={temps} tasks={tasks} stock={stock} onNavigate={setScreen}/>}
          {screen === "temp" && <TempScreen temps={temps} setTemps={setTemps}/>}
          {screen === "haccp" && <HACCPScreen tasks={tasks} setTasks={setTasks}/>}
          {screen === "stock" && <StockScreen stock={stock}/>}
          {screen === "label" && <LabelScreen/>}
          {screen === "trace" && <TraceScreen/>}
          {screen === "scan" && <PhotoLabelScreen/>}
        </div>

        <div className="bottom-nav">
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${screen===n.id?"active":""}`} onClick={()=>setScreen(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
