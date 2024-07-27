const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
    {
        points: 10,
        duration: 30, // per 30 seconds
    });
function limitReqs(req, res, next) {
     
            const ip_clt = req.ip
            // Consume 1 point for each action
            rateLimiter.consume(ip_clt) // or req.ip
            .then(() => {
                next();
            })
            .catch((rejRes) => {
                res.status(429).send('Too Many Requests');
            });
        
}
module.exports = {limitReqs}