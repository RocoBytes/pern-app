const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/security.log');

const logSecurityEvent = (type, message, req) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || 'anonymous',
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

module.exports = { logSecurityEvent };