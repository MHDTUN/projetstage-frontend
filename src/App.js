import { useState, useEffect, useCallback } from 'react'
 
const C = {
  primary: '#4f46e5',
  primaryLight: '#ede9fe',
  primaryDark: '#3730a3',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  success: '#10b981',
  bg: '#f1f5f9',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  textMuted: '#64748b',
  white: '#ffffff',
}
 
const s = {
  page: { fontFamily: "'Inter', Arial, sans-serif", minHeight: '100vh', background: C.bg, color: C.text },
 
  // Header
  header: {
    background: C.primary, color: C.white,
    padding: '0 32px', height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 2px 8px #0002',
  },
  headerTitle: { fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  headerUser: { fontSize: 14, opacity: 0.85 },
  btnLogout: {
    background: 'rgba(255,255,255,0.15)', color: C.white,
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8,
    padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  },
 
  // Layout
  body: { display: 'flex', gap: 20, padding: 28, alignItems: 'flex-start' },
  col: {
    background: C.surface, borderRadius: 14, padding: 20,
    minWidth: 260, maxWidth: 320, flex: 1,
    boxShadow: '0 1px 4px #0001',
    border: `1px solid ${C.border}`,
  },
  colHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${C.primaryLight}`,
  },
  colTitle: { fontWeight: 700, fontSize: 15, color: C.primary },
  colCount: {
    background: C.primaryLight, color: C.primary,
    borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 700,
  },
 
  // Formulaire ajout
  addBox: { marginBottom: 14 },
  input: {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1px solid ${C.border}`, fontSize: 14,
    boxSizing: 'border-box', outline: 'none',
    transition: 'border 0.2s',
  },
  btnAdd: {
    width: '100%', marginTop: 6, padding: '9px 0',
    background: C.primary, color: C.white,
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontSize: 14, fontWeight: 600,
  },
 
  // Items
  item: {
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 6,
  },
  itemLabel: {
    flex: 1, padding: '9px 12px', borderRadius: 8,
    cursor: 'pointer', fontSize: 14, userSelect: 'none',
    transition: 'background 0.15s',
  },
  itemActions: { display: 'flex', gap: 4 },
  btnEdit: {
    background: '#f1f5f9', color: C.textMuted,
    border: `1px solid ${C.border}`, borderRadius: 6,
    padding: '5px 9px', cursor: 'pointer', fontSize: 13,
  },
  btnDel: {
    background: C.dangerLight, color: C.danger,
    border: 'none', borderRadius: 6,
    padding: '5px 9px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
  },
  editInput: {
    flex: 1, padding: '7px 10px', borderRadius: 8,
    border: `1px solid ${C.primary}`, fontSize: 14,
    outline: 'none',
  },
  btnSave: {
    background: C.success, color: C.white,
    border: 'none', borderRadius: 6,
    padding: '5px 10px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
  },
 
  // Empty state
  empty: { color: C.textMuted, fontSize: 13, textAlign: 'center', padding: '16px 0', fontStyle: 'italic' },
 
  // Toast / erreur
  toast: {
    position: 'fixed', bottom: 24, right: 24,
    background: C.danger, color: C.white,
    padding: '12px 20px', borderRadius: 10,
    fontSize: 14, fontWeight: 600,
    boxShadow: '0 4px 16px #0002', zIndex: 1000,
  },
  toastSuccess: { background: C.success },
 
  // Login / inscription
  authPage: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: C.bg,
  },
  card: {
    background: C.surface, padding: 40, borderRadius: 16,
    boxShadow: '0 4px 24px #0002', minWidth: 340,
    border: `1px solid ${C.border}`,
  },
  cardTitle: { textAlign: 'center', color: C.primary, marginBottom: 6, fontSize: 22, fontWeight: 700 },
  cardSub: { textAlign: 'center', color: C.textMuted, fontSize: 13, marginBottom: 24 },
  authInput: {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: `1px solid ${C.border}`, fontSize: 14,
    boxSizing: 'border-box', marginBottom: 12, outline: 'none',
  },
  btnPrimary: {
    width: '100%', padding: 13,
    background: C.primary, color: C.white,
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontSize: 15, fontWeight: 700, marginTop: 4,
  },
  switchLink: {
    textAlign: 'center', marginTop: 18, fontSize: 13, color: C.textMuted,
  },
  switchBtn: {
    background: 'none', border: 'none', color: C.primary,
    cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0,
  },
}
 
