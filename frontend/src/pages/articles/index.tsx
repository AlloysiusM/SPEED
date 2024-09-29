import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon } from 'lucide-react'

interface Article {
  _id: string;
  title: string;
  author: string;
  url: string;
  status: string;
}

export default function Component() {
  const [articles, setArticles] = useState<Article[]>([
  ])

  useEffect
  (() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:8082/articles/pending", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: Article[] = await response.json();
        console.log(data);
        
        setArticles(data);
      } catch (err) {
        
      }
    };

    fetchArticles();
  }, []);
  
  const handleAccept = async (articleId: string) => {
    try {
      const response = await fetch(`http://localhost:8082/articles/${articleId}/accept`, {
        method: "PUT", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to accept article');
      }
  
      const acceptedArticle = await response.json();
      console.log('Accepted article:', acceptedArticle);
  
      // Optionally update the articles list after accepting
      setArticles(prevArticles =>
        prevArticles.filter(article =>
          article._id !== articleId 
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (articleId: string) => {
    try {
      const response = await fetch(`http://localhost:8082/articles/${articleId}/reject`, {
        method: "PUT", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to reject article');
      }
  
      const rejectedArticle = await response.json();
      console.log('Reject article:', rejectedArticle);
  
      // Optionally update the articles list after accepting
      setArticles(prevArticles =>
        prevArticles.filter(article =>
          article._id !== articleId 
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Review Table</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map(article => (
            <TableRow key={article._id}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {article.url.length > 30 ? article.url.substring(0, 30) + '...' : article.url}
                </a>
              </TableCell>
              <TableCell>
                <Badge >
                  {article.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAccept(article._id)}
                    disabled={article.status !== 'pending'}
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleReject(article._id)}
                    disabled={article.status !== 'pending'}
                    variant="outline"
                    size="sm"
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}