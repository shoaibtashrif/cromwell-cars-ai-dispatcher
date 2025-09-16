# 🚀 Cromwell Cars AI Dispatcher - Deployment Guide

## 📋 Pre-Deployment Checklist

### Required Accounts & Services
- [ ] **GitHub Account** (for code repository)
- [ ] **Ultravox AI Account** ([dashboard.ultravox.ai](https://dashboard.ultravox.ai))
- [ ] **Twilio Account** ([console.twilio.com](https://console.twilio.com))
- [ ] **ngrok Account** ([ngrok.com](https://ngrok.com)) - for development
- [ ] **Cromwell Cars API Access** (JWT token)
- [ ] **Make.com Account** (for pricing webhook)

### Required Information
- [ ] Ultravox API Key
- [ ] Twilio Account SID
- [ ] Twilio Auth Token  
- [ ] Twilio Phone Number
- [ ] Cromwell Cars JWT Token
- [ ] Make.com Webhook URL

## 🛠️ Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/shoaib-rao/cromwell-cars-ai-dispatcher.git
cd cromwell-cars-ai-dispatcher
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit with your actual credentials
nano .env
```

### 4. Start ngrok (Development)
```bash
# In separate terminal
ngrok http 3000

# Note the HTTPS URL (e.g., https://abc123.ngrok-free.app)
```

### 5. Configure Twilio Webhook
```bash
# Update the setup script with your ngrok URL
nano setup-twilio-webhook.sh

# Run the setup script
./setup-twilio-webhook.sh
```

### 6. Start the Application
```bash
npm start
```

### 7. Test the System
```bash
# Call your Twilio number and test the AI agent
# Watch terminal logs for detailed monitoring
```

## 🌐 Production Deployment

### Server Requirements
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Node.js**: Version 18 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB available space
- **Network**: Public IP address and domain name

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install nginx -y
```

### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/shoaib-rao/cromwell-cars-ai-dispatcher.git
cd cromwell-cars-ai-dispatcher

# Install dependencies
npm install --production

# Set up environment
cp .env.example .env
nano .env  # Add production credentials
```

### 3. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 4. nginx Configuration
```nginx
# /etc/nginx/sites-available/cromwell-dispatcher
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Start Production Service
```bash
# Start with PM2
pm2 start index.js --name "cromwell-dispatcher"

# Save PM2 configuration
pm2 save
pm2 startup

# Enable nginx
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 6. Update Twilio Webhook
```bash
# Update webhook URL to production domain
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$PHONE_NUMBER_SID.json" \
  --data-urlencode "VoiceUrl=https://your-domain.com/twilio/incoming" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

## 📊 Monitoring & Maintenance

### Log Monitoring
```bash
# View real-time logs
pm2 logs cromwell-dispatcher --lines 100

# Monitor system resources
pm2 monit
```

### Health Checks
```bash
# Check service status
curl https://your-domain.com/twilio/active-calls

# Test webhook
curl -X POST https://your-domain.com/twilio/incoming \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=health_check&From=%2B1234567890&To=your_twilio_number"
```

### Backup Strategy
```bash
# Backup configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env package.json routes/ ultravox-config.js

# Store backups securely
```

## 🔐 Security Considerations

### Environment Variables
- Store sensitive keys in secure environment management
- Use different keys for development/production
- Regularly rotate API keys and tokens

### Network Security
- Use HTTPS/SSL for all communications
- Implement firewall rules (UFW or iptables)
- Regular security updates

### Access Control
- Limit server access to authorized personnel
- Use SSH keys instead of passwords
- Monitor access logs regularly

## 🚨 Troubleshooting

### Common Issues

1. **Calls Not Connecting**
   - Check Twilio webhook configuration
   - Verify SSL certificate validity
   - Test ngrok/domain accessibility

2. **API Errors**
   - Validate JWT token expiration
   - Check API endpoint availability
   - Monitor rate limiting

3. **Performance Issues**
   - Monitor server resources
   - Check PM2 process status
   - Review nginx logs

### Support Commands
```bash
# Check system status
systemctl status nginx
pm2 status

# View error logs
sudo tail -f /var/log/nginx/error.log
pm2 logs cromwell-dispatcher --err

# Restart services
pm2 restart cromwell-dispatcher
sudo systemctl restart nginx
```

## 📞 Final Verification

After deployment, test the complete flow:

1. **Call your Twilio number**
2. **Verify AI greeting**: "Thank you for calling Cromwell Cars..."
3. **Test booking flow**: "I need a taxi from [address] to [destination]"
4. **Confirm tool calling**: Check logs for API calls
5. **Verify booking creation**: Check Cromwell Cars system

## 📈 Scaling Considerations

For high-volume deployment:
- Load balancer with multiple Node.js instances
- Redis for session management
- Database for call logging
- CDN for static assets
- Monitoring tools (Grafana, Prometheus)

---

**Your Cromwell Cars AI Dispatcher is now ready for production! 🚖** 