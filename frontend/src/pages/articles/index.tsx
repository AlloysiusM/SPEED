import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  author: string;
  journel: string; 
  yearOfPub: string;
  volume: string;
  numberOfPages: string;
  doi: string;
  status: string;
}

export default function Component() {
  const [articles, setArticles] = useState<Article[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${backendUrl}/articles/pending`, {
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
        console.error(err); 
      }
    };

    fetchArticles();
  }, [backendUrl]);
  
  const handleAccept = async (articleId: string) => {
    try {
      const response = await fetch(`${backendUrl}/articles/${articleId}/accept`, {
        method: "PUT", // Use PUT method
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to accept article');
      }
  
      const acceptedArticle = await response.json();
      console.log('Accepted article:', acceptedArticle);
  
      setArticles(prevArticles =>
        prevArticles.filter(article => article._id !== articleId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (articleId: string) => {
    try {
      const response = await fetch(`${backendUrl}/articles/${articleId}/reject`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to reject article');
      }
  
      const rejectedArticle = await response.json();
      console.log('Rejected article:', rejectedArticle);
  
      setArticles(prevArticles =>
        prevArticles.filter(article => article._id !== articleId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderator Article List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Journal</TableHead>
            <TableHead>Year of Publication</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Number of Pages</TableHead>
            <TableHead>DOI</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map(article => (
            <TableRow key={article._id}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell>{article.journel}</TableCell>
              <TableCell>{article.yearOfPub}</TableCell>
              <TableCell>{article.volume}</TableCell>
              <TableCell>{article.numberOfPages}</TableCell>
              <TableCell>{article.doi}</TableCell>
              <TableCell>
                <Badge>
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
  );
}
