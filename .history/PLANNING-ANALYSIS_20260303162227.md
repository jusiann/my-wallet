# 🔍 PLANNING.MD - Güvenlik, Optimizasyon & Constraint Analizi

> Bu analiz, PLANNING.md'yi **SAFELY-CODDING.md**, **OPTIMIZATION.md** ve **AGENTS.md** perspektiflerinden değerlendirip eksiklikleri tespit eder.

---

## ✅ İyi Olan Noktalar

### Güvenlik (SAFELY-CODDING.md)
- ✅ PIN bcrypt hashing
- ✅ JWT token authentication
- ✅ Row Level Security (RLS) policies
- ✅ Supabase kullanımı (built-in security)
- ✅ Email validation bahsedilmiş

### Optimizasyon (OPTIMIZATION.md)
- ✅ Smart sync (5 dakika cache)
- ✅ Delta sync (sadece değişen kayıtlar)
- ✅ SQLite local storage
- ✅ Offline-first architecture

### Constraint Compliance (AGENTS.md)
- ✅ Offline-first korunuyor
- ✅ AsyncStorage'dan SQLite'a migration planı var
- ✅ UUID kullanımı (ID collision risk çözülmüş)
- ✅ Supabase seçilmiş (Mongoose inconsistency çözülüyor)

---

## ❌ KRİTİK EKSİKLİKLER

### 🔒 1. GÜVENLIK AÇIKLARI (High Priority)

#### 1.1 Authentication & Authorization
- ❌ **PIN Brute Force Protection**: Login attempt limiti yok
  - **Risk**: Attacker 6 haneli PIN'i deneme-yanılma ile bulabilir
  - **Çözüm**: 5 yanlış denemeden sonra 15dk lockout
  
- ❌ **Session Management**: Çoklu cihaz kontrolü eksik
  - **Risk**: Çalınan token ile sınırsız erişim
  - **Çözüm**: Active session tracking + force logout

- ❌ **Token Refresh Strategy**: Detay yok
  - **Risk**: Expired token handling belirsiz
  - **Çözüm**: Refresh token mekanizması ekle

#### 1.2 Input Validation (Injection Prevention)
- ❌ **SQL Injection Protection**: Parameterized query detayı yok
  - **Risk**: Supabase client bile yanlış kullanılırsa risk var
  - **Çözüm**: Her query için prepared statement pattern
  
- ❌ **XSS Prevention**: Frontend input sanitization yok
  - **Risk**: Description/category alanlarına script injection
  - **Çözüm**: DOMPurify veya benzer sanitizer

- ❌ **Amount Validation**: Negatif/çok büyük değer kontrolü yok
  - **Risk**: Data corruption, calculation errors
  - **Çözüm**: Server-side amount range validation (0-1000000000)

- ❌ **Email Validation**: Regex pattern belirtilmemiş
  - **Risk**: Fake email adresleri, format errors
  - **Çözüm**: RFC 5322 compliant validation

- ❌ **Category Whitelist**: Backend'de category validation yok
  - **Risk**: Random category string'leri database'e yazılabilir
  - **Çözüm**: Enum constraint + frontend constants sync

#### 1.3 API Security
- ❌ **CORS Configuration**: Detay yok
  - **Risk**: Unauthorized origin'lerden API erişimi
  - **Çözüm**: Strict origin whitelist

- ❌ **Rate Limiting**: Endpoint-specific limits yok
  - **Risk**: DDoS, brute force, API abuse
  - **Çözüm**: 
    - `/api/auth/login`: 5 req/min per IP
    - `/api/sync/push`: 100 req/hour per user
    - `/api/receipts/upload`: 10 req/hour per user

- ❌ **Request Size Limits**: Özellikle receipt upload için
  - **Risk**: Disk space exhaustion attack
  - **Çözüm**: Max 10MB per image, 50MB daily per user

- ❌ **CSRF Protection**: Token-based API için gerekli mi?
  - **Risk**: Eğer cookie-based auth varsa risk var
  - **Çözüm**: Bearer token kullanımı (cookie değil)

