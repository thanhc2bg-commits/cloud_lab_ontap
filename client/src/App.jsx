import { useEffect, useState } from 'react'
const API = '/api/students'
const EMPTY = { studentId: '', name: '', email: '' }
const FIELDS = [
{ name: 'studentId', label: 'MSSV', type: 'text' },
{ name: 'name', label: 'Họ tên', type: 'text' },
{ name: 'email', label: 'Email', type: 'email' },
]
export default function App() {
const [students, setStudents] = useState([])
const [form, setForm] = useState(EMPTY)
const [editingId, setEditingId] = useState(null)
const [error, setError] = useState('')
async function loadStudents() {
try {
const res = await fetch(API)
if (!res.ok) throw new Error('HTTP ' + res.status)
setStudents(await res.json())
setError('')
} catch (err) {
setError('Không tải được danh sách: ' + err.message)
}
}
useEffect(() => {
loadStudents()
}, [])
function handleChange(e) {
setForm({ ...form, [e.target.name]: e.target.value })
}
async function handleSubmit(e) {
e.preventDefault()
const isEdit = editingId !== null
try {
const res = await fetch(isEdit ? `${API}/${editingId}` : API, {
method: isEdit ? 'PUT' : 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(form),
})
if (!res.ok) throw new Error('HTTP ' + res.status)
setForm(EMPTY)
setEditingId(null)
loadStudents()
} catch (err) {
setError('Không lưu được: ' + err.message)
}
}
function handleEdit(s) {
setEditingId(s._id)
setForm({ studentId: s.studentId, name: s.name, email: s.email })
}
async function handleDelete(id) {
if (!window.confirm('Xóa sinh viên này?')) return
try {
const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
if (!res.ok) throw new Error('HTTP ' + res.status)
loadStudents()
} catch (err) {
setError('Không xóa được: ' + err.message)
}
}
function handleCancel() {
setForm(EMPTY)
setEditingId(null)
}
return (
<div className="container">
<h1>Quản lý sinh viên</h1>
{error && <p className="error">{error}</p>}
<form className="form" onSubmit={handleSubmit}>
{FIELDS.map((f) => (
<input
key={f.name}
name={f.name}
type={f.type}
placeholder={f.label}
value={form[f.name]}
onChange={handleChange}
required
/>
))}
<button type="submit">{editingId ? 'Cập nhật' : 'Thêm'}</button>
{editingId && (
<button type="button" onClick={handleCancel}>Hủy</button>
)}
</form>
10
Cloud-Lab Mini – Ôn thực hành Frontend React (Vite)
<table>
<thead>
<tr><th>MSSV</th><th>Họ tên</th><th>Email</th><th></th></tr>
</thead>
<tbody>
{students.map((s) => (
<tr key={s._id}>
<td>{s.studentId}</td>
<td>{s.name}</td>
<td>{s.email}</td>
<td>
<button onClick={() => handleEdit(s)}>Sửa</button>
<button onClick={() => handleDelete(s._id)}>Xóa</button>
</td>
</tr>
))}
{students.length === 0 && (
<tr><td colSpan="4">Chưa có sinh viên nào</td></tr>
)}
</tbody>
</table>
</div>
)
}