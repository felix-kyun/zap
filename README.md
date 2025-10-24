<p align="center">
  <img src="https://github.com/felix-kyun/zap/blob/e7efa3035a8c5255adc4fd7d3ec199dfeec845d2/public/favicon.png" alt="Zap App Icon" width="120"/>
</p>
<h1 align="center">Zap!</h1>
<p align="center">
  <b>Minimal, fast, and secure password manager</b>
  <br>
  <br>
  <a href="https://github.com/felix-kyun/zap/actions/workflows/main.yml"><img src="https://github.com/felix-kyun/zap/actions/workflows/main.yml/badge.svg"></a>
  <a href="https://github.com/felix-kyun/zap"><img src="https://img.shields.io/github/license/felix-kyun/zap" alt="License"></a>
  <a href="https://github.com/felix-kyun/zap"><img src="https://img.shields.io/github/languages/top/felix-kyun/zap" alt="Top Language"></a>
</p>

---

Zap is a **minimalist password manager** built for speed, security, and designed to keep your secrets safe with modern encryption and a straightforward, easy-to-use interface.

## 🔒 Security Highlights

- **OPAQUE protocol** for passwordless authentication.
- **Argon2** as the Key Derivation Function (KDF).
- **XChaCha20-Poly1305** for vault encryption.

## ⚡ Features

- Minimal and fast UI
- Zero Knowledge Vault Storage
- Multi threaded encryption/decryption
- Multi Device (limited to browsers for now)
- Dark theme (YES! Dark theme)
- Self hostable (for all those home-labbers)

---

## 🚧 Roadmap

- [ ] Browser extension
- [ ] Native apps (iOS/Android)
- [ ] Real time vault update
- [ ] OAuth (google)
- [ ] TOTP and Passkeys
- [ ] WebAuthn (for vault unlock)
- [ ] Import/export from other managers (Bitwarden, 1Password, etc.)
- [ ] Secure sharing of passwords/secrets
- [ ] Offline mode
- [ ] Theming and accessibility improvements
- [ ] Audit logging
- [ ] User profile customizations

---

## 🛠️ Getting Started

You will need to run the [backend](https://github.com/felix-kyun/zap-backend) first.

1. **Clone the repo**
    ```bash
    git clone https://github.com/felix-kyun/zap.git
    cd zap
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Run locally**
    ```bash
    npm run dev
    ```
4. **Build**
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are welcome! Please check out our [issues](https://github.com/felix-kyun/zap/issues) and [pull requests](https://github.com/felix-kyun/zap/pulls) to get involved.

---

<p align="center"><i>Built with ❤️ by <a href="https://github.com/felix-kyun">felix-kyun</a></i></p>