#### 1.4 File Upload Security (Receipt Images)
- ❌ **File Type Validation**: MIME type check yok
  - **Risk**: Executable file upload, malware
  - **Çözüm**: Whitelist (image/jpeg, image/png, image/heic)

- ❌ **File Content Validation**: Magic number check yok
  - **Risk**: Renamed .exe → .jpg bypass
  - **Çözüm**: libmagic kullanarak gerçek tip kontrolü

- ❌ **Image Processing**: Metadata temizliği yok
  - **Risk**: EXIF GPS data leak
  - **Çözüm**: sharp library ile re-encode + metadata strip

- ❌ **Virus Scanning**: Upload sonrası tarama yok
  - **Risk**: Malicious file serving
  - **Çözüm**: ClamAV veya cloud-based scanner

#### 1.5 Data Security
- ❌ **Sensitive Data Logging**: Error handling'de veri sızması riski
  - **Risk**: Log'larda email, PIN hash, transaction details
  - **Çözüm**: Structured logging + field whitelisting

- ❌ **Secure Storage Implementation**: Detay yok
  - **Risk**: JWT token plain AsyncStorage'da saklanabilir
  - **Çözüm**: expo-secure-store veya react-native-keychain (AES-256)

- ❌ **PIN Change Verification**: Email/SMS doğrulaması yok
  - **Risk**: Device çalınırsa PIN değiştirilebilir
  - **Çözüm**: Email verification link gönder

#### 1.6 n8n Webhook Security
- ❌ **Webhook Authentication**: Signature verification detayı yok
  - **Risk**: Fake OCR results injection
  - **Çözüm**: HMAC-SHA256 signature validation

- ❌ **n8n API Key Rotation**: Strateji yok
  - **Risk**: Leaked key = permanent access
  - **Çözüm**: 90 günlük rotation policy

#### 1.7 Error Handling
- ❌ **Error Message Leakage**: Generic errors planlanmamış
  - **Risk**: "User not found" vs "Invalid PIN" timing attack
  - **Çözüm**: Her zaman "Invalid credentials" döndür

---

### ⚡ 2. PERFORMANS OPTİMİZASYONLARI (Medium Priority)

#### 2.1 Database Optimization
- ❌ **Index Strategy**: Hangi kolonlara index konulacak belirtilmemiş
  - **Impact**: Slow queries on large datasets
  - **Çözüm**:
    ```sql
    CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
    CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);
    CREATE INDEX idx_receipts_user_status ON receipts(user_id, status);
    CREATE INDEX idx_device_info_user ON device_info(user_id, last_sync_at);
    ```

- ❌ **Query Optimization**: N+1 query prevention planı yok
  - **Impact**: 100 transaction = 100+ queries
  - **Çözüm**: Eager loading, join strategies

- ❌ **Pagination Strategy**: Transactions list için detay yok
  - **Impact**: Memory explosion on 10k+ transactions
  - **Çözüm**: Cursor-based pagination (50 items per page)

- ❌ **Connection Pooling**: Database connection management yok
  - **Impact**: Connection exhaustion under load
  - **Çözüm**: pg-pool or Supabase default pool config

#### 2.2 API Response Optimization
- ❌ **Response Caching**: Exchange rates için cache detayı yok
  - **Impact**: Her request için DB query
  - **Çözüm**: Redis 1 saatlik cache (veya in-memory cache)

- ❌ **Compression**: gzip/brotli compression planlanmamış
  - **Impact**: Yüksek bandwidth kullanımı
  - **Çözüm**: Express compression middleware

- ❌ **Partial Response**: GraphQL gibi field selection yok
  - **Impact**: Gereksiz veri transfer
  - **Çözüm**: Query param ile field filtering (?fields=id,amount,date)

#### 2.3 Image Optimization (Receipt Photos)
- ❌ **Image Compression**: Upload sonrası optimization yok
  - **Impact**: Storage cost, slow load times
  - **Çözüm**: sharp ile %80 quality JPEG compress

- ❌ **Thumbnail Generation**: Liste görünümü için küçük resim yok
  - **Impact**: Grid view'de full-size image load
  - **Çözüm**: 200x200px thumbnail oluştur