const API = 'http://localhost:3000'
 
export default function App() {
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
 
  const [processus, setProcessus] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [activites, setActivites] = useState([])
  const [selectedPcs, setSelectedPcs] = useState(null)
  const [selectedWkf, setSelectedWkf] = useState(null)
 
  const [nouveauPcs, setNouveauPcs] = useState('')
  const [nouveauWkf, setNouveauWkf] = useState('')
  const [nouvelleAct, setNouvelleAct] = useState('')
 
  const [editingPcs, setEditingPcs] = useState(null)
  const [editingWkf, setEditingWkf] = useState(null)
  const [editingAct, setEditingAct] = useState(null)
  const [editValue, setEditValue] = useState('')
 
  const [toast, setToast] = useState(null)
 
  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
 
  const headers = (json = false) => {
    const h = { authorization: `Bearer ${token}` }
    if (json) h['Content-Type'] = 'application/json'
    return h
  }
 
  // Auth
  const seConnecter = async () => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur de connexion')
    setToken(data.token)
    setUsername(authForm.username)
  }
 
  const sInscrire = async () => {
    if (!authForm.username || !authForm.password) return showToast('Remplissez tous les champs')
    const res = await fetch(`${API}/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    })
    const data = await res.json()
    if (!res.ok) return showToast(data.message || 'Erreur')
    showToast('Compte créé ! Connectez-vous.', 'success')
    setAuthMode('login')
  }
 
  const seDeconnecter = () => {
    setToken('')
    setUsername('')
    setProcessus([])
    setWorkflows([])
    setActivites([])
    setSelectedPcs(null)
    setSelectedWkf(null)
  }
 
// Chargement
  const chargerProcessus = useCallback(() =>
    fetch(`${API}/processus`, { headers: headers() }).then(r => r.json()).then(setProcessus)
  , [token])

  const chargerWorkflows = useCallback((pcs) =>
    fetch(`${API}/processus/${pcs.pcs_id}/workflows`, { headers: headers() }).then(r => r.json()).then(setWorkflows)
  , [token])

  const chargerActivites = useCallback((wkf) =>
    fetch(`${API}/workflows/${wkf.wkf_id}/activites`, { headers: headers() }).then(r => r.json()).then(setActivites)
  , [token])

  useEffect(() => { if (token) chargerProcessus() }, [token, chargerProcessus])
 
  // Navigation
  const voirWorkflows = (pcs) => {
    setSelectedPcs(pcs); setSelectedWkf(null); setActivites([])
    chargerWorkflows(pcs)
  }
  const voirActivites = (wkf) => { setSelectedWkf(wkf); chargerActivites(wkf) }
 
  // CRUD processus
  const ajouterProcessus = async () => {
    if (!nouveauPcs.trim()) return
    const res = await fetch(`${API}/processus`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify({ pcsnom: nouveauPcs, pcsrspgrp: 'ADMIN' }),
    })
    if (!res.ok) return showToast('Erreur lors de la création')
    setNouveauPcs(''); chargerProcessus()
  }
  const supprimerProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, { method: 'DELETE', headers: headers() })
    if (selectedPcs?.pcs_id === id) { setSelectedPcs(null); setWorkflows([]); setActivites([]) }
    chargerProcessus()
  }
  const modifierProcessus = async (id) => {
    await fetch(`${API}/processus/${id}`, {
      method: 'PUT', headers: headers(true),
      body: JSON.stringify({ pcsnom: editValue }),
    })
    setEditingPcs(null); chargerProcessus()
  }
 
  // CRUD workflows
  const ajouterWorkflow = async () => {
    if (!nouveauWkf.trim() || !selectedPcs) return
    await fetch(`${API}/processus/${selectedPcs.pcs_id}/workflows`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify({ wkfnom: nouveauWkf }),
    })
    setNouveauWkf(''); chargerWorkflows(selectedPcs)
  }
  const supprimerWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, { method: 'DELETE', headers: headers() })
    if (selectedWkf?.wkf_id === id) { setSelectedWkf(null); setActivites([]) }
    chargerWorkflows(selectedPcs)
  }
  const modifierWorkflow = async (id) => {
    await fetch(`${API}/workflows/${id}`, {
      method: 'PUT', headers: headers(true),
      body: JSON.stringify({ wkfnom: editValue }),
    })
    setEditingWkf(null); chargerWorkflows(selectedPcs)
  }
 
  // CRUD activités
  const ajouterActivite = async () => {
    if (!nouvelleAct.trim() || !selectedWkf) return
    await fetch(`${API}/workflows/${selectedWkf.wkf_id}/activites`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify({ actnom: nouvelleAct }),
    })
    setNouvelleAct(''); chargerActivites(selectedWkf)
  }
  const supprimerActivite = async (id) => {
    await fetch(`${API}/activites/${id}`, { method: 'DELETE', headers: headers() })
    chargerActivites(selectedWkf)
  }
  const modifierActivite = async (id) => {
    await fetch(`${API}/activites/${id}`, {
      method: 'PUT', headers: headers(true),
      body: JSON.stringify({ actnom: editValue }),
    })
    setEditingAct(null); chargerActivites(selectedWkf)
  }
 
  // === AUTH SCREEN ===
  if (!token) return (
    <div style={s.authPage}>
      {toast && <div style={{ ...s.toast, ...(toast.type === 'success' ? s.toastSuccess : {}) }}>{toast.msg}</div>}
      <div style={s.card}>
        <div style={s.cardTitle}>Suivi de Projet</div>
        <div style={s.cardSub}>{authMode === 'login' ? 'Connectez-vous pour continuer' : 'Créer un nouveau compte'}</div>
        <input style={s.authInput} placeholder="Nom d'utilisateur"
          value={authForm.username}
          onChange={e => setAuthForm({ ...authForm, username: e.target.value })} />
        <input style={s.authInput} placeholder="Mot de passe" type="password"
          value={authForm.password}
          onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && (authMode === 'login' ? seConnecter() : sInscrire())} />
        <button style={s.btnPrimary} onClick={authMode === 'login' ? seConnecter : sInscrire}>
          {authMode === 'login' ? 'Se connecter' : "Créer le compte"}
        </button>
        <div style={s.switchLink}>
          {authMode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button style={s.switchBtn} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  )
 
  // === APP SCREEN ===
  const renderItem = (label, key, isSelected, onClick, onEdit, onDelete, editing, onSaveEdit) => (
    <div key={key} style={s.item}>
      {editing ? (
        <>
          <input style={s.editInput} value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSaveEdit()}
            autoFocus />
          <button style={s.btnSave} onClick={onSaveEdit}>✓</button>
          <button style={s.btnEdit} onClick={() => { setEditingPcs(null); setEditingWkf(null); setEditingAct(null) }}>✕</button>
        </>
      ) : (
        <>
          <div onClick={onClick}
            style={{ ...s.itemLabel, background: isSelected ? C.primaryLight : '#f8fafc',
              color: isSelected ? C.primary : C.text, fontWeight: isSelected ? 600 : 400 }}>
            {label}
          </div>
          <div style={s.itemActions}>
            <button style={s.btnEdit} title="Modifier" onClick={onEdit}>✏️</button>
            <button style={s.btnDel} title="Supprimer" onClick={onDelete}>✕</button>
          </div>
        </>
      )}
    </div>
  )
 
  return (
    <div style={s.page}>
      {toast && <div style={{ ...s.toast, ...(toast.type === 'success' ? s.toastSuccess : {}) }}>{toast.msg}</div>}
 
      <div style={s.header}>
        <div style={s.headerTitle}>📋 Suivi de Projet</div>
        <div style={s.headerRight}>
          <span style={s.headerUser}>👤 {username}</span>
          <button style={s.btnLogout} onClick={seDeconnecter}>Déconnexion</button>
        </div>
      </div>
 
      <div style={s.body}>
 
        {/* PROCESSUS */}
        <div style={s.col}>
          <div style={s.colHeader}>
            <span style={s.colTitle}>Processus</span>
            <span style={s.colCount}>{processus.length}</span>
          </div>
          <div style={s.addBox}>
            <input style={s.input} placeholder="Nom du processus..." value={nouveauPcs}
              onChange={e => setNouveauPcs(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ajouterProcessus()} />
            <button style={s.btnAdd} onClick={ajouterProcessus}>+ Ajouter</button>
          </div>
          {processus.length === 0 && <div style={s.empty}>Aucun processus</div>}
          {processus.map(p => renderItem(
            p.pcsnom, p.pcs_id,
            selectedPcs?.pcs_id === p.pcs_id,
            () => voirWorkflows(p),
            () => { setEditingPcs(p.pcs_id); setEditValue(p.pcsnom) },
            () => supprimerProcessus(p.pcs_id),
            editingPcs === p.pcs_id,
            () => modifierProcessus(p.pcs_id),
          ))}
        </div>
 
        {/* WORKFLOWS */}
        {selectedPcs && (
          <div style={s.col}>
            <div style={s.colHeader}>
              <span style={s.colTitle}>Workflows</span>
              <span style={s.colCount}>{workflows.length}</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>↳ {selectedPcs.pcsnom}</div>
            <div style={s.addBox}>
              <input style={s.input} placeholder="Nom du workflow..." value={nouveauWkf}
                onChange={e => setNouveauWkf(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ajouterWorkflow()} />
              <button style={s.btnAdd} onClick={ajouterWorkflow}>+ Ajouter</button>
            </div>
            {workflows.length === 0 && <div style={s.empty}>Aucun workflow pour ce processus</div>}
            {workflows.map(w => renderItem(
              w.wkfnom, w.wkf_id,
              selectedWkf?.wkf_id === w.wkf_id,
              () => voirActivites(w),
              () => { setEditingWkf(w.wkf_id); setEditValue(w.wkfnom) },
              () => supprimerWorkflow(w.wkf_id),
              editingWkf === w.wkf_id,
              () => modifierWorkflow(w.wkf_id),
            ))}
          </div>
        )}
 
        {/* ACTIVITÉS */}
        {selectedWkf && (
          <div style={s.col}>
            <div style={s.colHeader}>
              <span style={s.colTitle}>Activités</span>
              <span style={s.colCount}>{activites.length}</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>↳ {selectedWkf.wkfnom}</div>
            <div style={s.addBox}>
              <input style={s.input} placeholder="Nom de l'activité..." value={nouvelleAct}
                onChange={e => setNouvelleAct(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ajouterActivite()} />
              <button style={s.btnAdd} onClick={ajouterActivite}>+ Ajouter</button>
            </div>
            {activites.length === 0 && <div style={s.empty}>Aucune activité pour ce workflow</div>}
            {activites.map(a => renderItem(
              a.actnom, a.act_id,
              false,
              () => {},
              () => { setEditingAct(a.act_id); setEditValue(a.actnom) },
              () => supprimerActivite(a.act_id),
              editingAct === a.act_id,
              () => modifierActivite(a.act_id),
            ))}
          </div>
        )}
 
      </div>
    </div>
  )
}