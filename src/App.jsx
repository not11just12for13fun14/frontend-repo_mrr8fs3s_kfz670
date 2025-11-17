import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { Home, Users, Package, Tag, FileText, Percent, Plus, Edit, Trash } from 'lucide-react'
import api from './lib/api'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r p-4 hidden sm:block">
        <div className="font-bold text-xl mb-6">Admin Panel</div>
        <nav className="space-y-2">
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/"> <Home size={18}/> Dashboard</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/users/create"> <Users size={18}/> New User</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/products"> <Package size={18}/> Products</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/products/create"> <Plus size={18}/> Create Product</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/categories"> <Tag size={18}/> Categories</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/blogs"> <FileText size={18}/> Blogs</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/blogs/create"> <Plus size={18}/> Create Blog</NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 ${isActive?'bg-slate-100 font-medium':''}`} to="/sale"> <Percent size={18}/> Sale</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

function Dashboard(){
  return <div>
    <h1 className="text-2xl font-bold">Welcome</h1>
    <p className="text-slate-600">Use the sidebar to manage products, categories, blogs, users and sales.</p>
  </div>
}

function NewUser(){
  const [form, setForm] = useState({name:'',email:'',address:'',age:'',is_active:true})
  const [status, setStatus] = useState('')
  const onSubmit = async (e)=>{
    e.preventDefault()
    const payload = {...form, age: form.age? Number(form.age): undefined}
    try{
      await api.post('/users', payload)
      setStatus('User created')
      setForm({name:'',email:'',address:'',age:'',is_active:true})
    }catch(e){ setStatus('Failed to create') }
  }
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/> Active</label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  )
}

function Products(){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  const load = async ()=>{
    setLoading(true)
    try{ const data = await api.get('/products'); setItems(data) }catch(e){}
    setLoading(false)
  }
  useState(()=>{ load() },[])
  const onDelete = async(id)=>{ if(!confirm('Delete?')) return; await api.del(`/products/${id}`); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link to="/products/create" className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"><Plus size={16}/> New</Link>
      </div>
      {loading? 'Loading...' : (
        <div className="overflow-x-auto bg-white border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p=> (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{p.in_stock? 'Yes':'No'}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={()=>navigate(`/products/${p._id}`)} className="px-2 py-1 border rounded">View</button>
                    <button onClick={()=>navigate(`/products/${p._id}/edit`)} className="px-2 py-1 border rounded">Edit</button>
                    <button onClick={()=>onDelete(p._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProductForm(){
  const navigate = useNavigate()
  const [form,setForm] = useState({title:'',description:'',price:'',category:'',in_stock:true,sku:'',image_url:''})
  const submit = async(e)=>{
    e.preventDefault();
    const payload = {...form, price: Number(form.price)}
    await api.post('/products', payload)
    navigate('/products')
  }
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Create Product</h2>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
        <input className="col-span-2 border rounded px-3 py-2" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})}/>
        <textarea className="col-span-2 border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={form.in_stock} onChange={e=>setForm({...form,in_stock:e.target.checked})}/> In Stock</label>
        <div className="col-span-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>
    </div>
  )
}

function ProductView(){
  const { id } = useParams()
  const [item,setItem] = useState(null)
  useState(()=>{ api.get(`/products/${id}`).then(setItem)},[id])
  if(!item) return 'Loading...'
  return (
    <div className="max-w-2xl space-y-2">
      <h2 className="text-xl font-semibold">{item.title}</h2>
      <p className="text-slate-600">{item.description}</p>
      <div className="grid grid-cols-2 gap-2">
        <div><span className="font-medium">Price:</span> ${item.price}</div>
        <div><span className="font-medium">Category:</span> {item.category}</div>
        <div><span className="font-medium">SKU:</span> {item.sku || '-'}</div>
        <div><span className="font-medium">In stock:</span> {item.in_stock? 'Yes':'No'}</div>
      </div>
    </div>
  )
}

function ProductEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [form,setForm] = useState(null)
  useState(()=>{ api.get(`/products/${id}`).then(data=>setForm(data)) },[id])
  if(!form) return 'Loading...'
  const submit = async(e)=>{ e.preventDefault(); const payload = {...form, price:Number(form.price)}; delete payload._id; await api.put(`/products/${id}`, payload); navigate('/products') }
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        <input className="border rounded px-3 py-2" placeholder="SKU" value={form.sku||''} onChange={e=>setForm({...form,sku:e.target.value})}/>
        <input className="col-span-2 border rounded px-3 py-2" placeholder="Image URL" value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})}/>
        <textarea className="col-span-2 border rounded px-3 py-2" placeholder="Description" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/>
        <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={form.in_stock} onChange={e=>setForm({...form,in_stock:e.target.checked})}/> In Stock</label>
        <div className="col-span-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  )
}

