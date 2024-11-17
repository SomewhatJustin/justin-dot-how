const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000; // You can change this port if needed

// Middleware to parse JSON body
app.use(express.json());

app.post('/github-update', (req, res) => {
  console.log('Received a GitHub webhook event:', req.body);
  req.setTimeout(600000);

  exec('/home/justin/Developer/justin-dot-how/update.sh &', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
    }
    console.log(`Script stdout: ${stdout}`);
  });

  res.status(200).send('Update script execution started');
});


app.get('/github-update', (req, res) => {
  res.send('Webhook server is running!');
  console.log('Received a request to check the webhook server');
});


app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
