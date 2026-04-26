# Setup Guide — Đồ Đồng Trường Thơi

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Go 1.23+
- Node.js 18+
- PostgreSQL Client (psql) — optional but recommended

### 1. Start PostgreSQL Database

```bash
cd dodongtruongthoi
docker compose up -d
```

Initialize the database:
```bash
# Create user and database
PGPASSWORD=postgres psql -U postgres -h localhost \
  -c "CREATE USER dodongtruongthoi WITH PASSWORD 'secure_password_123';" || true

PGPASSWORD=postgres psql -U postgres -h localhost \
  -c "CREATE DATABASE dodongtruongthoi OWNER dodongtruongthoi;" || true

# Run migrations
PGPASSWORD=postgres psql -U postgres -h localhost -d dodongtruongthoi \
  -f dodongtruongthoi_be/migrations/001_create_categories_products_orders.sql
```

### 2. Configure Cloudinary (Optional)

Get your Cloudinary credentials from https://cloudinary.com/

Update `.env`:
```bash
cd dodongtruongthoi_be
# Edit .env with your Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start Backend

```bash
cd dodongtruongthoi_be

# With Docker database
PORT=8080 \
JWT_SECRET=dev-secret \
DATABASE_URL="postgres://dodongtruongthoi:secure_password_123@localhost:5432/dodongtruongthoi" \
CLOUDINARY_CLOUD_NAME=demo \
go run ./cmd/server

# Or run compiled binary
./server
```

Expected output:
```
✓ PostgreSQL connected
✓ Cloudinary configured
Đồ Đồng Trường Thơi Backend started on :8080 in development mode
```

### 4. Start Frontend

```bash
cd dodongtruongthoi_fe
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:8080

---

## Environment Variables

### Backend (dodongtruongthoi_be/.env)

```bash
# Server
APP_NAME=Đồ Đồng Trường Thơi Backend
APP_ENV=development
PORT=8080

# JWT
JWT_SECRET=dev-secret-key-change-in-production

# Database
DATABASE_URL=postgres://dodongtruongthoi:secure_password_123@localhost:5432/dodongtruongthoi

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Docker Compose (docker-compose.yml)

```yaml
PostgreSQL:
  Container: dodongtruongthoi_db
  User: postgres
  Default Password: postgres
  Port: 5432
```

Created User:
- Username: `dodongtruongthoi`
- Password: `secure_password_123`
- Database: `dodongtruongthoi`

---

## Database Initialization

### Automatic (Docker)
Migrations in `/migrations/` are automatically applied via Docker entrypoint.

### Manual
```bash
PGPASSWORD=secure_password_123 psql -U dodongtruongthoi -h localhost -d dodongtruongthoi \
  -f dodongtruongthoi_be/migrations/001_create_categories_products_orders.sql
```

### Verify
```bash
PGPASSWORD=secure_password_123 psql -U dodongtruongthoi -h localhost -d dodongtruongthoi \
  -c "\dt"
```

---

## Image Storage (Cloudinary)

### Getting Started

1. **Sign up**: https://cloudinary.com (Free tier)
2. **Get credentials**:
   - Dashboard → API Keys
   - Copy: Cloud Name, API Key, API Secret
3. **Configure**: Add to `.env`

### Image Upload Flow

1. Admin uploads image via CMS
2. Backend sends to Cloudinary API
3. Cloudinary returns secure URL
4. URL stored in database
5. Frontend fetches and caches via Cloudinary CDN

### No Cloudinary?
System still works with placeholder demo URLs (`https://res.cloudinary.com/demo/...`)

---

## Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### API Test
```bash
# List categories
curl http://localhost:8080/api/v1/categories

# Admin login
curl -X POST http://localhost:8080/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Create product (with token)
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.data.token')

curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"test","title":"Test Product","category_id":"feng-shui-paintings","base_price":5000000}'
```

---

## Troubleshooting

### Database Connection Error
```
tls error: server refused TLS connection
```
Fix: Ensure PostgreSQL is running
```bash
docker ps | grep dodongtruongthoi_db
docker logs dodongtruongthoi_db
```

### Port Already in Use
```bash
lsof -i :8080  # Check what's using port 8080
kill -9 <PID>  # Kill process
```

### Cloudinary Not Configured
Backend will use in-memory/demo URLs automatically.

### Database Tables Missing
```bash
# Recreate tables
PGPASSWORD=secure_password_123 psql -U dodongtruongthoi -h localhost -d dodongtruongthoi \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
PGPASSWORD=secure_password_123 psql -U dodongtruongthoi -h localhost -d dodongtruongthoi \
  -f dodongtruongthoi_be/migrations/001_create_categories_products_orders.sql
```

---

## Production Setup

### Environment Variables
```bash
APP_ENV=production
JWT_SECRET=<generate-strong-secret>
DATABASE_URL=postgres://<user>:<pass>@<host>:5432/<db>
CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
```

### Database
- Use managed PostgreSQL (AWS RDS, Railway, Heroku, etc.)
- Enable SSL connections
- Set strong password
- Enable backups

### Docker
```bash
docker build -t dodongtruongthoi_be dodongtruongthoi_be
docker run -p 8080:8080 \
  -e DATABASE_URL="postgres://..." \
  -e JWT_SECRET="..." \
  -e CLOUDINARY_CLOUD_NAME="..." \
  dodongtruongthoi_be
```

### Deployment
- **Frontend**: Vercel (auto-deploy from git)
- **Backend**: Railway, Heroku, AWS ECS, or self-hosted

---

## Architecture Summary

```
┌─ Frontend (Next.js) ─────────────────┐
│  - Product browsing                  │
│  - Admin CMS                         │
│  - Order management                  │
│  - Port: 3000                        │
└──────────────────────────────────────┘
           ↓
    ┌──── API ────┐
    ↓            ↓
┌──────────────────────────────────────┐
│ Backend (Go) — Port: 8080            │
│  - REST API                          │
│  - JWT auth                          │
│  - Business logic                    │
│  - Image upload to Cloudinary        │
└──────────────────────────────────────┘
           ↓            ↓
      ┌─────┴─────┐    ┌──────────┐
      ↓           ↓    ↓          ↓
   PostgreSQL  Cloudinary   In-Memory
   (DB)        (Images)      (Fallback)
```

---

## Key Features

✅ PostgreSQL database with migrations
✅ Cloudinary image storage integration
✅ Docker Compose for local development
✅ JWT authentication
✅ Admin CMS CRUD operations
✅ In-memory fallback for development
✅ Production-ready environment configuration

---

**Ready to develop!** 🚀
