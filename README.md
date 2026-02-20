# 🌸 BloomBack Prototype

**AI-powered maternity support assistant**

BloomBack is an AI-enabled web application designed to provide intelligent, accessible support around maternity leave and return-to-work transitions. The project demonstrates a complete modern deployment workflow from local development to production.

---

## 🚀 Live Demo

🔗 **Production URL:** *https://women-techsters-ai-prototype-2.vercel.app/*

---

## 🧭 Project Overview

This project showcases an end-to-end DevOps workflow:

* AI Studio export → local Ubuntu setup
* Environment configuration with secure secrets
* Version control with Git and GitHub
* Automated deployment to Vercel
* Production-ready environment handling

The application integrates generative AI to deliver contextual responses for maternity-related queries.

---

## 🏗️ Architecture

```text
User Browser
     ↓
Vercel (Hosting & Serverless)
     ↓
BloomBack Web App
     ↓
Gemini API
```

**Key Flow**

1. User submits a prompt
2. App processes request
3. Secure call to Gemini API
4. AI response returned to user
5. UI renders the result

---

## 🧰 Tech Stack

**Frontend & Runtime**

* Next.js / React (AI Studio generated app)
* Node.js (LTS)
* npm

**DevOps & Deployment**

* Ubuntu (WSL)
* Git & GitHub
* Vercel (production hosting)
* nvm (Node version management)

**AI Integration**

* Gemini API
* Environment-based secret management

---

## ⚙️ Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/bloomback-prototype.git
cd bloomback-prototype
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create:

```bash
.env.local
```

Add your key:

```env
GEMINI_API_KEY=your_actual_key_here
```

> ⚠️ Never commit `.env.local` to GitHub.

---

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🚀 Production Deployment (Vercel)

1. Import the repository into Vercel
2. Add environment variable:

```text
GEMINI_API_KEY=your_actual_key
```

3. Deploy

Vercel automatically builds and hosts the application.

---

## 🔐 Security Practices

* Environment variables stored outside source code
* `.env.local` excluded via `.gitignore`
* API keys managed in Vercel dashboard
* Local testing completed before production release

---

## 📂 Project Structure

```text
bloomback-prototype/
├── src/
├── public/
├── package.json
├── .env.local (ignored)
├── .gitignore
└── README.md
```

---

## 🔄 Continuous Deployment Workflow

Future updates follow:

```bash
git add .
git commit -m "meaningful update"
git push
```

Vercel automatically redeploys on push to `main`.

---

## 🧪 Validation Checklist

* ✅ Local environment runs successfully
* ✅ Dependencies installed via npm
* ✅ Environment variables secured
* ✅ Repository pushed to GitHub
* ✅ Application deployed to production

---

## 📸 Screenshots (Recommended)

*Add screenshots here for stronger portfolio impact.*

Suggested:

* Home screen
* AI response example
* Mobile view

---

## 🌍 Real-World Impact

BloomBack demonstrates how AI can be responsibly applied to support working parents navigating maternity transitions. The project aligns with practical AI adoption principles and modern DevOps deployment standards.

---

## 🔮 Future Enhancements

* Docker containerization
* GitHub Actions CI/CD
* AWS deployment option
* User analytics
* Prompt optimization
* Rate limiting & monitoring
