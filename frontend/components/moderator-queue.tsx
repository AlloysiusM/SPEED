'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle } from "lucide-react"
import { acceptArticle, rejectArticle, fetchArticles } from '@/lib/api'

type Article = {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  status: string
}

export default function ModeratorQueue() {
  const [articles, setArticles] = useState<Article[]>([])
  const [status, setStatus] = useState<string>('pending')

  useEffect(() => {
    const loadArticles = async () => {
      const fetchedArticles = await fetchArticles(status)
      setArticles(fetchedArticles)
    }
    loadArticles()
  }, [status])

  const handleAccept = async (id: string) => {
    try {
      await acceptArticle(id)
      setArticles(articles.filter(article => article.id !== id))
    } catch (error) {
      console.error('Error accepting article:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectArticle(id)
      setArticles(articles.filter(article => article.id !== id))
    } catch (error) {
      console.error('Error rejecting article:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderator Queue</h1>
      <div className="mb-4">
        <Select onValueChange={handleStatusChange} defaultValue={status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No articles in this category</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{article.authors}</p>
                <p className="text-sm text-gray-600">{article.journal}, {article.year}</p>
                <p className="text-sm font-semibold mt-2">Status: {article.status}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {status === 'pending' && (
                  <>
                    <Button onClick={() => handleAccept(article.id)} variant="outline" className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button onClick={() => handleReject(article.id)} variant="outline" className="flex items-center">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}