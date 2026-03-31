export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { name, email, password } = req.body;
  if (!email || !password || password.length < 6 || !name) {
    return res.status(400).json({ success: false, error: 'Invalid details provided.' });
  }

  // Mock successful registration
  const token = 'mock_jwt_token_' + Date.now();

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: 'u_' + Date.now(),
        name: name,
        email
      }
    }
  });
}
