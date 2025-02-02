import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from '../components/analystqueuenavbar';

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
  
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/accepted-articles`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: Article[] = await response.json();
        
        setArticles(data);
      } catch (err) {
        console.error(err); 
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Analyst Article Queue</h1>
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
                <div className="flex space-x-2">
                  <a
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/analyst/${article._id}`} // Use the env variable here
                  >
                    Go to Analyst Page
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
