<script setup lang="ts">
import { useUser } from '../hooks/useUser'

const { currentUser } = useUser()
</script>

<template>
  <div v-if="currentUser" class="user-profile">
    <div class="avatar">
      {{ currentUser.name.charAt(0).toUpperCase() }}
    </div>
    <div class="user-info">
      <span class="user-name">{{ currentUser.name }}</span>
      <span class="user-email">{{ currentUser.email }}</span>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}

.avatar {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--color-primary), #a78bfa);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-header-text);
  line-height: 1.3;
}

.user-email {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
