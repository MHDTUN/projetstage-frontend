import { useState, useEffect, useCallback, useRef } from 'react'
import mermaid from 'mermaid'

const API = 'https://projetstage-secure-1.onrender.com'
mermaid.initialize({ startOnLoad:false, theme:'neutral', flowchart:{ curve:'basis' } })

const C = {
  indigo:'#6366f1', indigoDark:'#4f46e5', indigoLight:'#ede9fe', indigoText:'#5b21b6',
  ink:'#0f172a', slate:'#1e293b', slate600:'#475569', slate400:'#94a3b8', slate300:'#cbd5e1', slate200:'#e2e8f0', slate100:'#f1f5f9', slate50:'#f8fafc',
  green:'#10b981', greenLight:'#dcfce7', greenText:'#166534', greenBorder:'#86efac',
  red:'#ef4444', redLight:'#fee2e2', amber:'#f59e0b', amberLight:'#fef3c7',
  white:'#fff',
}

// Hook : détecte si on est sur mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 820 : false)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 820)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

const S = {
  app:{ display:'flex', height:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.slate50, color:C.slate, overflow:'hidden' },
  appMobile:{ flexDirection:'column' },

  sidebar:{ width:72, background:C.ink, display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, paddingTop:16, paddingBottom:16 },
  sbLogo:{ width:40, height:40, background:C.indigo, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, marginBottom:24, cursor:'pointer' },
  sbIcon:{ width:44, height:44, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, cursor:'pointer', marginBottom:6, color:'#475569', transition:'all .15s' },
  sbIconActive:{ background:'#1e293b', color:'#a5b4fc' },
  sbSpacer:{ flex:1 },

  main:{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar:{ minHeight:56, padding:'0 16px', paddingTop:'env(safe-area-inset-top)', borderBottom:`1px solid ${C.slate200}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.white, flexShrink:0, gap:10 },
  backBtn:{ width:36, height:36, borderRadius:9, border:`1px solid ${C.slate200}`, background:C.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:C.slate600, flexShrink:0 },
  breadcrumb:{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:C.slate400, overflow:'hidden' },
  breadLink:{ cursor:'pointer', transition:'color .12s', padding:'2px 4px', borderRadius:5, whiteSpace:'nowrap' },
  breadChip:{ background:C.indigoLight, color:C.indigoText, padding:'3px 10px', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:140 },
  userPill:{ display:'flex', alignItems:'center', gap:9, padding:'6px 14px', border:`1px solid ${C.slate200}`, borderRadius:22, fontSize:13, color:C.slate600, background:C.slate50, flexShrink:0 },
  avatar:{ width:24, height:24, borderRadius:'50%', background:C.indigo, color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },

  panels:{ flex:1, display:'flex', overflow:'hidden' },
  panelsMobile:{ flexDirection:'column' },

  col:{ display:'flex', flexDirection:'column', background:C.white, flexShrink:0 },
  colMobile:{ width:'100%', flex:1, borderRight:'none' },
  colHdr:{ padding:'16px 16px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  colTitle:{ fontSize:11, fontWeight:700, color:C.slate400, textTransform:'uppercase', letterSpacing:'.07em' },
  colCount:{ background:C.slate100, color:C.slate600, borderRadius:20, padding:'1px 8px', fontSize:11, fontWeight:700, marginLeft:8 },
  addBtn:{ width:30, height:30, borderRadius:8, background:C.indigo, color:'#fff', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
  searchBox:{ margin:'0 14px 8px', position:'relative' },
  searchInput:{ width:'100%', padding:'9px 11px 9px 30px', borderRadius:8, border:`1px solid ${C.slate200}`, fontSize:13, outline:'none', boxSizing:'border-box', background:C.slate50 },
  searchIcon:{ position:'absolute', left:10, top:10, fontSize:12, color:C.slate400 },
  scroll:{ flex:1, overflowY:'auto', padding:'4px 10px 10px', WebkitOverflowScrolling:'touch' },

  sectionLabel:{ display:'flex', alignItems:'center', gap:6, padding:'8px 6px 4px', fontSize:10, fontWeight:700, color:C.slate400, textTransform:'uppercase', letterSpacing:'.06em', cursor:'pointer', userSelect:'none' },

  pcsItem:{ display:'flex', alignItems:'center', gap:8, padding:'12px 10px', borderRadius:9, cursor:'pointer', marginBottom:3, fontSize:14, color:C.slate600, userSelect:'none', transition:'background .12s', border:'1px solid transparent' },
  pcsActive:{ background:C.indigoLight, color:C.indigoText, fontWeight:600 },
  itemDone:{ opacity:.55 },
  dragHandle:{ cursor:'grab', color:C.slate300, fontSize:14, flexShrink:0 },
  ordBadge:{ minWidth:26, height:24, borderRadius:6, background:C.slate100, color:C.slate600, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'text', padding:'0 4px' },
  ordBadgeActive:{ background:C.indigo, color:'#fff' },
  ordInput:{ width:38, height:24, borderRadius:6, border:`1px solid ${C.indigo}`, fontSize:12, fontWeight:700, textAlign:'center', outline:'none', padding:0 },
  itemName:{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  nameDone:{ textDecoration:'line-through' },
  miniBtns:{ display:'flex', gap:2, flexShrink:0 },
  miniBtn:{ width:30, height:30, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:C.slate400 },
  miniBtnDanger:{ color:C.red },
  miniBtnDone:{ color:C.green },
  chevron:{ color:C.slate300, fontSize:16, flexShrink:0 },

  wkfCard:{ border:`1px solid ${C.slate200}`, borderRadius:11, padding:'13px 12px', marginBottom:8, cursor:'pointer', background:C.white, userSelect:'none', transition:'all .15s' },
  wkfCardActive:{ borderColor:C.indigo, background:'#f5f3ff', boxShadow:'0 1px 8px rgba(99,102,241,.12)' },
  wkfName:{ fontSize:14, fontWeight:600, color:C.slate, flex:1 },

  badge:{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600 },
  badgeActif:{ background:C.indigoLight, color:C.indigoText },
  badgeDone:{ background:C.greenLight, color:C.greenText },

  addBox:{ padding:'10px', margin:'0 10px 10px', background:C.slate50, borderRadius:10, border:`1px dashed ${C.slate200}` },
  input:{ width:'100%', padding:'11px 12px', borderRadius:8, border:`1px solid ${C.slate200}`, fontSize:14, outline:'none', boxSizing:'border-box' },
  rowBtns:{ display:'flex', gap:6, marginTop:7 },
  btn:{ padding:'10px 14px', fontSize:13, border:`1px solid ${C.slate200}`, borderRadius:8, background:C.white, color:C.slate600, cursor:'pointer', fontWeight:600, transition:'all .12s' },
  btnPrimary:{ background:C.indigo, color:'#fff', borderColor:C.indigo },

  actZone:{ flex:1, display:'flex', flexDirection:'column', background:C.slate50, overflow:'hidden' },
  actTop:{ padding:'18px 20px 14px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' },
  actTitle:{ fontSize:18, fontWeight:700, color:C.slate, display:'flex', alignItems:'center', gap:10 },
  actSub:{ fontSize:13, color:C.slate400, marginTop:4 },
  progressWrap:{ marginTop:10, display:'flex', alignItems:'center', gap:10 },
  progressBar:{ flex:1, maxWidth:200, height:6, background:C.slate200, borderRadius:6, overflow:'hidden' },
  progressFill:{ height:'100%', background:C.green, transition:'width .3s' },
  progressText:{ fontSize:12, color:C.slate600, fontWeight:600 },

  viewToggle:{ display:'flex', background:C.white, border:`1px solid ${C.slate200}`, borderRadius:9, padding:3, gap:2 },
  toggleBtn:{ padding:'8px 14px', fontSize:13, fontWeight:600, border:'none', borderRadius:7, background:'transparent', color:C.slate400, cursor:'pointer' },
  toggleActive:{ background:C.indigo, color:'#fff' },

  actBody:{ flex:1, overflow:'auto', padding:20, paddingTop:0, WebkitOverflowScrolling:'touch' },

  listCard:{ background:C.white, borderRadius:14, border:`1px solid ${C.slate200}`, padding:16 },
  actRow:{ display:'flex', alignItems:'center', gap:10, padding:'13px 12px', borderRadius:11, background:C.slate50, border:`1px solid ${C.slate100}`, marginBottom:8, transition:'all .15s' },
  actRowDrag:{ opacity:.4, borderStyle:'dashed' },
  actRowOver:{ borderColor:C.indigo, background:'#f5f3ff' },
  actNum:{ width:28, height:28, borderRadius:'50%', background:C.indigoLight, color:C.indigoText, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'text' },
  actNumDone:{ background:C.greenLight, color:C.greenText },
  actName:{ flex:1, color:C.slate, fontSize:14 },

  canvas:{ position:'relative', background:`radial-gradient(circle, ${C.slate200} 1px, transparent 1px)`, backgroundSize:'22px 22px', borderRadius:14, border:`1px solid ${C.slate200}`, minHeight:520, overflow:'hidden', touchAction:'none' },
  canvasNode:{ position:'absolute', background:C.white, border:`2px solid ${C.indigo}`, borderRadius:12, padding:'12px 16px', minWidth:130, maxWidth:190, cursor:'grab', boxShadow:'0 2px 12px rgba(15,23,42,.08)', userSelect:'none', zIndex:2, touchAction:'none' },
  canvasNodeDone:{ borderColor:C.green, background:'#f0fdf4' },
  canvasNodeNum:{ position:'absolute', top:-10, left:-10, width:24, height:24, borderRadius:'50%', background:C.indigo, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 },
  canvasNodeNumDone:{ background:C.green },
  canvasNodeName:{ fontSize:13, fontWeight:600, color:C.slate, wordBreak:'break-word' },
  canvasHint:{ position:'absolute', bottom:14, right:16, fontSize:12, color:C.slate400, background:C.white, padding:'5px 12px', borderRadius:20, border:`1px solid ${C.slate200}`, zIndex:4 },

  mermaidCard:{ background:C.white, borderRadius:14, border:`1px solid ${C.slate200}`, padding:16, marginTop:16 },
  mermaidWrap:{ overflowX:'auto', display:'flex', justifyContent:'center', padding:'12px 0', WebkitOverflowScrolling:'touch' },

  empty:{ textAlign:'center', padding:'48px 20px', color:C.slate400 },
  emptyIcon:{ fontSize:40, marginBottom:10, opacity:.3 },
  emptyTitle:{ fontSize:15, fontWeight:600, color:C.slate600, marginBottom:4 },

  authPage:{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:C.ink, padding:20, boxSizing:'border-box' },
  authCard:{ background:'#fff', padding:'36px 28px', borderRadius:18, width:'100%', maxWidth:370, boxShadow:'0 24px 70px rgba(0,0,0,.35)', boxSizing:'border-box' },
  authLogo:{ display:'flex', alignItems:'center', gap:11, marginBottom:8, justifyContent:'center' },
  authLogoIcon:{ width:42, height:42, background:C.indigo, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:21 },
  authTitle:{ fontSize:24, fontWeight:800, color:C.slate, letterSpacing:'-.5px' },
  authSub:{ textAlign:'center', color:C.slate400, fontSize:13, marginBottom:26 },
  authInput:{ width:'100%', padding:'13px 14px', borderRadius:9, border:`1px solid ${C.slate200}`, fontSize:16, marginBottom:12, outline:'none', boxSizing:'border-box' },
  authBtn:{ width:'100%', padding:14, background:C.indigo, color:'#fff', border:'none', borderRadius:9, cursor:'pointer', fontSize:15, fontWeight:700, marginTop:4 },
  authSwitch:{ textAlign:'center', marginTop:18, fontSize:13, color:C.slate400 },
  authSwitchBtn:{ background:'none', border:'none', color:C.indigo, cursor:'pointer', fontWeight:700, fontSize:13 },

  toast:{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', padding:'13px 22px', borderRadius:11, fontSize:14, fontWeight:600, zIndex:3000, boxShadow:'0 6px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, animation:'slideIn .25s ease', maxWidth:'90vw' },
  toastError:{ background:C.red, color:'#fff' },
  toastSuccess:{ background:C.green, color:'#fff' },

  overlay:{ position:'fixed', inset:0, background:'rgba(15,23,42,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:4000, animation:'fadeIn .15s ease', padding:20, boxSizing:'border-box' },
  modal:{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:380, boxShadow:'0 24px 70px rgba(0,0,0,.3)', animation:'popIn .2s ease', boxSizing:'border-box' },
  modalIcon:{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:14 },
  modalTitle:{ fontSize:17, fontWeight:700, color:C.slate, marginBottom:6 },
  modalText:{ fontSize:14, color:C.slate600, lineHeight:1.5, marginBottom:22 },
  modalBtns:{ display:'flex', gap:10 },
  modalBtn:{ flex:1, padding:'12px 0', borderRadius:9, fontSize:14, fontWeight:600, cursor:'pointer', border:'none' },
  modalCancel:{ background:C.slate100, color:C.slate600 },
  modalConfirm:{ background:C.red, color:'#fff' },
  modalConfirmIndigo:{ background:C.indigo, color:'#fff' },

  // Barre de navigation mobile en bas
  mobileNav:{ display:'flex', borderTop:`1px solid ${C.slate200}`, background:C.white, flexShrink:0, paddingBottom:'env(safe-area-inset-bottom)', transition:'transform .25s ease' },
  mobileNavHidden:{ transform:'translateY(130%)' },
  mobileNavBtn:{ flex:1, padding:'10px 0 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', fontSize:10, fontWeight:600, color:C.slate400 },
  mobileNavBtnActive:{ color:C.indigo },
  mobileNavIcon:{ fontSize:20 },
}

const CSS = `
@keyframes slideIn { from{transform:translate(-50%,20px);opacity:0} to{transform:translate(-50%,0);opacity:1} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes popIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
@keyframes itemIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
* { scrollbar-width:thin; scrollbar-color:#cbd5e1 transparent; box-sizing:border-box; }
*::-webkit-scrollbar { width:8px; height:8px; }
*::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:8px; }
*::-webkit-scrollbar-track { background:transparent; }
html,body { margin:0; padding:0; overscroll-behavior:none; }
.fade-item { animation:itemIn .2s ease; }
input:focus { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
.hover-lift { transition:transform .12s, box-shadow .12s; }
@media(hover:hover){ .hover-lift:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(15,23,42,.08); } }
@media(hover:hover){ .bread-link:hover { color:#6366f1; background:#ede9fe; } }
@media(hover:hover){ .mini-hover:hover { background:#e2e8f0; } }
`

export default function App() {
  const isMobile = useIsMobile()

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

  const [toast, setToast]       = useState(null)
  const [actView, setActView]   = useState('list')
  const [mermaidSvg, setMermaidSvg] = useState('')
  const [canvasPos, setCanvasPos]   = useState({})
  const [search, setSearch]     = useState('')
  const [showDonePcs, setShowDonePcs] = useState(false)
  const [showDoneWkf, setShowDoneWkf] = useState(false)
  const [confirm, setConfirm]   = useState(null)

  // Mobile : quel écran afficher ('pcs' | 'wkf' | 'act')
  const [mobileScreen, setMobileScreen] = useState('pcs')
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  const dragItem = useRef(null)
  const [dragInfo, setDragInfo] = useState({ list:null, idx:null, over:null })
  const canvasDrag = useRef(null)
  const canvasRef = useRef(null)

  const showToast = (msg, type='error') => { setToast({ msg, type }); setTimeout(()=>setToast(null), 2800) }

  const h = (json=false) => {
    const hd = { authorization:`Bearer ${token}` }
    if (json) hd['Content-Type'] = 'application/json'
    return hd
  }

  const estTermine = (x) => x.statut === 'TERMINE'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setConfirm(null); setEditingPcs(null); setEditingWkf(null); setEditingAct(null); setEditingOrd(null)
        setShowAddPcs(false); setShowAddWkf(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Auth ──
  const seConnecter = async () => {
    const res = await fetch(`${API}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authForm) })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur de connexion')
    setToken(data.token); setUsername(data.username || authForm.username)
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
    setSelectedPcs(null); setSelectedWkf(null); setMermaidSvg(''); setMobileScreen('pcs')
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

  // ── Sauvegarde ordre ──
  const sauverOrdrePcs = (items) =>
    fetch(`${API}/processus/ordre`, { method:'PATCH', headers:h(true), body:JSON.stringify({ ordre: items.map(p=>p.pcs_id) }) })
  const sauverOrdreWkf = (items) =>
    fetch(`${API}/workflows/ordre`, { method:'PATCH', headers:h(true), body:JSON.stringify({ ordre: items.map(w=>w.wkf_id) }) })
  const sauverOrdreAct = (items) =>
    fetch(`${API}/workflows/${selectedWkf.wkf_id}/activites/ordre`, { method:'PATCH', headers:h(true), body:JSON.stringify({ ordre: items.map(a=>a.act_id) }) })

  // ── Mermaid ──
  const genererMermaid = async (acts) => {
    if (!acts || acts.length===0) { setMermaidSvg(''); return }
    const lignes = acts.map((a,i) => {
      const label = (a.actnom||'').replace(/"/g,"'")
      const shape = a.statut==='TERMINE' ? `A${i}["✓ ${label}"]` : `A${i}["${label}"]`
      return i < acts.length-1 ? `  ${shape} --> A${i+1}` : `  ${shape}`
    })
    const def = `flowchart TD\n  S([Début]) --> A0\n${lignes.join('\n')}\n  A${acts.length-1} --> E([Fin])`
    try { const { svg } = await mermaid.render('m'+Date.now(), def); setMermaidSvg(svg) }
    catch { setMermaidSvg('') }
  }

  // ── Canvas ──
  const initCanvas = (acts) => {
    const pos = {}
    acts.forEach((a,i) => { const col=i%3, row=Math.floor(i/3); pos[a.act_id]={ x:50+col*210, y:50+row*120 } })
    setCanvasPos(pos)
  }

  // ── Navigation ──
  const voirWorkflows = (pcs) => { setSelectedPcs(pcs); setSelectedWkf(null); setActivites([]); setMermaidSvg(''); chargerWorkflows(pcs); setMobileScreen('wkf') }
  const voirActivites = (wkf) => { setSelectedWkf(wkf); chargerActivites(wkf); setMobileScreen('act') }
  const retourAccueil = () => { setSelectedPcs(null); setSelectedWkf(null); setWorkflows([]); setActivites([]); setMermaidSvg(''); setMobileScreen('pcs') }
  const retourProcessus = () => { setSelectedWkf(null); setActivites([]); setMermaidSvg(''); setMobileScreen('wkf') }

  // Bouton retour mobile
  const retourMobile = () => {
    if (mobileScreen === 'act') { setSelectedWkf(null); setActivites([]); setMermaidSvg(''); setMobileScreen('wkf') }
    else if (mobileScreen === 'wkf') { setSelectedPcs(null); setWorkflows([]); setMobileScreen('pcs') }
  }

  // ── CRUD Processus ──
  const ajouterProcessus = async () => {
    if (!nouveauPcs.trim()) return
    const res = await fetch(`${API}/processus`, { method:'POST', headers:h(true), body:JSON.stringify({ pcsnom:nouveauPcs, pcsrspgrp:'ADMIN' }) })
    if (!res.ok) return showToast('Erreur création')
    setNouveauPcs(''); setShowAddPcs(false); chargerProcessus(); showToast('Processus créé', 'success')
  }
  const supprimerProcessus = (id, nom) => setConfirm({
    type:'delete', icon:'🗑️', title:'Supprimer ce processus ?',
    message:`« ${nom} » et tous ses workflows et activités seront supprimés définitivement.`,
    onConfirm: async () => {
      await fetch(`${API}/processus/${id}`, { method:'DELETE', headers:h() })
      if (selectedPcs?.pcs_id===id) retourAccueil()
      chargerProcessus(); setConfirm(null); showToast('Processus supprimé', 'success')
    }
  })
  const modifierProcessus = async (id) => {
    if (!editValue.trim()) return
    await fetch(`${API}/processus/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ pcsnom:editValue }) })
    setEditingPcs(null); chargerProcessus(); showToast('Modifié', 'success')
  }
  const toggleStatutPcs = async (p) => {
    const nouveau = estTermine(p) ? 'ACTIF' : 'TERMINE'
    await fetch(`${API}/processus/${p.pcs_id}/statut`, { method:'PATCH', headers:h(true), body:JSON.stringify({ statut:nouveau }) })
    chargerProcessus(); showToast(nouveau==='TERMINE'?'Marqué terminé':'Réactivé', 'success')
  }

  // ── CRUD Workflows ──
  const ajouterWorkflow = async () => {
    if (!nouveauWkf.trim() || !selectedPcs) return
    await fetch(`${API}/processus/${selectedPcs.pcs_id}/workflows`, { method:'POST', headers:h(true), body:JSON.stringify({ wkfnom:nouveauWkf }) })
    setNouveauWkf(''); setShowAddWkf(false); chargerWorkflows(selectedPcs); showToast('Workflow créé', 'success')
  }
  const supprimerWorkflow = (id, nom) => setConfirm({
    type:'delete', icon:'🗑️', title:'Supprimer ce workflow ?',
    message:`« ${nom} » et ses activités liées seront supprimés définitivement.`,
    onConfirm: async () => {
      await fetch(`${API}/workflows/${id}`, { method:'DELETE', headers:h() })
      if (selectedWkf?.wkf_id===id) { setSelectedWkf(null); setActivites([]); setMermaidSvg('') }
      chargerWorkflows(selectedPcs); setConfirm(null); showToast('Workflow supprimé', 'success')
    }
  })
  const modifierWorkflow = async (id) => {
    if (!editValue.trim()) return
    await fetch(`${API}/workflows/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ wkfnom:editValue }) })
    setEditingWkf(null); chargerWorkflows(selectedPcs); showToast('Modifié', 'success')
  }
  const toggleStatutWkf = async (w) => {
    const nouveau = estTermine(w) ? 'ACTIF' : 'TERMINE'
    await fetch(`${API}/workflows/${w.wkf_id}/statut`, { method:'PATCH', headers:h(true), body:JSON.stringify({ statut:nouveau }) })
    chargerWorkflows(selectedPcs); showToast(nouveau==='TERMINE'?'Marqué terminé':'Réactivé', 'success')
  }

  // ── CRUD Activités ──
  const ajouterActivite = async () => {
    if (!nouvelleAct.trim() || !selectedWkf) return
    await fetch(`${API}/workflows/${selectedWkf.wkf_id}/activites`, { method:'POST', headers:h(true), body:JSON.stringify({ actnom:nouvelleAct }) })
    setNouvelleAct(''); chargerActivites(selectedWkf); showToast('Activité ajoutée', 'success')
  }
  const supprimerActivite = (id, nom) => setConfirm({
    type:'delete', icon:'🗑️', title:'Supprimer cette activité ?',
    message:`« ${nom} » sera supprimée définitivement.`,
    onConfirm: async () => {
      await fetch(`${API}/activites/${id}`, { method:'DELETE', headers:h() })
      chargerActivites(selectedWkf); setConfirm(null); showToast('Activité supprimée', 'success')
    }
  })
  const modifierActivite = async (id) => {
    if (!editValue.trim()) return
    await fetch(`${API}/activites/${id}`, { method:'PUT', headers:h(true), body:JSON.stringify({ actnom:editValue }) })
    setEditingAct(null); chargerActivites(selectedWkf); showToast('Modifié', 'success')
  }
  const toggleStatutAct = async (a) => {
    const nouveau = estTermine(a) ? 'ACTIF' : 'TERMINE'
    await fetch(`${API}/activites/${a.act_id}/statut`, { method:'PATCH', headers:h(true), body:JSON.stringify({ statut:nouveau }) })
    chargerActivites(selectedWkf)
  }

  // ── Drag & drop ──
  const onDragStart = (list, idx) => { dragItem.current = { list, idx }; setDragInfo({ list, idx, over:null }) }
  const onDragEnter = (list, idx) => { if (dragItem.current?.list===list) setDragInfo(d=>({ ...d, over:idx })) }
  const onDragEnd = (list, items, setItems, sauver) => {
    const di = dragItem.current
    if (di && dragInfo.over!==null && di.idx!==dragInfo.over) {
      const copy=[...items]; const [m]=copy.splice(di.idx,1); copy.splice(dragInfo.over,0,m)
      setItems(copy)
      if (list==='act') genererMermaid(copy)
      sauver(copy).then(()=>showToast('Ordre enregistré', 'success')).catch(()=>showToast('Erreur sauvegarde'))
    }
    dragItem.current=null; setDragInfo({ list:null, idx:null, over:null })
  }

  const validerOrdre = (items, setItems, idx, label, sauver) => {
    const n = parseInt(ordValue)
    if (isNaN(n)||n<1) { setEditingOrd(null); return }
    if (n>items.length) { showToast(`Maximum : ${items.length}`, 'error'); return }
    if (n===idx+1) { setEditingOrd(null); return }
    const copy=[...items]; const [m]=copy.splice(idx,1); copy.splice(n-1,0,m)
    setItems(copy)
    if (label==='act') genererMermaid(copy)
    sauver(copy).then(()=>showToast('Ordre enregistré', 'success')).catch(()=>showToast('Erreur sauvegarde'))
    setEditingOrd(null)
  }

  // ── Canvas drag (souris + tactile) ──
  const getPoint = (e) => {
    if (e.touches && e.touches[0]) return { x:e.touches[0].clientX, y:e.touches[0].clientY }
    return { x:e.clientX, y:e.clientY }
  }
  const startCanvasDrag = (e, id) => {
    const pt = getPoint(e)
    const rect = canvasRef.current.getBoundingClientRect()
    const pos = canvasPos[id] || { x:50, y:50 }
    canvasDrag.current = { id, offX:pt.x-rect.left-pos.x, offY:pt.y-rect.top-pos.y }
  }
  const moveCanvasDrag = (e) => {
    if (!canvasDrag.current) return
    const pt = getPoint(e)
    const rect = canvasRef.current.getBoundingClientRect()
    const { id, offX, offY } = canvasDrag.current
    const x = Math.max(0, Math.min(pt.x-rect.left-offX, rect.width-150))
    const y = Math.max(0, Math.min(pt.y-rect.top-offY, rect.height-70))
    setCanvasPos(p=>({ ...p, [id]:{ x, y } }))
  }
  const endCanvasDrag = () => { canvasDrag.current = null }

  const onScrollMobile = (e) => {
    const y = e.target.scrollTop
    if (y > lastScrollY.current && y > 40) setNavVisible(false)
    else setNavVisible(true)
    lastScrollY.current = y
  }

  const initiales = (n) => n ? n.slice(0,2).toUpperCase() : '?'

  const filtrer = (items, champNom) => {
    const q = search.toLowerCase()
    return items.filter(x => !q || (x[champNom]||'').toLowerCase().includes(q))
  }
  const pcsActifs   = filtrer(processus, 'pcsnom').filter(p => !estTermine(p))
  const pcsTermines = filtrer(processus, 'pcsnom').filter(p => estTermine(p))
  const wkfActifs   = workflows.filter(w => !estTermine(w))
  const wkfTermines = workflows.filter(w => estTermine(w))
  const actTerminees = activites.filter(estTermine).length
  const progression = activites.length ? Math.round(actTerminees/activites.length*100) : 0

  // ── AUTH SCREEN ──
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

  // ── Rendu processus ──
  const renderPcs = (p, idx, isDone) => (
    <div key={p.pcs_id} className="fade-item" draggable={!isMobile && editingPcs!==p.pcs_id && !isDone}
      onDragStart={()=>!isDone&&onDragStart('pcs',idx)}
      onDragEnter={()=>!isDone&&onDragEnter('pcs',idx)}
      onDragOver={e=>e.preventDefault()}
      onDragEnd={()=>!isDone&&onDragEnd('pcs',pcsActifs,setProcessus,sauverOrdrePcs)}>
      {editingPcs===p.pcs_id ? (
        <div style={{display:'flex',gap:4,marginBottom:3}}>
          <input style={{...S.input,flex:1}} value={editValue} autoFocus
            onChange={e=>setEditValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&modifierProcessus(p.pcs_id)} />
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>modifierProcessus(p.pcs_id)}>✓</button>
          <button style={S.btn} onClick={()=>setEditingPcs(null)}>✕</button>
        </div>
      ) : (
        <div style={{...S.pcsItem, ...(selectedPcs?.pcs_id===p.pcs_id&&!isMobile?S.pcsActive:{}), ...(isDone?S.itemDone:{}),
          ...(dragInfo.list==='pcs'&&dragInfo.idx===idx?{opacity:.4}:{}),
          ...(dragInfo.list==='pcs'&&dragInfo.over===idx?{borderColor:C.indigo,background:'#f5f3ff'}:{})}}
          onClick={()=>voirWorkflows(p)}>
          {!isDone && !isMobile && <span style={S.dragHandle}>⋮⋮</span>}
          {!isDone && (editingOrd===`pcs-${idx}` ? (
            <input style={S.ordInput} value={ordValue} autoFocus type="number"
              onChange={e=>setOrdValue(e.target.value)} onClick={e=>e.stopPropagation()}
              onKeyDown={e=>{if(e.key==='Enter'){e.stopPropagation();validerOrdre(pcsActifs,setProcessus,idx,'pcs',sauverOrdrePcs)}}}
              onBlur={()=>setEditingOrd(null)} />
          ) : (
            <span style={{...S.ordBadge,...(selectedPcs?.pcs_id===p.pcs_id&&!isMobile?S.ordBadgeActive:{})}}
              onClick={e=>{e.stopPropagation();setEditingOrd(`pcs-${idx}`);setOrdValue(String(idx+1))}}>{idx+1}</span>
          ))}
          <span style={{...S.itemName,...(isDone?S.nameDone:{})}}>{p.pcsnom}</span>
          <div style={S.miniBtns}>
            <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDone}} title={isDone?'Réactiver':'Marquer terminé'}
              onClick={e=>{e.stopPropagation();toggleStatutPcs(p)}}>{isDone?'↺':'✓'}</button>
            <button className="mini-hover" style={S.miniBtn} title="Modifier"
              onClick={e=>{e.stopPropagation();setEditingPcs(p.pcs_id);setEditValue(p.pcsnom)}}>✏️</button>
            <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDanger}} title="Supprimer"
              onClick={e=>{e.stopPropagation();supprimerProcessus(p.pcs_id,p.pcsnom)}}>✕</button>
            {isMobile && <span style={S.chevron}>›</span>}
          </div>
        </div>
      )}
    </div>
  )

  // ── Rendu workflow ──
  const renderWkf = (w, idx, isDone) => (
    <div key={w.wkf_id} className="fade-item" draggable={!isMobile && editingWkf!==w.wkf_id && !isDone}
      onDragStart={()=>!isDone&&onDragStart('wkf',idx)}
      onDragEnter={()=>!isDone&&onDragEnter('wkf',idx)}
      onDragOver={e=>e.preventDefault()}
      onDragEnd={()=>!isDone&&onDragEnd('wkf',wkfActifs,setWorkflows,sauverOrdreWkf)}>
      {editingWkf===w.wkf_id ? (
        <div style={{display:'flex',gap:4,marginBottom:8}}>
          <input style={{...S.input,flex:1}} value={editValue} autoFocus
            onChange={e=>setEditValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&modifierWorkflow(w.wkf_id)} />
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>modifierWorkflow(w.wkf_id)}>✓</button>
          <button style={S.btn} onClick={()=>setEditingWkf(null)}>✕</button>
        </div>
      ) : (
        <div className="hover-lift" style={{...S.wkfCard, ...(selectedWkf?.wkf_id===w.wkf_id&&!isMobile?S.wkfCardActive:{}), ...(isDone?S.itemDone:{}),
          ...(dragInfo.list==='wkf'&&dragInfo.over===idx?{borderColor:C.indigo}:{})}}
          onClick={()=>voirActivites(w)}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {!isDone && !isMobile && <span style={S.dragHandle}>⋮⋮</span>}
            {!isDone && (editingOrd===`wkf-${idx}` ? (
              <input style={S.ordInput} value={ordValue} autoFocus type="number"
                onChange={e=>setOrdValue(e.target.value)} onClick={e=>e.stopPropagation()}
                onKeyDown={e=>{if(e.key==='Enter'){e.stopPropagation();validerOrdre(wkfActifs,setWorkflows,idx,'wkf',sauverOrdreWkf)}}}
                onBlur={()=>setEditingOrd(null)} />
            ) : (
              <span style={S.ordBadge} onClick={e=>{e.stopPropagation();setEditingOrd(`wkf-${idx}`);setOrdValue(String(idx+1))}}>{idx+1}</span>
            ))}
            <span style={{...S.wkfName,...(isDone?S.nameDone:{})}}>{w.wkfnom}</span>
            <div style={S.miniBtns}>
              <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDone}} title={isDone?'Réactiver':'Marquer terminé'}
                onClick={e=>{e.stopPropagation();toggleStatutWkf(w)}}>{isDone?'↺':'✓'}</button>
              <button className="mini-hover" style={S.miniBtn} onClick={e=>{e.stopPropagation();setEditingWkf(w.wkf_id);setEditValue(w.wkfnom)}}>✏️</button>
              <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDanger}} onClick={e=>{e.stopPropagation();supprimerWorkflow(w.wkf_id,w.wkfnom)}}>✕</button>
              {isMobile && <span style={S.chevron}>›</span>}
            </div>
          </div>
          <div style={{marginTop:7,paddingLeft:isDone||isMobile?0:22}}>
            <span style={{...S.badge,...(isDone?S.badgeDone:S.badgeActif)}}>{isDone?'✓ terminé':'actif'}</span>
          </div>
        </div>
      )}
    </div>
  )

  // ── Colonne Processus ──
  const colProcessus = (
    <div style={{...S.col, ...(isMobile?S.colMobile:{width:250, borderRight:`1px solid ${C.slate200}`})}}>
      <div style={S.colHdr}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span style={S.colTitle}>Processus</span>
          <span style={S.colCount}>{pcsActifs.length}</span>
        </div>
        <button style={S.addBtn} onClick={()=>setShowAddPcs(!showAddPcs)}>+</button>
      </div>
      {processus.length > 4 && (
        <div style={S.searchBox}>
          <span style={S.searchIcon}>🔍</span>
          <input style={S.searchInput} placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      )}
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
      <div style={S.scroll} onScroll={isMobile ? onScrollMobile : undefined}>
        {pcsActifs.length===0 && pcsTermines.length===0 && <div style={S.empty}><div style={S.emptyIcon}>📂</div>Aucun processus</div>}
        {pcsActifs.map((p,idx) => renderPcs(p, idx, false))}
        {pcsTermines.length > 0 && (
          <>
            <div style={S.sectionLabel} onClick={()=>setShowDonePcs(!showDonePcs)}>
              <span>{showDonePcs?'▼':'▶'}</span> Terminés ({pcsTermines.length})
            </div>
            {showDonePcs && pcsTermines.map((p,idx) => renderPcs(p, idx, true))}
          </>
        )}
      </div>
    </div>
  )

  // ── Colonne Workflows ──
  const colWorkflows = (
    <div style={{...S.col, ...(isMobile?S.colMobile:{width:265, borderRight:`1px solid ${C.slate200}`, background:C.slate50}), ...(isMobile?{}:{background:C.slate50})}}>
      <div style={S.colHdr}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span style={S.colTitle}>Workflows</span>
          <span style={S.colCount}>{wkfActifs.length}</span>
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
      <div style={S.scroll} onScroll={isMobile ? onScrollMobile : undefined}>
        {wkfActifs.length===0 && wkfTermines.length===0 && <div style={S.empty}><div style={S.emptyIcon}>🔀</div>Aucun workflow</div>}
        {wkfActifs.map((w,idx) => renderWkf(w, idx, false))}
        {wkfTermines.length > 0 && (
          <>
            <div style={S.sectionLabel} onClick={()=>setShowDoneWkf(!showDoneWkf)}>
              <span>{showDoneWkf?'▼':'▶'}</span> Terminés ({wkfTermines.length})
            </div>
            {showDoneWkf && wkfTermines.map((w,idx) => renderWkf(w, idx, true))}
          </>
        )}
      </div>
    </div>
  )

  // ── Zone Activités ──
  const zoneActivites = (
    <div style={S.actZone}>
      <div style={S.actTop}>
        <div style={{minWidth:0}}>
          <div style={S.actTitle}>
            {selectedWkf.wkfnom}
            {estTermine(selectedWkf) && <span style={{...S.badge,...S.badgeDone}}>✓ terminé</span>}
          </div>
          <div style={S.actSub}>{activites.length} activité{activites.length!==1?'s':''}{!isMobile && ' · glissez pour réorganiser'}</div>
          {activites.length>0 && (
            <div style={S.progressWrap}>
              <div style={S.progressBar}><div style={{...S.progressFill, width:`${progression}%`}} /></div>
              <span style={S.progressText}>{actTerminees}/{activites.length} terminées</span>
            </div>
          )}
        </div>
        <div style={S.viewToggle}>
          <button style={{...S.toggleBtn,...(actView==='list'?S.toggleActive:{})}} onClick={()=>setActView('list')}>☰{!isMobile && ' Liste'}</button>
          <button style={{...S.toggleBtn,...(actView==='canvas'?S.toggleActive:{})}} onClick={()=>setActView('canvas')}>⬚{!isMobile && ' Canvas'}</button>
        </div>
      </div>

      <div style={S.actBody} onScroll={isMobile ? onScrollMobile : undefined}>
        {actView==='list' ? (
          <>
            <div style={S.listCard}>
              {activites.length===0 && <div style={S.empty}><div style={S.emptyIcon}>✅</div><div style={S.emptyTitle}>Aucune activité</div>Ajoutez-en une ci-dessous</div>}
              {activites.map((a,idx) => {
                const done = estTermine(a)
                return (
                  <div key={a.act_id} className="fade-item" draggable={!isMobile && editingAct!==a.act_id}
                    onDragStart={()=>onDragStart('act',idx)} onDragEnter={()=>onDragEnter('act',idx)}
                    onDragOver={e=>e.preventDefault()} onDragEnd={()=>onDragEnd('act',activites,setActivites,sauverOrdreAct)}
                    style={{...S.actRow,
                      ...(done?{opacity:.6,background:'#f0fdf4',borderColor:C.greenBorder}:{}),
                      ...(dragInfo.list==='act'&&dragInfo.idx===idx?S.actRowDrag:{}),
                      ...(dragInfo.list==='act'&&dragInfo.over===idx?S.actRowOver:{})}}>
                    {!isMobile && <span style={S.dragHandle}>⋮⋮</span>}
                    {editingOrd===`act-${idx}` ? (
                      <input style={{...S.ordInput,width:40,height:28}} value={ordValue} autoFocus type="number"
                        onChange={e=>setOrdValue(e.target.value)}
                        onKeyDown={e=>e.key==='Enter'&&validerOrdre(activites,setActivites,idx,'act',sauverOrdreAct)}
                        onBlur={()=>setEditingOrd(null)} />
                    ) : (
                      <span style={{...S.actNum,...(done?S.actNumDone:{})}}
                        onClick={()=>{setEditingOrd(`act-${idx}`);setOrdValue(String(idx+1))}}>{done?'✓':idx+1}</span>
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
                        <span style={{...S.actName,...(done?S.nameDone:{})}}>{a.actnom}</span>
                        <div style={S.miniBtns}>
                          <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDone}} title={done?'Réactiver':'Marquer terminée'}
                            onClick={()=>toggleStatutAct(a)}>{done?'↺':'✓'}</button>
                          <button className="mini-hover" style={S.miniBtn} onClick={()=>{setEditingAct(a.act_id);setEditValue(a.actnom)}}>✏️</button>
                          <button className="mini-hover" style={{...S.miniBtn,...S.miniBtnDanger}} onClick={()=>supprimerActivite(a.act_id,a.actnom)}>✕</button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
              <div style={{display:'flex',gap:8,marginTop:12,paddingTop:12,borderTop:`1px solid ${C.slate100}`}}>
                <input style={{...S.input,flex:1}} placeholder="Nouvelle activité…" value={nouvelleAct}
                  onChange={e=>setNouvelleAct(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ajouterActivite()} />
                <button style={{...S.btn,...S.btnPrimary}} onClick={ajouterActivite}>+{!isMobile && ' Ajouter'}</button>
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
            onMouseMove={moveCanvasDrag} onMouseUp={endCanvasDrag} onMouseLeave={endCanvasDrag}
            onTouchMove={moveCanvasDrag} onTouchEnd={endCanvasDrag}>
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1,pointerEvents:'none'}}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L8,3 L0,6 Z" fill={C.slate300} />
                </marker>
              </defs>
              {activites.slice(0,-1).map((a,i) => {
                const p1 = canvasPos[a.act_id], p2 = canvasPos[activites[i+1].act_id]
                if (!p1||!p2) return null
                const x1=p1.x+75, y1=p1.y+30, x2=p2.x+75, y2=p2.y+30
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.slate300} strokeWidth="2" markerEnd="url(#arrow)" />
              })}
            </svg>
            {activites.length===0 && <div style={{...S.empty,paddingTop:200}}><div style={S.emptyIcon}>⬚</div><div style={S.emptyTitle}>Canvas vide</div>Ajoutez des activités en vue Liste</div>}
            {activites.map((a,idx) => {
              const pos = canvasPos[a.act_id] || { x:50, y:50 }
              const done = estTermine(a)
              return (
                <div key={a.act_id} style={{...S.canvasNode,...(done?S.canvasNodeDone:{}), left:pos.x, top:pos.y}}
                  onMouseDown={e=>startCanvasDrag(e,a.act_id)} onTouchStart={e=>startCanvasDrag(e,a.act_id)}
                  onDoubleClick={()=>toggleStatutAct(a)}>
                  <div style={{...S.canvasNodeNum,...(done?S.canvasNodeNumDone:{})}}>{done?'✓':idx+1}</div>
                  <div style={{...S.canvasNodeName,...(done?S.nameDone:{})}}>{a.actnom}</div>
                </div>
              )
            })}
            {activites.length>0 && <div style={S.canvasHint}>✋ Glissez{!isMobile && ' · double-clic = terminer'}</div>}
          </div>
        )}
      </div>
    </div>
  )

  const placeholderWkf = (
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:C.slate400}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:12,opacity:.3}}>🔀</div>
        <div style={S.emptyTitle}>Sélectionnez un workflow</div>
        <div style={{fontSize:13}}>pour voir et organiser ses activités</div>
      </div>
    </div>
  )
  const placeholderAccueil = (
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:C.slate400}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:14,opacity:.25}}>⬡</div>
        <div style={{...S.emptyTitle,fontSize:16}}>Bienvenue sur PCS</div>
        <div style={{fontSize:13}}>Sélectionnez un processus pour commencer</div>
      </div>
    </div>
  )

  // ════════════════ RENDU MOBILE ════════════════
  if (isMobile) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{...S.app,...S.appMobile}}>
          {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>
            <span>{toast.type==='success'?'✓':'⚠'}</span>{toast.msg}
          </div>}

          {confirm && (
            <div style={S.overlay} onClick={()=>setConfirm(null)}>
              <div style={S.modal} onClick={e=>e.stopPropagation()}>
                <div style={{...S.modalIcon, background:confirm.type==='delete'?C.redLight:C.indigoLight}}>{confirm.icon}</div>
                <div style={S.modalTitle}>{confirm.title}</div>
                <div style={S.modalText}>{confirm.message}</div>
                <div style={S.modalBtns}>
                  <button style={{...S.modalBtn,...S.modalCancel}} onClick={()=>setConfirm(null)}>Annuler</button>
                  <button style={{...S.modalBtn,...(confirm.type==='delete'?S.modalConfirm:S.modalConfirmIndigo)}}
                    onClick={confirm.onConfirm}>{confirm.type==='delete'?'Supprimer':'Confirmer'}</button>
                </div>
              </div>
            </div>
          )}

          {/* Topbar mobile */}
          <div style={S.topbar}>
            {mobileScreen !== 'pcs' && <button style={S.backBtn} onClick={retourMobile}>‹</button>}
            <div style={S.breadcrumb}>
              {mobileScreen==='pcs' && <span style={{fontWeight:700,color:C.slate,fontSize:16}}>⬡ PCS</span>}
              {mobileScreen==='wkf' && selectedPcs && <span style={S.breadChip}>{selectedPcs.pcsnom}</span>}
              {mobileScreen==='act' && selectedWkf && <span style={S.breadChip}>{selectedWkf.wkfnom}</span>}
            </div>
            <div style={{...S.avatar,width:30,height:30,fontSize:11}}>{initiales(username)}</div>
          </div>

          {/* Écran actif */}
          <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {mobileScreen==='pcs' && colProcessus}
            {mobileScreen==='wkf' && colWorkflows}
            {mobileScreen==='act' && (selectedWkf ? zoneActivites : placeholderWkf)}
          </div>

          {/* Nav bas mobile */}
          <div style={{...S.mobileNav, ...(navVisible ? {} : S.mobileNavHidden)}}>
            <button style={{...S.mobileNavBtn,...(mobileScreen==='pcs'?S.mobileNavBtnActive:{})}} onClick={retourAccueil}>
              <span style={S.mobileNavIcon}>📋</span>Processus
            </button>
            <button style={{...S.mobileNavBtn,...(mobileScreen==='wkf'?S.mobileNavBtnActive:{}),...(!selectedPcs?{opacity:.4}:{})}}
              onClick={()=>selectedPcs&&setMobileScreen('wkf')}>
              <span style={S.mobileNavIcon}>🔀</span>Workflows
            </button>
            <button style={{...S.mobileNavBtn,...(mobileScreen==='act'?S.mobileNavBtnActive:{}),...(!selectedWkf?{opacity:.4}:{})}}
              onClick={()=>selectedWkf&&setMobileScreen('act')}>
              <span style={S.mobileNavIcon}>✅</span>Activités
            </button>
            <button style={S.mobileNavBtn} onClick={seDeconnecter}>
              <span style={S.mobileNavIcon}>🚪</span>Quitter
            </button>
          </div>
        </div>
      </>
    )
  }

  // ════════════════ RENDU DESKTOP ════════════════
  return (
    <>
      <style>{CSS}</style>
      <div style={S.app}>
        {toast && <div style={{...S.toast,...(toast.type==='success'?S.toastSuccess:S.toastError)}}>
          <span>{toast.type==='success'?'✓':'⚠'}</span>{toast.msg}
        </div>}

        {confirm && (
          <div style={S.overlay} onClick={()=>setConfirm(null)}>
            <div style={S.modal} onClick={e=>e.stopPropagation()}>
              <div style={{...S.modalIcon, background:confirm.type==='delete'?C.redLight:C.indigoLight}}>{confirm.icon}</div>
              <div style={S.modalTitle}>{confirm.title}</div>
              <div style={S.modalText}>{confirm.message}</div>
              <div style={S.modalBtns}>
                <button style={{...S.modalBtn,...S.modalCancel}} onClick={()=>setConfirm(null)}>Annuler</button>
                <button style={{...S.modalBtn,...(confirm.type==='delete'?S.modalConfirm:S.modalConfirmIndigo)}}
                  onClick={confirm.onConfirm}>{confirm.type==='delete'?'Supprimer':'Confirmer'}</button>
              </div>
            </div>
          </div>
        )}

        <div style={S.sidebar}>
          <div style={S.sbLogo} onClick={retourAccueil}>⬡</div>
          <div style={{...S.sbIcon,...S.sbIconActive}} title="Processus" onClick={retourAccueil}>📋</div>
          <div style={S.sbSpacer} />
          <div style={S.sbIcon} title="Déconnexion" onClick={seDeconnecter}>🚪</div>
        </div>

        <div style={S.main}>
          <div style={S.topbar}>
            <div style={S.breadcrumb}>
              <span className="bread-link" style={S.breadLink} onClick={retourAccueil}>PCS</span>
              {selectedPcs && <><span>›</span><span style={S.breadChip} onClick={retourProcessus}>{selectedPcs.pcsnom}</span></>}
              {selectedWkf && <><span>›</span><span style={S.breadChip}>{selectedWkf.wkfnom}</span></>}
            </div>
            <div style={S.userPill}><div style={S.avatar}>{initiales(username)}</div>{username}</div>
          </div>

          <div style={S.panels}>
            {colProcessus}
            {selectedPcs && colWorkflows}
            {selectedWkf ? zoneActivites : selectedPcs ? placeholderWkf : placeholderAccueil}
          </div>
        </div>
      </div>
    </>
  )
}