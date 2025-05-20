"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AuthDebug() {
  const { user, refreshUser, isLoading } = useAuth()
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setShowDebug(true)}>
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white p-4 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Auth Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
          Close
        </Button>
      </div>
      <div className="text-xs space-y-2 max-h-80 overflow-auto">
        <div>
          <p>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>User:</strong> {user ? "Logged in" : "Not logged in"}
          </p>
          {user && (
            <>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              {user.location && (
                <p>
                  <strong>Location:</strong> {user.location}
                </p>
              )}
              {user.phone && (
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
              )}
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await refreshUser()
          }}
        >
          Refresh User
        </Button>
      </div>
    </div>
  )
}
