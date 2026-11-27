export const CSS = `
.csk-section{display:flex;flex-direction:column;gap:12px;max-width:720px;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);}
.csk-card{display:flex;flex-direction:column;overflow:hidden;border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill);}
.csk-options{display:flex;flex-direction:column;min-width:0;}
.csk-option{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:12px 14px;cursor:pointer;}
.csk-option+.csk-option{border-top:.5px solid var(--dsw-alias-border-l2);}
@media (hover:hover){.csk-option:hover{background:var(--dsw-alias-interactive-bg-hover);}}
.csk-radio{flex:none;width:16px;height:16px;margin:0;accent-color:var(--dsw-alias-brand-primary);cursor:inherit;}
.csk-radio:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px;}
.csk-title{font-weight:500;}
.csk-keys{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;}
.csk-pair{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
.csk-kbd{font-family:var(--ds-font-family-code);font-size:11px;line-height:16px;padding:1px 5px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-xs);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);}
.csk-combo{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px 12px 42px;border-top:.5px solid var(--dsw-alias-border-l2);}
.csk-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);cursor:pointer;}
@media (hover:hover){.csk-chip:hover{background:var(--dsw-alias-interactive-bg-hover);}}
.csk-chip-selected{border-color:var(--dsw-alias-border-l3);background:var(--dsw-alias-interactive-bg-hover);}
.csk-chip .csk-radio{width:14px;height:14px;}
.csk-error{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-error-primary);}
@media (max-width:600px){.csk-keys{margin-left:28px;}.csk-combo{padding-left:28px;}}
`
