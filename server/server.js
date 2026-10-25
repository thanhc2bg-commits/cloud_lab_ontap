const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true }); // đọc biến môi trường từ file .env ở thư mục gốc
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json()); // đọc body JSON của request
// ----- Model: Student (Mongoose dùng collection "students") -----
const studentSchema = new mongoose.Schema(
{
studentId: { type: String, required: true },
name: { type: String, required: true },
email: { type: String, required: true },
},
{ timestamps: true }
);
const Student = mongoose.model('Student', studentSchema);
// ----- REST API -----
app.get('/api/hello', (req, res) => {
res.json({ message: 'Backend is running' });
});
// Health check cho Render: 200 khi đã nối được MongoDB, 503 khi chưa
app.get('/health', (req, res) => {
const dbUp = mongoose.connection.readyState === 1;
res.status(dbUp ? 200 : 503).json({
status: dbUp ? 'UP' : 'DOWN',
uptime: process.uptime(),
});
});
app.get('/api/students', async (req, res) => {
try {
res.json(await Student.find().sort({ createdAt: -1 }));
} catch (err) {
res.status(500).json({ error: err.message });
}
});
app.post('/api/students', async (req, res) => {
try {
res.status(201).json(await Student.create(req.body));
} catch (err) {
res.status(400).json({ error: err.message });
}
});
app.put('/api/students/:id', async (req, res) => {
try {
const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
returnDocument: 'after',
runValidators: true,
});
if (!student) return res.status(404).json({ error: 'Student not found' });
res.json(student);
} catch (err) {
res.status(400).json({ error: err.message });
}
});
app.delete('/api/students/:id', async (req, res) => {
try {
const student = await Student.findByIdAndDelete(req.params.id);
if (!student) return res.status(404).json({ error: 'Student not found' });
res.json({ message: 'Deleted' });
} catch (err) {
res.status(400).json({ error: err.message });
}
});
// ----- Khởi động server và kết nối MongoDB Atlas -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MongoDB connection error: MONGODB_URI is not defined. Check your .env file.');
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));