function Categories(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({name:'',description:'',is_active:true})
  const load = async()=>{ const data = await api.get('/categories'); setItems(data) }
  useState(()=>{ load() },[])
  const create = async(e)=>{ e.preventDefault(); await api.post('/categories', form); setForm({name:'',description:'',is_active:true}); load() }
  const update = async(id,changes)=>{ await api.put(`/categories/${id}`, changes); load() }
  const del = async(id)=>{ if(!confirm('Delete?')) return; await api.del(`/categories/${id}`); load() }
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>
        <form onSubmit={create} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/> Active</label>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="overflow-x-auto bg-white border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c=> (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.is_active? 'Yes':'No'}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={()=>update(c._id,{is_active:!c.is_active})} className="px-2 py-1 border rounded">Toggle</button>
                    <button onClick={()=>del(c._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Blogs(){
  const [items,setItems] = useState([])
  const load = async()=>{ const data = await api.get('/blogs'); setItems(data) }
  useState(()=>{ load() },[])
  const del = async(id)=>{ if(!confirm('Delete?')) return; await api.del(`/blogs/${id}`); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <Link to="/blogs/create" className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"><Plus size={16}/> New</Link>
      </div>
      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Published</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(b=> (
              <tr key={b._id} className="border-t">
                <td className="p-2">{b.title}</td>
                <td className="p-2">{b.author}</td>
                <td className="p-2">{b.is_published? 'Yes':'No'}</td>
                <td className="p-2 flex gap-2">
                  <Link to={`/blogs/${b._id}`} className="px-2 py-1 border rounded">View</Link>
                  <Link to={`/blogs/${b._id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
                  <button onClick={()=>del(b._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BlogForm(){
  const navigate = useNavigate()
  const [form,setForm] = useState({title:'',content:'',author:'',is_published:false})
  const submit = async(e)=>{ e.preventDefault(); await api.post('/blogs', form); navigate('/blogs') }
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Create Blog</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
        <textarea className="w-full border rounded px-3 py-2 h-40" placeholder="Content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Published</label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  )
}

function BlogView(){
  const { id } = useParams()
  const [item,setItem] = useState(null)
  useState(()=>{ api.get(`/blogs/${id}`).then(setItem) },[id])
  if(!item) return 'Loading...'
  return (
    <div className="max-w-2xl space-y-2">
      <h2 className="text-xl font-semibold">{item.title}</h2>
      <div className="text-slate-500 text-sm">By {item.author}</div>
      <p className="text-slate-700 whitespace-pre-wrap">{item.content}</p>
    </div>
  )
}

function BlogEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [form,setForm] = useState(null)
  useState(()=>{ api.get(`/blogs/${id}`).then(setForm) },[id])
  if(!form) return 'Loading...'
  const submit = async(e)=>{ e.preventDefault(); const payload = {...form}; delete payload._id; await api.put(`/blogs/${id}`, payload); navigate('/blogs') }
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
        <textarea className="w-full border rounded px-3 py-2 h-40" placeholder="Content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Published</label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  )
}

function Sale(){
  const [cfg,setCfg] = useState(null)
  const [saving,setSaving] = useState(false)
  useState(()=>{ api.get('/sale').then(setCfg) },[])
  if(!cfg) return 'Loading...'
  const update = async()=>{ setSaving(true); await api.put('/sale', cfg); setSaving(false) }
  const setProduct = (id, val)=>{ setCfg({...cfg, product_sales: {...cfg.product_sales, [id]: val}}) }
  const removeProduct = (id)=>{ const copy={...cfg.product_sales}; delete copy[id]; setCfg({...cfg, product_sales: copy}) }
  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-xl font-semibold">Sales</h2>
      <div className="bg-white border rounded p-4 space-y-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.global_sale_active} onChange={e=>setCfg({...cfg, global_sale_active: e.target.checked})}/> Enable Global Sale</label>
        <div className="flex items-center gap-2">
          <span className="w-48">Global Discount %</span>
          <input type="number" className="border rounded px-3 py-2 w-32" value={cfg.global_discount_percent} onChange={e=>setCfg({...cfg, global_discount_percent: Number(e.target.value)})}/>
        </div>
      </div>
      <div className="bg-white border rounded p-4 space-y-3">
        <h3 className="font-medium">Per-Product Sale</h3>
        <PerProductEditor cfg={cfg} setProduct={setProduct} removeProduct={removeProduct} />
      </div>
      <button onClick={update} className="bg-blue-600 text-white px-4 py-2 rounded">{saving? 'Saving...':'Save Settings'}</button>
    </div>
  )
}

function PerProductEditor({cfg,setProduct,removeProduct}){
  const [productId,setProductId] = useState('')
  const [discount,setDiscount] = useState('')
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input className="border rounded px-3 py-2" placeholder="Product ID" value={productId} onChange={e=>setProductId(e.target.value)}/>
        <input type="number" className="border rounded px-3 py-2 w-32" placeholder="Discount %" value={discount} onChange={e=>setDiscount(e.target.value)}/>
        <button className="px-3 py-2 border rounded" onClick={()=>{ if(productId && discount!==''){ setProduct(productId, Number(discount)); setProductId(''); setDiscount('') } }}>Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="p-2 text-left">Product ID</th>
              <th className="p-2 text-left">Discount %</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cfg.product_sales || {}).map(([pid, disc])=> (
              <tr key={pid} className="border-t">
                <td className="p-2">{pid}</td>
                <td className="p-2">{disc}</td>
                <td className="p-2"><button className="px-2 py-1 border rounded text-red-600" onClick={()=>removeProduct(pid)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/users/create" element={<NewUser/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/products/create" element={<ProductForm/>} />
          <Route path="/products/:id" element={<ProductView/>} />
          <Route path="/products/:id/edit" element={<ProductEdit/>} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/blogs/create" element={<BlogForm/>} />
          <Route path="/blogs/:id" element={<BlogView/>} />
          <Route path="/blogs/:id/edit" element={<BlogEdit/>} />
          <Route path="/sale" element={<Sale/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
