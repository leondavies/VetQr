"use client"

import { useState, useEffect } from "react"

interface AIAnimalInfoProps {
  species: string
  breed: string
}

export default function AIAnimalInfo({ species, breed }: AIAnimalInfoProps) {
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimalInfo = async () => {
      if (species && breed) {
        setLoading(true)
        setError(null)

        try {
          const response = await fetch("/api/animal-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ species, breed }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to fetch animal information")
          }

          // Stream the response as text to handle large responses efficiently
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()
          let receivedInfo = ""

          if (reader) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                break
              }
              receivedInfo += decoder.decode(value)
              setInfo(receivedInfo) // Update state with each chunk of data
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred")
          console.error("Error fetching animal information:", err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAnimalInfo()
  }, [species, breed])

  if (loading) {
    return (
      <div className="mt-4">
        <p className="text-gray-600">Loading animal information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-100 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!info) {
    return (
      <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
        <p className="text-yellow-600">No information available for this animal at the moment.</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h3 className="text-sm font-semibold mb-2">
        About {breed}'s
      </h3>
      <p className="whitespace-pre-wrap">{info}</p>
    </div>
  )
}

