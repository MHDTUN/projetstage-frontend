import { useState, useEffect, useCallback, useRef } from 'react'
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'

const API = 'https://projetstage-secure-1.onrender.com'
mermaid.initialize({ startOnLoad:false, theme:'neutral', flowchart:{ curve:'basis' } })

const C = {
  indigo:'#6366f1', indigoDark:'#4f46e5', indigoLight:'#ede9fe', indigoText:'#5b21b6',
  ink:'#0f172a', slate:'#1e293b', slate600:'#475569', slate400:'#94a3b8', slate200:'#e2e8f0', slate100:'#f1f5f9', slate50:'#f8fafc',
  green:'#10b981', greenLight:'#dcfce7', greenText:'#166534',
  red:'#ef4444', redLight:'#fee2e2', amber:'#f59e0b', amberLight:'#fef3c7',
  white:'#fff',
}

const S = {
  app:{ display:'flex', height:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.slate50, color:C.slate, overflow:'hidden' },

  sidebar:{ width:72, background:C.ink, display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, paddingTop:16, paddingBottom:16 },
  sbLogo:{ width:40, height:40, background:C.indigo, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, marginBottom:24 },
  sbIcon:{ width:44, height:44, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, cursor:'pointer', marginBottom:6, color:'#475569', transition:'all .15s', position:'relative' },
  sbIconActive:{ background:'#1e293b', color:'#a5b4fc' },
  sbSpacer:{ flex:1 },

  main:{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar:{ height:56, padding:'0 24px', borderBottom:`1px solid ${C.slate200}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.white, flexShrink:0 },
  breadcrumb:{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:C.slate400 },
  breadActive:{ color:C.slate, fontWeight:600 },
  breadChip:{ background:C.indigoLight, color:C.indigoText, padding:'3px 10px', borderRadius:7, fontSize:13, fontWeight:600 },
  userPill:{ display:'flex', alignItems:'center', gap:9, padding:'6px 14px', border:`1px solid ${C.slate200}`, borderRadius:22, fontSize:13, color:C.slate600, background:C.slate50, cursor:'pointer' },
  avatar:{ width:24, height:24, borderRadius:'50%', background:C.indigo, color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },

  panels:{ flex:1, display:'flex', overflow:'hidden' },

  col:{ display:'flex', flexDirection:'column', background:C.white, flexShrink:0 },
  colHdr:{ padding:'16px 16px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  colTitle:{ fontSize:11, fontWeight:700, color:C.slate400, textTransform:'uppercase', letterSpacing:'.07em' },
  colCount:{ background:C.slate100, color:C.slate600, borderRadius:20, padding:'1px 8px', fontSize:11, fontWeight:700, marginLeft:8 },
  addBtn:{ width:26, height:26, borderRadius:7, background:C.indigo, color:'#fff', border:'none', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1, transition:'transform .1s' },
  scroll:{ flex:1, overflowY:'auto', padding:'4px 10px 10px' },

  pcsItem:{ display:'flex', alignItems:'center', gap:8, padding:'10px 10px', borderRadius:9, cursor:'pointer', marginBottom:3, fontSize:13, color:C.slate600, userSelect:'none', transition:'background .12s', border:'1px solid transparent' },
  pcsActive:{ background:C.indigoLight, color:C.indigoText, fontWeight:600 },
  dragHandle:{ cursor:'grab', color:C.slate400, fontSize:13, opacity:.5, flexShrink:0 },
  ordBadge:{ minWidth:24, height:22, borderRadius:6, background:C.slate100, color:C.slate600, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'text', padding:'0 4px' },
  ordBadgeActive:{ background:C.indigo, color:'#fff' },
  ordInput:{ width:34, height:22, borderRadius:6, border:`1px solid ${C.indigo}`, fontSize:11, fontWeight:700, textAlign:'center', outline:'none', padding:0 },
  itemName:{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  miniBtns:{ display:'flex', gap:2, flexShrink:0 },
  miniBtn:{ width:22, height:22, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:C.slate400 },
  miniBtnDanger:{ color:C.red },

  wkfCard:{ border:`1px solid ${C.slate200}`, borderRadius:11, padding:'11px 12px', marginBottom:8, cursor:'pointer', background:C.white, userSelect:'none', transition:'all .15s' },
  wkfCardActive:{ borderColor:C.indigo, background:'#f5f3ff', boxShadow:'0 1px 8px rgba(99,102,241,.12)' },
  wkfName:{ fontSize:13, fontWeight:600, color:C.slate, flex:1 },
  tag:{ display:'inline-block', background:C.greenLight, color:C.greenText, fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600 },

  addBox:{ padding:'10px', margin:'0 10px 10px', background:C.slate50, borderRadius:10, border:`1px dashed ${C.slate200}` },
  input:{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${C.slate200}`, fontSize:13, outline:'none', boxSizing:'border-box' },
  rowBtns:{ display:'flex', gap:6, marginTop:7 },
  btn:{ padding:'8px 14px', fontSize:12, border:`1px solid ${C.slate200}`, borderRadius:8, background:C.white, color:C.slate600, cursor:'pointer', fontWeight:600, transition:'all .12s' },
  btnPrimary:{ background:C.indigo, color:'#fff', borderColor:C.indigo },

  // Zone activités
  actZone:{ flex:1, display:'flex', flexDirection:'column', background:C.slate50, overflow:'hidden' },
  actTop:{ padding:'18px 24px 0', display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  actTitle:{ fontSize:18, fontWeight:700, color:C.slate },
  actSub:{ fontSize:13, color:C.slate400, marginTop:3 },
  viewToggle:{ display:'flex', background:C.white, border:`1px solid ${C.slate200}`, borderRadius:9, padding:3, gap:2 },
  toggleBtn:{ padding:'7px 14px', fontSize:12, fontWeight:600, border:'none', borderRadius:7, background:'transparent', color:C.slate400, cursor:'pointer', display:'flex', alignItems:'center', gap:6 },
  toggleActive:{ background:C.indigo, color:'#fff' },

  actBody:{ flex:1, overflow:'auto', padding:24 },

  // Vue liste
  listCard:{ background:C.white, borderRadius:14, border:`1px solid ${C.slate200}`, padding:20 },
  actRow:{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:11, background:C.slate50, border:`1px solid ${C.slate100}`, marginBottom:8, transition:'all .15s' },
  actRowDrag:{ opacity:.4, borderStyle:'dashed' },
  actRowOver:{ borderColor:C.indigo, background:'#f5f3ff' },
  actNum:{ width:26, height:26, borderRadius:'50%', background:C.indigoLight, color:C.indigoText, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  actName:{ flex:1, color:C.slate, fontSize:14 },

  addActRow:{ display:'flex', gap:8, marginTop:12, paddingTop:12, borderTop:`1px solid ${C.slate100}` },

  // Vue canvas
  canvas:{ position:'relative', background:`radial-gradient(circle, ${C.slate200} 1px, transparent 1px)`, backgroundSize:'22px 22px', borderRadius:14, border:`1px solid ${C.slate200}`, minHeight:480, overflow:'hidden' },
  canvasNode:{ position:'absolute', background:C.white, border:`2px solid ${C.indigo}`, borderRadius:12, padding:'12px 16px', minWidth:130, maxWidth:200, cursor:'grab', boxShadow:'0 2px 12px rgba(15,23,42,.08)', userSelect:'none', transition:'box-shadow .15s' },
  canvasNodeNum:{ position:'absolute', top:-10, left:-10, width:24, height:24, borderRadius:'50%', background:C.indigo, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },
  canvasNodeName:{ fontSize:13, fontWeight:600, color:C.slate, wordBreak:'break-word' },
  canvasHint:{ position:'absolute', bottom:14, right:16, fontSize:12, color:C.slate400, background:C.white, padding:'5px 12px', borderRadius:20, border:`1px solid ${C.slate200}` },

  // Mermaid
  mermaidCard:{ background:C.white, borderRadius:14, border:`1px solid ${C.slate200}`, padding:20, marginTop:16 },
  mermaidWrap:{ overflowX:'auto', display:'flex', justifyContent:'center', padding:'12px 0' },

  empty:{ textAlign:'center', padding:'48px 20px', color:C.slate400 },
  emptyIcon:{ fontSize:40, marginBottom:10, opacity:.3 },
  emptyTitle:{ fontSize:15, fontWeight:600, color:C.slate600, marginBottom:4 },

  // Auth
  authPage:{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:C.ink },
  authCard:{ background:'#fff', padding:40, borderRadius:18, width:370, boxShadow:'0 24px 70px rgba(0,0,0,.35)' },
  authLogo:{ display:'flex', alignItems:'center', gap:11, marginBottom:8, justifyContent:'center' },
  authLogoIcon:{ width:42, height:42, background:C.indigo, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:21 },
  authTitle:{ fontSize:24, fontWeight:800, color:C.slate, letterSpacing:'-.5px' },
  authSub:{ textAlign:'center', color:C.slate400, fontSize:13, marginBottom:26 },
  authInput:{ width:'100%', padding:'12px 14px', borderRadius:9, border:`1px solid ${C.slate200}`, fontSize:14, marginBottom:12, outline:'none', boxSizing:'border-box' },
  authBtn:{ width:'100%', padding:14, background:C.indigo, color:'#fff', border:'none', borderRadius:9, cursor:'pointer', fontSize:15, fontWeight:700, marginTop:4 },
  authSwitch:{ textAlign:'center', marginTop:18, fontSize:13, color:C.slate400 },
  authSwitchBtn:{ background:'none', border:'none', color:C.indigo, cursor:'pointer', fontWeight:700, fontSize:13 },

  toast:{ position:'fixed', bottom:24, right:24, padding:'13px 22px', borderRadius:11, fontSize:14, fontWeight:600, zIndex:2000, boxShadow:'0 6px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, animation:'slideIn .25s ease' },
  toastError:{ background:C.red, color:'#fff' },
  toastSuccess:{ background:C.green, color:'#fff' },
}

const CSS = `
@keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
* { scrollbar-width:thin; scrollbar-color:#cbd5e1 transparent; }
*::-webkit-scrollbar { width:8px; height:8px; }
*::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:8px; }
*::-webkit-scrollbar-track { background:transparent; }
.fade-item { animation:fadeIn .2s ease; }
input:focus { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
.hover-lift:hover { transform:translateY(-1px); }
`

export default function App() {
  const [token, setToken]       = useState('')
  const [username, setUsername] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username:'', password:'' })

  const [processus, setProcessus]     = useState([])
  const [workflows, setWorkflows]     = useState([])
  const [activites, setActivites]     = useState([])
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
  const [editingOrd, setEditingOrd] = useState(null)
  const [ordValue, setOrdValue]     = useState('')

  const [toast, setToast]   = useState(null)
  const [actView, setActView] = useState('list') // 'list' | 'canvas'
  const [mermaidSvg, setMermaidSvg] = useState('')
  const [canvasPos, setCanvasPos]   = useState({})  // { act_id: {x,y} }

  // Drag state
  const dragItem = useRef(null)
  const dragOver = useRef(null)
  const [dragInfo, setDragInfo] = useState({ list:null, idx:null, over:null })
  const canvasDrag = useRef(null)

  const showToast = (msg, type='error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800) }

  const h = (json=false) => {
    const hd = { authorization:`Bearer ${token}` }
    if (json) hd['Content-Type'] = 'application/json'
    return hd
  }

  // ── Auth ──
  const seConnecter = async () => {
    const res = await fetch(`${API}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authForm) })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur de connexion')
    setToken(data.token); setUsername(authForm.username)
  }
  const sInscrire = async () => {
    if (!authForm.username || !authForm.password) return showToast('Remplissez tous les champs')
    const res = await fetch(`${API}/inscription`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authForm) })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur')
    showToast('Compte créé !', 'success'); setAuthMode('login')
  }
  const seDeconnecter = () => {
    setToken(''); setUsername(''); setProcessus([]); setWorkflows([]); setActivites([])
    setSelectedPcs(null); setSelectedWkf(null); setMermaidSvg('')
  }

  // ── Chargement ──
  const chargerProcessus = useCallback(() =>
    fetch(`${API}/processus`, { headers:{ authorization:`Bearer ${token}` } }).then(r=>r.json()).then(setProcessus)
  , [token])
  const chargerWorkflows = useCallback((pcs) =>
    fetch(`${API}/processus/${pcs.pcs_id}/workflows`, { headers:{ authorization:`Bearer ${token}` } }).then(r=>r.json()).then(setWorkflows)
  , [token])
  const chargerActivites = useCallback(async (wkf) => {
    const data = await fetch(`${API}/workflows/${wkf.wkf_id}/activites`, { headers:{ authorization:`Bearer ${token}` } }).then(r=>r.json())
    setActivites(data); genererMermaid(data); initCanvas(data)
  }, [token])

  useEffect(() => { if (token) chargerProcessus() }, [token, chargerProcessus])

  // ── Mermaid ──
  const genererMermaid = async (acts) => {
    if (!acts || acts.length===0) { setMermaidSvg(''); return }
    const lignes = acts.map((a,i) => {
      const label = (a.actnom||'').replace(/"/g,"'")
      return i < acts.length-1 ? `  A${i}["${label}"] --> A${i+1}` : `  A${i}["${label}"]`
    })
    const def = `flowchart TD\n  S([Début]) --> A0\n${lignes.join('\n')}\n  A${acts.length-1} --> E([Fin])`
    try { const { svg } = await mermaid.render('m'+Date.now(), def); setMermaidSvg(svg) }
    catch { setMermaidSvg('') }
  }

  // ── Canvas positions ──
  const initCanvas = (acts) => {
    const pos = {}
    acts.forEach((a,i) => {
      const col = i % 3, row = Math.floor(i/3)
      pos[a.act_id] = { x: 40 + col*220, y: 40 + row*120 }
    })
    setCanvasPos(pos)
  }

  // ── Navigation ──
  const voirWorkflows = (pcs) => { setSelectedPcs(pcs); setSelectedWkf(null); setActivites([]); setMermaidSvg(''); chargerWorkflows(pcs) }
  const voirActivites = (wkf) => { setSelectedWkf(wkf); chargerActivites(wkf) }

  // ── CRUD Processus ──
  const ajouterProcessus = async () => {
    if (!nouveauPcs.trim()) return
    const res = await fetch(`${API}/processus`, { method:'POST', headers:h(true), body:JSON.stringify({ pcsnom:nouveauPcs, pcsrspgrp:'ADMIN' }) })
    if (!res.ok) return showToast('Erreur création')
    setNouveauPcs(''); setShowAddPcs(false); chargerProcessus(); showToast('Processus créé', 'success')
  }
  const supprimerProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, { method:'DELETE', headers:h() })
    if (selectedPcs?.pcs_id===id) { setSelectedPcs(null); setSelectedWkf(null); setWorkflows([]); setActivites([]); setMermaidSvg('') }
    chargerProcessus()
  }
  const modifierProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ pcsnom:editValue }) })
    setEditingPcs(null); chargerProcessus()
  }

  // ── CRUD Workflows ──
  const ajouterWorkflow = async () => {
    if (!nouveauWkf.trim() || !selectedPcs) return
    await fetch(`${API}/processus/${selectedPcs.pcs_id}/workflows`, { method:'POST', headers:h(true), body:JSON.stringify({ wkfnom:nouveauWkf }) })
    setNouveauWkf(''); setShowAddWkf(false); chargerWorkflows(selectedPcs); showToast('Workflow créé', 'success')
  }
  const supprimerWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, { method:'DELETE', headers:h() })
    if (selectedWkf?.wkf_id===id) { setSelectedWkf(null); setActivites([]); setMermaidSvg('') }
    chargerWorkflows(selectedPcs)
  }
  const modifierWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ wkfnom:editValue }) })
    setEditingWkf(null); chargerWorkflows(selectedPcs)
  }

  // ── CRUD Activités ──
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

  // ── Drag & drop réordonnement (visuel) ──
  const onDragStart = (list, idx) => { dragItem.current = { list, idx }; setDragInfo({ list, idx, over:null }) }
  const onDragEnter = (list, idx) => { if (dragItem.current?.list===list) setDragInfo(d => ({ ...d, over:idx })) }
  const onDragEnd = (list, items, setItems) => {
    const di = dragItem.current
    if (di && dragInfo.over!==null && di.idx!==dragInfo.over) {
      const copy = [...items]
      const [moved] = copy.splice(di.idx, 1)
      copy.splice(dragInfo.over, 0, moved)
      setItems(copy)
      if (list==='act') genererMermaid(copy)
    }
    dragItem.current = null
    setDragInfo({ list:null, idx:null, over:null })
  }

  // ── Édition numéro d'ordre avec détection doublon ──
  const validerOrdre = (items, setItems, idx, listLabel) => {
    const n = parseInt(ordValue)
    if (isNaN(n) || n < 1) { setEditingOrd(null); return }
    const exists = items.some((it,i) => i!==idx && (i+1)===n)
    if (exists) { showToast(`Numéro ${n} déjà utilisé`, 'error'); return }
    const copy = [...items]
    const [moved] = copy.splice(idx, 1)
    copy.splice(Math.min(n-1, copy.length), 0, moved)
    setItems(copy)
    if (listLabel==='act') genererMermaid(copy)
    setEditingOrd(null)
    showToast('Ordre mis à jour', 'success')
  }

  // ── Canvas drag ──
  const canvasRef = useRef(null)
  const startCanvasDrag = (e, id) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const pos = canvasPos[id] || { x:40, y:40 }
    canvasDrag.current = { id, offX: e.clientX - rect.left - pos.x, offY: e.clientY - rect.top - pos.y }
  }
  const moveCanvasDrag = (e) => {
    if (!canvasDrag.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const { id, offX, offY } = canvasDrag.current
    const x = Math.max(0, Math.min(e.clientX - rect.left - offX, rect.width - 140))
    const y = Math.max(0, Math.min(e.clientY - rect.top - offY, rect.height - 70))
    setCanvasPos(p => ({ ...p, [id]: { x, y } }))
  }
  const endCanvasDrag = () => { canvasDrag.current = null }

  const initiales = (n) => n ? n.slice(0,2).toUpperCase() : '?'

  // ── AUTH ──
  if (!token) return (
    <>
      <style>{CSS}</style>
      <div style={S.authPage}>
        {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>{toast.msg}</div>}
        <div style={S.authCard}>
          <div style={S.authLogo}><div style={S.authLogoIcon}>⬡</div><span style={S.authTitle}>PCS</span></div>
          <div style={S.authSub}>{authMode==='login'?'Connectez-vous pour continuer':'Créer un nouveau compte'}</div>
          <input style={S.authInput} placeholder="Nom d'utilisateur" value={authForm.username}
            onChange={e=>setAuthForm({...authForm,username:e.target.value})} />
          <input style={S.authInput} placeholder="Mot de passe" type="password" value={authForm.password}
            onChange={e=>setAuthForm({...authForm,password:e.target.value})}
            onKeyDown={e=>e.key==='Enter'&&(authMode==='login'?seConnecter():sInscrire())} />
          <button style={S.authBtn} onClick={authMode==='login'?seConnecter:sInscrire}>
            {authMode==='login'?'Se connecter':'Créer le compte'}
          </button>
          <div style={S.authSwitch}>
            {authMode==='login'?'Pas encore de compte ? ':'Déjà un compte ? '}
            <button style={S.authSwitchBtn} onClick={()=>setAuthMode(authMode==='login'?'register':'login')}>
              {authMode==='login'?"S'inscrire":'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // ── APP ──
  return (
    <>
      <style>{CSS}</style>
      <div style={S.app}>
        {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>
          <span>{toast.type==='success'?'✓':'⚠'}</span>{toast.msg}
        </div>}

        {/* SIDEBAR ICÔNES */}
        <div style={S.sidebar}>
          <div style={S.sbLogo}>⬡</div>
          <div style={{...S.sbIcon,...S.sbIconActive}} title="Processus">📋</div>
          <div style={S.sbSpacer} />
          <div style={S.sbIcon} title="Déconnexion" onClick={seDeconnecter}>🚪</div>
        </div>

        {/* MAIN */}
        <div style={S.main}>
          <div style={S.topbar}>
            <div style={S.breadcrumb}>
              <span>PCS</span>
              {selectedPcs && <><span>›</span><span style={S.breadChip}>{selectedPcs.pcsnom}</span></>}
              {selectedWkf && <><span>›</span><span style={S.breadChip}>{selectedWkf.wkfnom}</span></>}
            </div>
            <div style={S.userPill}><div style={S.avatar}>{initiales(username)}</div>{username}</div>
          </div>

          <div style={S.panels}>

            {/* COLONNE PROCESSUS */}
            <div style={{...S.col, width:240, borderRight:`1px solid ${C.slate200}`}}>
              <div style={S.colHdr}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={S.colTitle}>Processus</span>
                  <span style={S.colCount}>{processus.length}</span>
                </div>
                <button style={S.addBtn} onClick={()=>setShowAddPcs(!showAddPcs)}>+</button>
              </div>
              {showAddPcs && (
                <div style={S.addBox}>
                  <input style={S.input} placeholder="Nom du processus…" value={nouveauPcs} autoFocus
                    onChange={e=>setNouveauPcs(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ajouterProcessus()} />
                  <div style={S.rowBtns}>
                    <button style={{...S.btn,...S.btnPrimary,flex:1}} onClick={ajouterProcessus}>Ajouter</button>
                    <button style={S.btn} onClick={()=>setShowAddPcs(false)}>Annuler</button>
                  </div>
                </div>
              )}
              <div style={S.scroll}>
                {processus.length===0 && <div style={S.empty}><div style={S.emptyIcon}>📂</div>Aucun processus</div>}
                {processus.map((p,idx) => (
                  <div key={p.pcs_id} className="fade-item" draggable={editingPcs!==p.pcs_id}
                    onDragStart={()=>onDragStart('pcs',idx)}
                    onDragEnter={()=>onDragEnter('pcs',idx)}
                    onDragOver={e=>e.preventDefault()}
                    onDragEnd={()=>onDragEnd('pcs',processus,setProcessus)}>
                    {editingPcs===p.pcs_id ? (
                      <div style={{display:'flex',gap:4,marginBottom:3}}>
                        <input style={{...S.input,flex:1}} value={editValue} autoFocus
                          onChange={e=>setEditValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&modifierProcessus(p.pcs_id)} />
                        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>modifierProcessus(p.pcs_id)}>✓</button>
                        <button style={S.btn} onClick={()=>setEditingPcs(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={{...S.pcsItem,
                        ...(selectedPcs?.pcs_id===p.pcs_id?S.pcsActive:{}),
                        ...(dragInfo.list==='pcs'&&dragInfo.idx===idx?{opacity:.4}:{}),
                        ...(dragInfo.list==='pcs'&&dragInfo.over===idx?{borderColor:C.indigo,background:'#f5f3ff'}:{})}}
                        onClick={()=>voirWorkflows(p)}>
                        <span style={S.dragHandle}>⋮⋮</span>
                        {editingOrd===`pcs-${idx}` ? (
                          <input style={S.ordInput} value={ordValue} autoFocus type="number"
                            onChange={e=>setOrdValue(e.target.value)} onClick={e=>e.stopPropagation()}
                            onKeyDown={e=>{ if(e.key==='Enter'){e.stopPropagation();validerOrdre(processus,setProcessus,idx,'pcs')} }}
                            onBlur={()=>setEditingOrd(null)} />
                        ) : (
                          <span style={{...S.ordBadge,...(selectedPcs?.pcs_id===p.pcs_id?S.ordBadgeActive:{})}}
                            onClick={e=>{e.stopPropagation();setEditingOrd(`pcs-${idx}`);setOrdValue(String(idx+1))}}>{idx+1}</span>
                        )}
                        <span style={S.itemName}>{p.pcsnom}</span>
                        <div style={S.miniBtns}>
                          <button style={S.miniBtn} onClick={e=>{e.stopPropagation();setEditingPcs(p.pcs_id);setEditValue(p.pcsnom)}}>✏️</button>
                          <button style={{...S.miniBtn,...S.miniBtnDanger}} onClick={e=>{e.stopPropagation();supprimerProcessus(p.pcs_id)}}>✕</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COLONNE WORKFLOWS */}
            {selectedPcs && (
              <div style={{...S.col, width:260, borderRight:`1px solid ${C.slate200}`, background:C.slate50}}>
                <div style={S.colHdr}>
                  <div style={{display:'flex',alignItems:'center'}}>
                    <span style={S.colTitle}>Workflows</span>
                    <span style={S.colCount}>{workflows.length}</span>
                  </div>
                  <button style={S.addBtn} onClick={()=>setShowAddWkf(!showAddWkf)}>+</button>
                </div>
                {showAddWkf && (
                  <div style={S.addBox}>
                    <input style={S.input} placeholder="Nom du workflow…" value={nouveauWkf} autoFocus
                      onChange={e=>setNouveauWkf(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ajouterWorkflow()} />
                    <div style={S.rowBtns}>
                      <button style={{...S.btn,...S.btnPrimary,flex:1}} onClick={ajouterWorkflow}>Ajouter</button>
                      <button style={S.btn} onClick={()=>setShowAddWkf(false)}>Annuler</button>
                    </div>
                  </div>
                )}
                <div style={S.scroll}>
                  {workflows.length===0 && <div style={S.empty}><div style={S.emptyIcon}>🔀</div>Aucun workflow</div>}
                  {workflows.map((w,idx) => (
                    <div key={w.wkf_id} className="fade-item" draggable={editingWkf!==w.wkf_id}
                      onDragStart={()=>onDragStart('wkf',idx)}
                      onDragEnter={()=>onDragEnter('wkf',idx)}
                      onDragOver={e=>e.preventDefault()}
                      onDragEnd={()=>onDragEnd('wkf',workflows,setWorkflows)}>
                      {editingWkf===w.wkf_id ? (
                        <div style={{display:'flex',gap:4,marginBottom:8}}>
                          <input style={{...S.input,flex:1}} value={editValue} autoFocus
                            onChange={e=>setEditValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&modifierWorkflow(w.wkf_id)} />
                          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>modifierWorkflow(w.wkf_id)}>✓</button>
                          <button style={S.btn} onClick={()=>setEditingWkf(null)}>✕</button>
                        </div>
                      ) : (
                        <div className="hover-lift" style={{...S.wkfCard,
                          ...(selectedWkf?.wkf_id===w.wkf_id?S.wkfCardActive:{}),
                          ...(dragInfo.list==='wkf'&&dragInfo.idx===idx?{opacity:.4}:{}),
                          ...(dragInfo.list==='wkf'&&dragInfo.over===idx?{borderColor:C.indigo}:{})}}
                          onClick={()=>voirActivites(w)}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={S.dragHandle}>⋮⋮</span>
                            {editingOrd===`wkf-${idx}` ? (
                              <input style={S.ordInput} value={ordValue} autoFocus type="number"
                                onChange={e=>setOrdValue(e.target.value)} onClick={e=>e.stopPropagation()}
                                onKeyDown={e=>{ if(e.key==='Enter'){e.stopPropagation();validerOrdre(workflows,setWorkflows,idx,'wkf')} }}
                                onBlur={()=>setEditingOrd(null)} />
                            ) : (
                              <span style={S.ordBadge} onClick={e=>{e.stopPropagation();setEditingOrd(`wkf-${idx}`);setOrdValue(String(idx+1))}}>{idx+1}</span>
                            )}
                            <span style={S.wkfName}>{w.wkfnom}</span>
                            <div style={S.miniBtns}>
                              <button style={S.miniBtn} onClick={e=>{e.stopPropagation();setEditingWkf(w.wkf_id);setEditValue(w.wkfnom)}}>✏️</button>
                              <button style={{...S.miniBtn,...S.miniBtnDanger}} onClick={e=>{e.stopPropagation();supprimerWorkflow(w.wkf_id)}}>✕</button>
                            </div>
                          </div>
                          <div style={{marginTop:7,paddingLeft:22}}><span style={S.tag}>actif</span></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ZONE ACTIVITÉS */}
            {selectedWkf ? (
              <div style={S.actZone}>
                <div style={S.actTop}>
                  <div>
                    <div style={S.actTitle}>{selectedWkf.wkfnom}</div>
                    <div style={S.actSub}>{activites.length} activité{activites.length!==1?'s':''} · glissez pour réorganiser</div>
                  </div>
                  <div style={S.viewToggle}>
                    <button style={{...S.toggleBtn,...(actView==='list'?S.toggleActive:{})}} onClick={()=>setActView('list')}>☰ Liste</button>
                    <button style={{...S.toggleBtn,...(actView==='canvas'?S.toggleActive:{})}} onClick={()=>setActView('canvas')}>⬚ Canvas</button>
                  </div>
                </div>

                <div style={S.actBody}>
                  {actView==='list' ? (
                    <>
                      <div style={S.listCard}>
                        {activites.length===0 && <div style={S.empty}><div style={S.emptyIcon}>✅</div><div style={S.emptyTitle}>Aucune activité</div>Ajoutez-en une ci-dessous</div>}
                        {activites.map((a,idx) => (
                          <div key={a.act_id} className="fade-item" draggable={editingAct!==a.act_id}
                            onDragStart={()=>onDragStart('act',idx)}
                            onDragEnter={()=>onDragEnter('act',idx)}
                            onDragOver={e=>e.preventDefault()}
                            onDragEnd={()=>onDragEnd('act',activites,setActivites)}
                            style={{...S.actRow,
                              ...(dragInfo.list==='act'&&dragInfo.idx===idx?S.actRowDrag:{}),
                              ...(dragInfo.list==='act'&&dragInfo.over===idx?S.actRowOver:{})}}>
                            <span style={S.dragHandle}>⋮⋮</span>
                            {editingOrd===`act-${idx}` ? (
                              <input style={{...S.ordInput,width:38,height:26}} value={ordValue} autoFocus type="number"
                                onChange={e=>setOrdValue(e.target.value)}
                                onKeyDown={e=>e.key==='Enter'&&validerOrdre(activites,setActivites,idx,'act')}
                                onBlur={()=>setEditingOrd(null)} />
                            ) : (
                              <span style={S.actNum} onClick={()=>{setEditingOrd(`act-${idx}`);setOrdValue(String(idx+1))}}>{idx+1}</span>
                            )}
                            {editingAct===a.act_id ? (
                              <>
                                <input style={{...S.input,flex:1}} value={editValue} autoFocus
                                  onChange={e=>setEditValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&modifierActivite(a.act_id)} />
                                <button style={{...S.btn,...S.btnPrimary}} onClick={()=>modifierActivite(a.act_id)}>✓</button>
                                <button style={S.btn} onClick={()=>setEditingAct(null)}>✕</button>
                              </>
                            ) : (
                              <>
                                <span style={S.actName}>{a.actnom}</span>
                                <div style={S.miniBtns}>
                                  <button style={S.miniBtn} onClick={()=>{setEditingAct(a.act_id);setEditValue(a.actnom)}}>✏️</button>
                                  <button style={{...S.miniBtn,...S.miniBtnDanger}} onClick={()=>supprimerActivite(a.act_id)}>✕</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        <div style={S.addActRow}>
                          <input style={{...S.input,flex:1}} placeholder="Nouvelle activité…" value={nouvelleAct}
                            onChange={e=>setNouvelleAct(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ajouterActivite()} />
                          <button style={{...S.btn,...S.btnPrimary}} onClick={ajouterActivite}>+ Ajouter</button>
                        </div>
                      </div>

                      {mermaidSvg && (
                        <div style={S.mermaidCard}>
                          <div style={{fontSize:13,fontWeight:700,color:C.indigo,marginBottom:8}}>Aperçu du flux</div>
                          <div style={S.mermaidWrap} dangerouslySetInnerHTML={{__html:mermaidSvg}} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div ref={canvasRef} style={S.canvas}
                      onMouseMove={moveCanvasDrag} onMouseUp={endCanvasDrag} onMouseLeave={endCanvasDrag}>
                      {activites.length===0 && <div style={{...S.empty,paddingTop:200}}><div style={S.emptyIcon}>⬚</div><div style={S.emptyTitle}>Canvas vide</div>Ajoutez des activités en vue Liste</div>}
                      {activites.map((a,idx) => {
                        const pos = canvasPos[a.act_id] || { x:40, y:40 }
                        return (
                          <div key={a.act_id} style={{...S.canvasNode, left:pos.x, top:pos.y}}
                            onMouseDown={e=>startCanvasDrag(e,a.act_id)}>
                            <div style={S.canvasNodeNum}>{idx+1}</div>
                            <div style={S.canvasNodeName}>{a.actnom}</div>
                          </div>
                        )
                      })}
                      {activites.length>0 && <div style={S.canvasHint}>✋ Glissez les cartes librement</div>}
                    </div>
                  )}
                </div>
              </div>
            ) : selectedPcs ? (
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:C.slate400}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:40,marginBottom:12,opacity:.3}}>🔀</div>
                  <div style={S.emptyTitle}>Sélectionnez un workflow</div>
                  <div style={{fontSize:13}}>pour voir et organiser ses activités</div>
                </div>
              </div>
            ) : (
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:C.slate400}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:52,marginBottom:14,opacity:.25}}>⬡</div>
                  <div style={{...S.emptyTitle,fontSize:16}}>Bienvenue sur PCS</div>
                  <div style={{fontSize:13}}>Sélectionnez un processus pour commencer</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}