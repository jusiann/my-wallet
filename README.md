# My Wallet

> Kişisel gelir ve giderlerinizi takip etmenizi sağlayan minimalist cüzdan uygulaması.

![License](https://img.shields.io/github/license/jusiann/my-wallet)
![Stars](https://img.shields.io/github/stars/jusiann/my-wallet?style=social)

---

## İçindekiler

- [Hakkında](#hakkında)
- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Konfigürasyon](#konfigürasyon)
- [İletişim](#iletişim)

---

## Hakkında

My Wallet, günlük harcamalarınızı ve gelirlerinizi kolayca takip etmenizi sağlayan React Native tabanlı bir mobil uygulamadır. Nakit ve dijital bakiye ayrımı yaparak finansal durumunuzu net bir şekilde görmenizi sağlar.

**Teknoloji Yığını:**

- **Dil:** TypeScript
- **Framework:** React Native 0.81.5 + Expo 54
- **State:** Zustand 5.0.11
- **Storage:** AsyncStorage
- **Diğer:** React Navigation, Expo Linear Gradient

---

## Özellikler

- **Gelir/Gider Takibi** — İşlemlerinizi kategorize ederek kaydedin
- **Nakit & Dijital Ayrımı** — Farklı bakiye türlerini ayrı takip edin
- **Aylık Görünüm** — Ay bazlı filtreleme ve özet
- **Kategori Sistemi** — Özelleştirilebilir kategoriler
- **Günlük Gruplandırma** — İşlemleri tarihe göre görüntüleme
- **Çalışan Bakiye** — Her işlem sonrası bakiye hesaplama
- **Modern UI** — Gradient ve karanlık tema tasarımı

---

## Kurulum

### Gereksinimler

- Node.js >= 18
- npm veya yarn
- Expo CLI
- iOS Simulator / Android Emulator (opsiyonel)

### Hızlı Başlangıç

```bash
# Repoyu klonla
git clone https://github.com/jusiann/my-wallet.git
cd my-wallet

# Bağımlılıkları yükle
npm install

# Expo sunucusunu başlat
npm start
```

### Platform Komutları

```bash
# iOS simülatörde çalıştır
npm run ios

# Android emülatörde çalıştır
npm run android

# Web'de çalıştır
npm run web
```

---

## Kullanım

### Ana Ekranlar

| Ekran | Açıklama |
|-------|----------|
| Home | Bakiye özeti, aylık gelir/gider ve işlem listesi |
| Create | Yeni işlem ekleme (gelir/gider) |

### İşlem Oluşturma

Yeni bir işlem eklemek için:
1. Ana sayfada "+" butonuna tıklayın
2. İşlem türünü seçin (Gelir/Gider)
3. Tutarı girin
4. Kategori seçin
5. Ödeme yöntemini belirleyin (Nakit/Dijital)
6. Kaydedin

---

## Konfigürasyon

| Dosya | Açıklama |
|-------|----------|
| `src/constants/colors.js` | Renk paleti ve para birimi |
| `src/constants/category.constant.js` | Kategori tanımları |
| `src/constants/storage.utils.js` | AsyncStorage yardımcıları |
| `src/store/transaction.store.js` | Zustand store yapılandırması |

### Özelleştirilebilir Değerler

| Değişken | Konum | Açıklama |
|----------|-------|----------|
| `currency` | `colors.js` | Para birimi sembolü |
| `COLORS` | `colors.js` | Uygulama renk teması |
| `categories` | `category.constant.js` | Gelir/gider kategorileri |

---

## İletişim

**Adil Efe** — insta:adlefee — adilefe257@gmail.com

Proje: [https://github.com/jusiann/my-wallet](https://github.com/jusiann/my-wallet)
