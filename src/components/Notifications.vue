<template>
  <div>
    <h3>Thông Báo</h3>
    <ul>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import { connect, disconnect } from '@/data/websocket'

export default {
  data() {
    return {
      notifications: []
    }
  },
  created() {
    connect(this.onMessageReceived)
  },
  beforeDestroy() {
    disconnect()
  },
  methods: {
    onMessageReceived(notification) {
      this.notifications.push(notification)
    }
  }
}
</script>
