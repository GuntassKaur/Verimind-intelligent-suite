export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Invalid credentials.' });
  }

  // Mock successful login
  const token = 'mock_jwt_token_' + Date.now();
  const userName = email.split('@')[0];

  res.status(200).json({
    success: true,
    token,
    data: {
      user: {
        id: 'u_' + Date.now(),
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email
      }
    }
  });
}
