#!/bin/bash
# ============================================================
# HYPERBEATS DEPLOYMENT SCRIPT
# Oracle Cloud Free Tier + Cloudflare ($0/month)
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║      HYPERBEATS FREE TIER DEPLOYMENT                     ║"
echo "║      Oracle Cloud + Cloudflare ($0/month)                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Please edit .env with your actual values, then run this script again.${NC}"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo -e "${GREEN}1️⃣  Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✅ Docker ready${NC}"

echo -e "${GREEN}2️⃣  Pulling latest images...${NC}"
docker-compose -f docker-compose.prod.yml pull

echo -e "${GREEN}3️⃣  Building Hyperbeats image...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache hyperbeats

echo -e "${GREEN}4️⃣  Stopping existing containers (if any)...${NC}"
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

echo -e "${GREEN}5️⃣  Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo -e "${GREEN}6️⃣  Waiting for services to be healthy...${NC}"
sleep 30

# Health check loop
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Hyperbeats API is healthy!${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}Waiting for API to start... (attempt $RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 10
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ API failed to start. Check logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs hyperbeats
    exit 1
fi

echo -e "${GREEN}7️⃣  Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T hyperbeats alembic upgrade head || echo "Migrations skipped"

echo -e "${GREEN}8️⃣  Testing endpoints...${NC}"

# Test health
echo -n "   /health: "
if curl -sf http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

# Test ready
echo -n "   /ready: "
if curl -sf http://localhost:8000/ready > /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️ (may need DB)${NC}"
fi

# Test chart endpoint
echo -n "   /api/v1/chart/activity: "
CHART_RESPONSE=$(curl -sf "http://localhost:8000/api/v1/chart/activity?repos=octocat/Hello-World&timeframe=7d" 2>&1 || echo "FAILED")
if [[ "$CHART_RESPONSE" == *"svg"* ]] || [[ "$CHART_RESPONSE" == *"<"* ]]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️ (check GitHub token)${NC}"
fi

# Get public IP
PUBLIC_IP=$(curl -sf ifconfig.me 2>/dev/null || curl -sf ipinfo.io/ip 2>/dev/null || echo "unknown")

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   DEPLOYMENT COMPLETE!                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Services running:${NC}"
echo "   • API:        http://localhost:8000"
echo "   • Prometheus: http://localhost:9090"
echo "   • Grafana:    http://localhost:3001"
echo ""
echo -e "${GREEN}🔗 Public IP: ${PUBLIC_IP}${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "   1. Add domain to Cloudflare"
echo "   2. Create A record: beats.hyperionkit.xyz → ${PUBLIC_IP}"
echo "   3. Enable Cloudflare proxy (orange cloud)"
echo "   4. Test: curl https://beats.hyperionkit.xyz/health"
echo ""
echo -e "${GREEN}📊 Resource usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""
echo -e "${GREEN}📝 View logs:${NC}"
echo "   docker-compose -f docker-compose.prod.yml logs -f hyperbeats"
echo ""