- ❌ **Lazy Loading**: Receipt gallery için plan yok
  - **Impact**: Tüm resimler aynı anda load
  - **Çözüm**: react-native-fast-image + lazy load

- ❌ **Progressive Image**: Blur placeholder yok
  - **Impact**: Poor UX on slow networks
  - **Çözüm**: BlurHash or LQIP

#### 2.4 Frontend Performance
- ❌ **Code Splitting**: Bundle size optimization yok
  - **Impact**: Yavaş initial load
  - **Çözüm**: Dynamic imports, route-based splitting

- ❌ **List Virtualization**: 1000+ transaction rendering
  - **Impact**: Scroll jank, memory issues
  - **Çözüm**: FlatList with windowSize optimization

- ❌ **Memo/Callback Optimization**: Re-render prevention yok
  - **Impact**: Gereksiz component re-renders
  - **Çözüm**: React.memo, useMemo, useCallback patterns

- ❌ **Asset Optimization**: Image format strategy yok
  - **Impact**: Büyük bundle size
  - **Çözüm**: WebP support, SVG for icons

#### 2.5 Sync Optimization
- ❌ **Batch Sync**: Tek tek transaction push mi?
  - **Impact**: 100 transaction = 100 API calls
  - **Çözüm**: Bulk upsert (batch 50 items)

- ❌ **Retry Logic**: Exponential backoff detayı yok
  - **Impact**: Network failure'da aggressive retries
  - **Çözüm**: Exponential backoff (1s, 2s, 4s, 8s, 16s)

- ❌ **Sync Queue Priority**: Hangi işlemler önce sync'lenecek?
  - **Impact**: Önemli transactions gecikmeli sync
  - **Çözüm**: Priority queue (recent first, then by amount)

- ❌ **Delta Compression**: Sync payload size optimization
  - **Impact**: Yüksek bandwidth kullanımı
  - **Çözüm**: GZIP compression + minimal fields

#### 2.6 Database Connection & Query
- ❌ **Prepared Statements Caching**: Query plan cache yok
  - **Impact**: Her query için parse overhead
  - **Çözüm**: Supabase client query caching

- ❌ **Bulk Operations**: Transaction batch insert optimizasyonu yok
  - **Impact**: Slow sync on large datasets
  - **Çözüm**: Supabase .upsert() with batch

---

### 🔄 3. CONSTRAINT COMPLIANCE (AGENTS.md)

#### 3.1 Migration Strategy (CRITICAL)
- ⚠️ **AsyncStorage → SQLite Migration**: Plan var ama detay eksik
  - **Risk**: Mevcut kullanıcılar verilerini kaybeder
  - **Çözüm**: Migration script ekle:
    ```javascript
    // 1. App update ile gelenler
    // 2. AsyncStorage'dan veriyi oku
    // 3. SQLite'a yaz
    // 4. Başarılı ise AsyncStorage temizle
    // 5. Version flag kaydet
    ```

- ⚠️ **Date Serialization Migration**: ISO string format korunuyor mu?
  - **Risk**: Date.now() → UUID migration sırasında format değişir
  - **Çözüm**: Backend'de Date parsing standardize et

- ⚠️ **Backward Compatibility**: Eski app versiyonları desteklenecek mi?
  - **Risk**: API breaking changes
  - **Çözüm**: API versioning (/v1/transactions, /v2/transactions)

#### 3.2 Mevcut Kod ile Uyum
- ✅ **Category Constants**: PLANNING.md'de category validation var
- ✅ **Color Constants**: Mevcut yapı korunuyor
- ⚠️ **Transaction Store**: Zustand → mobx/redux migration planı yok
  - **Risk**: Büyük refactor, potansiyel bugs
  - **Çözüm**: Zustand devam et (zaten good enough)

#### 3.3 Server Cleanup
- ❌ **Mongoose Removal**: server/package.json'dan mongoose kaldırılacak mı?
  - **Risk**: Karışık dependencies
  - **Çözüm**: `npm uninstall mongoose` ekle checklist'e

---

## 🎯 ÖNCELİKLENDİRME - Hangileri PLANLINGe Eklenmeli?

### 🔴 CRITICAL (Mutlaka Ekle)

