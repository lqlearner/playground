// API route - place this in /api/contact.js
export default function handler(req, res) {
    // Check if request method is POST
    if (req.method === 'POST') {
      const { name, email, message } = req.body;
      
      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: 'Name, email, and message are required' 
        });
      }
      
      // Process the data (save to database, send email, etc.)
      // For this example, we'll just return success
      return res.status(200).json({ 
        success: true,
        message: `Thank you ${name}, your message has been received!`,
        data: { name, email, message }
      });
    } else {
      // Method not allowed
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  