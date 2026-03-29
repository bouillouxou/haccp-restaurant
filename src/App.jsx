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

  /* Range Poker Game */
  .poker-screen { padding: 0 12px; }
  .poker-scenario-card { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 16px; margin-bottom: 14px; }
  .poker-position { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .poker-pos-badge { background: linear-gradient(135deg, #FFB547, #FF8C00); color: #000; font-size: 13px; font-weight: 800; padding: 4px 12px; border-radius: 20px; }
  .poker-action-label { font-size: 12px; color: ${theme.textMuted}; }
  .poker-context { font-size: 11px; color: ${theme.textDim}; font-family: 'JetBrains Mono'; }
  .poker-instruction { font-size: 13px; color: ${theme.text}; font-weight: 500; margin-top: 8px; }
  .poker-grid-wrap { overflow-x: auto; margin-bottom: 14px; }
  .poker-grid { display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; min-width: 300px; }
  .poker-cell { aspect-ratio: 1; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 8px; font-weight: 700; font-family: 'JetBrains Mono'; border: 1px solid transparent; transition: all 0.1s; user-select: none; }
  .poker-cell.pair { background: #2A2040; color: #9B7FFF; border-color: #3D2D7A33; }
  .poker-cell.suited { background: #0D2A1F; color: #4DB88A; border-color: #00D4AA22; }
  .poker-cell.offsuit { background: #1A1F2A; color: ${theme.textDim}; border-color: ${theme.border}33; }
  .poker-cell.selected.pair { background: #5B3FCC; color: #fff; border-color: #9B7FFF; }
  .poker-cell.selected.suited { background: #006B40; color: #fff; border-color: #00D4AA; }
  .poker-cell.selected.offsuit { background: #004080; color: #fff; border-color: #5BA3FF; }
  .poker-cell.correct { background: #00D4AA33; border-color: #00D4AA; color: #00D4AA; }
  .poker-cell.wrong { background: #FF4D6D33; border-color: #FF4D6D; color: #FF4D6D; }
  .poker-cell.missed { background: #FFB54733; border-color: #FFB547; color: #FFB547; }
  .poker-validate-btn { background: linear-gradient(135deg, #FFB547, #FF8C00); color: #000; border: none; border-radius: 14px; padding: 16px; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; width: 100%; cursor: pointer; margin-bottom: 10px; transition: all 0.15s; }
  .poker-validate-btn:active { transform: scale(0.97); }
  .poker-validate-btn:disabled { opacity: 0.5; cursor: default; }
  .poker-clear-btn { background: ${theme.card}; color: ${theme.textMuted}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 12px; font-family: 'Sora', sans-serif; font-size: 14px; width: 100%; cursor: pointer; margin-bottom: 14px; }
  .poker-result-card { background: ${theme.card}; border-radius: 16px; padding: 16px; margin-bottom: 14px; border: 1px solid ${theme.border}; }
  .poker-score-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; margin: 0 auto 12px; }
  .poker-stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 12px; }
  .poker-stat { background: ${theme.surface}; border-radius: 10px; padding: 10px; text-align: center; }
  .poker-stat-val { font-size: 18px; font-weight: 700; font-family: 'JetBrains Mono'; }
  .poker-stat-lbl { font-size: 10px; color: ${theme.textMuted}; margin-top: 2px; }
  .poker-tip { background: #5BA3FF15; border: 1px solid #5BA3FF33; border-radius: 12px; padding: 12px; margin-bottom: 14px; font-size: 12px; color: #5BA3FF; line-height: 1.5; }
  .poker-legend { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
  .poker-legend-item { display: flex; align-items: center; gap: 5px; font-size: 10px; color: ${theme.textMuted}; }
  .poker-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .poker-menu-card { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 18px; margin-bottom: 10px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 14px; }
  .poker-menu-card:active { transform: scale(0.98); border-color: #FFB54766; }
  .poker-menu-icon { font-size: 32px; }
  .poker-menu-info { flex: 1; }
  .poker-menu-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .poker-menu-desc { font-size: 12px; color: ${theme.textMuted}; }
  .poker-menu-arr { font-size: 18px; color: ${theme.textDim}; }
  .poker-total-banner { background: linear-gradient(135deg, #FFB54722, #FF8C0022); border: 1px solid #FFB54744; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
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

// ─── RANGE POKER GAME ────────────────────────────────────────────────────────

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

function getHandName(i, j) {
  if (i === j) return RANKS[i] + RANKS[i];
  if (i < j) return RANKS[i] + RANKS[j] + 's';
  return RANKS[j] + RANKS[i] + 'o';
}

function getCellType(i, j) {
  if (i === j) return 'pair';
  if (i < j) return 'suited';
  return 'offsuit';
}

const UTG_RANGE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77',
  'AKs','AQs','AJs','ATs','A9s','A8s','A5s','A4s','A3s',
  'KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s','65s','54s',
  'AKo','AQo','AJo','KQo',
]);

const CO_RANGE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','T9s','T8s',
  '98s','97s','87s','86s','76s','75s','65s','64s','54s','53s','43s',
  'AKo','AQo','AJo','ATo','KQo','KJo','KTo','QJo','QTo','JTo',
]);

const BTN_RANGE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s',
  'QJs','QTs','Q9s','Q8s','Q7s',
  'JTs','J9s','J8s','J7s',
  'T9s','T8s','T7s','T6s',
  '98s','97s','96s','95s',
  '87s','86s','85s','84s',
  '76s','75s','74s','73s',
  '65s','64s','63s','54s','53s','52s','43s','42s','32s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o',
  'KQo','KJo','KTo','K9o','K8o',
  'QJo','QTo','Q9o','Q8o',
  'JTo','J9o','J8o',
  'T9o','T8o','98o','97o','87o','86o','76o','75o','65o',
]);

const POKER_SCENARIOS = [
  {
    id: 1,
    position: 'UTG',
    posIcon: '🎯',
    action: 'Open raise 2.5x',
    context: '6-max · 100BB · Blindes 250/500',
    range: UTG_RANGE,
    tip: 'UTG (Under The Gun) est la position la plus défavorable. Jouez uniquement vos mains les plus solides : paires moyennes+, broadways assortis, et quelques connecteurs premium.',
    color: '#FF4D6D',
  },
  {
    id: 2,
    position: 'CO',
    posIcon: '⚡',
    action: 'Open raise 2.5x',
    context: '6-max · 100BB · Blindes 250/500',
    range: CO_RANGE,
    tip: 'Cutoff (CO) offre un avantage positionnel important. Élargissez votre range : toutes les paires, la plupart des axes assortis, connecteurs, et plus de broadways non-assortis.',
    color: '#FFB547',
  },
  {
    id: 3,
    position: 'BTN',
    posIcon: '🎰',
    action: 'Open raise 2.5x',
    context: '6-max · 100BB · Blindes 250/500',
    range: BTN_RANGE,
    tip: 'Button (BTN) = meilleure position ! Vous avez l\'avantage post-flop garanti. Ouvrez très large : ~45-50% des mains. Incluez les petits axes, connecteurs bas, et mains marginales.',
    color: '#00D4AA',
  },
];

function RangePokerScreen() {
  const [phase, setPhase] = useState('menu');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState([]);

  const scenario = POKER_SCENARIOS[scenarioIdx];

  function toggleHand(i, j) {
    if (phase === 'result') return;
    const hand = getHandName(i, j);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(hand)) next.delete(hand);
      else next.add(hand);
      return next;
    });
  }

  function validate() {
    const correct = scenario.range;
    let tp = 0, fp = 0, fn = 0;
    for (const h of selected) {
      if (correct.has(h)) tp++;
      else fp++;
    }
    for (const h of correct) {
      if (!selected.has(h)) fn++;
    }
    const prec = selected.size === 0 ? 0 : tp / selected.size;
    const rec = correct.size === 0 ? 0 : tp / correct.size;
    const f1 = (prec + rec === 0) ? 0 : 2 * prec * rec / (prec + rec);
    const pct = Math.round(f1 * 100);
    const res = { pct, tp, fp, fn, total: correct.size };
    setResult(res);
    setScores(s => [...s, pct]);
    setPhase('result');
  }

  function startScenario(idx) {
    setScenarioIdx(idx);
    setSelected(new Set());
    setResult(null);
    setPhase('quiz');
  }

  function backToMenu() {
    setSelected(new Set());
    setResult(null);
    setPhase('menu');
  }

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;

  function getCellClass(i, j) {
    const hand = getHandName(i, j);
    const type = getCellType(i, j);
    if (phase === 'result') {
      const inCorrect = scenario.range.has(hand);
      const inSelected = selected.has(hand);
      if (inCorrect && inSelected) return `poker-cell correct`;
      if (inSelected && !inCorrect) return `poker-cell wrong`;
      if (inCorrect && !inSelected) return `poker-cell missed`;
      return `poker-cell ${type}`;
    }
    return `poker-cell ${type}${selected.has(hand) ? ' selected' : ''}`;
  }

  const scoreColor = (pct) => pct >= 80 ? theme.accent : pct >= 60 ? theme.warning : theme.danger;

  if (phase === 'menu') {
    return (
      <div className="screen">
        <div className="poker-screen">
          <div style={{padding:'4px 0 14px'}}>
            <div style={{fontSize:13,color:theme.textMuted,marginBottom:4}}>W SERIES — 3 MILLION EVENT</div>
            <div style={{fontSize:18,fontWeight:700}}>Entraînement Range</div>
            <div style={{fontSize:12,color:theme.textDim,fontFamily:"'JetBrains Mono'",marginTop:2}}>No-Limit Hold'em · 6-max · 50 000 chips</div>
          </div>

          {avgScore !== null && (
            <div className="poker-total-banner">
              <div>
                <div style={{fontSize:12,color:theme.textMuted}}>Score moyen</div>
                <div style={{fontSize:22,fontWeight:800,color:scoreColor(avgScore),fontFamily:"'JetBrains Mono'"}}>{avgScore}%</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:theme.textMuted}}>{scores.length} exercice{scores.length>1?'s':''} fait{scores.length>1?'s':''}</div>
                <div style={{fontSize:11,color:theme.textDim}}>Continuez à pratiquer !</div>
              </div>
            </div>
          )}

          <div style={{fontSize:12,color:theme.textMuted,marginBottom:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px'}}>Choisir un scénario</div>

          {POKER_SCENARIOS.map((s, idx) => (
            <div key={s.id} className="poker-menu-card" onClick={() => startScenario(idx)}>
              <div className="poker-menu-icon">{s.posIcon}</div>
              <div className="poker-menu-info">
                <div className="poker-menu-name" style={{color:s.color}}>{s.position} — {s.action}</div>
                <div className="poker-menu-desc">{s.context}</div>
                <div style={{fontSize:11,color:theme.textDim,marginTop:4}}>{s.range.size} mains dans la range correcte</div>
              </div>
              <div className="poker-menu-arr">›</div>
            </div>
          ))}

          <div className="poker-tip" style={{marginTop:6}}>
            💡 Sélectionnez les mains que vous joueriez dans la grille 13×13. Plus votre choix est proche de la range GTO, meilleur est votre score !
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="poker-screen">
        <div className="poker-scenario-card">
          <div className="poker-position">
            <div className="poker-pos-badge" style={{background:`linear-gradient(135deg, ${scenario.color}, ${scenario.color}99)`}}>{scenario.position}</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>{scenario.action}</div>
              <div className="poker-context">{scenario.context}</div>
            </div>
          </div>
          <div className="poker-instruction">
            Sélectionnez toutes les mains que vous ouvririez depuis le {scenario.position}
          </div>
          {phase === 'quiz' && (
            <div style={{marginTop:8,fontSize:12,color:theme.textDim}}>
              {selected.size} main{selected.size>1?'s':''} sélectionnée{selected.size>1?'s':''}
            </div>
          )}
        </div>

        {phase === 'result' && (
          <div className="poker-legend">
            <div className="poker-legend-item"><div className="poker-legend-dot" style={{background:'#00D4AA'}}/> Correct</div>
            <div className="poker-legend-item"><div className="poker-legend-dot" style={{background:'#FF4D6D'}}/> Erreur</div>
            <div className="poker-legend-item"><div className="poker-legend-dot" style={{background:'#FFB547'}}/> Oublié</div>
            <div className="poker-legend-item"><div className="poker-legend-dot" style={{background:theme.card}}/> Fold OK</div>
          </div>
        )}

        <div className="poker-grid-wrap">
          <div className="poker-grid">
            {Array.from({length:13}, (_,i) =>
              Array.from({length:13}, (_,j) => (
                <div
                  key={`${i}-${j}`}
                  className={getCellClass(i, j)}
                  onClick={() => toggleHand(i, j)}
                  title={getHandName(i,j)}
                >
                  {getHandName(i,j).length <= 3 ? getHandName(i,j) : getHandName(i,j).slice(0,2)}
                </div>
              ))
            )}
          </div>
        </div>

        {phase === 'quiz' && (
          <>
            <button className="poker-validate-btn" onClick={validate}>
              Valider ma range ({selected.size} mains)
            </button>
            <button className="poker-clear-btn" onClick={() => setSelected(new Set())}>
              Effacer la sélection
            </button>
          </>
        )}

        {phase === 'result' && result && (
          <>
            <div className="poker-result-card">
              <div className="poker-score-circle" style={{border:`3px solid ${scoreColor(result.pct)}`, background:`${scoreColor(result.pct)}15`}}>
                <div style={{fontSize:24,fontWeight:800,color:scoreColor(result.pct),fontFamily:"'JetBrains Mono'"}}>{result.pct}%</div>
                <div style={{fontSize:10,color:theme.textMuted}}>Score F1</div>
              </div>
              <div style={{textAlign:'center',fontSize:14,fontWeight:600,marginBottom:4}}>
                {result.pct >= 85 ? '🏆 Excellent !' : result.pct >= 70 ? '💪 Bien joué !' : result.pct >= 50 ? '📚 Continuez !' : '🎯 À retravailler'}
              </div>
              <div style={{textAlign:'center',fontSize:12,color:theme.textMuted,marginBottom:4}}>
                Range correcte : {result.total} mains
              </div>
              <div className="poker-stats-row">
                <div className="poker-stat">
                  <div className="poker-stat-val" style={{color:theme.accent}}>{result.tp}</div>
                  <div className="poker-stat-lbl">Corrects</div>
                </div>
                <div className="poker-stat">
                  <div className="poker-stat-val" style={{color:theme.danger}}>{result.fp}</div>
                  <div className="poker-stat-lbl">Erreurs</div>
                </div>
                <div className="poker-stat">
                  <div className="poker-stat-val" style={{color:theme.warning}}>{result.fn}</div>
                  <div className="poker-stat-lbl">Oubliés</div>
                </div>
              </div>
            </div>

            <div className="poker-tip">💡 {scenario.tip}</div>

            <button className="poker-validate-btn" onClick={() => startScenario(scenarioIdx)}>
              Réessayer ce scénario
            </button>
            <button className="poker-clear-btn" onClick={backToMenu}>
              ← Changer de scénario
            </button>
          </>
        )}
      </div>
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
    {id:"poker",icon:"🃏",label:"Poker"},
  ];

  const screenTitles = {
    home:"Accueil", temp:"Températures", haccp:"Plan HACCP",
    stock:"Gestion des stocks", label:"Étiquetage", trace:"Traçabilité",
    poker:"Range Poker",
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
          {screen === "poker" && <RangePokerScreen/>}
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
