import { Message } from '@/app/use-optimistic/page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type MessageTableProps = {
  messages: Message[]
}

export const MessageTable: React.FC<MessageTableProps> = ({ messages }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Message</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map(({ id, text, sending }) => (
          <TableRow key={id} className={sending ? 'opacity-50' : ''}>
            <TableCell suppressHydrationWarning>{id.split('-')[0]}</TableCell>
            <TableCell>{text}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