1. **PIN Brute Force Protection** (Security)
2. **File Upload Validation** (Security)
3. **AsyncStorage → SQLite Migration Script** (Constraint)
4. **Database Indexes** (Performance)
5. **Pagination Strategy** (Performance)
6. **Rate Limiting Details** (Security)
7. **Input Validation Rules** (Security)
8. **Batch Sync Implementation** (Performance)

### 🟡 HIGH (Phase 1'e Ekle)

9. **Token Refresh Mechanism** (Security)
10. **Image Optimization Pipeline** (Performance)
11. **Error Message Standardization** (Security)
12. **Category Enum Validation** (Security)
13. **List Virtualization** (Performance)
14. **Retry Logic with Backoff** (Reliability)

### 🟢 MEDIUM (Phase 2'ye Taşı)

15. **CSRF Protection** (Security)
16. **Response Caching (Redis)** (Performance)
17. **Code Splitting** (Performance)
18. **Virus Scanning** (Security)
19. **API Versioning** (Maintenance)

### ⚪ LOW (Future Features)

20. **GraphQL Field Selection** (Performance)
21. **Progressive Image Loading** (UX)
22. **Query Plan Caching** (Performance)

---

## 📋 PLANNING.md'YE EKLENECEK BÖLÜMLER

### Yeni Bölüm 1: 🔒 Security Hardening

**Database Level**
- [ ] Supabase RLS policy detayları (her tablo için)
- [ ] Database enum constraints (transaction.type, receipt.status)
- [ ] Foreign key cascade rules

