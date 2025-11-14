import React, { useEffect, useMemo, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { Menu, Map, Home, CircleUser, LogIn, LogOut, PlusCircle, BarChart3, Info, HelpCircle, Shield, Mail } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Simple auth store using localStorage JWT
function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role') || 'user')
  const login = (t, r='user') => { localStorage.setItem('token', t); localStorage.setItem('role', r); setToken(t); setRole(r) }
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('role'); setToken(null); setRole('user') }
  return { token, role, login, logout }
}

function Navbar({ auth }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={()=>setOpen(!open)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><Menu className="w-5 h-5"/></button>
        <Link to="/" className="font-extrabold text-xl">E-Waste Mapper</Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/about" className="hover:text-green-600">About</Link>
          <Link to="/how-it-works" className="hover:text-green-600">How it works</Link>
          <Link to="/map" className="hover:text-green-600">Map</Link>
          <Link to="/report" className="hover:text-green-600">Report</Link>
          <Link to="/contact" className="hover:text-green-600">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          {auth.token ? (
            <>
              <Link to="/dashboard" className="px-3 py-1 rounded bg-green-600 text-white flex items-center gap-1"><BarChart3 className="w-4 h-4"/>Dashboard</Link>
              <button onClick={()=>{auth.logout(); navigate('/')}} className="px-3 py-1 rounded border flex items-center gap-1"><LogOut className="w-4 h-4"/>Logout</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded border flex items-center gap-1"><LogIn className="w-4 h-4"/>Login</Link>
          )}
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
          <Link to="/how-it-works" onClick={()=>setOpen(false)}>How it works</Link>
          <Link to="/map" onClick={()=>setOpen(false)}>Map</Link>
          <Link to="/report" onClick={()=>setOpen(false)}>Report</Link>
          <Link to="/contact" onClick={()=>setOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="backdrop-blur bg-white/70 dark:bg-gray-900/60 rounded-xl p-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Crowdsourced E‑Waste Mapping</h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Report, track, and recycle e‑waste responsibly. AI classifies items, flags duplicates, and predicts hotspots.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/report" className="px-5 py-3 rounded bg-green-600 text-white flex items-center gap-2"><PlusCircle className="w-5 h-5"/>Report Waste</Link>
            <Link to="/map" className="px-5 py-3 rounded border flex items-center gap-2"><Map className="w-5 h-5"/>Open Map</Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30 dark:from-gray-950 dark:to-transparent"/>
    </section>
  )
}

function HomePage(){
  return (
    <main>
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[{icon:Info,title:'About E‑waste',to:'/about'},{icon:HelpCircle,title:'How it works',to:'/how-it-works'},{icon:Shield,title:'Privacy',to:'/privacy'}].map((c,i)=> (
          <Link key={i} to={c.to} className="p-6 rounded-xl border hover:shadow-lg transition bg-white dark:bg-gray-900">
            <c.icon className="w-6 h-6 text-green-600"/>
            <h3 className="mt-3 font-bold text-lg">{c.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn more</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

function LoginPage({ auth }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setError('')
    const body = new URLSearchParams(); body.set('username', email); body.set('password', password)
    const res = await fetch(`${BACKEND_URL}/auth/login`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body })
    if(res.ok){ const data = await res.json(); auth.login(data.access_token); navigate('/dashboard') } else { setError('Invalid credentials') }
    setLoading(false)
  }
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-900" required/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-900" required/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-green-600 text-white">{loading?'Logging in...':'Login'}</button>
      </form>
    </div>
  )
}

function ReportPage({ auth }){
  const [file, setFile] = useState(null)
  const [desc, setDesc] = useState('')
  const [coords, setCoords] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(()=>{ navigator.geolocation.getCurrentPosition((pos)=> setCoords({lat:pos.coords.latitude, lng:pos.coords.longitude})) },[])

  const submit = async (e)=>{
    e.preventDefault(); if(!file || !coords) return
    const form = new FormData()
    form.append('image', file)
    form.append('description', desc)
    form.append('lat', coords.lat)
    form.append('lng', coords.lng)
    if(auth.token) form.append('token', auth.token)
    const res = await fetch(`${BACKEND_URL}/reports`, { method:'POST', body: form })
    const data = await res.json(); setResult(data)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Report E‑waste</h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="w-full" required/>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe the e‑waste..." className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-900"/>
        <button className="px-4 py-2 rounded bg-green-600 text-white">Submit</button>
      </form>
      {result && (
        <div className="mt-6 p-4 rounded border">
          <p className="font-semibold">Prediction: {result.category} ({Math.round(result.confidence*100)}%)</p>
          {result.duplicate_of && <p className="text-amber-600">Possible duplicate detected.</p>}
        </div>
      )}
    </div>
  )
}

function MapPage(){
  const [items, setItems] = useState([])
  useEffect(()=>{ fetch(`${BACKEND_URL}/reports`).then(r=>r.json()).then(setItems) },[])
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Map</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Interactive map is simplified in this environment. Below shows fetched reports.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((r)=> (
          <div key={r._id} className="p-4 rounded border bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500">{r.category || 'Unknown'}</p>
            <p className="font-semibold">{r.description || 'No description'}</p>
            {r.location && <p className="text-xs">Lat: {r.location.lat.toFixed?.(4) ?? r.location.lat}, Lng: {r.location.lng.toFixed?.(4) ?? r.location.lng}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard({ auth }){
  const [summary, setSummary] = useState(null)
  useEffect(()=>{ fetch(`${BACKEND_URL}/analytics/summary`).then(r=>r.json()).then(setSummary) },[])
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {summary ? (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded border"><p className="text-sm text-gray-500">Total Reports</p><p className="text-3xl font-extrabold">{summary.total}</p></div>
          <div className="p-4 rounded border"><p className="font-semibold">By Status</p><ul className="text-sm">{summary.by_status.map(s=> <li key={s._id}>{s._id||'unknown'}: {s.count}</li>)}</ul></div>
          <div className="p-4 rounded border"><p className="font-semibold">By Category</p><ul className="text-sm">{summary.by_category.map(s=> <li key={s._id}>{s._id||'unknown'}: {s.count}</li>)}</ul></div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  )
}

function StaticPage({ title, children }){
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  )
}

function Footer(){
  return (
    <footer className="border-t mt-16 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© {new Date().getFullYear()} E‑Waste Mapper</p>
        <nav className="flex gap-4">
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}

export default function App(){
  const auth = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar auth={auth} />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/about" element={<StaticPage title="About E‑waste">E‑waste includes discarded electronics. Proper recycling prevents toxic leakage and enables circular economy.</StaticPage>} />
        <Route path="/how-it-works" element={<StaticPage title="How it works">Upload an image, auto‑classification suggests a category. Your location helps route pickups and display hotspots. Admins review and coordinate with recyclers.</StaticPage>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/report" element={<ReportPage auth={auth}/>} />
        <Route path="/dashboard" element={<Dashboard auth={auth}/>} />
        <Route path="/login" element={<LoginPage auth={auth}/>} />
        <Route path="/contact" element={<StaticPage title="Contact">Email us at support@ewaste.example or use the form below.</StaticPage>} />
        <Route path="/privacy" element={<StaticPage title="Privacy Policy">We store reports and metadata to improve recycling logistics. You can request deletion of your data anytime.</StaticPage>} />
      </Routes>
      <Footer />
    </div>
  )
}
