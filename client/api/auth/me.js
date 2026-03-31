export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  // In a real app we'd decode JWT from Authorization header or cookies
  // Here we just return a success payload if they call this to verify
  res.status(200).json({
    id: 'guest_or_valid',
    name: 'Verified User'
  });
}