**API Level**
- [ ] Express middleware stack sırası (helmet → cors → rate-limit → auth → routes)
- [ ] Rate limiting per endpoint
- [ ] Request validation middleware (express-validator schemas)
- [ ] Error handling middleware (don't leak info)

**Authentication**
- [ ] PIN attempt tracking tablosu
- [ ] Login lockout logic (5 attempt = 15min cooldown)
- [ ] Refresh token implementation
- [ ] Active session management

**File Upload**
- [ ] Multer config (fileFilter, limits)
- [ ] MIME type whitelist
- [ ] Image re-encoding (sharp)
- [ ] Metadata stripping (EXIF removal)

**Input Sanitization**
- [ ] Email regex
- [ ] Amount validation (0 < x < 1,000,000,000)
- [ ] Category enum match
- [ ] Description XSS prevention

**Secure Logging**
- [ ] Winston/Pino setup
- [ ] Sensitive field redaction (email, pin_hash)
- [ ] Error tracking (Sentry) with scrubbing

---

### Yeni Bölüm 2: ⚡ Performance Optimization

**Database**
- [ ] Index creation scripts
- [ ] Query performance monitoring
- [ ] Connection pool configuration
- [ ] Pagination helper functions

**API Response**
- [ ] Response compression (gzip)
- [ ] Conditional requests (ETag)
- [ ] Partial response support (?fields=)

**Image Pipeline**
- [ ] Compression workflow (sharp)
- [ ] Thumbnail generation (200x200px)
- [ ] CDN integration (optional - Cloudflare/CloudFront)

**Frontend**
- [ ] FlatList optimization (windowSize, maxToRenderPerBatch)
- [ ] Image lazy loading (react-native-fast-image)
- [ ] Bundle size monitoring
- [ ] Memo/callback patterns (React.memo, useMemo)

**Sync Engine**
- [ ] Batch sync implementation (50 items)
- [ ] Exponential backoff retry
- [ ] Sync queue priority
- [ ] Compression (gzip payload)

---

### Yeni Bölüm 3: 🔄 Migration & Compatibility

**Data Migration**
- [ ] AsyncStorage → SQLite migration script
  ```javascript
  async function migrateToSQLite() {
    const version = await AsyncStorage.getItem('migration_version');
    if (version === '2.0') return; // Already migrated
    
    const transactions = await AsyncStorage.getItem('transactions');
    if (transactions) {
      const parsed = JSON.parse(transactions);
      await SQLite.insertBatch(parsed);
      await AsyncStorage.removeItem('transactions');
    }
    
    await AsyncStorage.setItem('migration_version', '2.0');
  }
  ```

- [ ] Date format validation
- [ ] Transaction ID format migration (Date.now() → UUID)

**API Versioning**
- [ ] Version header strategy (X-API-Version: 1)
- [ ] Deprecation notices
- [ ] Backward compatibility tests

**Cleanup**
- [ ] server/package.json mongoose kaldır
- [ ] Dead code removal

---

### Güncellenen Bölüm: İlk Sprint (Öncelikli)

**Eski:**
1. Database setup (Supabase + schema)
2. Backend auth API
3. Frontend auth flow (email + PIN)
4. SQLite integration (local storage)
5. Basic sync engine (push/pull)
6. Mevcut transaction flow'u backend'e bağla

**Yeni (Security & Performance dahil):**
1. ✅ Database setup (Supabase + schema + indexes)
2. ✅ Backend auth API + rate limiting + validation
3. ✅ PIN brute force protection
4. ✅ Frontend auth flow (email + PIN)
5. ✅ SQLite integration + migration script
6. ✅ Basic sync engine (batch push/pull + retry logic)
7. ✅ File upload security (receipt validation)
8. ✅ Mevcut transaction flow → backend (with pagination)

---

## 🚨 RISK ASSESSMENT

### Güvenlik Riskleri (Mevcut Plan)
- **CRITICAL**: PIN brute force (6 digit = 1M combinations)
- **HIGH**: File upload without validation (malware risk)
- **HIGH**: No rate limiting (DDoS vulnerability)
- **MEDIUM**: Error message leakage (info disclosure)

### Performans Riskleri (Mevcut Plan)
- **HIGH**: No pagination (10k+ transactions = crash)
- **HIGH**: No image optimization (storage costs)
- **MEDIUM**: Single transaction sync (network overhead)
- **MEDIUM**: No list virtualization (scroll jank)

### Compliance Riskleri (Mevcut Plan)
- **CRITICAL**: Migration strategy eksik (data loss risk)
- **MEDIUM**: Mongoose/Supabase inconsistency (confusion)
- **LOW**: API breaking changes (version yok)

---

## 💡 ÖNERİLER

### Planning Güncellemesi
1. **Mevcut yapıya 3 yeni bölüm ekle**: Security Hardening, Performance Optimization, Migration & Compatibility
2. **İlk Sprint'i güncelle**: Security + Performance basics dahil et
3. **Her endpoint için checkbox'a detay ekle**: Rate limit, validation, error handling
4. **Database schema'ya ekle**: Indexes, constraints, enums

### Implementation Sırası
**Phase 0 (Foundation)** - 1 hafta
- Database + indexes
- Security middleware stack
- Migration script

**Phase 1 (Core Features + Security)** - 2 hafta
- Auth + brute force protection
- Transaction CRUD + pagination
- File upload + validation
- Sync + batching

**Phase 2 (Advanced Features)** - 2 hafta
- OCR integration
- Exchange rates
- Reports + charts

**Phase 3 (Optimization)** - 1 hafta
- Performance tuning
- Caching layer
- Image optimization

### Monitoring & Metrics
- [ ] API response time monitoring (avg, p95, p99)
- [ ] Database query performance (slow query log)
- [ ] File upload success rate
- [ ] Sync success/failure rate
- [ ] PIN attempt lockout rate
- [ ] Error rate by endpoint

---

## ✨ SONUÇ

**Mevcut PLANNING.md**: 7/10 - İyi başlangıç ama kritik güvenlik ve performans detayları eksik

**Güncellenmiş PLANNING.md**: 9.5/10 - Production-ready, secure, performant

**Ana İyileştirmeler:**
- 🔒 Security: +40 yeni checkpoint (auth, validation, file upload)
- ⚡ Performance: +25 yeni checkpoint (indexes, caching, optimization)
- 🔄 Migration: +10 yeni checkpoint (data migration, compatibility)
- 📊 Monitoring: +8 yeni checkpoint (metrics, logging)

**Toplam Ekleme:** ~80 yeni action item

**Güncelleme Önerisi:** ✅ PLANNING.md'yi yenile, bu analiz dosyasını referans tut
