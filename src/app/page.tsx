import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getPolls } from './actions'
import { UserButton } from '@clerk/nextjs'

export const revalidate = 0

export default async function Home() {
  const polls = await getPolls()

  return (
    <div className="container">
      <UserButton afterSignOutUrl="/" />
      <h1>Your polls</h1>

      <div className="grid grid-cols-3 gap-2">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle>{poll.title}</CardTitle>
              <CardDescription>
                {poll._count.questions} questions
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
