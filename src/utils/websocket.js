import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
  reconnectDelay: 5000
})

let notificationCallback = null

// Hàm để khởi tạo WebSocket và lắng nghe thông báo
export const initializeWebSocket = (username, onNotificationReceived) => {
  notificationCallback = onNotificationReceived // Lưu callback để sử dụng khi có thông báo mới

  stompClient.onConnect = () => {
    console.log('Connected to WebSocket')

    stompClient.subscribe(`/topic/notifications/${username}`, (message) => {
      const notification = JSON.parse(message.body)

      // Lưu cấu hình gốc
      const originalOptions = { ...toastr.options }

      // Cấu hình tạm thời cho Toastr
      toastr.options = {
        ...originalOptions,
        positionClass: 'toast-bottom-left'
      }

      toastr.info('New Notification')

      toastr.options = originalOptions

      if (notificationCallback) {
        notificationCallback(notification)
      }
    })
  }

  stompClient.activate()
}

// Hàm ngắt kết nối WebSocket
export const disconnectWebSocket = () => {
  stompClient.deactivate()
  console.log('Disconnected from WebSocket')
}
