import { useState, useEffect, useCallback } from 'react'
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'

const API = 'https://projetstage-secure-1.onrender.com'

mermaid.initialize({ startOnLoad: false, theme: 'neutral', flowchart: { curve: 'basis' } })

// ── Styles ──────────────────────────────────────────────────────────────────
const S = {
  // Layout
  app:        { display:'flex', height:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:'#f8fafc', color:'#1e293b', overflow:'hidden' },

  // Sidebar
  sidebar:    { width:220, background:'#0f172a', display:'flex', flexDirection:'column', flexShrink:0, height:'100vh' },
  logo:       { padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' },
  logoBadge:  { display:'flex', alignItems:'center', gap:10 },
  logoIcon:   { width:34, height:34, background:'#6366f1', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 },
  logoName:   { color:'#f1f5f9', fontSize:15, fontWeight:600 },
  logoSub:    { color:'#475569', fontSize:11, marginTop:1 },
  navSection: { padding:'20px 12px 6px', color:'#334155', fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', fontWeight:600 },
  navItem:    { display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:8, margin:'2px 8px', cursor:'pointer', color:'#64748b', fontSize:13, userSelect:'none' },
  navActive:  { background:'#1e293b', color:'#e2e8f0' },
  navIcon:    { fontSize:16, width:18 },
  sidebarSpacer: { flex:1 },
  sidebarBottom: { padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)' },

  // Main
  main:       { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar:     { height:52, padding:'0 20px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff', flexShrink:0 },
  breadcrumb: { display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#64748b' },
  breadSep:   { fontSize:11 },
  breadActive:{ color:'#1e293b', fontWeight:600 },
  userPill:   { display:'flex', alignItems:'center', gap:8, padding:'5px 12px', border:'1px solid #e2e8f0', borderRadius:20, fontSize:13, color:'#475569', background:'#f8fafc', cursor:'pointer' },
  avatar:     { width:22, height:22, borderRadius:'50%', background:'#6366f1', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },

  // Panels
  panels:     { flex:1, display:'flex', overflow:'hidden' },

  // Processus panel (sidebar secondaire)
  pcsPanel:   { width:230, borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', background:'#fff' },
  pcsPanelHdr:{ padding:'14px 16px 10px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' },
  pcsPanelTitle:{ fontSize:12, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.06em' },
  addBtn:     { width:24, height:24, borderRadius:6, background:'#6366f1', color:'#fff', border:'none', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
  pcsScroll:  { flex:1, overflowY:'auto', padding:'8px' },
  pcsItem:    { padding:'10px 12px', borderRadius:8, cursor:'pointer', marginBottom:4, fontSize:13, color:'#475569', userSelect:'none', display:'flex', alignItems:'center', justifyContent:'space-between' },
  pcsActive:  { background:'#ede9fe', color:'#5b21b6', fontWeight:600 },
  pcsActions: { display:'flex', gap:3, opacity:0 },
  pcsAddBox:  { padding:'8px', borderTop:'1px solid #f1f5f9' },
  pcsInput:   { width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' },

  // Workflows panel
  wkfPanel:   { width:250, borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', background:'#fafafa' },
  wkfPanelHdr:{ padding:'14px 16px 10px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' },
  wkfPanelTitle:{ fontSize:12, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.06em' },
  wkfScroll:  { flex:1, overflowY:'auto', padding:'8px' },
  wkfCard:    { border:'1px solid #e2e8f0', borderRadius:10, padding:'10px 12px', marginBottom:8, cursor:'pointer', background:'#fff', userSelect:'none' },
  wkfCardActive:{ borderColor:'#6366f1', background:'#f5f3ff' },
  wkfCardName:  { fontSize:13, fontWeight:600, color:'#1e293b' },
  wkfCardMeta:  { fontSize:11, color:'#94a3b8', marginTop:3 },
  wkfCardTag:   { display:'inline-block', background:'#ede9fe', color:'#5b21b6', fontSize:10, padding:'2px 7px', borderRadius:10, fontWeight:600 },
  wkfAddBox:  { padding:'8px', borderTop:'1px solid #f1f5f9' },
  wkfInput:   { width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' },

  // Diagramme panel
  diagPanel:  { flex:1, display:'flex', flexDirection:'column', padding:24, gap:16, overflowY:'auto', background:'#f8fafc' },
  diagHdr:    { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  diagTitle:  { fontSize:16, fontWeight:700, color:'#1e293b' },
  diagSub:    { fontSize:12, color:'#94a3b8', marginTop:3 },
  diagActions:{ display:'flex', gap:8 },
  btnSm:      { padding:'6px 14px', fontSize:12, border:'1px solid #e2e8f0', borderRadius:7, background:'#fff', color:'#475569', cursor:'pointer', fontWeight:500 },
  btnSmPrimary:{ background:'#6366f1', color:'#fff', borderColor:'#6366f1' },
  diagBox:    { border:'1px solid #e2e8f0', borderRadius:14, padding:24, background:'#fff', minHeight:300 },
  actList:    { display:'flex', flexDirection:'column', gap:8 },
  actItem:    { display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:9, background:'#f8fafc', border:'1px solid #f1f5f9', fontSize:13 },
  actNum:     { width:22, height:22, borderRadius:'50%', background:'#ede9fe', color:'#5b21b6', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  actName:    { flex:1, color:'#1e293b' },
  actBtns:    { display:'flex', gap:4 },
  btnIcon:    { width:28, height:28, borderRadius:6, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#94a3b8' },
  btnIconDanger:{ borderColor:'#fee2e2', background:'#fff', color:'#ef4444' },
  actInput:   { flex:1, padding:'6px 10px', borderRadius:7, border:'1px solid #6366f1', fontSize:13, outline:'none' },
  actSave:    { padding:'6px 12px', borderRadius:7, background:'#10b981', color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' },
  actCancel:  { padding:'6px 10px', borderRadius:7, background:'#f1f5f9', color:'#64748b', border:'none', fontSize:12, cursor:'pointer' },
  addActRow:  { display:'flex', gap:8, marginTop:8 },
  addActInput:{ flex:1, padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none' },
  addActBtn:  { padding:'9px 16px', borderRadius:8, background:'#6366f1', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer' },

  // Empty states
  empty:      { textAlign:'center', padding:'40px 20px', color:'#94a3b8', fontSize:13 },
  emptyIcon:  { fontSize:32, marginBottom:8, opacity:.4 },

  // Auth
  authPage:   { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0f172a' },
  authCard:   { background:'#fff', padding:40, borderRadius:16, width:360, boxShadow:'0 20px 60px rgba(0,0,0,.3)' },
  authLogo:   { display:'flex', alignItems:'center', gap:10, marginBottom:28, justifyContent:'center' },
  authLogoIcon:{ width:40, height:40, background:'#6366f1', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20 },
  authTitle:  { fontSize:22, fontWeight:700, color:'#6366f1' },
  authSub:    { textAlign:'center', color:'#64748b', fontSize:13, marginBottom:24 },
  authInput:  { width:'100%', padding:'11px 14px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:14, marginBottom:12, outline:'none', boxSizing:'border-box' },
  authBtn:    { width:'100%', padding:13, background:'#6366f1', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:15, fontWeight:700 },
  authSwitch: { textAlign:'center', marginTop:16, fontSize:13, color:'#94a3b8' },
  authSwitchBtn:{ background:'none', border:'none', color:'#6366f1', cursor:'pointer', fontWeight:600, fontSize:13 },

  // Toast
  toast:      { position:'fixed', bottom:24, right:24, padding:'12px 20px', borderRadius:10, fontSize:14, fontWeight:600, zIndex:1000, boxShadow:'0 4px 16px rgba(0,0,0,.15)' },
  toastError: { background:'#ef4444', color:'#fff' },
  toastSuccess:{ background:'#10b981', color:'#fff' },

  // Mermaid
  mermaidWrap:{ overflowX:'auto', padding:'16px 0' },
}

export default function App() {
  const [token, setToken]       = useState('')
  const [username, setUsername] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username:'', password:'' })

  const [processus, setProcessus]   = useState([])
  const [workflows, setWorkflows]   = useState([])
  const [activites, setActivites]   = useState([])
  const [selectedPcs, setSelectedPcs] = useState(null)
  const [selectedWkf, setSelectedWkf] = useState(null)

  const [nouveauPcs, setNouveauPcs]   = useState('')
  const [nouveauWkf, setNouveauWkf]   = useState('')
  const [nouvelleAct, setNouvelleAct] = useState('')
  const [showAddPcs, setShowAddPcs]   = useState(false)
  const [showAddWkf, setShowAddWkf]   = useState(false)

  const [editingPcs, setEditingPcs] = useState(null)
  const [editingWkf, setEditingWkf] = useState(null)
  const [editingAct, setEditingAct] = useState(null)
  const [editValue, setEditValue]   = useState('')

  const [toast, setToast]     = useState(null)
  const [view, setView]       = useState('processus') // 'processus' | 'workflows' | 'activites'
  const [mermaidSvg, setMermaidSvg] = useState('')

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const h = (json = false) => {
    const headers = { authorization: `Bearer ${token}` }
    if (json) headers['Content-Type'] = 'application/json'
    return headers
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const seConnecter = async () => {
    const res  = await fetch(`${API}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authForm) })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur de connexion')
    setToken(data.token); setUsername(authForm.username)
  }

  const sInscrire = async () => {
    if (!authForm.username || !authForm.password) return showToast('Remplissez tous les champs')
    const res  = await fetch(`${API}/inscription`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authForm) })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur')
    showToast('Compte créé !', 'success'); setAuthMode('login')
  }

  const seDeconnecter = () => {
    setToken(''); setUsername(''); setProcessus([]); setWorkflows([]); setActivites([])
    setSelectedPcs(null); setSelectedWkf(null); setMermaidSvg('')
  }

  // ── Chargement ────────────────────────────────────────────────────────────
  const chargerProcessus = useCallback(() =>
    fetch(`${API}/processus`, { headers:{ authorization:`Bearer ${token}` } }).then(r => r.json()).then(setProcessus)
  , [token])

  const chargerWorkflows = useCallback((pcs) =>
    fetch(`${API}/processus/${pcs.pcs_id}/workflows`, { headers:{ authorization:`Bearer ${token}` } }).then(r => r.json()).then(setWorkflows)
  , [token])

  const chargerActivites = useCallback(async (wkf) => {
    const data = await fetch(`${API}/workflows/${wkf.wkf_id}/activites`, { headers:{ authorization:`Bearer ${token}` } }).then(r => r.json())
    setActivites(data)
    genererMermaid(data)
  }, [token])

  useEffect(() => { if (token) chargerProcessus() }, [token, chargerProcessus])

  // ── Mermaid ───────────────────────────────────────────────────────────────
  const genererMermaid = async (acts) => {
    if (!acts || acts.length === 0) { setMermaidSvg(''); return }
    const lignes = acts.map((a, i) => {
      const id   = `A${i}`
      const next = i < acts.length - 1 ? `A${i+1}` : null
      const label = a.actnom.replace(/"/g, "'")
      return next ? `  ${id}["${label}"] --> A${i+1}` : `  ${id}["${label}"]`
    })
    const def = `flowchart TD\n  S([Début]) --> A0\n${lignes.join('\n')}\n  A${acts.length-1} --> E([Fin])`
    try {
      const { svg } = await mermaid.render('mermaid-diag', def)
      setMermaidSvg(svg)
    } catch(e) {
      setMermaidSvg('')
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const voirWorkflows = (pcs) => {
    setSelectedPcs(pcs); setSelectedWkf(null); setActivites([]); setMermaidSvg('')
    chargerWorkflows(pcs); setView('workflows')
  }
  const voirActivites = (wkf) => { setSelectedWkf(wkf); chargerActivites(wkf); setView('activites') }

  // ── CRUD Processus ────────────────────────────────────────────────────────
  const ajouterProcessus = async () => {
    if (!nouveauPcs.trim()) return
    const res = await fetch(`${API}/processus`, { method:'POST', headers:h(true), body:JSON.stringify({ pcsnom:nouveauPcs, pcsrspgrp:'ADMIN' }) })
    if (!res.ok) return showToast('Erreur création processus')
    setNouveauPcs(''); setShowAddPcs(false); chargerProcessus(); showToast('Processus créé', 'success')
  }

  const supprimerProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, { method:'DELETE', headers:h() })
    if (selectedPcs?.pcs_id === id) { setSelectedPcs(null); setSelectedWkf(null); setWorkflows([]); setActivites([]); setMermaidSvg('') }
    chargerProcessus()
  }

  const modifierProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ pcsnom:editValue }) })
    setEditingPcs(null); chargerProcessus()
  }

  // ── CRUD Workflows ────────────────────────────────────────────────────────
  const ajouterWorkflow = async () => {
    if (!nouveauWkf.trim() || !selectedPcs) return
    await fetch(`${API}/processus/${selectedPcs.pcs_id}/workflows`, { method:'POST', headers:h(true), body:JSON.stringify({ wkfnom:nouveauWkf }) })
    setNouveauWkf(''); setShowAddWkf(false); chargerWorkflows(selectedPcs); showToast('Workflow créé', 'success')
  }

  const supprimerWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, { method:'DELETE', headers:h() })
    if (selectedWkf?.wkf_id === id) { setSelectedWkf(null); setActivites([]); setMermaidSvg('') }
    chargerWorkflows(selectedPcs)
  }

  const modifierWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ wkfnom:editValue }) })
    setEditingWkf(null); chargerWorkflows(selectedPcs)
  }

  // ── CRUD Activités ────────────────────────────────────────────────────────
  const ajouterActivite = async () => {
    if (!nouvelleAct.trim() || !selectedWkf) return
    await fetch(`${API}/workflows/${selectedWkf.wkf_id}/activites`, { method:'POST', headers:h(true), body:JSON.stringify({ actnom:nouvelleAct }) })
    setNouvelleAct(''); chargerActivites(selectedWkf); showToast('Activité ajoutée', 'success')
  }

  const supprimerActivite = async (id) => {
    await fetch(`${API}/activites/${id}`, { method:'DELETE', headers:h() })
    chargerActivites(selectedWkf)
  }

  const modifierActivite = async (id) => {
    await fetch(`${API}/activites/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ actnom:editValue }) })
    setEditingAct(null); chargerActivites(selectedWkf)
  }

  // ── Initiales avatar ──────────────────────────────────────────────────────
  const initiales = (name) => name ? name.slice(0,2).toUpperCase() : '?'

  // ── AUTH SCREEN ───────────────────────────────────────────────────────────
  if (!token) return (
    <div style={S.authPage}>
      {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>{toast.msg}</div>}
      <div style={S.authCard}>
        <div style={S.authLogo}>
          <div style={S.authLogoIcon}>⬡</div>
          <span style={S.authTitle}>PCS</span>
        </div>
        <div style={S.authSub}>{authMode==='login' ? 'Connectez-vous pour continuer' : 'Créer un nouveau compte'}</div>
        <input style={S.authInput} placeholder="Nom d'utilisateur" value={authForm.username}
          onChange={e => setAuthForm({...authForm, username:e.target.value})} />
        <input style={S.authInput} placeholder="Mot de passe" type="password" value={authForm.password}
          onChange={e => setAuthForm({...authForm, password:e.target.value})}
          onKeyDown={e => e.key==='Enter' && (authMode==='login' ? seConnecter() : sInscrire())} />
        <button style={S.authBtn} onClick={authMode==='login' ? seConnecter : sInscrire}>
          {authMode==='login' ? 'Se connecter' : 'Créer le compte'}
        </button>
        <div style={S.authSwitch}>
          {authMode==='login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          <button style={S.authSwitchBtn} onClick={() => setAuthMode(authMode==='login'?'register':'login')}>
            {authMode==='login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  )

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoBadge}>
            <div style={S.logoIcon}>⬡</div>
            <div>
              <div style={S.logoName}>PCS</div>
              <div style={S.logoSub}>Suivi de projet</div>
            </div>
          </div>
        </div>

        <div style={S.navSection}>Navigation</div>

        {[
          { key:'processus', label:'Processus', icon:'📋' },
          { key:'workflows', label:'Workflows',  icon:'🔀' },
          { key:'activites', label:'Activités',  icon:'✅' },
        ].map(item => (
          <div key={item.key}
            style={{...S.navItem,...(view===item.key?S.navActive:{})}}
            onClick={() => setView(item.key)}>
            <span style={S.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div style={S.sidebarSpacer} />
        <div style={S.sidebarBottom}>
          <div style={{...S.navItem}} onClick={seDeconnecter}>
            <span style={S.navIcon}>🚪</span>
            Déconnexion
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* TOPBAR */}
        <div style={S.topbar}>
          <div style={S.breadcrumb}>
            <span>PCS</span>
            {selectedPcs && <><span style={S.breadSep}>›</span><span style={S.breadActive}>{selectedPcs.pcsnom}</span></>}
            {selectedWkf && <><span style={S.breadSep}>›</span><span style={S.breadActive}>{selectedWkf.wkfnom}</span></>}
          </div>
          <div style={S.userPill}>
            <div style={S.avatar}>{initiales(username)}</div>
            {username}
          </div>
        </div>

        {/* PANELS */}
        <div style={S.panels}>

          {/* PANEL PROCESSUS */}
          <div style={S.pcsPanel}>
            <div style={S.pcsPanelHdr}>
              <span style={S.pcsPanelTitle}>Processus</span>
              <button style={S.addBtn} onClick={() => setShowAddPcs(!showAddPcs)}>+</button>
            </div>
            <div style={S.pcsScroll}>
              {processus.length === 0 && <div style={S.empty}><div style={S.emptyIcon}>📂</div>Aucun processus</div>}
              {processus.map(p => (
                <div key={p.pcs_id}>
                  {editingPcs === p.pcs_id ? (
                    <div style={{display:'flex', gap:4, marginBottom:4}}>
                      <input style={{...S.pcsInput, flex:1}} value={editValue} autoFocus
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={e => e.key==='Enter' && modifierProcessus(p.pcs_id)} />
                      <button style={{...S.btnSm,...S.btnSmPrimary}} onClick={() => modifierProcessus(p.pcs_id)}>✓</button>
                      <button style={S.btnSm} onClick={() => setEditingPcs(null)}>✕</button>
                    </div>
                  ) : (
                    <div
                      style={{...S.pcsItem,...(selectedPcs?.pcs_id===p.pcs_id?S.pcsActive:{})}}
                      onClick={() => voirWorkflows(p)}>
                      <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.pcsnom}</span>
                      <div style={{display:'flex', gap:3}}>
                        <button style={{...S.btnIcon, width:22, height:22, fontSize:11}} onClick={e=>{e.stopPropagation();setEditingPcs(p.pcs_id);setEditValue(p.pcsnom)}}>✏️</button>
                        <button style={{...S.btnIcon,...S.btnIconDanger, width:22, height:22, fontSize:11}} onClick={e=>{e.stopPropagation();supprimerProcessus(p.pcs_id)}}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {showAddPcs && (
              <div style={S.pcsAddBox}>
                <input style={S.pcsInput} placeholder="Nom du processus…" value={nouveauPcs} autoFocus
                  onChange={e => setNouveauPcs(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && ajouterProcessus()} />
                <div style={{display:'flex', gap:4, marginTop:6}}>
                  <button style={{...S.btnSm,...S.btnSmPrimary, flex:1}} onClick={ajouterProcessus}>Ajouter</button>
                  <button style={S.btnSm} onClick={() => setShowAddPcs(false)}>Annuler</button>
                </div>
              </div>
            )}
          </div>

          {/* PANEL WORKFLOWS */}
          {selectedPcs && (
            <div style={S.wkfPanel}>
              <div style={S.wkfPanelHdr}>
                <span style={S.wkfPanelTitle}>Workflows</span>
                <button style={S.addBtn} onClick={() => setShowAddWkf(!showAddWkf)}>+</button>
              </div>
              <div style={S.wkfScroll}>
                {workflows.length === 0 && <div style={S.empty}><div style={S.emptyIcon}>🔀</div>Aucun workflow</div>}
                {workflows.map(w => (
                  <div key={w.wkf_id}>
                    {editingWkf === w.wkf_id ? (
                      <div style={{display:'flex', gap:4, marginBottom:8}}>
                        <input style={{...S.wkfInput, flex:1}} value={editValue} autoFocus
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key==='Enter' && modifierWorkflow(w.wkf_id)} />
                        <button style={{...S.btnSm,...S.btnSmPrimary}} onClick={() => modifierWorkflow(w.wkf_id)}>✓</button>
                        <button style={S.btnSm} onClick={() => setEditingWkf(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={{...S.wkfCard,...(selectedWkf?.wkf_id===w.wkf_id?S.wkfCardActive:{})}}
                        onClick={() => voirActivites(w)}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                          <span style={S.wkfCardName}>{w.wkfnom}</span>
                          <div style={{display:'flex', gap:3}}>
                            <button style={{...S.btnIcon, width:22, height:22, fontSize:11}} onClick={e=>{e.stopPropagation();setEditingWkf(w.wkf_id);setEditValue(w.wkfnom)}}>✏️</button>
                            <button style={{...S.btnIcon,...S.btnIconDanger, width:22, height:22, fontSize:11}} onClick={e=>{e.stopPropagation();supprimerWorkflow(w.wkf_id)}}>✕</button>
                          </div>
                        </div>
                        <div style={S.wkfCardMeta}><span style={S.wkfCardTag}>actif</span></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {showAddWkf && (
                <div style={S.wkfAddBox}>
                  <input style={S.wkfInput} placeholder="Nom du workflow…" value={nouveauWkf} autoFocus
                    onChange={e => setNouveauWkf(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && ajouterWorkflow()} />
                  <div style={{display:'flex', gap:4, marginTop:6}}>
                    <button style={{...S.btnSm,...S.btnSmPrimary, flex:1}} onClick={ajouterWorkflow}>Ajouter</button>
                    <button style={S.btnSm} onClick={() => setShowAddWkf(false)}>Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL ACTIVITÉS + MERMAID */}
          {selectedWkf && (
            <div style={S.diagPanel}>
              <div style={S.diagHdr}>
                <div>
                  <div style={S.diagTitle}>{selectedWkf.wkfnom}</div>
                  <div style={S.diagSub}>{activites.length} activité{activites.length !== 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Liste activités */}
              <div style={S.diagBox}>
                <div style={S.actList}>
                  {activites.length === 0 && <div style={S.empty}><div style={S.emptyIcon}>✅</div>Aucune activité</div>}
                  {activites.map((a, i) => (
                    <div key={a.act_id} style={S.actItem}>
                      {editingAct === a.act_id ? (
                        <>
                          <div style={S.actNum}>{i+1}</div>
                          <input style={S.actInput} value={editValue} autoFocus
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key==='Enter' && modifierActivite(a.act_id)} />
                          <button style={S.actSave} onClick={() => modifierActivite(a.act_id)}>✓</button>
                          <button style={S.actCancel} onClick={() => setEditingAct(null)}>✕</button>
                        </>
                      ) : (
                        <>
                          <div style={S.actNum}>{i+1}</div>
                          <span style={S.actName}>{a.actnom}</span>
                          <div style={S.actBtns}>
                            <button style={S.btnIcon} title="Modifier" onClick={() => { setEditingAct(a.act_id); setEditValue(a.actnom) }}>✏️</button>
                            <button style={{...S.btnIcon,...S.btnIconDanger}} title="Supprimer" onClick={() => supprimerActivite(a.act_id)}>✕</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div style={S.addActRow}>
                  <input style={S.addActInput} placeholder="Nouvelle activité…" value={nouvelleAct}
                    onChange={e => setNouvelleAct(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && ajouterActivite()} />
                  <button style={S.addActBtn} onClick={ajouterActivite}>+ Ajouter</button>
                </div>
              </div>

              {/* Diagramme Mermaid */}
              {mermaidSvg && (
                <div style={S.diagBox}>
                  <div style={{fontSize:13, fontWeight:600, color:'#6366f1', marginBottom:12}}>Flux d'activités</div>
                  <div style={S.mermaidWrap} dangerouslySetInnerHTML={{ __html: mermaidSvg }} />
                </div>
              )}
            </div>
          )}

          {/* ÉTAT VIDE PRINCIPAL */}
          {!selectedPcs && (
            <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48, marginBottom:12, opacity:.3}}>⬡</div>
                <div style={{fontSize:15, fontWeight:600, marginBottom:6, color:'#475569'}}>Sélectionnez un processus</div>
                <div style={{fontSize:13}}>pour voir ses workflows et activités</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}