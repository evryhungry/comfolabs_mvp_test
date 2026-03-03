<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUser } from '../domains/user/hooks/useUser'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'

const { currentUser, error, createUser, signIn, logout } = useUser()

const mode = ref<'signup' | 'signin'>('signup')
const name = ref('')
const email = ref('')
const submitting = ref(false)

async function handleSignUp() {
  if (!name.value.trim() || !email.value.trim()) return
  submitting.value = true
  try {
    await createUser({ name: name.value.trim(), email: email.value.trim() })
  } catch {
    // store handles error
  } finally {
    submitting.value = false
  }
}

async function handleSignIn() {
  if (!email.value.trim()) return
  submitting.value = true
  try {
    await signIn(email.value.trim())
  } catch {
    // store handles error
  } finally {
    submitting.value = false
  }
}

function switchMode(to: 'signup' | 'signin') {
  mode.value = to
  name.value = ''
  email.value = ''
}
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!currentUser" class="login-screen">
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-icon">C</span>
        <span class="logo-text">Comfolabs</span>
      </div>

      <!-- Sign Up -->
      <template v-if="mode === 'signup'">
        <p class="login-subtitle">Create your account to get started</p>
        <form class="login-form" @submit.prevent="handleSignUp">
          <BaseInput v-model="name" label="Name" placeholder="Your name" />
          <BaseInput v-model="email" label="Email" placeholder="you@example.com" type="email" />
          <p v-if="error" class="form-error">{{ error }}</p>
          <BaseButton
            label="Get Started"
            size="lg"
            :loading="submitting"
            :disabled="!name.trim() || !email.trim()"
            @click="handleSignUp"
          />
        </form>
        <p class="switch-text">
          Already have an account?
          <button class="switch-link" @click="switchMode('signin')">Sign In</button>
        </p>
      </template>

      <!-- Sign In -->
      <template v-else>
        <p class="login-subtitle">Sign in with your email</p>
        <form class="login-form" @submit.prevent="handleSignIn">
          <BaseInput v-model="email" label="Email" placeholder="you@example.com" type="email" />
          <p v-if="error" class="form-error">{{ error }}</p>
          <BaseButton
            label="Sign In"
            size="lg"
            :loading="submitting"
            :disabled="!email.trim()"
            @click="handleSignIn"
          />
        </form>
        <p class="switch-text">
          Don't have an account?
          <button class="switch-link" @click="switchMode('signup')">Sign Up</button>
        </p>
      </template>
    </div>
  </div>

  <!-- Main App -->
  <div v-else id="app">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo">
          <span class="logo-icon-sm">C</span>
          <span class="logo-text-sm">Comfolabs</span>
        </RouterLink>
        <div class="header-right">
          <div class="user-badge">
            <div class="avatar">{{ currentUser.name.charAt(0).toUpperCase() }}</div>
            <span class="user-name">{{ currentUser.name }}</span>
          </div>
          <button class="logout-btn" @click="logout" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
/* ========== CSS Reset & Global ========== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-light: #eef2ff;
  --color-primary-subtle: #c7d2fe;
  --color-success: #10b981;
  --color-success-light: #ecfdf5;
  --color-warning: #f59e0b;
  --color-warning-light: #fffbeb;
  --color-danger: #ef4444;
  --color-danger-light: #fef2f2;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  --color-header-bg: #0f172a;
  --color-header-text: #f1f5f9;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.1);
  --transition: 0.2s ease;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input, textarea, select {
  font-family: inherit;
}

h1 { font-size: 1.875rem; font-weight: 700; line-height: 1.3; }
h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.35; }
h3 { font-size: 1.125rem; font-weight: 600; line-height: 1.4; }
</style>

<style scoped>
/* ========== Login Screen ========== */
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 24px;
}

.login-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), #a78bfa);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 800;
  color: #fff;
}

.logo-text {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 28px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.login-form .btn {
  width: 100%;
  margin-top: 4px;
}

.form-error {
  font-size: 0.8125rem;
  color: var(--color-danger);
  text-align: center;
  margin: -4px 0;
}

.switch-text {
  margin-top: 20px;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.switch-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition);
}

.switch-link:hover {
  color: var(--color-primary-hover);
}

/* ========== Main App ========== */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: var(--color-header-bg);
  color: var(--color-header-text);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.125rem;
  transition: opacity var(--transition);
}

.logo:hover {
  opacity: 0.85;
}

.logo-icon-sm {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary), #a78bfa);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  color: #fff;
}

.logo-text-sm {
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.avatar {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, var(--color-primary), #a78bfa);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-header-text);
}

.logout-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.app-main {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}
</style>
