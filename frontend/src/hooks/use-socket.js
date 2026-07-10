import { useEffect, useRef } from "react"
import { io } from "socket.io-client"

export function useSocket() {
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
    })
    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef
}
