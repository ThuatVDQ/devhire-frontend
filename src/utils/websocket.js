import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
  reconnectDelay: 5000
})

stompClient.onConnect = () => {
  console.log('Connected to WebSocket')
  const username = localStorage.getItem('username')
  stompClient.subscribe(`/topic/notifications/${username}`, (message) => {
    const notification = JSON.parse(message.body)
    toastr.success(notification.message, 'New Notification')
  })
}

stompClient.activate()
