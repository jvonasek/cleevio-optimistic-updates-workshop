import { Post } from '@/app/rq-optimistic/page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type PostsTableProps = {
  posts: Post[]
}

export const PostsTable: React.FC<PostsTableProps> = ({ posts }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map(({ id, title }) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>
              {title.length > 20 ? `${title.slice(0, 20)}...` : title}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
